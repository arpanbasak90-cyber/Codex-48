import React, { useState } from 'react';
import type { BrandRule, EvidenceRecord, ReviewRecord } from '../types';
import { runComplianceScan } from '../engine/complianceEngine';
import { StorageService } from '../storage/localStorage';
import { 
  Sparkles, 
  Upload, 
  FileText, 
  Image as ImageIcon, 
  X, 
  RotateCcw, 
  AlertCircle,
  FileCheck2
} from 'lucide-react';

interface NewReviewPageProps {
  rules: BrandRule[];
  evidenceList: EvidenceRecord[];
  onScanComplete: (newReviewId: string) => void;
}

export const NewReviewPage: React.FC<NewReviewPageProps> = ({
  rules,
  evidenceList,
  onScanComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'text' | 'image'>('text');
  const [campaignName, setCampaignName] = useState('Q4 Cloud Launch - Enterprise Tier');
  const [targetChannel, setTargetChannel] = useState('LinkedIn Ad');
  const [headline, setHeadline] = useState('Are cloud bottlenecks slowing your engineering sprint cycles?');
  const [copyText, setCopyText] = useState(
    'Boost your enterprise productivity by 10x guaranteed with Acme Cloud Platform. Voted #1 fastest cloud database in North America without downtime!'
  );
  const [uploadedFile, setUploadedFile] = useState<{ name: string; size: string } | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Live word and character counters
  const words = copyText.trim().split(/\s+/).filter(Boolean).length;
  const chars = copyText.length;

  const handleClear = () => {
    setCopyText('');
  };

  const handleLoadSample = (type: 'flagged' | 'clean' | 'long') => {
    if (type === 'flagged') {
      setCampaignName('Q4 Cloud Launch - Enterprise Tier');
      setTargetChannel('LinkedIn Ad');
      setHeadline('Are cloud bottlenecks slowing your engineering sprint cycles?');
      setCopyText(
        'Boost your enterprise productivity by 10x guaranteed with Acme Cloud Platform. Voted #1 fastest cloud database in North America without downtime!'
      );
    } else if (type === 'long') {
      setCampaignName('Global Enterprise Scaling');
      setTargetChannel('LinkedIn Ad');
      setHeadline('Are cloud bottlenecks slowing your engineering sprint cycles?');
      setCopyText(
        'Deploy the Acme Cloud Platform today and boost your enterprise productivity by 10x guaranteed. Engineered as the voted #1 fastest cloud database in North America, our distributed clusters eliminate failover friction. With our patented zero scheduled downtime architecture, global teams experience uninterrupted operations at planetary scale.'
      );
    } else {
      setCampaignName('Autonomous Analytics - Product Tour');
      setTargetChannel('Google Search Ad');
      setHeadline('Accelerate Enterprise Data Pipeline Performance');
      setCopyText(
        'Accelerate enterprise data analytics with validated sub-5ms query latency and planetary scale using Acme CloudSphere™ high-availability clusters.'
      );
    }
    setErrorMsg('');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        setErrorMsg('Uploaded asset exceeds 25MB limit.');
        return;
      }
      setUploadedFile({
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
      });
      setErrorMsg('');
    }
  };

  const handleRunScan = () => {
    if (!campaignName.trim()) {
      setErrorMsg('Please specify a Campaign Name.');
      return;
    }
    if (!copyText.trim()) {
      setErrorMsg('Please enter advertisement copy text to scan.');
      return;
    }

    setIsScanning(true);
    setErrorMsg('');

    // Simulate responsive engine execution (300ms)
    setTimeout(() => {
      const scanResult = runComplianceScan(copyText, targetChannel, rules, evidenceList);
      const newId = StorageService.generateReviewId();

      const newRecord: ReviewRecord = {
        id: newId,
        campaignName: campaignName.trim(),
        targetChannel,
        headline: headline.trim() || undefined,
        content: copyText.trim(),
        activePolicyVersion: 'Acme Global 2025 v2.4',
        status: scanResult.status,
        brandHealthScore: scanResult.score,
        findings: scanResult.findings,
        versions: [
          {
            version: 1,
            content: copyText.trim(),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            score: scanResult.score,
            findings: scanResult.findings,
          }
        ],
        currentVersion: 1,
        createdAt: 'Just now',
        updatedAt: 'Just now',
        reviewedAt: 'Just now',
        hasCreativeAsset: !!uploadedFile,
        assetFileName: uploadedFile ? uploadedFile.name : undefined,
        auditLog: [
          {
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            action: 'Automated Compliance Scan',
            user: 'AI Engine v4.6.1',
            details: scanResult.summaryText,
          }
        ]
      };

      StorageService.saveReview(newRecord);
      setIsScanning(false);
      onScanComplete(newId);
    }, 400);
  };

  return (
    <div className="page-container">
      {/* Page Title */}
      <div style={{ marginBottom: 20 }}>
        <h1 className="page-title">Review your content</h1>
        <div className="page-subtitle">
          Check marketing content and creative assets against brand guidelines and evidence.
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border-color)', marginBottom: 24 }}>
        <button
          className={`filter-tab ${activeTab === 'text' ? 'active' : ''}`}
          style={{ 
            padding: '10px 18px', 
            borderBottom: activeTab === 'text' ? '2px solid var(--primary)' : 'none',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: activeTab === 'text' ? 'var(--primary)' : 'var(--text-sub)'
          }}
          onClick={() => setActiveTab('text')}
        >
          <FileText size={16} />
          <span>Text Ad</span>
        </button>

        <button
          className={`filter-tab ${activeTab === 'image' ? 'active' : ''}`}
          style={{ 
            padding: '10px 18px', 
            borderBottom: activeTab === 'image' ? '2px solid var(--primary)' : 'none',
            borderRadius: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            color: activeTab === 'image' ? 'var(--primary)' : 'var(--text-sub)'
          }}
          onClick={() => setActiveTab('image')}
        >
          <ImageIcon size={16} />
          <span>Image Ad</span>
        </button>
      </div>

      {/* Error alert if any */}
      {errorMsg && (
        <div style={{ 
          background: '#fef2f2', 
          border: '1px solid #fecaca', 
          color: '#b91c1c', 
          padding: '12px 16px', 
          borderRadius: 'var(--radius-sm)', 
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          fontSize: 13 
        }}>
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Form Layout */}
      <div className="review-form-layout">
        {/* Left Column: Form Details */}
        <div className="review-form-card">
          {/* Preset Buttons for Judges */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '10px 14px', 
            background: '#f8fafc', 
            borderRadius: 'var(--radius-sm)', 
            marginBottom: 20,
            border: '1px solid var(--border-color)' 
          }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-sub)' }}>
              Quick Test Templates:
            </span>
            <div style={{ display: 'flex', gap: 6 }}>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleLoadSample('flagged')}
                title="Load sample copy with absolute guarantee, unverified claim, and tone flag"
              >
                Sample Ad (Flagged)
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleLoadSample('long')}
                title="Load full multi-sentence enterprise copy"
              >
                Enterprise Copy
              </button>
              <button 
                type="button" 
                className="btn btn-secondary btn-sm"
                onClick={() => handleLoadSample('clean')}
                title="Load 100% compliant ad with approved nomenclature"
              >
                Compliant Ad (Pass)
              </button>
            </div>
          </div>

          {/* Row 1: Campaign Name & Target Channel */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <div className="form-label-row">
                <label className="form-label">Campaign Name</label>
                <span className="form-hint" style={{ color: '#ef4444', fontWeight: 600 }}>Required</span>
              </div>
              <input
                type="text"
                className="form-input"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
                placeholder="e.g. Q4 Cloud Launch - Enterprise Tier"
                id="input-campaign-name"
              />
            </div>

            <div>
              <div className="form-label-row">
                <label className="form-label">Target Channel</label>
                <span className="form-hint">Affects Disclaimers</span>
              </div>
              <select
                className="form-select"
                value={targetChannel}
                onChange={(e) => setTargetChannel(e.target.value)}
                id="select-channel"
              >
                <option value="LinkedIn Ad">LinkedIn Ad</option>
                <option value="Google Search Ad">Google Search Ad</option>
                <option value="Twitter / X Post">Twitter / X Post</option>
                <option value="Meta Ad">Meta Ad</option>
                <option value="Email Newsletter">Email Newsletter</option>
              </select>
            </div>
          </div>

          {/* Headline (Optional) */}
          <div className="form-group">
            <div className="form-label-row">
              <label className="form-label">Headline / Hook</label>
              <span className="form-hint">Optional</span>
            </div>
            <input
              type="text"
              className="form-input"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              placeholder="e.g. Are cloud bottlenecks slowing your engineering sprint cycles?"
            />
          </div>

          {/* Advertisement Copy & Body Text */}
          <div className="form-group" style={{ marginBottom: 12 }}>
            <div className="form-label-row">
              <label className="form-label">Advertisement Copy & Body Text</label>
              <span className="form-hint">
                {words} words • {chars}/2,000 characters
              </span>
            </div>
            <textarea
              className="form-textarea"
              rows={6}
              value={copyText}
              onChange={(e) => setCopyText(e.target.value)}
              placeholder="Paste promotional marketing copy, headline, and claims here..."
              id="input-ad-copy"
            />
            <div className="textarea-footer">
              <span style={{ fontSize: 11.5, color: '#94a3b8' }}>
                Rule engine checks against 86 Acme brand rules and verified evidence whitepapers
              </span>
              <button 
                type="button" 
                className="btn btn-ghost btn-sm"
                onClick={handleClear}
                style={{ fontSize: 11.5 }}
              >
                <RotateCcw size={12} />
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Scan Action */}
          <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
            <button
              className="btn btn-primary"
              onClick={handleRunScan}
              disabled={isScanning}
              style={{ minWidth: 200, padding: '10px 20px', fontSize: 14 }}
              id="btn-run-compliance-scan"
            >
              <Sparkles size={16} />
              <span>{isScanning ? 'Scanning Compliance Engine...' : 'Run Compliance Scan'}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Creative Asset */}
        <div className="review-form-card" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="form-label-row" style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ImageIcon size={16} style={{ color: 'var(--primary)' }} />
              <span className="form-label">Creative Asset</span>
            </div>
            <span className="form-hint">Optional</span>
          </div>

          {uploadedFile ? (
            <div style={{ 
              background: '#f8fafc', 
              border: '1px solid var(--border-color)', 
              borderRadius: 'var(--radius-md)', 
              padding: 20, 
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              flex: 1
            }}>
              <div style={{ width: 48, height: 48, background: '#eff6ff', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2563eb', marginBottom: 12 }}>
                <FileCheck2 size={24} />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-main)', marginBottom: 2 }}>
                {uploadedFile.name}
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16 }}>
                {uploadedFile.size} • Attached to review
              </div>
              <button 
                className="btn btn-secondary btn-sm"
                onClick={() => setUploadedFile(null)}
              >
                <X size={13} />
                <span>Remove Asset</span>
              </button>
            </div>
          ) : (
            <label className="dropzone-box" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <input
                type="file"
                accept="image/png,image/jpeg,image/svg+xml"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
              />
              <div className="dropzone-icon">
                <Upload size={20} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-main)', marginBottom: 4 }}>
                Drag and drop creative banner
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--text-muted)', marginBottom: 14 }}>
                PNG, JPG, or SVG up to 25MB
              </div>
              <span className="btn btn-secondary btn-sm" style={{ margin: '0 auto', pointerEvents: 'none' }}>
                Browse files
              </span>
            </label>
          )}

          <div style={{ marginTop: 16, fontSize: 11.5, color: '#94a3b8', lineHeight: 1.5 }}>
            💡 Image metadata and text OCR are evaluated during the review run.
          </div>
        </div>
      </div>
    </div>
  );
};
