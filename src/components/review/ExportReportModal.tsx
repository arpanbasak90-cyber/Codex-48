import type { ReviewRecord } from '../../types';
import { Printer, X, FileText } from 'lucide-react';

interface ExportReportModalProps {
  review: ReviewRecord;
  onClose: () => void;
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({ review, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: 780 }}>
        {/* Header */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <FileText size={20} style={{ color: 'var(--primary)' }} />
            <div>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                Compliance Audit Report — {review.id}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {review.campaignName} • Generated {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          <button className="btn btn-ghost" onClick={onClose} style={{ padding: 4 }}>
            <X size={18} />
          </button>
        </div>

        {/* Printable Body */}
        <div className="modal-body" id="printable-audit-report" style={{ fontSize: 13, lineHeight: 1.6 }}>
          {/* Header Summary */}
          <div style={{ 
            background: '#f8fafc', 
            padding: 18, 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-color)',
            marginBottom: 20,
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 12
          }}>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Campaign</div>
              <div style={{ fontWeight: 600 }}>{review.campaignName}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Channel</div>
              <div style={{ fontWeight: 600 }}>{review.targetChannel}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Status</div>
              <div style={{ fontWeight: 700, color: review.status === 'Approved' ? '#059669' : '#b91c1c' }}>
                {review.status}
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Brand Health Score</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-main)' }}>
                {review.brandHealthScore} / 100
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Baseline Policy</div>
              <div style={{ fontWeight: 600 }}>{review.activePolicyVersion}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Scan Engine</div>
              <div style={{ fontWeight: 600 }}>BrandGuard AI v4.6.1</div>
            </div>
          </div>

          {/* Evaluated Copy */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
              Evaluated Marketing Copy
            </div>
            <div style={{ 
              background: '#ffffff', 
              padding: 14, 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-sm)',
              fontStyle: 'italic',
              color: 'var(--text-main)'
            }}>
              "{review.content}"
            </div>
          </div>

          {/* Findings Table */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Identified Compliance Findings ({review.findings.length})
            </div>
            <div style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: 12 }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--border-color)' }}>
                    <th style={{ padding: '8px 12px' }}>Claim / Trigger</th>
                    <th style={{ padding: '8px 12px' }}>Severity</th>
                    <th style={{ padding: '8px 12px' }}>Rule Reference</th>
                    <th style={{ padding: '8px 12px' }}>Suggested Replacement</th>
                    <th style={{ padding: '8px 12px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {review.findings.map((f, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 600 }}>{f.originalClaim}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`pill ${f.severity === 'critical' ? 'pill-critical' : f.severity === 'warning' ? 'pill-warning' : f.severity === 'verified' ? 'pill-verified' : 'pill-purple'}`}>
                          {f.severity}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{f.ruleCode}</td>
                      <td style={{ padding: '10px 12px' }}>{f.suggestedAlternative || 'N/A'}</td>
                      <td style={{ padding: '10px 12px', textTransform: 'capitalize' }}>{f.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Audit History */}
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 8 }}>
              Audit Trail & Decision History
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {(review.auditLog || []).map((log, i) => (
                <div key={i} style={{ fontSize: 11.5, padding: '6px 10px', background: '#f8fafc', borderRadius: 4, display: 'flex', gap: 10 }}>
                  <span style={{ color: 'var(--text-muted)', minWidth: 100 }}>{log.timestamp}</span>
                  <strong style={{ minWidth: 140 }}>{log.action}</strong>
                  <span style={{ color: 'var(--text-sub)' }}>{log.details} ({log.user})</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
          <button className="btn btn-primary" onClick={handlePrint}>
            <Printer size={15} />
            <span>Print / Save PDF Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};
