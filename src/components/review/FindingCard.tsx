import React from 'react';
import type { Finding } from '../../types';
import { 
  AlertTriangle, 
  ShieldAlert, 
  CheckCircle2, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  Paperclip, 
  FileCheck,
  ShieldCheck,
  EyeOff
} from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
  isSelected?: boolean;
  onApply: (finding: Finding) => void;
  onCopy: (text: string) => void;
  onMarkReviewed: (findingId: string) => void;
  onAttachEvidence?: (finding: Finding) => void;
  onOverride?: (finding: Finding) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  isSelected,
  onApply,
  onCopy,
  onMarkReviewed,
  onAttachEvidence,
  onOverride,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    onCopy(finding.suggestedAlternative);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine card icon and badges based on severity and category
  let cardIcon = <AlertTriangle size={16} style={{ color: '#d97706' }} />;
  let pillClass = 'pill-warning';

  if (finding.severity === 'critical') {
    cardIcon = <ShieldAlert size={16} style={{ color: '#ef4444' }} />;
    pillClass = 'pill-critical';
  } else if (finding.severity === 'verified') {
    cardIcon = <CheckCircle2 size={16} style={{ color: '#059669' }} />;
    pillClass = 'pill-verified';
  } else if (finding.category === 'trademark' || finding.category === 'tone_sla') {
    cardIcon = <Sparkles size={16} style={{ color: '#7c3aed' }} />;
    pillClass = 'pill-purple';
  }

  const isResolved = finding.status === 'applied' || finding.status === 'reviewed' || finding.status === 'overridden';

  return (
    <div 
      className={`finding-card ${isSelected ? 'active-focus' : ''}`}
      id={`card-${finding.id}`}
      style={{
        opacity: isResolved ? 0.75 : 1,
        borderLeft: finding.severity === 'critical' ? '4px solid #ef4444' : undefined,
      }}
    >
      {/* Header */}
      <div className="finding-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {cardIcon}
          <span className={`pill ${pillClass}`}>
            {finding.categoryLabel || finding.ruleCode}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span className="pill pill-neutral" style={{ fontSize: 10, letterSpacing: 0.5, fontWeight: 700 }}>
            {finding.ruleCode}
          </span>
          {finding.status === 'applied' && (
            <span className="pill pill-verified" style={{ fontSize: 10 }}>
              ✓ Applied
            </span>
          )}
          {finding.status === 'reviewed' && (
            <span className="pill pill-neutral" style={{ fontSize: 10 }}>
              Reviewed
            </span>
          )}
          {finding.status === 'overridden' && (
            <span className="pill pill-warning" style={{ fontSize: 10 }}>
              Overridden
            </span>
          )}
        </div>
      </div>

      {/* Original Claim Quote */}
      <div className="finding-claim-quote">
        Claim: {finding.originalClaim}
      </div>

      {/* Clarification Note Box */}
      {finding.clarificationNote && (
        <div className="clarification-box">
          <strong>Clarification Note:</strong> {finding.clarificationNote}
        </div>
      )}

      {/* Evidence Reference */}
      {finding.evidenceReference && (
        <div className="evidence-ref-note">
          <FileText size={14} style={{ color: '#64748b' }} />
          <span>
            <strong>Evidence Reference:</strong> {finding.evidenceReference}
          </span>
        </div>
      )}

      {/* Verified Claim Approval Display */}
      {finding.severity === 'verified' && (
        <div style={{ 
          background: '#f0fdf4', 
          border: '1px solid #bbf7d0', 
          borderRadius: 'var(--radius-sm)', 
          padding: '12px 14px', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginTop: 10 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#047857', fontSize: 13, fontWeight: 600 }}>
            <ShieldCheck size={16} />
            <span>Verified & Approved against active SLA baseline</span>
          </div>
          <span className="pill pill-verified" style={{ fontSize: 11 }}>
            ● Fully Compliant
          </span>
        </div>
      )}

      {/* Suggested Replacement Section */}
      {finding.suggestedAlternative && finding.severity !== 'verified' && (
        <div className="replacement-box">
          <div className="replacement-header">
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Sparkles size={13} />
              {finding.category === 'trademark' 
                ? 'BRAND STANDARD NOMENCLATURE' 
                : finding.category === 'tone_sla'
                ? 'SUGGESTED BRAND TONE ADJUSTMENT'
                : 'AI SUGGESTED COMPLIANT REPLACEMENT'}
            </span>
            <span className="pill pill-neutral" style={{ fontSize: 10 }}>
              {finding.category === 'evidence_required' 
                ? 'Requires Citation' 
                : finding.category === 'tone_sla' 
                ? 'SLA Alignment' 
                : 'Brand Standard'}
            </span>
          </div>

          <div className="replacement-text">
            "{finding.suggestedAlternative}"
          </div>

          <div className="replacement-actions">
            {/* Copy button */}
            <button 
              className="btn btn-secondary btn-sm" 
              onClick={handleCopy}
              title="Copy suggestion to clipboard"
            >
              {copied ? <Check size={13} style={{ color: '#10b981' }} /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy Suggestion'}</span>
            </button>

            {/* Apply button */}
            <button 
              className="btn btn-primary btn-sm"
              onClick={() => onApply(finding)}
              title="Apply replacement directly to draft"
              id={`apply-btn-${finding.id}`}
            >
              <Check size={13} />
              <span>Apply Fix</span>
            </button>

            {/* Attach Evidence */}
            {onAttachEvidence && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => onAttachEvidence(finding)}
                title="Attach evidence whitepaper or SLA document"
              >
                <Paperclip size={13} />
                <span>Attach Evidence</span>
              </button>
            )}

            {/* Mark Reviewed */}
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => onMarkReviewed(finding.id)}
              title="Mark finding as acknowledged/reviewed"
            >
              <FileCheck size={13} />
              <span>{isResolved ? 'Reviewed ✓' : 'Mark Reviewed'}</span>
            </button>

            {/* Override */}
            {onOverride && !isResolved && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => onOverride(finding)}
                title="Log human sign-off override"
                style={{ color: '#94a3b8', marginLeft: 'auto' }}
              >
                <EyeOff size={13} />
                <span>Override</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
