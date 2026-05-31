import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { captureReferralFromSearch, setStoredReferralAgentId } from '@/lib/referral';
import { getRegionFromPathname } from '@/data/regions';
import { resolveReferralAgent, trackReferralVisit } from '@/lib/supabase/agent-api';
import { isSupabaseConfigured } from '@/lib/supabase/client';

export function ReferralCapture() {
  const location = useLocation();

  useEffect(() => {
    const stored = captureReferralFromSearch(location.search, location.pathname);
    if (!stored || !isSupabaseConfigured) return;

    const region = getRegionFromPathname(location.pathname);
    void (async () => {
      const { data } = await resolveReferralAgent(stored.agentCode);
      const row = Array.isArray(data) ? data[0] : data;
      if (row?.agent_id) {
        setStoredReferralAgentId(row.agent_id, row.region ?? region);
        await trackReferralVisit(stored.agentCode, location.pathname, region);
      }
    })();
  }, [location.pathname, location.search]);

  return null;
}
