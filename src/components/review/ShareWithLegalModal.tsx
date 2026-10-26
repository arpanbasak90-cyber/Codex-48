import { useState } from 'react';
import type { ReviewRecord } from '../../types';
import { X, Send, Users } from 'lucide-react';

interface ShareWithLegalModalProps {
  review: ReviewRecord;
  onConfirm: (notes: string, recipient: string) => void;
  onClose: () => void;
}

export const ShareWithLegalModal: React.FC<ShareWithLegalModalProps> = ({
  review,
  onConfirm,
  onClose,
}) => {
  const [recipient, setRecipient] = useState('legal-compliance@acmecorp.com');
  const [notes, setNotes] = useState(`Requesting expedited legal review for campaign ${review.campaignName} (${review.id}).`);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(notes, recipient);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 520 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Users size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                Share with Legal Compliance
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Dispatch package for formal brand counsel approval
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12.5 }}>Review Package</label>
              <div style={{ padding: '10px 14px', background: '#f8fafc', borderRadius: 4, border: '1px solid var(--border-color)', fontSize: 13 }}>
                <strong>{review.campaignName}</strong> ({review.id}) • {review.findings.length} findings evaluated
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ fontSize: 12.5 }}>Legal Department Email</label>
              <input
                type="email"
                className="form-input"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label" style={{ fontSize: 12.5 }}>Compliance Dispatch Note</label>
              <textarea
                className="form-textarea"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              <Send size={14} />
              <span>Dispatch to Legal</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
