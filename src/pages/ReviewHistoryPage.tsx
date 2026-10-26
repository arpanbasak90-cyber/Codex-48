import React, { useState } from 'react';
import type { ReviewRecord } from '../types';
import { 
  Search, 
  FileText, 
  ArrowRight, 
  CheckCircle2, 
  Plus,
  Trash2
} from 'lucide-react';

interface ReviewHistoryPageProps {
  reviews: ReviewRecord[];
  onOpenReview: (reviewId: string) => void;
  onNewReview: () => void;
  onDeleteReview?: (reviewId: string) => void;
  onClearAllReviews?: () => void;
}

export const ReviewHistoryPage: React.FC<ReviewHistoryPageProps> = ({
  reviews,
  onOpenReview,
  onNewReview,
  onDeleteReview,
  onClearAllReviews,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter !== 'all' && r.status !== statusFilter) return false;
    if (channelFilter !== 'all' && r.targetChannel !== channelFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        r.campaignName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.content.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="page-container">
      {/* Title Bar */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="page-title" style={{ margin: 0 }}>Review History</h1>
          <div className="page-subtitle" style={{ marginBottom: 0 }}>
            Audit log of all marketing campaign scans, compliance evaluations, and approvals.
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {onClearAllReviews && reviews.length > 0 && (
            <button 
              className="btn btn-secondary" 
              style={{ color: '#ef4444' }} 
              onClick={onClearAllReviews}
              title="Delete all review records"
            >
              <Trash2 size={14} />
              <span>Clear All History</span>
            </button>
          )}
          <button className="btn btn-primary" onClick={onNewReview}>
            <Plus size={15} />
            <span>New Review</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ 
        background: 'white', 
        padding: '16px 20px', 
        borderRadius: 'var(--radius-md)', 
        border: '1px solid var(--border-color)',
        marginBottom: 20,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', flex: 1 }}>
          {/* Search */}
          <div style={{ position: 'relative', minWidth: 260 }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: 30, height: 36, fontSize: 13 }}
              placeholder="Search by campaign name or review ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Status:</span>
            <select
              className="form-select"
              style={{ height: 36, fontSize: 12.5, width: 'auto' }}
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Action Required">Action Required</option>
              <option value="Needs Evidence">Needs Evidence</option>
              <option value="Revision Requested">Revision Requested</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {/* Channel Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Channel:</span>
            <select
              className="form-select"
              style={{ height: 36, fontSize: 12.5, width: 'auto' }}
              value={channelFilter}
              onChange={(e) => setChannelFilter(e.target.value)}
            >
              <option value="all">All Channels</option>
              <option value="LinkedIn Ad">LinkedIn Ad</option>
              <option value="Google Search Ad">Google Search Ad</option>
              <option value="Twitter / X Post">Twitter / X Post</option>
              <option value="Meta Ad">Meta Ad</option>
              <option value="Email Newsletter">Email Newsletter</option>
            </select>
          </div>
        </div>

        <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
          Showing <strong>{filteredReviews.length}</strong> of <strong>{reviews.length}</strong> records
        </div>
      </div>

      {/* Reviews Table */}
      <div className="history-section-card">
        <div style={{ overflowX: 'auto' }}>
          <table className="reviews-table">
            <thead>
              <tr>
                <th style={{ width: '32%' }}>Campaign Name & ID</th>
                <th style={{ width: '15%' }}>Channel</th>
                <th style={{ width: '12%' }}>Score</th>
                <th style={{ width: '20%' }}>Compliance Findings</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '9%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                    No matching review records found.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => {
                  let statusClass = 'pill-verified';
                  if (review.status === 'Action Required') statusClass = 'pill-critical';
                  else if (review.status === 'Needs Evidence') statusClass = 'pill-warning';
                  else if (review.status === 'Rejected') statusClass = 'pill-critical';
                  else if (review.status === 'Revision Requested') statusClass = 'pill-warning';

                  const critCount = review.findings.filter(f => f.severity === 'critical').length;
                  const warnCount = review.findings.filter(f => f.severity === 'warning').length;

                  return (
                    <tr key={review.id}>
                      {/* Campaign */}
                      <td>
                        <div className="campaign-cell">
                          <div className="campaign-icon-wrap">
                            <FileText size={16} />
                          </div>
                          <div className="campaign-meta">
                            <div className="campaign-title-row">
                              <span 
                                className="campaign-name"
                                onClick={() => onOpenReview(review.id)}
                                style={{ cursor: 'pointer' }}
                              >
                                {review.campaignName}
                              </span>
                              <span className="campaign-id-tag">{review.id}</span>
                            </div>
                            <div className="campaign-subline">
                              {review.headline || 'Promotional Ad Content'} • {review.createdAt}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Channel */}
                      <td>
                        <span style={{ fontWeight: 500, color: 'var(--text-sub)' }}>
                          {review.targetChannel}
                        </span>
                      </td>

                      {/* Score */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ fontWeight: 800, fontSize: 14 }}>
                            {review.brandHealthScore}
                          </span>
                          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>/100</span>
                        </div>
                      </td>

                      {/* Compliance Findings */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {review.findings.length === 0 ? (
                            <span style={{ color: '#059669', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 size={13} />
                              <span>0 findings</span>
                            </span>
                          ) : (
                            <>
                              {critCount > 0 && (
                                <span className="pill pill-critical" style={{ fontSize: 11 }}>
                                  {critCount} Critical
                                </span>
                              )}
                              {warnCount > 0 && (
                                <span className="pill pill-warning" style={{ fontSize: 11 }}>
                                  {warnCount} Unverified
                                </span>
                              )}
                              {review.findings.length - critCount - warnCount > 0 && (
                                <span className="pill pill-purple" style={{ fontSize: 11 }}>
                                  +{review.findings.length - critCount - warnCount} Suggestions
                                </span>
                              )}
                            </>
                          )}
                        </div>
                      </td>

                      {/* Status */}
                      <td>
                        <span className={`pill ${statusClass}`}>
                          {review.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                          <button
                            className="btn btn-ghost btn-sm"
                            style={{ color: 'var(--primary)', fontWeight: 600 }}
                            onClick={() => onOpenReview(review.id)}
                          >
                            <span>View Results</span>
                            <ArrowRight size={13} />
                          </button>
                          {onDeleteReview && (
                            <button
                              className="btn btn-ghost"
                              style={{ width: 28, height: 28, padding: 0, color: '#94a3b8' }}
                              onClick={() => onDeleteReview(review.id)}
                              title="Delete review"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
