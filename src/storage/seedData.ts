import type { ReviewRecord } from '../types';
import { runComplianceScan } from '../engine/complianceEngine';
import { DEFAULT_RULES } from '../engine/rules';
import { DEFAULT_EVIDENCE } from '../engine/evidence';

const bg8924Content = `Deploy the Acme Cloud Platform today and boost your enterprise productivity by 10x guaranteed. Engineered as the voted #1 fastest cloud database in North America, our distributed clusters eliminate failover friction. With our patented zero scheduled downtime architecture, global teams experience uninterrupted operations at planetary scale.`;

const scanResult8924 = runComplianceScan(bg8924Content, 'LinkedIn Ad', DEFAULT_RULES, DEFAULT_EVIDENCE);

export const SEED_REVIEWS: ReviewRecord[] = [
  {
    id: '#BG-8924',
    campaignName: 'Q4 Cloud Launch - Enterprise Tier',
    targetChannel: 'LinkedIn Ad',
    headline: 'Are cloud bottlenecks slowing your engineering sprint cycles?',
    content: bg8924Content,
    activePolicyVersion: 'Acme Global 2025 v2.4',
    status: 'Action Required',
    brandHealthScore: 74,
    findings: scanResult8924.findings,
    versions: [
      {
        version: 1,
        content: bg8924Content,
        timestamp: 'Today, 2:14 PM',
        score: 74,
        findings: scanResult8924.findings,
      }
    ],
    currentVersion: 1,
    createdAt: 'Today, 2:14 PM',
    updatedAt: 'Today, 2:14 PM',
    reviewedAt: 'Today, 2:14 PM',
    hasCreativeAsset: true,
    assetFileName: 'q4_cloud_launch_banner.png',
    auditLog: [
      {
        timestamp: 'Today, 2:14 PM',
        action: 'Compliance Scan Completed',
        user: 'AI Engine v4.6.1',
        details: 'Initial automated scan flagged 1 Critical violation, 1 Unverified claim, 1 Tone recommendation, 1 Verified claim.',
      }
    ]
  },
  {
    id: '#BG-8921',
    campaignName: 'Autonomous Analytics - Product Tour',
    targetChannel: 'Google Search Ad',
    headline: 'Accelerate Analytics Workflows with Acme CloudSphere™',
    content: 'Experience streamlined database telemetry and real-time query acceleration with Acme CloudSphere™ enterprise tier.',
    activePolicyVersion: 'Acme Global 2025 v2.4',
    status: 'Approved',
    brandHealthScore: 100,
    findings: [],
    versions: [
      {
        version: 1,
        content: 'Experience streamlined database telemetry and real-time query acceleration with Acme CloudSphere™ enterprise tier.',
        timestamp: 'Oct 24, 2024, 11:30 AM',
        score: 100,
        findings: [],
      }
    ],
    currentVersion: 1,
    createdAt: 'Oct 24, 2024',
    updatedAt: 'Oct 24, 2024',
    reviewedAt: 'Oct 24, 2024',
    hasCreativeAsset: false,
    auditLog: [
      {
        timestamp: 'Oct 24, 2024, 11:32 AM',
        action: 'Review Approved',
        user: 'Legal Compliance Officer (Sarah M.)',
        details: 'Ad conforms fully to brand nomenclature and FTC substantiation guidelines.',
      }
    ]
  },
  {
    id: '#BG-8918',
    campaignName: 'Fintech Security Whitepaper Promo',
    targetChannel: 'Twitter / X Post',
    headline: 'Zero-Trust Architecture for Modern Cloud Datastores',
    content: 'Read our latest whitepaper detailing how Acme CloudSphere™ supports continuous SOC 2 Type II audit readiness.',
    activePolicyVersion: 'Acme Global 2025 v2.4',
    status: 'Needs Evidence',
    brandHealthScore: 82,
    findings: [
      {
        id: 'find-mock-8918-1',
        ruleCode: 'FTC COMPLIANCE',
        category: 'evidence_required',
        categoryLabel: 'Missing Evidence • Comparative Claim',
        severity: 'warning',
        originalClaim: '"unmatched industry security"',
        matchedText: 'unmatched industry security',
        startIndex: 0,
        endIndex: 27,
        issue: 'Comparative security claims require external third-party auditor signoff.',
        clarificationNote: 'Attach independent auditor review before public promotion.',
        suggestedAlternative: 'enterprise defense-in-depth security',
        status: 'pending',
      }
    ],
    versions: [
      {
        version: 1,
        content: 'Read our latest whitepaper detailing how Acme CloudSphere™ supports continuous SOC 2 Type II audit readiness with unmatched industry security.',
        timestamp: 'Oct 23, 2024, 4:15 PM',
        score: 82,
        findings: [],
      }
    ],
    currentVersion: 1,
    createdAt: 'Oct 23, 2024',
    updatedAt: 'Oct 23, 2024',
    hasCreativeAsset: true,
    assetFileName: 'fintech_whitepaper_cover.svg',
    auditLog: [
      {
        timestamp: 'Oct 23, 2024, 4:15 PM',
        action: 'Scan Completed',
        user: 'AI Engine v4.6.1',
        details: 'Flagged 1 comparative claim requiring independent verification.',
      }
    ]
  },
  {
    id: '#BG-8912',
    campaignName: 'Global AI Infrastructure Case Study',
    targetChannel: 'Email Newsletter',
    headline: 'How FinCorp Reduced Cloud Latency by 40% with Acme CloudSphere™',
    content: 'Discover how global teams achieved sub-5ms query latency and planetary scale with Acme CloudSphere™ enterprise infrastructure.',
    activePolicyVersion: 'Acme Global 2025 v2.4',
    status: 'Approved',
    brandHealthScore: 95,
    findings: [],
    versions: [
      {
        version: 1,
        content: 'Discover how global teams achieved sub-5ms query latency and planetary scale with Acme CloudSphere™ enterprise infrastructure.',
        timestamp: 'Oct 21, 2024, 9:00 AM',
        score: 95,
        findings: [],
      }
    ],
    currentVersion: 1,
    createdAt: 'Oct 21, 2024',
    updatedAt: 'Oct 21, 2024',
    reviewedAt: 'Oct 21, 2024',
    hasCreativeAsset: false,
    auditLog: [
      {
        timestamp: 'Oct 21, 2024, 9:15 AM',
        action: 'Review Approved',
        user: 'Brand Marketing Lead',
        details: 'Customer case study verified against signed proof point release form.',
      }
    ]
  },
  {
    id: '#BG-8905',
    campaignName: 'Zero-Downtime Guarantee Campaign',
    targetChannel: 'Meta Ad',
    headline: 'Never Experience Outages Again',
    content: 'Eliminate downtime completely! 100% guaranteed zero outages with Acme Cloud Platform.',
    activePolicyVersion: 'Acme Global 2025 v2.4',
    status: 'Rejected',
    brandHealthScore: 45,
    findings: [
      {
        id: 'find-mock-8905-1',
        ruleCode: 'Policy 4.2',
        category: 'prohibited',
        categoryLabel: 'Critical: Prohibited Absolute Guarantee',
        severity: 'critical',
        originalClaim: '"100% guaranteed"',
        matchedText: '100% guaranteed',
        startIndex: 29,
        endIndex: 44,
        issue: 'Absolute availability guarantees violate brand policy and consumer protection guidelines.',
        suggestedAlternative: 'enterprise 99.99% availability',
        status: 'pending',
      }
    ],
    versions: [
      {
        version: 1,
        content: 'Eliminate downtime completely! 100% guaranteed zero outages with Acme Cloud Platform.',
        timestamp: 'Oct 19, 2024, 3:30 PM',
        score: 45,
        findings: [],
      }
    ],
    currentVersion: 1,
    createdAt: 'Oct 19, 2024',
    updatedAt: 'Oct 19, 2024',
    reviewedAt: 'Oct 19, 2024',
    hasCreativeAsset: true,
    assetFileName: 'meta_video_story.mp4',
    auditLog: [
      {
        timestamp: 'Oct 19, 2024, 3:45 PM',
        action: 'Review Rejected',
        user: 'Legal Compliance Officer',
        details: 'Rejected due to multiple absolute claims and improper product naming.',
      }
    ]
  }
];
