import type { EvidenceRecord, Finding } from '../../types';
import { X, Paperclip, CheckCircle2 } from 'lucide-react';

interface AttachEvidenceModalProps {
  finding: Finding;
  evidenceList: EvidenceRecord[];
  onAttach: (evidence: EvidenceRecord) => void;
  onClose: () => void;
}

export const AttachEvidenceModal: React.FC<AttachEvidenceModalProps> = ({
  finding,
  evidenceList,
  onAttach,
  onClose,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 640 }}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Paperclip size={18} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                Attach Substantiating Evidence
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                Select an approved whitepaper or benchmark for {finding.originalClaim}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 16 }}>
            Select an approved evidence record from the Acme enterprise repository to substantiate this claim:
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {evidenceList.map((record) => (
              <div
                key={record.id}
                style={{
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  padding: 14,
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: 12,
                  background: record.verificationStatus === 'verified' ? '#ffffff' : '#f8fafc',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span className="pill pill-neutral" style={{ fontSize: 10, fontFamily: 'monospace' }}>
                      {record.code}
                    </span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)' }}>
                      {record.title}
                    </span>
                    <span className={`pill ${record.verificationStatus === 'verified' ? 'pill-verified' : 'pill-warning'}`} style={{ fontSize: 10 }}>
                      {record.verificationStatus}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4 }}>
                    {record.claimOrFact}
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8' }}>
                    Source: {record.sourceReference}
                  </div>
                </div>

                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => onAttach(record)}
                  style={{ flexShrink: 0 }}
                >
                  <CheckCircle2 size={13} />
                  <span>Attach</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
