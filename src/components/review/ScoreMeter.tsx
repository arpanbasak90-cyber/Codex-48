import React from 'react';
import { ShieldAlert, AlertTriangle, Lightbulb, CheckCircle2 } from 'lucide-react';

interface ScoreMeterProps {
  score: number;
  criticalCount: number;
  unverifiedCount: number;
  suggestionCount: number;
  verifiedCount?: number;
}

export const ScoreMeter: React.FC<ScoreMeterProps> = ({
  score,
  criticalCount,
  unverifiedCount,
  suggestionCount,
  verifiedCount = 0,
}) => {
  // SVG circular gauge calculation
  const radius = 32;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let strokeColor = '#10b981'; // Green
  let statusBadge = 'Fully Compliant';
  let badgeClass = 'pill-verified';

  if (criticalCount > 0) {
    strokeColor = '#ef4444'; // Red
    statusBadge = 'Needs Revision';
    badgeClass = 'pill-critical';
  } else if (unverifiedCount > 0) {
    strokeColor = '#f59e0b'; // Amber
    statusBadge = 'Needs Evidence';
    badgeClass = 'pill-warning';
  } else if (suggestionCount > 0) {
    strokeColor = '#8b5cf6'; // Purple
    statusBadge = 'Suggestions Pending';
    badgeClass = 'pill-purple';
  }

  const totalIssues = criticalCount + unverifiedCount + suggestionCount;

  return (
    <div className="score-banner">
      {/* Circular Gauge */}
      <div className="score-circle-wrap">
        <div className="score-circle">
          <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke="#e2e8f0"
              strokeWidth="6"
              fill="transparent"
            />
            <circle
              cx="36"
              cy="36"
              r={radius}
              stroke={strokeColor}
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.6s ease' }}
            />
          </svg>
          <div style={{ position: 'absolute', display: 'flex', alignItems: 'baseline' }}>
            <span>{score}</span>
            <span className="score-sub">/100</span>
          </div>
        </div>

        <div>
          <span className={`pill ${badgeClass}`} style={{ marginBottom: 4 }}>
            {statusBadge}
          </span>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)', marginTop: 2 }}>
            Brand Health Score
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {totalIssues} issue{totalIssues === 1 ? '' : 's'} flagged across 86 brand rules
          </div>
        </div>
      </div>

      {/* Breakdown Badges */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto', flexWrap: 'wrap' }}>
        <div className="pill pill-critical" style={{ padding: '6px 12px', fontSize: 12 }}>
          <ShieldAlert size={14} />
          <span>Violations:</span>
          <strong>{criticalCount} Critical</strong>
        </div>

        <div className="pill pill-warning" style={{ padding: '6px 12px', fontSize: 12 }}>
          <AlertTriangle size={14} />
          <span>Unverified:</span>
          <strong>{unverifiedCount} Claim{unverifiedCount === 1 ? '' : 's'}</strong>
        </div>

        <div className="pill pill-purple" style={{ padding: '6px 12px', fontSize: 12 }}>
          <Lightbulb size={14} />
          <span>Suggestions:</span>
          <strong>{suggestionCount} Tone</strong>
        </div>

        {verifiedCount > 0 && (
          <div className="pill pill-verified" style={{ padding: '6px 12px', fontSize: 12 }}>
            <CheckCircle2 size={14} />
            <span>Verified:</span>
            <strong>{verifiedCount} Claim{verifiedCount === 1 ? '' : 's'}</strong>
          </div>
        )}
      </div>
    </div>
  );
};
