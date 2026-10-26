export type RuleCategory = 
  | 'prohibited'
  | 'trademark'
  | 'evidence_required'
  | 'tone_sla'
  | 'disclaimer';

export type Severity = 'critical' | 'warning' | 'suggestion' | 'verified';

export interface BrandRule {
  id: string;
  code: string; // e.g. "Policy 4.2", "FTC COMPLIANCE", "Glossary v2.4"
  title: string;
  category: RuleCategory;
  categoryLabel: string;
  severity: Severity;
  description: string;
  matchPattern: string;
  isRegex: boolean;
  clarificationNote: string;
  suggestedReplacement: string;
  evidenceRequired: boolean;
  requiredEvidenceCategory?: string;
  applicableChannels?: string[]; // If empty, applies to all
  isActive: boolean;
}

export interface EvidenceRecord {
  id: string;
  code: string; // e.g. "SLA-2025-V2", "PROD-CAT-2024"
  title: string;
  claimOrFact: string;
  sourceReference: string;
  category: string;
  verificationStatus: 'verified' | 'unverified' | 'disputed';
  notes: string;
  dateAdded: string;
}

export interface Finding {
  id: string;
  ruleId?: string;
  ruleCode: string;
  category: RuleCategory;
  categoryLabel: string;
  severity: Severity;
  originalClaim: string;
  matchedText: string;
  startIndex: number;
  endIndex: number;
  issue: string;
  clarificationNote?: string;
  evidenceReference?: string;
  suggestedAlternative: string;
  actionLabel?: string;
  status: 'pending' | 'reviewed' | 'applied' | 'overridden';
  overrideReason?: string;
  attachedEvidenceId?: string;
}

export type ReviewStatus = 
  | 'Draft'
  | 'Scanned'
  | 'Action Required'
  | 'Approved'
  | 'Needs Evidence'
  | 'Rejected'
  | 'Revision Requested';

export interface ReviewVersion {
  version: number;
  content: string;
  timestamp: string;
  score: number;
  findings: Finding[];
}

export interface AuditLogEntry {
  timestamp: string;
  action: string;
  user: string;
  details: string;
}

export interface ReviewRecord {
  id: string; // e.g. "#BG-8924"
  campaignName: string;
  targetChannel: string;
  headline?: string;
  content: string;
  activePolicyVersion: string;
  status: ReviewStatus;
  brandHealthScore: number;
  findings: Finding[];
  versions: ReviewVersion[];
  currentVersion: number;
  createdAt: string;
  updatedAt: string;
  reviewedAt?: string;
  hasCreativeAsset?: boolean;
  assetFileName?: string;
  auditLog: AuditLogEntry[];
}

export interface ComplianceScanResult {
  score: number;
  status: ReviewStatus;
  findings: Finding[];
  summaryText: string;
  stats: {
    criticalCount: number;
    unverifiedCount: number;
    suggestionCount: number;
    verifiedCount: number;
  };
}
