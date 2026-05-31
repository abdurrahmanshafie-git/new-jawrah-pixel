export const PROJECT_LIFECYCLE = [
  'lead',
  'discovery',
  'planning',
  'design',
  'development',
  'testing',
  'revision',
  'deployment',
  'completed',
] as const;

export type ProjectLifecycleStatus = (typeof PROJECT_LIFECYCLE)[number];

export const CRM_PIPELINE = [
  'new',
  'qualified',
  'proposal_sent',
  'negotiation',
  'won',
  'lost',
] as const;

export type CrmPipelineStatus = (typeof CRM_PIPELINE)[number];

export const PROPOSAL_STATUSES = ['draft', 'sent', 'viewed', 'accepted', 'rejected'] as const;
export type ProposalStatus = (typeof PROPOSAL_STATUSES)[number];

export const INVOICE_STATUSES = ['draft', 'pending', 'paid', 'overdue', 'void'] as const;
export type InvoiceStatus = (typeof INVOICE_STATUSES)[number];

export const AGENT_APPLICATION_STATUSES = ['pending', 'interview', 'approved', 'rejected', 'suspended'] as const;
export type AgentApplicationStatus = (typeof AGENT_APPLICATION_STATUSES)[number];

export const FILE_CATEGORIES = ['project', 'contract', 'invoice', 'proposal', 'asset'] as const;
export type FileCategory = (typeof FILE_CATEGORIES)[number];

export function projectProgressFromStatus(status: string): number {
  const index = PROJECT_LIFECYCLE.indexOf(status as ProjectLifecycleStatus);
  if (index < 0) return 0;
  return Math.round(((index + 1) / PROJECT_LIFECYCLE.length) * 100);
}

export function formatLifecycleLabel(status: string): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

export function isActiveProject(status: string): boolean {
  return !['lead', 'completed'].includes(status);
}

export function isPendingProject(status: string): boolean {
  return ['lead', 'discovery', 'planning'].includes(status);
}

export function isCompletedProject(status: string): boolean {
  return status === 'completed';
}
