import React, { useState } from 'react';
import type { Finding } from '../../types';
import { X, EyeOff, AlertTriangle } from 'lucide-react';

interface OverrideModalProps {
  finding: Finding;
  onConfirm: (reason: string) => void;
  onClose: () => void;
}

export const OverrideModal: React.FC<OverrideModalProps> = ({
  finding,
  onConfirm,
  onClose,
}) => {
  const [reason, setReason] = useState('');
  const [reviewerName, setReviewerName] = useState('Sarah M. (Marketing Lead)');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reason.trim()) return;
    onConfirm(`${reviewerName}: ${reason.trim()}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <EyeOff size={18} style={{ color: '#d97706' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                Human Review Override Sign-off
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Provide an auditable justification for overriding this finding
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div style={{ 
              background: '#fffbeb', 
              border: '1px solid #fef08a', 
              padding: 12, 
              borderRadius: 'var(--radius-sm)', 
              fontSize: 12.5, 
              color: '#854d0e',
              marginBottom: 16,
              display: 'flex',
              gap: 8 
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                Overriding a finding bypasses the automated rule check and creates an indelible record in the review audit trail.
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12.5 }}>Target Claim</label>
              <div style={{ padding: '8px 12px', background: '#f8fafc', borderRadius: 4, border: '1px solid var(--border-color)', fontSize: 13, fontWeight: 600 }}>
                {finding.originalClaim}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12.5 }}>Authorizing Reviewer</label>
              <input
                type="text"
                className="form-input"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 12.5 }}>Override Justification & Evidence Link</label>
              <textarea
                className="form-textarea"
                rows={3}
                placeholder="e.g. Legal approved exception per Q4 Exec Committee addendum #104..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={!reason.trim()}>
              Confirm & Log Override
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
