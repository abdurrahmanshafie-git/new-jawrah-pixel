import { supabase, isSupabaseConfigured } from './client';
import { submitInquiry } from './api';
import { createAgentApplication } from './ecosystem-api';
import { notifyUser } from './ecosystem-api';
import { sendAgentEmailNotification, type AgentEmailPayload } from '@/lib/email/agentEmails';
import { getClientPlatform } from '@/lib/email/platform';
import { getReferralSource, getStoredReferral } from '@/lib/referral';
import {
  calculateAgentTier,
  calculateCommission,
  regionCurrency,
  type AgentTier,
} from '@/lib/agent/tiers';
import {
  formatPartnerId,
  generateReferralCodeFromName,
  isUrlSafeReferralCode,
  normalizeReferralCode,
  partnerStatusLabel,
} from '@/lib/partner/ids';
import type { RegionCode } from '@/types';
import { logSupabaseQuery } from './query-debug';

function ensureConfigured() {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase environment variables are not configured for this deployment.');
  }
}

async function currentUserId(): Promise<string> {
  const { data } = await supabase.auth.getUser();
  if (!data.user?.id) throw new Error('Authentication required.');
  return data.user.id;
}

export type AgentStatus = 'pending' | 'under_review' | 'interview' | 'approved' | 'rejected' | 'suspended';
export type AgentLeadStatus =
  | 'submitted'
  | 'reviewing'
  | 'qualified'
  | 'proposal_sent'
  | 'won'
  | 'lost'
  | 'paid'
  | 'cancelled';
export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'rejected';

export interface ApplyAsAgentInput {
  name: string;
  email: string;
  whatsapp?: string | null;
  region: RegionCode;
  location: string;
  country?: string | null;
  city?: string | null;
  profileLink?: string | null;
  experience: string;
  message?: string | null;
  userId: string;
  captcha_token?: string | null;
}

async function nextPartnerSequence(region: RegionCode): Promise<number> {
  const { count } = await supabase
    .from('agent_profiles')
    .select('id', { count: 'exact', head: true })
    .eq('region', region);
  return (count ?? 0) + 1001;
}

async function generateUniqueReferralCode(seedName: string): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const candidate =
      attempt === 0
        ? generateReferralCodeFromName(seedName)
        : `${generateReferralCodeFromName(seedName)}${attempt}`;
    const normalized = normalizeReferralCode(candidate);
    const { data } = await supabase
      .from('profiles')
      .select('id')
      .eq('agent_code', normalized)
      .maybeSingle();
    if (!data) return normalized;
  }
  return normalizeReferralCode(`JP${Date.now().toString(36).toUpperCase()}`);
}

export { partnerStatusLabel };

export async function applyAsAgent(input: ApplyAsAgentInput) {
  ensureConfigured();

  const country = input.country?.trim() || input.region.toUpperCase();
  const city = input.city?.trim() || input.location;

  const fullMessage = `
--- PARTNER NETWORK APPLICATION ---
Country: ${country}
City: ${city}
Location Hub: ${input.location}
LinkedIn: ${input.profileLink || 'None Provided'}
Experience: ${input.experience}
Why Partner: ${input.message || 'No additional notes.'}
  `.trim();

  const { data: inquiry, error: inquiryError } = await submitInquiry(
    {
      full_name: input.name.trim(),
      email: input.email.trim(),
      whatsapp: input.whatsapp?.trim() || null,
      business_name: `Partner Application - ${city}`,
      service_interested: 'Partner Application',
      inquiry_type: 'collaboration',
      budget_range: 'Referral Program',
      message: fullMessage,
      country: input.region,
      region: input.region,
      source_page: input.region,
      status: 'new',
    },
    {
      name: input.name.trim(),
      email: input.email.trim(),
      whatsapp: input.whatsapp?.trim() || null,
      region: input.region,
      service: 'Partner Application',
      budget: 'Referral Program',
      goals: input.experience,
      message: input.message || undefined,
      formType: 'Partner Application',
      userId: input.userId,
      platform: getClientPlatform(),
      requirements: fullMessage,
    },
  );

  if (inquiryError) return { error: inquiryError, data: null };

  const appResult = await createAgentApplication({
    inquiry_id: inquiry?.id ?? null,
    applicant_name: input.name.trim(),
    applicant_email: input.email.trim(),
    whatsapp: input.whatsapp?.trim() || null,
    region: input.region,
    experience: input.experience,
    profile_link: input.profileLink || null,
    message: input.message || null,
    status: 'pending',
  });

  if (appResult.error) return appResult;

  await logSupabaseQuery(
    'agent_profiles.upsert_application',
    supabase.from('agent_profiles').upsert(
      {
        user_id: input.userId,
        application_id: appResult.data?.id ?? null,
        region: input.region,
        status: 'pending',
        whatsapp: input.whatsapp?.trim() || null,
        experience: input.experience,
        profile_link: input.profileLink || null,
      },
      { onConflict: 'user_id' },
    ),
  );

  await logSupabaseQuery(
    'profiles.agent_status_pending',
    supabase
      .from('profiles')
      .update({ agent_status: 'pending', region: input.region })
      .eq('id', input.userId),
  );

  void sendAgentEmailNotification({
    emailType: 'agent_application_received',
    email: input.email,
    name: input.name,
    region: input.region,
  });
  void sendAgentEmailNotification({
    emailType: 'agent_application_admin_alert',
    name: input.name,
    email: input.email,
    region: input.region,
    message: input.experience,
  });

  return appResult;
}

export async function fetchAgentProfile(userId?: string) {
  ensureConfigured();
  const uid = userId ?? (await currentUserId());

  const [profileRes, agentProfileRes] = await Promise.all([
    logSupabaseQuery('profiles.agent', supabase.from('profiles').select('*').eq('id', uid).single()),
    logSupabaseQuery(
      'agent_profiles.by_user',
      supabase.from('agent_profiles').select('*').eq('user_id', uid).maybeSingle(),
    ),
  ]);

  return {
    profile: profileRes.data,
    agentProfile: agentProfileRes.data,
    error: profileRes.error || agentProfileRes.error,
  };
}

export async function fetchAgentDashboard(userId?: string) {
  ensureConfigured();
  const uid = userId ?? (await currentUserId());
  const { profile, agentProfile, error } = await fetchAgentProfile(uid);
  if (error) return { error, data: null };

  const [leads, commissions, payouts, referrals, tierHistory, notifications] = await Promise.all([
    fetchAgentLeads(uid),
    fetchAgentCommissions(uid),
    fetchAgentPayouts(uid),
    logSupabaseQuery(
      'agent_referrals.recent',
      supabase
        .from('agent_referrals')
        .select('*')
        .eq('agent_id', uid)
        .order('created_at', { ascending: false })
        .limit(20),
    ),
    logSupabaseQuery(
      'agent_tier_history',
      supabase
        .from('agent_tier_history')
        .select('*')
        .eq('agent_id', uid)
        .order('created_at', { ascending: false })
        .limit(10),
    ),
    logSupabaseQuery(
      'notifications.agent',
      supabase
        .from('notifications')
        .select('*')
        .eq('user_id', uid)
        .order('created_at', { ascending: false })
        .limit(50),
    ),
  ]);

  const paidLeads = (leads.data ?? []).filter((l) => l.status === 'paid');
  const completedCount =
    agentProfile?.completed_paid_projects ?? paidLeads.length;
  const tierInfo = calculateAgentTier(completedCount);

  const totalEarned = (commissions.data ?? [])
    .filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);
  const pendingCommission = (commissions.data ?? [])
    .filter((c) => c.status === 'pending' || c.status === 'approved')
    .reduce((sum, c) => sum + Number(c.commission_amount || 0), 0);

  return {
    error: null,
    data: {
      profile,
      agentProfile,
      tierInfo,
      completedCount,
      totalEarned,
      pendingCommission,
      leads: leads.data ?? [],
      commissions: commissions.data ?? [],
      payouts: payouts.data ?? [],
      referrals: referrals.data ?? [],
      tierHistory: tierHistory.data ?? [],
      notifications: notifications.data ?? [],
      applicationStatus: agentProfile?.status ?? profile?.agent_status ?? 'pending',
    },
  };
}

export async function submitAgentLead(payload: {
  client_name: string;
  client_email?: string | null;
  client_phone?: string | null;
  company?: string | null;
  service_interested?: string | null;
  project_value?: number;
  region?: RegionCode;
  notes?: string | null;
}) {
  ensureConfigured();
  const uid = await currentUserId();
  const { agentProfile } = await fetchAgentProfile(uid);
  const region = (payload.region ?? agentProfile?.region ?? 'lk') as RegionCode;
  const tier = calculateAgentTier(agentProfile?.completed_paid_projects ?? 0);
  const projectValue = Number(payload.project_value) || 0;
  const estimate = calculateCommission(projectValue, tier.rate);

  const result = await logSupabaseQuery(
    'agent_leads.insert',
    supabase
      .from('agent_leads')
      .insert({
        agent_id: uid,
        client_name: payload.client_name,
        client_email: payload.client_email ?? null,
        client_phone: payload.client_phone ?? null,
        company: payload.company ?? null,
        service_interested: payload.service_interested ?? null,
        project_value: projectValue,
        currency: regionCurrency(region),
        region,
        status: 'submitted',
        commission_estimate: estimate,
        commission_status: 'pending',
        notes: payload.notes ?? null,
        referral_source: getReferralSource(),
      })
      .select('*')
      .single(),
  );

  if (!result.error) {
    const profile = await supabase.from('profiles').select('email, full_name').eq('id', uid).single();
    void sendAgentEmailNotification({
      emailType: 'agent_lead_submitted',
      email: profile.data?.email ?? payload.client_email ?? undefined,
      name: profile.data?.full_name ?? undefined,
      region,
      message: payload.client_name,
    });
    void sendAgentEmailNotification({
      emailType: 'agent_lead_admin_alert',
      name: payload.client_name,
      email: payload.client_email ?? undefined,
      region,
      message: payload.service_interested ?? undefined,
    });
  }

  return result;
}

export async function fetchAgentLeads(agentId?: string) {
  ensureConfigured();
  const uid = agentId ?? (await currentUserId());
  return logSupabaseQuery(
    'agent_leads.list',
    supabase.from('agent_leads').select('*').eq('agent_id', uid).order('created_at', { ascending: false }),
  );
}

export { calculateAgentTier, calculateCommission } from '@/lib/agent/tiers';

export async function fetchAgentCommissions(agentId?: string) {
  ensureConfigured();
  const uid = agentId ?? (await currentUserId());
  return logSupabaseQuery(
    'agent_commissions.list',
    supabase
      .from('agent_commissions')
      .select('*')
      .eq('agent_id', uid)
      .order('created_at', { ascending: false }),
  );
}

export async function fetchAgentPayouts(agentId?: string) {
  ensureConfigured();
  const uid = agentId ?? (await currentUserId());
  return logSupabaseQuery(
    'agent_payouts.list',
    supabase.from('agent_payouts').select('*').eq('agent_id', uid).order('created_at', { ascending: false }),
  );
}

export async function sendAgentMessage(body: string, threadId?: string) {
  ensureConfigured();
  const uid = await currentUserId();

  let activeThreadId = threadId;
  if (!activeThreadId) {
    const existing = await logSupabaseQuery(
      'message_threads.agent',
      supabase
        .from('message_threads')
        .select('id')
        .eq('thread_type', 'agent')
        .eq('agent_id', uid)
        .eq('status', 'open')
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    );

    if (existing.data?.id) {
      activeThreadId = existing.data.id;
    } else {
      const created = await logSupabaseQuery(
        'message_threads.agent_create',
        supabase
          .from('message_threads')
          .insert({
            thread_type: 'agent',
            agent_id: uid,
            subject: 'Agent Partner Support',
            status: 'open',
            last_message_at: new Date().toISOString(),
          })
          .select('id')
          .single(),
      );
      if (created.error) return created;
      activeThreadId = created.data?.id;
    }
  }

  const msg = await logSupabaseQuery(
    'messages.agent_send',
    supabase
      .from('messages')
      .insert({
        thread_id: activeThreadId!,
        sender_id: uid,
        body: body.trim(),
      })
      .select('*')
      .single(),
  );

  if (!msg.error) {
    await logSupabaseQuery(
      'message_threads.touch',
      supabase
        .from('message_threads')
        .update({ last_message_at: new Date().toISOString() })
        .eq('id', activeThreadId!),
    );
    void sendAgentEmailNotification({ emailType: 'agent_message_received', message: body });
  }

  return { ...msg, threadId: activeThreadId };
}

export async function fetchAgentMessages(threadId?: string) {
  ensureConfigured();
  const uid = await currentUserId();

  if (!threadId) {
    const thread = await logSupabaseQuery(
      'message_threads.agent_latest',
      supabase
        .from('message_threads')
        .select('id')
        .eq('thread_type', 'agent')
        .eq('agent_id', uid)
        .order('updated_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    );
    threadId = thread.data?.id;
    if (!threadId) return { data: [], threadId: null, error: null };
  }

  const messages = await logSupabaseQuery(
    'messages.agent_thread',
    supabase
      .from('messages')
      .select('*')
      .eq('thread_id', threadId)
      .order('created_at', { ascending: true }),
  );

  return { ...messages, threadId };
}

export async function markAgentNotificationsRead(notificationIds?: string[]) {
  ensureConfigured();
  const uid = await currentUserId();
  const now = new Date().toISOString();

  if (notificationIds?.length) {
    return logSupabaseQuery(
      'notifications.mark_read',
      supabase
        .from('notifications')
        .update({ read_at: now })
        .eq('user_id', uid)
        .in('id', notificationIds),
    );
  }

  return logSupabaseQuery(
    'notifications.mark_all_read',
    supabase.from('notifications').update({ read_at: now }).eq('user_id', uid).is('read_at', null),
  );
}

export async function resolveReferralAgent(code: string) {
  ensureConfigured();
  return logSupabaseQuery(
    'resolve_agent_referral',
    supabase.rpc('resolve_agent_referral', { p_code: code }),
  );
}

export async function trackReferralVisit(agentCode: string, landingPath?: string, region?: RegionCode) {
  ensureConfigured();
  const resolved = await resolveReferralAgent(agentCode);
  const row = Array.isArray(resolved.data) ? resolved.data[0] : resolved.data;
  if (!row?.agent_id) return resolved;

  return logSupabaseQuery(
    'agent_referrals.insert',
    supabase.from('agent_referrals').insert({
      agent_id: row.agent_id,
      agent_code: row.agent_code,
      landing_path: landingPath,
      region: region ?? row.region,
      visitor_session: typeof crypto !== 'undefined' ? crypto.randomUUID() : String(Date.now()),
    }),
  );
}

export async function attachReferralToInquiry(inquiryId: string) {
  const stored = getStoredReferral();
  if (!stored?.agentCode) return { data: null, error: null };

  const resolved = await resolveReferralAgent(stored.agentCode);
  const row = Array.isArray(resolved.data) ? resolved.data[0] : resolved.data;
  if (!row?.agent_id) return { data: null, error: null };

  return logSupabaseQuery(
    'inquiries.attach_referral',
    supabase
      .from('inquiries')
      .update({
        agent_code: row.agent_code,
        agent_id: row.agent_id,
        referral_source: getReferralSource() || stored.landingPath || 'referral',
      })
      .eq('id', inquiryId),
  );
}

// ---------------------------------------------------------------------------
// Admin
// ---------------------------------------------------------------------------

export async function adminFetchAgents(region?: RegionCode | 'all') {
  ensureConfigured();
  let query = supabase
    .from('agent_profiles')
    .select('*, profiles(full_name, email, agent_code, agent_status, role, region)')
    .order('created_at', { ascending: false });

  if (region && region !== 'all') {
    query = query.eq('region', region);
  }

  const [agents, leads, commissions, payouts, referrals, tierHistory] = await Promise.all([
    logSupabaseQuery('admin.agent_profiles', query),
    logSupabaseQuery('admin.agent_leads', supabase.from('agent_leads').select('*').order('created_at', { ascending: false })),
    logSupabaseQuery(
      'admin.agent_commissions',
      supabase.from('agent_commissions').select('*').order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'admin.agent_payouts',
      supabase.from('agent_payouts').select('*').order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'admin.agent_referrals',
      supabase.from('agent_referrals').select('*').order('created_at', { ascending: false }),
    ),
    logSupabaseQuery(
      'admin.agent_tier_history',
      supabase.from('agent_tier_history').select('*').order('created_at', { ascending: false }),
    ),
  ]);

  return {
    agents: agents.data ?? [],
    leads: leads.data ?? [],
    commissions: commissions.data ?? [],
    payouts: payouts.data ?? [],
    referrals: referrals.data ?? [],
    tierHistory: tierHistory.data ?? [],
    error:
      agents.error ||
      leads.error ||
      commissions.error ||
      payouts.error ||
      referrals.error ||
      tierHistory.error,
  };
}

async function syncAgentTier(agentId: string, paidCount: number) {
  const tierInfo = calculateAgentTier(paidCount);
  const { data: existing } = await supabase
    .from('agent_profiles')
    .select('tier')
    .eq('user_id', agentId)
    .maybeSingle();

  await supabase
    .from('agent_profiles')
    .update({
      completed_paid_projects: paidCount,
      tier: tierInfo.tier,
      commission_rate: tierInfo.rate,
    })
    .eq('user_id', agentId);

  if (existing?.tier && existing.tier !== tierInfo.tier) {
    await supabase.from('agent_tier_history').insert({
      agent_id: agentId,
      previous_tier: existing.tier,
      new_tier: tierInfo.tier,
      completed_projects: paidCount,
      commission_rate: tierInfo.rate,
    });
  }
}

export async function adminUpdateAgentStatus(
  userId: string,
  status: AgentStatus,
  options?: { applicationId?: string; reviewedBy?: string },
) {
  ensureConfigured();

  const updates: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };
  if (status === 'approved') {
    updates.approved_at = new Date().toISOString();
    updates.region_locked = true;
  }

  const agentProfileRes = await logSupabaseQuery(
    'agent_profiles.admin_status',
    supabase.from('agent_profiles').update(updates).eq('user_id', userId).select('*').single(),
  );

  const profilePatch: Record<string, unknown> = { agent_status: status };
  let partnerId: string | undefined;
  let referralCode: string | undefined;

  if (status === 'approved') {
    profilePatch.role = 'agent';
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('agent_code, full_name, region')
      .eq('id', userId)
      .single();

    const agentRegion = (agentProfileRes.data?.region ??
      (existingProfile?.region as RegionCode | undefined) ??
      'lk') as RegionCode;
    const sequence = await nextPartnerSequence(agentRegion);
    partnerId = formatPartnerId(agentRegion, sequence);

    if (!existingProfile?.agent_code) {
      referralCode = await generateUniqueReferralCode(existingProfile?.full_name ?? 'Partner');
      profilePatch.agent_code = referralCode;
    } else {
      referralCode = existingProfile.agent_code;
    }

    const profileUpdates: Record<string, unknown> = {
      partner_id: partnerId,
      updated_at: new Date().toISOString(),
    };
    await logSupabaseQuery(
      'agent_profiles.partner_id',
      supabase.from('agent_profiles').update(profileUpdates).eq('user_id', userId),
    );
  }
  if (status === 'rejected' || status === 'suspended') {
    profilePatch.role = 'client';
  }

  await logSupabaseQuery(
    'profiles.admin_agent_status',
    supabase.from('profiles').update(profilePatch).eq('id', userId),
  );

  if (options?.applicationId) {
    await logSupabaseQuery(
      'agent_applications.admin_status',
      supabase
        .from('agent_applications')
        .update({
          status: status === 'suspended' ? 'rejected' : status,
          reviewed_by: options.reviewedBy ?? null,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', options.applicationId),
    );
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('email, full_name, agent_code, region')
    .eq('id', userId)
    .single();

  await notifyUser(
    userId,
    'Partner Application Update',
    `Your partner application status is now: ${partnerStatusLabel(status)}.`,
  );

  if (status === 'approved') {
    void sendAgentEmailNotification({
      emailType: 'agent_application_approved',
      email: profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      region: profile?.region ?? undefined,
      agentCode: referralCode ?? profile?.agent_code ?? undefined,
      partnerId,
    });
  } else if (status === 'rejected') {
    void sendAgentEmailNotification({
      emailType: 'agent_application_rejected',
      email: profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      region: profile?.region ?? undefined,
    });
  } else if (status === 'interview' || status === 'under_review') {
    void sendAgentEmailNotification({
      emailType: 'agent_application_needs_info',
      email: profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      region: profile?.region ?? undefined,
      message: 'Our team needs additional information to continue reviewing your partner application.',
    });
  }

  return agentProfileRes;
}

export async function updatePartnerReferralCode(userId: string, nextCode: string) {
  ensureConfigured();
  const normalized = normalizeReferralCode(nextCode);
  if (!isUrlSafeReferralCode(normalized)) {
    return { error: new Error('Referral code must be unique, URL-safe, and 3–32 characters.'), data: null };
  }

  const { data: agentProfile } = await supabase
    .from('agent_profiles')
    .select('status, referral_code_customized')
    .eq('user_id', userId)
    .maybeSingle();

  if (agentProfile?.status !== 'approved') {
    return { error: new Error('Referral codes can only be customized after approval.'), data: null };
  }

  const { data: taken } = await supabase
    .from('profiles')
    .select('id')
    .eq('agent_code', normalized)
    .neq('id', userId)
    .maybeSingle();

  if (taken) return { error: new Error('This referral code is already in use.'), data: null };

  const result = await logSupabaseQuery(
    'profiles.referral_code',
    supabase.from('profiles').update({ agent_code: normalized }).eq('id', userId).select('agent_code').single(),
  );

  if (!result.error) {
    await supabase
      .from('agent_profiles')
      .update({ referral_code_customized: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
  }

  return result;
}

export async function adminOverridePartnerReferralCode(userId: string, nextCode: string) {
  ensureConfigured();
  const normalized = normalizeReferralCode(nextCode);
  if (!isUrlSafeReferralCode(normalized)) {
    return { error: new Error('Referral code must be URL-safe.'), data: null };
  }

  const { data: taken } = await supabase
    .from('profiles')
    .select('id')
    .eq('agent_code', normalized)
    .neq('id', userId)
    .maybeSingle();

  if (taken) return { error: new Error('This referral code is already in use.'), data: null };

  return logSupabaseQuery(
    'profiles.admin_referral_code',
    supabase.from('profiles').update({ agent_code: normalized }).eq('id', userId).select('agent_code').single(),
  );
}

export async function adminUpdateAgentLeadStatus(leadId: string, status: AgentLeadStatus) {
  ensureConfigured();

  const result = await logSupabaseQuery(
    'agent_leads.admin_status',
    supabase.from('agent_leads').update({ status }).eq('id', leadId).select('*').single(),
  );

  if (!result.error && result.data?.agent_id && status === 'paid') {
    const { data: paidLeads } = await supabase
      .from('agent_leads')
      .select('id')
      .eq('agent_id', result.data.agent_id)
      .eq('status', 'paid');
    await syncAgentTier(result.data.agent_id, paidLeads?.length ?? 0);
  }

  return result;
}

export async function adminCreateCommission(payload: {
  agent_id: string;
  agent_lead_id?: string | null;
  project_id?: string | null;
  project_amount: number;
  currency?: string;
  status?: CommissionStatus;
}) {
  ensureConfigured();
  const { data: agentProfile } = await supabase
    .from('agent_profiles')
    .select('tier, commission_rate, region, completed_paid_projects')
    .eq('user_id', payload.agent_id)
    .maybeSingle();

  const tier = calculateAgentTier(agentProfile?.completed_paid_projects ?? 0);
  const rate = agentProfile?.commission_rate ?? tier.rate;
  const amount = calculateCommission(payload.project_amount, Number(rate));

  const result = await logSupabaseQuery(
    'agent_commissions.admin_create',
    supabase
      .from('agent_commissions')
      .insert({
        agent_id: payload.agent_id,
        agent_lead_id: payload.agent_lead_id ?? null,
        project_id: payload.project_id ?? null,
        project_amount: payload.project_amount,
        commission_rate: rate,
        commission_amount: amount,
        currency: payload.currency ?? regionCurrency((agentProfile?.region ?? 'lk') as RegionCode),
        tier: tier.tier as AgentTier,
        status: payload.status ?? 'pending',
      })
      .select('*')
      .single(),
  );

  if (!result.error && payload.status === 'approved') {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', payload.agent_id)
      .single();
    void sendAgentEmailNotification({
      emailType: 'agent_commission_approved',
      email: profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      amount: String(amount),
      currency: payload.currency,
    });
  }

  return result;
}

export async function adminCreatePayout(payload: {
  agent_id: string;
  amount: number;
  currency?: string;
  method?: string;
  reference?: string;
  notes?: string;
  created_by?: string;
}) {
  ensureConfigured();

  const result = await logSupabaseQuery(
    'agent_payouts.admin_create',
    supabase
      .from('agent_payouts')
      .insert({
        agent_id: payload.agent_id,
        amount: payload.amount,
        currency: payload.currency ?? 'LKR',
        method: payload.method ?? null,
        reference: payload.reference ?? null,
        notes: payload.notes ?? null,
        status: 'completed',
        paid_at: new Date().toISOString(),
        created_by: payload.created_by ?? null,
      })
      .select('*')
      .single(),
  );

  if (!result.error) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('email, full_name')
      .eq('id', payload.agent_id)
      .single();
    void sendAgentEmailNotification({
      emailType: 'agent_commission_paid',
      email: profile?.email ?? undefined,
      name: profile?.full_name ?? undefined,
      amount: String(payload.amount),
      currency: payload.currency,
    });
  }

  return result;
}

export async function adminSendAgentMessage(agentId: string, body: string) {
  ensureConfigured();
  const adminId = await currentUserId();

  const existing = await supabase
    .from('message_threads')
    .select('id')
    .eq('thread_type', 'agent')
    .eq('agent_id', agentId)
    .eq('status', 'open')
    .limit(1)
    .maybeSingle();

  let threadId = existing.data?.id;
  if (!threadId) {
    const created = await supabase
      .from('message_threads')
      .insert({
        thread_type: 'agent',
        agent_id: agentId,
        subject: 'Jawrah Pixel Partner Desk',
        status: 'open',
        last_message_at: new Date().toISOString(),
      })
      .select('id')
      .single();
    threadId = created.data?.id;
  }

  const msg = await supabase.from('messages').insert({
    thread_id: threadId!,
    sender_id: adminId,
    body: body.trim(),
  });

  if (!msg.error) {
    await notifyUser(agentId, 'New Message', 'You have a new message from Jawrah Pixel admin.');
    void sendAgentEmailNotification({ emailType: 'agent_message_received', message: body });
  }

  return msg;
}
