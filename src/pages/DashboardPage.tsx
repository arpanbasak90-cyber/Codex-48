import React, { useState } from 'react';
import type { ReviewRecord } from '../types';
import { 
  FileText, 
  AlertTriangle, 
  Clock, 
  CheckCircle2, 
  Shield, 
  ArrowRight, 
  Plus, 
  BookOpen, 
  Search
} from 'lucide-react';

interface DashboardPageProps {
  reviews: ReviewRecord[];
  rulesCount: number;
  onOpenReview: (reviewId: string) => void;
  onNewReview: () => void;
  onOpenGuidelines: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  reviews,
  rulesCount,
  onOpenReview,
  onNewReview,
  onOpenGuidelines,
}) => {
  const [filterTab, setFilterTab] = useState<'all' | 'action_required' | 'approved'>('all');
  const [searchFilter, setSearchFilter] = useState('');

  // Calculate dynamic metrics
  const totalReviewsCount = 142 + (reviews.length > 5 ? reviews.length - 5 : 0);
  
  // Calculate total claims flagged across active reviews
  const totalFlaggedClaims = reviews.reduce((sum, r) => {
    return sum + r.findings.filter(f => f.severity !== 'verified').length;
  }, 35);

  const pendingApprovalCount = reviews.filter(
    r => r.status === 'Action Required' || r.status === 'Needs Evidence' || r.status === 'Revision Requested'
  ).length;

  const completedReviewsCount = reviews.filter(r => r.status === 'Approved').length + 93;

  // Filtered reviews list
  const filteredReviews = reviews.filter(r => {
    if (filterTab === 'action_required') {
      if (r.status !== 'Action Required' && r.status !== 'Needs Evidence') return false;
    }
    if (filterTab === 'approved') {
      if (r.status !== 'Approved') return false;
    }
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        r.campaignName.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q) ||
        r.targetChannel.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const actionRequiredCount = reviews.filter(
    r => r.status === 'Action Required' || r.status === 'Needs Evidence'
  ).length;
  const approvedCount = reviews.filter(r => r.status === 'Approved').length;

  return (
    <div className="page-container">
      {/* Welcome Banner */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ margin: 0 }}>
              Welcome back, Sarah
            </h1>
            <span className="pill pill-purple" style={{ fontSize: 11 }}>
              Demo Workspace
            </span>
          </div>
          <div className="page-subtitle" style={{ marginBottom: 0 }}>
            Monitor ad compliance scans, resolve flagged claims, and manage brand baselines.
            <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 3 }}>
              ℹ Demo Environment • All metrics reflect sample simulation data
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button 
            className="btn btn-secondary"
            onClick={onOpenGuidelines}
            id="dash-guidelines-btn"
          >
            <BookOpen size={14} />
            <span>Review Guidelines</span>
          </button>
          <button 
            className="btn btn-primary"
            onClick={onNewReview}
            id="dash-new-review-btn"
          >
            <Plus size={15} />
            <span>+ New Review</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="metrics-grid">
        {/* Card 1: Total Reviews */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Total Reviews</span>
            <div className="metric-icon-wrap" style={{ background: '#eff6ff', color: '#2563eb' }}>
              <FileText size={16} />
            </div>
          </div>
          <div className="metric-value-row">
            <div className="metric-number">{totalReviewsCount}</div>
            <span className="metric-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
              ↑ +12%
            </span>
          </div>
          <div className="metric-footer">
            Processed this month <span style={{ color: '#94a3b8' }}>• Simulated</span>
          </div>
        </div>

        {/* Card 2: Claims Flagged */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Claims Flagged</span>
            <div className="metric-icon-wrap" style={{ background: '#fffbeb', color: '#d97706' }}>
              <AlertTriangle size={16} />
            </div>
          </div>
          <div className="metric-value-row">
            <div className="metric-number">{totalFlaggedClaims}</div>
            <span className="metric-badge" style={{ background: '#fffbeb', color: '#b45309' }}>
              Action Queue
            </span>
          </div>
          <div className="metric-footer">
            Requires human verification & source citations
          </div>
        </div>

        {/* Card 3: Pending Approval */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Pending Approval</span>
            <div className="metric-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <Clock size={16} />
            </div>
          </div>
          <div className="metric-value-row">
            <div className="metric-number">{pendingApprovalCount}</div>
            <span className="metric-badge" style={{ background: '#ede9fe', color: '#6d28d9' }}>
              3 High Priority
            </span>
          </div>
          <div className="metric-footer">
            Awaiting legal or brand sign-off
          </div>
        </div>

        {/* Card 4: Completed Reviews */}
        <div className="metric-card">
          <div className="metric-header">
            <span className="metric-label">Completed Reviews</span>
            <div className="metric-icon-wrap" style={{ background: '#f0fdf4', color: '#059669' }}>
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="metric-value-row">
            <div className="metric-number">{completedReviewsCount}</div>
            <span className="metric-badge" style={{ background: '#ecfdf5', color: '#059669' }}>
              98.2% Accuracy
            </span>
          </div>
          <div className="metric-footer">
            Clean or resolved compliance passes
          </div>
        </div>
      </div>

      {/* Active Rule Policy Banner */}
      <div className="policy-banner">
        <div className="policy-left">
          <div className="policy-shield-icon">
            <Shield size={22} strokeWidth={2.2} />
          </div>
          <div>
            <div className="policy-title-row">
              <span className="policy-title">Active Rule Policy: Acme Global 2025 v2.4</span>
              <span className="policy-enforced-tag">Enforced</span>
            </div>
            <div className="policy-subtext">
              {rulesCount} Rules Active • 14 Evidence Whitepapers Synced • Continuous Policy Guard • Last scanned 18m ago
            </div>
          </div>
        </div>

        <div className="policy-right">
          <div className="policy-status-indicator">
            <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: '#10b981' }}></span>
            <span>Zero Policy Drifts Detected</span>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={onOpenGuidelines}
          >
            <span>View Rule Set</span>
            <ArrowRight size={13} />
          </button>
        </div>
      </div>

      {/* Recent Review History Table Section */}
      <div className="history-section-card">
        <div className="history-section-header">
          <div>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 2 }}>
              Recent Review History
            </div>
            <div style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>
              Recent ad campaign scans evaluated against the current brand baseline.
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Filter Tabs */}
            <div className="filter-tabs">
              <button
                className={`filter-tab ${filterTab === 'all' ? 'active' : ''}`}
                onClick={() => setFilterTab('all')}
              >
                All Reviews
              </button>
              <button
                className={`filter-tab ${filterTab === 'action_required' ? 'active' : ''}`}
                onClick={() => setFilterTab('action_required')}
              >
                Action Required ({actionRequiredCount})
              </button>
              <button
                className={`filter-tab ${filterTab === 'approved' ? 'active' : ''}`}
                onClick={() => setFilterTab('approved')}
              >
                Approved ({approvedCount})
              </button>
            </div>

            {/* Quick search input */}
            <div style={{ position: 'relative', width: 180 }}>
              <Search size={13} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input
                type="text"
                className="form-input"
                style={{ paddingLeft: 28, height: 32, fontSize: 12 }}
                placeholder="Filter campaign..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto' }}>
          <table className="reviews-table">
            <thead>
              <tr>
                <th style={{ width: '35%' }}>Campaign & Asset</th>
                <th style={{ width: '15%' }}>Channel</th>
                <th style={{ width: '25%' }}>AI Compliance Findings</th>
                <th style={{ width: '12%' }}>Status</th>
                <th style={{ width: '13%' }}>Reviewed</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: 'var(--text-muted)' }}>
                    No reviews match the selected filter criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map((review) => {
                  // Count finding types
                  const critCount = review.findings.filter(f => f.severity === 'critical').length;
                  const warnCount = review.findings.filter(f => f.severity === 'warning').length;
                  const toneCount = review.findings.filter(f => f.category === 'trademark' || f.category === 'tone_sla').length;

                  // Status style
                  let statusClass = 'pill-verified';
                  if (review.status === 'Action Required') statusClass = 'pill-critical';
                  else if (review.status === 'Needs Evidence') statusClass = 'pill-warning';
                  else if (review.status === 'Rejected') statusClass = 'pill-critical';
                  else if (review.status === 'Revision Requested') statusClass = 'pill-warning';

                  return (
                    <tr key={review.id}>
                      {/* Campaign & Asset */}
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
                              {review.headline || 'Primary headline & technical guarantee claim'}
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

                      {/* AI Compliance Findings */}
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          {review.findings.length === 0 ? (
                            <span style={{ color: '#059669', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
                              <CheckCircle2 size={13} />
                              <span>0 findings • 100% Compliant</span>
                            </span>
                          ) : (
                            <>
                              {critCount > 0 && (
                                <span className="pill pill-critical" style={{ fontSize: 11 }}>
                                  {critCount} Violation
                                </span>
                              )}
                              {warnCount > 0 && (
                                <span className="pill pill-warning" style={{ fontSize: 11 }}>
                                  {warnCount} Unverified
                                </span>
                              )}
                              {toneCount > 0 && (
                                <span className="pill pill-purple" style={{ fontSize: 11 }}>
                                  +{toneCount} Tone
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

                      {/* Reviewed Date */}
                      <td>
                        <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>
                          {review.reviewedAt || review.createdAt}
                        </span>
                      </td>

                      {/* Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          className="btn btn-ghost btn-sm"
                          style={{ color: 'var(--primary)', fontWeight: 600 }}
                          onClick={() => onOpenReview(review.id)}
                          id={`view-review-${review.id.replace('#', '')}`}
                        >
                          <span>View Results</span>
                          <ArrowRight size={13} />
                        </button>
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
