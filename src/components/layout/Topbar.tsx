import React from 'react';
import { 
  Search, 
  Bell, 
  HelpCircle, 
  RefreshCw, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface TopbarProps {
  breadcrumb: Array<{ label: string; action?: () => void; active?: boolean }>;
  policyVersion?: string;
  onNewReviewClick: () => void;
  onSearchChange?: (val: string) => void;
  searchQuery?: string;
}

export const Topbar: React.FC<TopbarProps> = ({
  breadcrumb,
  policyVersion = 'Acme Global 2025 Guidelines v2.4',
  onNewReviewClick,
  onSearchChange,
  searchQuery = '',
}) => {
  return (
    <header className="topbar">
      {/* Left: Breadcrumbs & Active Policy */}
      <div className="topbar-left">
        <nav className="breadcrumb-nav">
          {breadcrumb.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight size={14} style={{ color: '#94a3b8' }} />}
              <span
                className={crumb.active ? 'active-crumb' : ''}
                style={{ cursor: crumb.action ? 'pointer' : 'default' }}
                onClick={crumb.action}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </nav>

        {/* Live Policy Tag */}
        <div 
          className="pill pill-neutral" 
          style={{ fontSize: 11, background: '#f8fafc', marginLeft: 8 }}
          title="Active compliance policy applied to all scans"
        >
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
          <span>{policyVersion}</span>
          <span style={{ color: '#94a3b8' }}>• Live Policy</span>
        </div>
      </div>

      {/* Right: Search, Alerts, & Actions */}
      <div className="topbar-right">
        {/* Search */}
        <div style={{ position: 'relative', width: 220 }}>
          <Search 
            size={14} 
            style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} 
          />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: 30, paddingRight: 10, height: 34, fontSize: 12.5 }}
            placeholder="Search claims, rules..."
            value={searchQuery}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
          />
        </div>

        {/* Sync Status */}
        <button 
          className="btn btn-ghost" 
          style={{ width: 34, height: 34, padding: 0 }}
          title="Policy whitepapers in sync"
        >
          <RefreshCw size={15} />
        </button>

        {/* Notification Bell with alert dot */}
        <button 
          className="btn btn-ghost" 
          style={{ width: 34, height: 34, padding: 0, position: 'relative' }}
          title="Notifications: 1 pending action required"
        >
          <Bell size={16} />
          <span 
            style={{ 
              position: 'absolute', 
              top: 7, 
              right: 7, 
              width: 7, 
              height: 7, 
              background: '#ef4444', 
              borderRadius: '50%',
              border: '1.5px solid white' 
            }} 
          />
        </button>

        {/* Help */}
        <button 
          className="btn btn-ghost" 
          style={{ width: 34, height: 34, padding: 0 }}
          title="Platform documentation and rules guide"
        >
          <HelpCircle size={16} />
        </button>

        {/* Quick New Review Button */}
        <button 
          className="btn btn-primary btn-sm" 
          onClick={onNewReviewClick}
          id="topbar-scan-btn"
        >
          <Sparkles size={14} />
          <span>Run Compliance Scan</span>
        </button>
      </div>
    </header>
  );
};
