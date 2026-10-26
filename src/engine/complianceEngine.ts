import type { BrandRule, EvidenceRecord, Finding, ComplianceScanResult, ReviewStatus } from '../types';

export function runComplianceScan(
  text: string,
  channel: string = 'LinkedIn Ad',
  rules: BrandRule[],
  evidenceList: EvidenceRecord[]
): ComplianceScanResult {
  if (!text || text.trim().length === 0) {
    return {
      score: 100,
      status: 'Draft',
      findings: [],
      summaryText: 'No marketing content provided for compliance scanning.',
      stats: {
        criticalCount: 0,
        unverifiedCount: 0,
        suggestionCount: 0,
        verifiedCount: 0,
      },
    };
  }

  const findings: Finding[] = [];
  const activeRules = rules.filter(r => r.isActive);

  // Evaluate each active rule against the text
  for (const rule of activeRules) {
    // Check channel applicability
    if (rule.applicableChannels && rule.applicableChannels.length > 0) {
      if (!rule.applicableChannels.includes(channel)) {
        continue;
      }
    }

    try {
      const regex = new RegExp(rule.matchPattern, 'gi');
      let match: RegExpExecArray | null;

      while ((match = regex.exec(text)) !== null) {
        const matchedText = match[0];
        const startIndex = match.index;
        const endIndex = startIndex + matchedText.length;

        // Check if an evidence record supports or addresses this claim
        let matchedEvidence: EvidenceRecord | undefined;
        if (rule.requiredEvidenceCategory) {
          matchedEvidence = evidenceList.find(
            e => e.category.toLowerCase() === rule.requiredEvidenceCategory?.toLowerCase()
          );
        }

        // Determine severity & evidence reference based on rule type and evidence
        let finalSeverity = rule.severity;
        let evidenceRef = '';

        if (rule.severity === 'verified') {
          // If explicitly a verified pattern
          evidenceRef = matchedEvidence?.claimOrFact || 'Supported by SLA documentation';
        } else if (rule.evidenceRequired) {
          if (matchedEvidence && matchedEvidence.verificationStatus === 'verified') {
            finalSeverity = 'verified';
            evidenceRef = matchedEvidence.claimOrFact;
          } else {
            finalSeverity = 'warning';
            evidenceRef = `Available repository searched: ${evidenceList.length} whitepapers/records, 0 matching audited benchmark found.`;
          }
        } else if (rule.category === 'trademark') {
          const tmEvid = evidenceList.find(e => e.category === 'Product Nomenclature');
          evidenceRef = tmEvid ? tmEvid.sourceReference : 'Glossary v2.4 Product Catalog';
        }

        const findingId = `find-${rule.id}-${startIndex}`;

        findings.push({
          id: findingId,
          ruleId: rule.id,
          ruleCode: rule.code,
          category: rule.category,
          categoryLabel: rule.categoryLabel,
          severity: finalSeverity,
          originalClaim: `"${matchedText}"`,
          matchedText,
          startIndex,
          endIndex,
          issue: rule.description,
          clarificationNote: rule.clarificationNote,
          evidenceReference: evidenceRef || undefined,
          suggestedAlternative: rule.suggestedReplacement,
          actionLabel: rule.suggestedReplacement ? `Replace with "${rule.suggestedReplacement}"` : undefined,
          status: 'pending',
        });
      }
    } catch (err) {
      console.error(`Error executing regex for rule ${rule.id}:`, err);
    }
  }

  // Sort findings by start index in text
  findings.sort((a, b) => a.startIndex - b.startIndex);

  // Calculate statistics
  let criticalCount = 0;
  let unverifiedCount = 0;
  let suggestionCount = 0;
  let verifiedCount = 0;

  for (const f of findings) {
    if (f.severity === 'critical') criticalCount++;
    else if (f.severity === 'warning') unverifiedCount++;
    else if (f.severity === 'suggestion') suggestionCount++;
    else if (f.severity === 'verified') verifiedCount++;
  }

  // Calculate dynamic Brand Health Score (0 - 100)
  let calculatedScore = 100;
  calculatedScore -= criticalCount * 26; // e.g. 1 critical => ~74
  calculatedScore -= unverifiedCount * 14;
  calculatedScore -= suggestionCount * 6;
  calculatedScore += verifiedCount * 3;

  calculatedScore = Math.max(12, Math.min(100, calculatedScore));

  // Determine overall status
  let overallStatus: ReviewStatus = 'Approved';
  if (criticalCount > 0) {
    overallStatus = 'Action Required';
  } else if (unverifiedCount > 0) {
    overallStatus = 'Needs Evidence';
  } else if (suggestionCount > 0) {
    overallStatus = 'Revision Requested';
  } else {
    overallStatus = 'Approved';
  }

  const summaryText = `${criticalCount} Rule Violation${criticalCount === 1 ? '' : 's'}, ${unverifiedCount} Unsupported Claim${unverifiedCount === 1 ? '' : 's'}, ${suggestionCount} Tone/Trademark Recommendation${suggestionCount === 1 ? '' : 's'} identified.`;

  return {
    score: calculatedScore,
    status: overallStatus,
    findings,
    summaryText,
    stats: {
      criticalCount,
      unverifiedCount,
      suggestionCount,
      verifiedCount,
    },
  };
}

/**
 * Apply a single finding replacement to the content text safely
 */
export function applySuggestionToText(originalText: string, finding: Finding): string {
  if (!finding.suggestedAlternative || !finding.matchedText) {
    return originalText;
  }

  // Replace only the occurrence at the exact position if possible, or fallback to exact string replace
  const start = finding.startIndex;
  const end = finding.endIndex;

  if (start >= 0 && end <= originalText.length && originalText.slice(start, end) === finding.matchedText) {
    return originalText.slice(0, start) + finding.suggestedAlternative + originalText.slice(end);
  }

  return originalText.replace(finding.matchedText, finding.suggestedAlternative);
}

/**
 * Apply all suggested alternatives in batch, processing from end to start to maintain indices
 */
export function applyAllSuggestionsToText(originalText: string, findings: Finding[]): string {
  const actionable = [...findings]
    .filter(f => f.suggestedAlternative && f.severity !== 'verified')
    .sort((a, b) => b.startIndex - a.startIndex); // Reverse sort by index

  let currentText = originalText;
  for (const finding of actionable) {
    currentText = applySuggestionToText(currentText, finding);
  }
  return currentText;
}
