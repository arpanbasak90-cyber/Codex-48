import { describe, it, expect } from 'vitest';
import { runComplianceScan, applySuggestionToText, applyAllSuggestionsToText } from './complianceEngine';
import { DEFAULT_RULES } from './rules';
import { DEFAULT_EVIDENCE } from './evidence';

describe('BrandGuard AI Compliance Engine', () => {
  const sampleAd = 'Boost your enterprise productivity by 10x guaranteed with Acme Cloud Platform. Voted #1 fastest cloud database in North America without downtime!';

  it('correctly detects critical violations, unsupported claims, trademark and tone issues on sample copy', () => {
    const result = runComplianceScan(sampleAd, 'LinkedIn Ad', DEFAULT_RULES, DEFAULT_EVIDENCE);

    expect(result.findings.length).toBeGreaterThanOrEqual(4);
    
    // Check 10x guaranteed (Critical)
    const criticalFinding = result.findings.find(f => f.severity === 'critical');
    expect(criticalFinding).toBeDefined();
    expect(criticalFinding?.ruleCode).toBe('Policy 4.2');
    expect(criticalFinding?.matchedText).toMatch(/10x guaranteed/i);

    // Check Voted #1 fastest (Warning / Missing evidence)
    const warningFinding = result.findings.find(f => f.severity === 'warning');
    expect(warningFinding).toBeDefined();
    expect(warningFinding?.ruleCode).toBe('FTC COMPLIANCE');

    // Check Acme Cloud Platform (Trademark)
    const tmFinding = result.findings.find(f => f.matchedText.includes('Acme Cloud Platform'));
    expect(tmFinding).toBeDefined();
    expect(tmFinding?.suggestedAlternative).toBe('Acme CloudSphere™');

    // Check without downtime (Tone recommendation)
    const toneFinding = result.findings.find(f => f.matchedText.includes('without downtime'));
    expect(toneFinding).toBeDefined();
    expect(toneFinding?.ruleCode).toBe('SLA Alignment');

    // Overall status should be Action Required
    expect(result.status).toBe('Action Required');
    expect(result.score).toBeLessThan(80);
  });

  it('correctly recognizes verified SLA evidence for approved architecture claims', () => {
    const verifiedText = 'Our patented zero scheduled downtime architecture powers enterprise workloads.';
    const result = runComplianceScan(verifiedText, 'LinkedIn Ad', DEFAULT_RULES, DEFAULT_EVIDENCE);

    const verifiedFinding = result.findings.find(f => f.severity === 'verified');
    expect(verifiedFinding).toBeDefined();
    expect(verifiedFinding?.ruleCode).toBe('SLA-2025-V2');
    expect(verifiedFinding?.evidenceReference).toContain('99.99% active-active uptime guarantee');
  });

  it('returns clean score of 100 for compliant marketing copy', () => {
    const cleanText = 'Accelerate enterprise productivity with modern high-availability database solutions from Acme CloudSphere™.';
    const result = runComplianceScan(cleanText, 'LinkedIn Ad', DEFAULT_RULES, DEFAULT_EVIDENCE);

    expect(result.score).toBe(100);
    expect(result.status).toBe('Approved');
    expect(result.stats.criticalCount).toBe(0);
    expect(result.stats.unverifiedCount).toBe(0);
  });

  it('replaces a single matched suggestion accurately in text', () => {
    const text = 'Check out Acme Cloud Platform for your team.';
    const result = runComplianceScan(text, 'LinkedIn Ad', DEFAULT_RULES, DEFAULT_EVIDENCE);
    const tmFinding = result.findings.find(f => f.matchedText.includes('Acme Cloud Platform'));
    expect(tmFinding).toBeDefined();

    const updatedText = applySuggestionToText(text, tmFinding!);
    expect(updatedText).toBe('Check out Acme CloudSphere™ for your team.');
  });

  it('applies batch suggestions cleanly from end to start without index collisions', () => {
    const text = 'Try Acme Cloud Platform without downtime!';
    const result = runComplianceScan(text, 'LinkedIn Ad', DEFAULT_RULES, DEFAULT_EVIDENCE);
    const updated = applyAllSuggestionsToText(text, result.findings);

    expect(updated).toContain('Acme CloudSphere™');
    expect(updated).toContain('99.99% uptime availability');
  });

  it('does not flag disabled / inactive rules', () => {
    const customRules = DEFAULT_RULES.map(r => 
      r.id === 'RULE-PROHIBITED-GUARANTEE' ? { ...r, isActive: false } : r
    );
    const text = '10x guaranteed returns!';
    const result = runComplianceScan(text, 'LinkedIn Ad', customRules, DEFAULT_EVIDENCE);

    expect(result.stats.criticalCount).toBe(0);
  });
});
