import React, { useState } from 'react';
import type { ReviewRecord, Finding, EvidenceRecord, BrandRule } from '../types';
import { ScoreMeter } from '../components/review/ScoreMeter';
import { EvaluatedCopySnippet } from '../components/review/EvaluatedCopySnippet';
import { FindingCard } from '../components/review/FindingCard';
import { StickyActionBar } from '../components/review/StickyActionBar';
import { ExportReportModal } from '../components/review/ExportReportModal';
import { AttachEvidenceModal } from '../components/review/AttachEvidenceModal';
import { OverrideModal } from '../components/review/OverrideModal';
import { ShareWithLegalModal } from '../components/review/ShareWithLegalModal';
import { 
  runComplianceScan, 
  applySuggestionToText, 
  applyAllSuggestionsToText 
} from '../engine/complianceEngine';
import { StorageService } from '../storage/localStorage';
import { 
  FileText, 
  Share2, 
  RotateCw, 
  CheckCircle2, 
  Send, 
  Edit3, 
  History,
  Sparkles,
  Info
} from 'lucide-react';

interface AnalysisResultsPageProps {
  review: ReviewRecord;
  rules: BrandRule[];
  evidenceList: EvidenceRecord[];
  onReviewUpdated: (updatedReview: ReviewRecord) => void;
  onNavigateHistory: () => void;
}

export const AnalysisResultsPage: React.FC<AnalysisResultsPageProps> = ({
  review,
  rules,
  evidenceList,
  onReviewUpdated,
  onNavigateHistory,
}) => {
  const [selectedFindingId, setSelectedFindingId] = useState<string | undefined>(
    review.findings[0]?.id
  );
  const [isEditingDraft, setIsEditingDraft] = useState(false);
  const [draftContent, setDraftContent] = useState(review.content);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [targetEvidenceFinding, setTargetEvidenceFinding] = useState<Finding | null>(null);
  const [targetOverrideFinding, setTargetOverrideFinding] = useState<Finding | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Stats calculation
  const criticalCount = review.findings.filter(f => f.severity === 'critical' && f.status !== 'applied').length;
  const unverifiedCount = review.findings.filter(f => f.severity === 'warning' && f.status !== 'applied').length;
  const suggestionCount = review.findings.filter(f => (f.category === 'trademark' || f.category === 'tone_sla') && f.severity !== 'verified' && f.status !== 'applied').length;
  const verifiedCount = review.findings.filter(f => f.severity === 'verified').length;

  /**
   * Re-scan the current content or modified draft against active rules & evidence
   */
  const handleRescan = (contentToScan = draftContent) => {
    const scanResult = runComplianceScan(contentToScan, review.targetChannel, rules, evidenceList);
    const newVersionNum = review.currentVersion + 1;

    const newVersion = {
      version: newVersionNum,
      content: contentToScan,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      score: scanResult.score,
      findings: scanResult.findings,
    };

    const updatedReview: ReviewRecord = {
      ...review,
      content: contentToScan,
      brandHealthScore: scanResult.score,
      status: scanResult.status,
      findings: scanResult.findings,
      versions: [...review.versions, newVersion],
      currentVersion: newVersionNum,
      updatedAt: 'Just now',
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `Revision v${newVersionNum} Rescanned`,
          user: 'AI Engine v4.6.1',
          details: `Re-scan score: ${scanResult.score}/100. ${scanResult.summaryText}`,
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    setIsEditingDraft(false);
    showToast(`Re-scan completed! New Brand Health Score: ${scanResult.score}/100`);
  };

  /**
   * Apply a suggested correction to text and auto-rescan
   */
  const handleApplySuggestion = (finding: Finding) => {
    const updatedContent = applySuggestionToText(draftContent, finding);
    setDraftContent(updatedContent);

    // Update finding state to 'applied'
    const updatedFindings = review.findings.map(f => 
      f.id === finding.id ? { ...f, status: 'applied' as const } : f
    );

    const updatedReview: ReviewRecord = {
      ...review,
      content: updatedContent,
      findings: updatedFindings,
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Applied Suggested Replacement',
          user: 'Sarah M.',
          details: `Replaced "${finding.matchedText}" with "${finding.suggestedAlternative}"`,
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    showToast(`Applied fix for "${finding.matchedText}". Rescanning...`);

    // Auto-rescan to update score cleanly
    setTimeout(() => {
      handleRescan(updatedContent);
    }, 250);
  };

  /**
   * Apply all suggestions in batch
   */
  const handleApplyAllSuggestions = () => {
    const updatedContent = applyAllSuggestionsToText(draftContent, review.findings);
    setDraftContent(updatedContent);
    showToast('Applied all suggestions! Rescanning...');
    setTimeout(() => {
      handleRescan(updatedContent);
    }, 250);
  };

  /**
   * Copy text helper
   */
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard!');
  };

  /**
   * Mark single finding as reviewed
   */
  const handleMarkReviewed = (findingId: string) => {
    const updatedFindings = review.findings.map(f =>
      f.id === findingId ? { ...f, status: 'reviewed' as const } : f
    );

    const updatedReview: ReviewRecord = {
      ...review,
      findings: updatedFindings,
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Finding Marked Reviewed',
          user: 'Sarah M.',
          details: `Marked finding ${findingId} as human reviewed.`,
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    showToast('Marked finding as reviewed.');
  };

  /**
   * Mark all findings as reviewed
   */
  const handleMarkAllReviewed = () => {
    const updatedFindings = review.findings.map(f => ({
      ...f,
      status: 'reviewed' as const,
    }));

    const updatedReview: ReviewRecord = {
      ...review,
      findings: updatedFindings,
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'All Findings Marked Reviewed',
          user: 'Sarah M.',
          details: 'User acknowledged all active compliance findings.',
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    showToast('All items marked as reviewed.');
  };

  /**
   * Approve Ad workflow
   */
  const handleApprove = () => {
    const updatedReview: ReviewRecord = {
      ...review,
      status: 'Approved',
      reviewedAt: 'Just now',
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Review Approved',
          user: 'Sarah M. (Brand Lead)',
          details: 'Campaign approved for public ad publication.',
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    showToast('Campaign approved successfully!');
  };

  /**
   * Request Revision workflow
   */
  const handleRequestRevision = () => {
    const updatedReview: ReviewRecord = {
      ...review,
      status: 'Revision Requested',
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Revision Requested',
          user: 'Sarah M. (Brand Lead)',
          details: 'Dispatched revision request to creative author with identified policy findings.',
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    showToast('Revision requested. Author notified.');
  };

  /**
   * Attach Evidence confirmation
   */
  const handleConfirmAttachEvidence = (evidence: EvidenceRecord) => {
    if (!targetEvidenceFinding) return;

    const updatedFindings = review.findings.map(f => {
      if (f.id === targetEvidenceFinding.id) {
        return {
          ...f,
          severity: 'verified' as const,
          evidenceReference: `Attached: ${evidence.code} — ${evidence.title}`,
          status: 'applied' as const,
        };
      }
      return f;
    });

    const updatedReview: ReviewRecord = {
      ...review,
      findings: updatedFindings,
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Evidence Attached',
          user: 'Sarah M.',
          details: `Attached evidence ${evidence.code} to claim: "${targetEvidenceFinding.matchedText}"`,
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    setTargetEvidenceFinding(null);
    showToast(`Attached ${evidence.code}! Claim verified.`);
  };

  /**
   * Override confirmation
   */
  const handleConfirmOverride = (reason: string) => {
    if (!targetOverrideFinding) return;

    const updatedFindings = review.findings.map(f => {
      if (f.id === targetOverrideFinding.id) {
        return {
          ...f,
          status: 'overridden' as const,
          overrideReason: reason,
        };
      }
      return f;
    });

    const updatedReview: ReviewRecord = {
      ...review,
      findings: updatedFindings,
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Finding Overridden',
          user: 'Sarah M.',
          details: `Override: ${reason}`,
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    setTargetOverrideFinding(null);
    showToast('Recorded compliance override in audit trail.');
  };

  /**
   * Share with Legal confirmation
   */
  const handleConfirmShareWithLegal = (notes: string, recipient: string) => {
    const updatedReview: ReviewRecord = {
      ...review,
      auditLog: [
        {
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: 'Dispatched to Legal',
          user: 'Sarah M.',
          details: `Sent to ${recipient}: "${notes}"`,
        },
        ...review.auditLog,
      ],
    };

    StorageService.saveReview(updatedReview);
    onReviewUpdated(updatedReview);
    setShowShareModal(false);
    showToast(`Dispatched compliance package to ${recipient}`);
  };

  return (
    <div className="page-container" style={{ paddingBottom: 100 }}>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <Sparkles size={16} style={{ color: '#60a5fa' }} />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Card */}
      <div className="results-header-card">
        <div className="results-title-row">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span className="pill pill-neutral" style={{ fontSize: 11, fontWeight: 700 }}>
                {review.targetChannel}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                Review ID: <strong>{review.id}</strong> • Analyzed {review.updatedAt || 'recently'}
              </span>
              {review.versions.length > 1 && (
                <span className="pill pill-purple" style={{ fontSize: 11 }}>
                  Revision v{review.currentVersion}
                </span>
              )}
            </div>
            <h1 className="page-title" style={{ fontSize: 24, margin: 0 }}>
              {review.campaignName}
            </h1>
          </div>

          <div className="results-header-actions">
            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowExportModal(true)}
              id="btn-export-pdf"
            >
              <FileText size={14} />
              <span>Export PDF Report</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => setShowShareModal(true)}
              id="btn-share-legal"
            >
              <Share2 size={14} />
              <span>Share with Legal</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={() => handleRescan(draftContent)}
              id="btn-rescan"
            >
              <RotateCw size={14} />
              <span>Re-scan</span>
            </button>

            <button 
              className="btn btn-secondary btn-sm"
              onClick={handleApprove}
            >
              <CheckCircle2 size={14} style={{ color: '#10b981' }} />
              <span>Approve Anyway</span>
            </button>

            <button 
              className="btn btn-primary btn-sm"
              onClick={handleRequestRevision}
            >
              <Send size={14} />
              <span>Request Revision</span>
            </button>
          </div>
        </div>

        {/* Compliance Audit Summary */}
        <div style={{ 
          background: '#f8fafc', 
          border: '1px solid var(--border-color)', 
          borderRadius: 'var(--radius-sm)', 
          padding: '10px 14px', 
          fontSize: 12.5, 
          color: 'var(--text-sub)',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16
        }}>
          <Info size={15} style={{ color: 'var(--primary)', flexShrink: 0 }} />
          <span>
            <strong>Compliance Audit Summary:</strong> {criticalCount} Rule Violation{criticalCount === 1 ? '' : 's'}, {unverifiedCount} Unsupported Claim{unverifiedCount === 1 ? '' : 's'}, {suggestionCount} Tone Recommendation{suggestionCount === 1 ? '' : 's'} identified across active baseline.
          </span>
        </div>

        {/* Score & Category Breakdown */}
        <ScoreMeter
          score={review.brandHealthScore}
          criticalCount={criticalCount}
          unverifiedCount={unverifiedCount}
          suggestionCount={suggestionCount}
          verifiedCount={verifiedCount}
        />
      </div>

      {/* Main Split Layout */}
      <div className="results-split-layout">
        {/* Left Column: Evaluated Copy Snippet */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
              Evaluated Content
            </span>
            <button
              className="btn btn-ghost btn-sm"
              onClick={() => setIsEditingDraft(!isEditingDraft)}
              style={{ fontSize: 12 }}
            >
              <Edit3 size={13} />
              <span>{isEditingDraft ? 'View Highlighted View' : 'Edit Copy Directly'}</span>
            </button>
          </div>

          {isEditingDraft ? (
            <div className="copy-panel-card">
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 8 }}>
                Modify Copy & Re-evaluate
              </div>
              <textarea
                className="form-textarea"
                rows={10}
                value={draftContent}
                onChange={(e) => setDraftContent(e.target.value)}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 14 }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  onClick={() => {
                    setDraftContent(review.content);
                    setIsEditingDraft(false);
                  }}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-primary btn-sm"
                  onClick={() => handleRescan(draftContent)}
                >
                  <RotateCw size={13} />
                  <span>Re-scan Modified Copy</span>
                </button>
              </div>
            </div>
          ) : (
            <EvaluatedCopySnippet
              headline={review.headline}
              content={review.content}
              channel={review.targetChannel}
              findings={review.findings}
              selectedFindingId={selectedFindingId}
              onSelectFinding={(id) => {
                setSelectedFindingId(id);
                const el = document.getElementById(`card-${id}`);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              onCopyText={handleCopy}
            />
          )}

          {/* Versions History Snippet */}
          {review.versions.length > 1 && (
            <div style={{ 
              marginTop: 16, 
              background: 'white', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: 16 
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-main)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <History size={14} />
                  <span>Revision History ({review.versions.length} versions)</span>
                </div>
                <button 
                  className="btn btn-ghost btn-sm"
                  style={{ fontSize: 11, padding: '2px 8px' }}
                  onClick={onNavigateHistory}
                >
                  All Reviews →
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {review.versions.map((ver) => (
                  <div 
                    key={ver.version} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      padding: '8px 12px',
                      background: ver.version === review.currentVersion ? '#eff6ff' : '#f8fafc',
                      borderRadius: 4,
                      fontSize: 12,
                      border: ver.version === review.currentVersion ? '1px solid #bfdbfe' : '1px solid transparent'
                    }}
                  >
                    <div>
                      <strong>Version {ver.version}</strong>
                      <span style={{ color: 'var(--text-muted)', marginLeft: 8 }}>{ver.timestamp}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span className="pill pill-neutral" style={{ fontSize: 11 }}>
                        Score: {ver.score}/100
                      </span>
                      {ver.version !== review.currentVersion && (
                        <button 
                          className="btn btn-ghost btn-sm"
                          style={{ padding: '2px 8px', fontSize: 11 }}
                          onClick={() => {
                            setDraftContent(ver.content);
                            handleRescan(ver.content);
                          }}
                        >
                          Restore
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Identified Findings */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-main)' }}>
              Identified Findings ({review.findings.length})
            </span>
            <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Click any token on the left to inspect
            </span>
          </div>

          <div className="finding-cards-list">
            {review.findings.length === 0 ? (
              <div style={{ 
                background: 'white', 
                border: '1px solid var(--border-color)', 
                borderRadius: 'var(--radius-md)', 
                padding: 40, 
                textAlign: 'center' 
              }}>
                <CheckCircle2 size={36} style={{ color: '#10b981', margin: '0 auto 12px' }} />
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginBottom: 4 }}>
                  100% Policy Compliant!
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                  No blocking violations, unsupported claims, or brand voice deviations were detected.
                </div>
              </div>
            ) : (
              review.findings.map((f) => (
                <FindingCard
                  key={f.id}
                  finding={f}
                  isSelected={f.id === selectedFindingId}
                  onApply={handleApplySuggestion}
                  onCopy={handleCopy}
                  onMarkReviewed={handleMarkReviewed}
                  onAttachEvidence={(finding) => setTargetEvidenceFinding(finding)}
                  onOverride={(finding) => setTargetOverrideFinding(finding)}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <StickyActionBar
        findings={review.findings}
        blockingViolationsCount={criticalCount}
        onCopyAllSuggestions={handleApplyAllSuggestions}
        onMarkAllReviewed={handleMarkAllReviewed}
        onApprove={handleApprove}
        onRequestRevision={handleRequestRevision}
        onExportReport={() => setShowExportModal(true)}
      />

      {/* Modals */}
      {showExportModal && (
        <ExportReportModal
          review={review}
          onClose={() => setShowExportModal(false)}
        />
      )}

      {showShareModal && (
        <ShareWithLegalModal
          review={review}
          onConfirm={handleConfirmShareWithLegal}
          onClose={() => setShowShareModal(false)}
        />
      )}

      {targetEvidenceFinding && (
        <AttachEvidenceModal
          finding={targetEvidenceFinding}
          evidenceList={evidenceList}
          onAttach={handleConfirmAttachEvidence}
          onClose={() => setTargetEvidenceFinding(null)}
        />
      )}

      {targetOverrideFinding && (
        <OverrideModal
          finding={targetOverrideFinding}
          onConfirm={handleConfirmOverride}
          onClose={() => setTargetOverrideFinding(null)}
        />
      )}
    </div>
  );
};
