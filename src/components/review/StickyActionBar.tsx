import React from 'react';
import type { Finding } from '../../types';
import { Copy, CheckCheck, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface StickyActionBarProps {
  findings: Finding[];
  blockingViolationsCount: number;
  onCopyAllSuggestions: () => void;
  onMarkAllReviewed: () => void;
  onApprove: () => void;
  onRequestRevision: () => void;
  onExportReport: () => void;
}

export const StickyActionBar: React.FC<StickyActionBarProps> = ({
  findings,
  blockingViolationsCount,
  onCopyAllSuggestions,
  onMarkAllReviewed,
  onApprove,
  onRequestRevision,
}) => {
  const actionableFindings = findings.filter(f => f.severity !== 'verified');
  const resolvedFindings = actionableFindings.filter(
    f => f.status === 'applied' || f.status === 'reviewed' || f.status === 'overridden'
  );

  const totalActionable = actionableFindings.length;
  const resolvedCount = resolvedFindings.length;

  return (
    <footer className="sticky-action-bar">
      {/* Left: Progress Indicator */}
      <div className="progress-indicator">
        {blockingViolationsCount > 0 ? (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444' }}>
            <AlertCircle size={15} />
            <span>{blockingViolationsCount} blocking violation{blockingViolationsCount === 1 ? '' : 's'} to resolve</span>
          </span>
        ) : (
          <span style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#059669' }}>
            <CheckCircle2 size={15} />
            <span>All critical policy blocks resolved</span>
          </span>
        )}

        <span style={{ color: '#cbd5e1' }}>|</span>

        <span style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
          Review Progress: <strong>{resolvedCount}</strong> of <strong>{totalActionable}</strong> actionable items resolved
        </span>
      </div>

      {/* Right: Actions */}
      <div className="batch-actions-group">
        <button 
          className="btn btn-secondary btn-sm"
          onClick={onCopyAllSuggestions}
          title="Copy all suggested compliant replacements"
        >
          <Copy size={13} />
          <span>Copy All Suggestions</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onMarkAllReviewed}
          title="Mark all flagged items as reviewed"
        >
          <CheckCheck size={13} />
          <span>Mark All as Reviewed</span>
        </button>

        <button 
          className="btn btn-secondary btn-sm"
          onClick={onApprove}
          title="Sign-off and approve this ad copy"
        >
          <CheckCircle2 size={14} style={{ color: '#10b981' }} />
          <span>Approve Ad</span>
        </button>

        <button 
          className="btn btn-primary btn-sm"
          onClick={onRequestRevision}
          title="Request revision from marketing author"
          id="btn-request-revision"
        >
          <Send size={13} />
          <span>Request Revision</span>
        </button>
      </div>
    </footer>
  );
};
