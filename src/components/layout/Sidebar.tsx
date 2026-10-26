import React from 'react';
import type { UserProfile } from '../../types';
import { 
  LayoutDashboard, 
  PenSquare, 
  History, 
  ShieldCheck, 
  Database, 
  Shield, 
  RotateCcw,
  ExternalLink,
  LogOut,
  User
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
  rulesCount: number;
  user: UserProfile | null;
  onLogout: () => void;
  onResetDemo: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onNavigate,
  rulesCount,
  user,
  onLogout,
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

      {/* User Session Profile & Logout */}
      {user && (
        <div style={{
          marginTop: 12,
          padding: '10px 12px',
          background: '#f8fafc',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-sm)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 8,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: '#eff6ff',
              color: '#2563eb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700,
              fontSize: 11,
              flexShrink: 0,
            }}>
              {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || <User size={14} />}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-main)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.name}
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {user.role}
              </div>
            </div>
          </div>

          <button
            className="btn btn-ghost"
            style={{ padding: 4, width: 26, height: 26, color: '#94a3b8' }}
            onClick={onLogout}
            title="Sign out of workspace"
          >
            <LogOut size={14} />
          </button>
        </div>
      )}

      {/* Reset Baseline Button */}
      <div style={{ marginTop: 8 }}>
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
