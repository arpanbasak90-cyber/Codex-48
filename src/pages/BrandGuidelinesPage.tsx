import React, { useState } from 'react';
import type { BrandRule, RuleCategory, Severity } from '../types';
import { 
  ShieldCheck, 
  Plus, 
  X, 
  ToggleLeft, 
  ToggleRight
} from 'lucide-react';

interface BrandGuidelinesPageProps {
  rules: BrandRule[];
  onToggleRule: (ruleId: string) => void;
  onAddRule: (rule: BrandRule) => void;
}

export const BrandGuidelinesPage: React.FC<BrandGuidelinesPageProps> = ({
  rules,
  onToggleRule,
  onAddRule,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // New Rule Form State
  const [newTitle, setNewTitle] = useState('');
  const [newCode, setNewCode] = useState('');
  const [newCategory, setNewCategory] = useState<RuleCategory>('prohibited');
  const [newSeverity, setNewSeverity] = useState<Severity>('critical');
  const [newPattern, setNewPattern] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newClarification, setNewClarification] = useState('');
  const [newReplacement, setNewReplacement] = useState('');

  const filteredRules = rules.filter(r => {
    if (activeCategory === 'all') return true;
    return r.category === activeCategory;
  });

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newPattern.trim()) return;

    const createdRule: BrandRule = {
      id: `RULE-CUSTOM-${Date.now()}`,
      code: newCode.trim() || 'Brand Policy Custom',
      title: newTitle.trim(),
      category: newCategory,
      categoryLabel: newCategory === 'prohibited' 
        ? 'Critical: Prohibited Phrase' 
        : newCategory === 'evidence_required' 
        ? 'Missing Evidence • Comparative Claim' 
        : 'Brand Voice Standard',
      severity: newSeverity,
      description: newDescription.trim() || 'Custom configured brand governance rule.',
      matchPattern: newPattern.trim(),
      isRegex: true,
      clarificationNote: newClarification.trim() || 'Rule added via Acme Brand Guidelines manager.',
      suggestedReplacement: newReplacement.trim(),
      evidenceRequired: newCategory === 'evidence_required',
      isActive: true,
    };

    onAddRule(createdRule);
    setShowAddModal(false);
    // Reset form
    setNewTitle('');
    setNewCode('');
    setNewPattern('');
    setNewDescription('');
    setNewClarification('');
    setNewReplacement('');
  };

  return (
    <div className="page-container">
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
            <h1 className="page-title" style={{ margin: 0 }}>Brand Guidelines & Governance Rules</h1>
            <span className="pill pill-verified" style={{ fontSize: 11 }}>
              v2.4 Enforced
            </span>
          </div>
          <div className="page-subtitle" style={{ marginBottom: 0 }}>
            Configure active compliance rules, trademark standards, prohibited terms, and evidence requirements.
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setShowAddModal(true)} id="btn-add-rule">
          <Plus size={15} />
          <span>Add Custom Rule</span>
        </button>
      </div>

      {/* Baseline Overview Banner */}
      <div className="policy-banner" style={{ marginBottom: 20 }}>
        <div className="policy-left">
          <div className="policy-shield-icon">
            <ShieldCheck size={22} />
          </div>
          <div>
            <div className="policy-title-row">
              <span className="policy-title">Acme Global Baseline v2.4</span>
              <span className="policy-enforced-tag">Active Baseline</span>
            </div>
            <div className="policy-subtext">
              {rules.filter(r => r.isActive).length} Active Rules • Changes immediately alter subsequent compliance scan results.
            </div>
          </div>
        </div>

        <div className="policy-right">
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            Last modified by Legal Review Board: Jan 2025
          </span>
        </div>
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          className={`filter-tab ${activeCategory === 'all' ? 'active' : ''}`}
          onClick={() => setActiveCategory('all')}
        >
          All Rules ({rules.length})
        </button>
        <button
          className={`filter-tab ${activeCategory === 'prohibited' ? 'active' : ''}`}
          onClick={() => setActiveCategory('prohibited')}
        >
          Prohibited Guarantees
        </button>
        <button
          className={`filter-tab ${activeCategory === 'evidence_required' ? 'active' : ''}`}
          onClick={() => setActiveCategory('evidence_required')}
        >
          Comparative & Superlative Claims
        </button>
        <button
          className={`filter-tab ${activeCategory === 'trademark' ? 'active' : ''}`}
          onClick={() => setActiveCategory('trademark')}
        >
          Product Nomenclature
        </button>
        <button
          className={`filter-tab ${activeCategory === 'tone_sla' ? 'active' : ''}`}
          onClick={() => setActiveCategory('tone_sla')}
        >
          Tone & SLA Alignment
        </button>
      </div>

      {/* Rules Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filteredRules.map((rule) => {
          let pillClass = 'pill-warning';
          if (rule.severity === 'critical') pillClass = 'pill-critical';
          else if (rule.severity === 'verified') pillClass = 'pill-verified';
          else if (rule.category === 'trademark' || rule.category === 'tone_sla') pillClass = 'pill-purple';

          return (
            <div
              key={rule.id}
              style={{
                background: 'white',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '18px 24px',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: 20,
                opacity: rule.isActive ? 1 : 0.6,
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className={`pill ${pillClass}`} style={{ fontSize: 11 }}>
                    {rule.code}
                  </span>
                  <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-main)' }}>
                    {rule.title}
                  </span>
                  <span className={`pill ${rule.isActive ? 'pill-verified' : 'pill-neutral'}`} style={{ fontSize: 10 }}>
                    {rule.isActive ? '● Enforced' : '○ Inactive'}
                  </span>
                </div>

                <div style={{ fontSize: 13, color: 'var(--text-sub)', marginBottom: 8 }}>
                  {rule.description}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  <div>
                    <strong>Match Pattern:</strong> <code style={{ fontSize: 11.5, background: '#f1f5f9', padding: '2px 6px', borderRadius: 4 }}>{rule.matchPattern}</code>
                  </div>
                  {rule.suggestedReplacement && (
                    <div>
                      <strong>Replacement:</strong> "{rule.suggestedReplacement}"
                    </div>
                  )}
                </div>

                {rule.clarificationNote && (
                  <div style={{ marginTop: 8, fontSize: 12, color: '#854d0e', background: '#fffbeb', padding: '6px 10px', borderRadius: 4, border: '1px solid #fef08a' }}>
                    <strong>Note:</strong> {rule.clarificationNote}
                  </div>
                )}
              </div>

              {/* Toggle Active Button */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                <button
                  className="btn btn-ghost btn-sm"
                  onClick={() => onToggleRule(rule.id)}
                  style={{ color: rule.isActive ? '#059669' : '#94a3b8' }}
                  title={rule.isActive ? 'Click to deactivate rule' : 'Click to activate rule'}
                >
                  {rule.isActive ? (
                    <>
                      <ToggleRight size={22} style={{ color: '#10b981' }} />
                      <span style={{ fontWeight: 600 }}>Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={22} />
                      <span>Disabled</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Rule Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: 600 }}>
            <div className="modal-header">
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--text-main)' }}>
                Add Custom Compliance Rule
              </div>
              <button className="btn btn-ghost" onClick={() => setShowAddModal(false)} style={{ padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateRule}>
              <div className="modal-body">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rule Title</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Prohibit Unqualified 'Free' Claims"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Rule Code / Citation</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Policy 5.1 / FTC"
                      value={newCode}
                      onChange={(e) => setNewCode(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 14 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <select
                      className="form-select"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as RuleCategory)}
                    >
                      <option value="prohibited">Prohibited (Critical)</option>
                      <option value="evidence_required">Comparative Claim (Warning)</option>
                      <option value="trademark">Product Nomenclature (Tone)</option>
                      <option value="tone_sla">Tone & SLA (Suggestion)</option>
                    </select>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Severity Level</label>
                    <select
                      className="form-select"
                      value={newSeverity}
                      onChange={(e) => setNewSeverity(e.target.value as Severity)}
                    >
                      <option value="critical">Critical (Blocking)</option>
                      <option value="warning">Warning (Requires Evidence)</option>
                      <option value="suggestion">Suggestion (Tone / Brand Voice)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Match Pattern (Regex or Phrase)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. \b100%\s+free\b or always free"
                    value={newPattern}
                    onChange={(e) => setNewPattern(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description / Issue Explanation</label>
                  <textarea
                    className="form-textarea"
                    rows={2}
                    placeholder="Explain why this term violates brand or legal guidelines..."
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Suggested Compliant Alternative</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. complimentary tier included with enterprise license"
                    value={newReplacement}
                    onChange={(e) => setNewReplacement(e.target.value)}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save & Enforce Rule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
