import React from 'react';
import type { Finding } from '../../types';
import { Copy, Check, CheckCircle2 } from 'lucide-react';

interface EvaluatedCopySnippetProps {
  headline?: string;
  content: string;
  channel: string;
  findings: Finding[];
  selectedFindingId?: string;
  onSelectFinding: (findingId: string) => void;
  onCopyText: (text: string) => void;
}

export const EvaluatedCopySnippet: React.FC<EvaluatedCopySnippetProps> = ({
  headline,
  content,
  channel,
  findings,
  selectedFindingId,
  onSelectFinding,
  onCopyText,
}) => {
  const [copied, setCopied] = React.useState(false);

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.length;

  const handleCopy = () => {
    onCopyText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Render copy text with embedded interactive highlight tokens
   */
  const renderHighlightedContent = () => {
    if (!findings || findings.length === 0) {
      return <span>{content}</span>;
    }

    // Sort findings by start index
    const sortedFindings = [...findings]
      .filter(f => f.startIndex >= 0 && f.endIndex <= content.length)
      .sort((a, b) => a.startIndex - b.startIndex);

    const elements: React.ReactNode[] = [];
    let currentIndex = 0;

    sortedFindings.forEach((f, idx) => {
      // If there's an overlap or invalid index, skip or clamp
      if (f.startIndex < currentIndex) {
        return;
      }

      // Add preceding plain text
      if (f.startIndex > currentIndex) {
        elements.push(
          <span key={`text-${idx}`}>{content.slice(currentIndex, f.startIndex)}</span>
        );
      }

      // Determine highlight style
      let hlClass = 'hl-warning';
      if (f.severity === 'critical') hlClass = 'hl-critical';
      else if (f.severity === 'verified') hlClass = 'hl-verified';
      else if (f.category === 'trademark' || f.category === 'tone_sla') hlClass = 'hl-purple';

      const isFocused = f.id === selectedFindingId;

      elements.push(
        <span
          key={`token-${f.id}`}
          className={`hl-token ${hlClass}`}
          style={{
            outline: isFocused ? '2px solid #2563eb' : 'none',
            boxShadow: isFocused ? '0 0 6px rgba(37,99,235,0.4)' : 'none',
          }}
          onClick={() => onSelectFinding(f.id)}
          title={`Click to view: ${f.categoryLabel || f.ruleCode}`}
        >
          {content.slice(f.startIndex, f.endIndex)}
        </span>
      );

      currentIndex = f.endIndex;
    });

    // Add trailing plain text
    if (currentIndex < content.length) {
      elements.push(
        <span key="trailing-text">{content.slice(currentIndex)}</span>
      );
    }

    return elements;
  };

  return (
    <div className="copy-panel-card">
      <div className="copy-panel-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
            Submitted Copy
          </span>
          <span className="pill pill-neutral" style={{ fontSize: 11 }}>
            {wordCount} words
          </span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
          {channel} • {charCount} characters
        </div>
      </div>

      {headline && (
        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 4 }}>
            Headline
          </div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-main)', padding: '10px 14px', background: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            {headline}
          </div>
        </div>
      )}

      <div style={{ fontSize: 11, fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 6 }}>
        Body Text
      </div>

      <div className="copy-text-body">
        {renderHighlightedContent()}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--verified-text)', fontWeight: 500 }}>
          <CheckCircle2 size={14} />
          <span>Checked against Acme Policy 4.2 & FTC Guidelines</span>
        </div>
        <button 
          className="btn btn-ghost btn-sm" 
          onClick={handleCopy}
          style={{ fontSize: 12 }}
        >
          {copied ? <Check size={14} style={{ color: '#10b981' }} /> : <Copy size={14} />}
          <span>{copied ? 'Copied!' : 'Copy Text'}</span>
        </button>
      </div>
    </div>
  );
};
