import React from 'react';
import { 
  LayoutDashboard, 
  PenSquare, 
  History, 
  ShieldCheck, 
  Database, 
  Shield, 
  RotateCcw,
  ExternalLink 
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  rulesCount: number;
  onResetDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  rulesCount,
  onResetDemo,
}) => {
  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrap">
          <Shield size={18} strokeWidth={2.5} />
        </div>
        <div className="brand-info">
          <h1>
            BrandGuard <span style={{ color: '#2563eb' }}>AI</span>
            <span className="brand-pro-tag">PRO</span>
          </h1>
          <div className="brand-subline">Marketing Compliance</div>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${currentTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => onNavigate('dashboard')}
          id="nav-dashboard"
        >
          <LayoutDashboard size={18} />
          <span>Dashboard</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'new-review' ? 'active' : ''}`}
          onClick={() => onNavigate('new-review')}
          id="nav-new-review"
        >
          <PenSquare size={18} />
          <span>New Review</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'history' ? 'active' : ''}`}
          onClick={() => onNavigate('history')}
          id="nav-history"
        >
          <History size={18} />
          <span>Review History</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => onNavigate('guidelines')}
          id="nav-guidelines"
        >
          <ShieldCheck size={18} />
          <span>Brand Guidelines</span>
        </button>

        <button
          className={`nav-item ${currentTab === 'evidence' ? 'active' : ''}`}
          onClick={() => onNavigate('evidence')}
          id="nav-evidence"
        >
          <Database size={18} />
          <span>Evidence Library</span>
        </button>
      </nav>

      {/* Active Baseline Card */}
      <div className="sidebar-baseline-card">
        <div className="baseline-header">
          <span className="baseline-tag">
            <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>
            Active Baseline
          </span>
          <Shield size={14} style={{ color: '#64748b' }} />
        </div>
        <div className="baseline-title">Brand Guidelines</div>
        <div className="baseline-desc">Acme Global v2.4 ({rulesCount} rules)</div>
        <button 
          className="btn-baseline-link"
          onClick={() => onNavigate('guidelines')}
        >
          <span>View Guidelines</span>
          <ExternalLink size={12} />
        </button>
      </div>

      {/* Reset Baseline Button */}
      <div style={{ marginTop: 12 }}>
        <button
          className="btn btn-ghost btn-sm"
          style={{ width: '100%', fontSize: 11, color: '#94a3b8' }}
          onClick={onResetDemo}
          title="Reset workspace to default brand guidelines and evidence repository"
        >
          <RotateCcw size={12} />
          <span>Reset Default Baseline</span>
        </button>
      </div>
    </aside>
  );
};
