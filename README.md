# BrandGuard AI — Marketing Compliance & Brand Governance Platform

**CODEX 48 Round 2 Submission**  
Built by a pair programming team for automated marketing compliance, claim substantiation, and brand governance.

---

## 🚀 Live Demo & Quick Start

### 1. Prerequisites
- **Node.js** v18+ (tested on Node v20+)
- **npm** v9+

### 2. Installation & Running Locally
```bash
# Clone or navigate into repository
cd "Codex 48"

# Install dependencies
npm install

# Run Vitest test suite (6 passing unit tests)
npm test

# Run local development server
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in any browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🎯 Round 2 Problem Statement & Objective

BrandGuard AI evaluates promotional marketing and advertising copy against approved corporate brand guidelines, terminology standards, technical SLAs, and substantiating evidence records.

### Key Capabilities Delivered:
- **Critical Guarantee Detection:** Flags prohibited absolute ROI or performance promises (e.g. *"10x guaranteed"*, *"100% unhackable"* per Acme Policy 4.2).
- **Claim Substantiation & FTC Compliance:** Identifies comparative superlatives (e.g. *"voted #1 fastest cloud database in North America"*) and verifies them against indexed whitepapers and audited benchmarks.
- **Trademark & Nomenclature Enforcement:** Enforces registered brand names on primary mentions (*Acme CloudSphere™* vs. deprecated *Acme Cloud Platform*).
- **Tone & SLA Clarity:** Recommends contractually aligned uptime tiers (*99.99% availability*) over colloquial phrasing (*"without downtime"*).
- **Verified SLA Evidence:** Validates approved claims (*"zero scheduled downtime architecture"*) linked directly to legal SLA attachments (`SLA-2025-V2`).
- **Human-in-the-Loop Governance:** Provides 1-click **"Apply Fix"**, **"Attach Evidence"**, **"Mark Reviewed"**, and **"Override"** with audit logs.
- **Revision Rescan:** Creates versioned drafts and recalculates dynamic Brand Health Scores (0–100) upon editing.
- **Audit Export:** Generates clean printable and PDF compliance reports.

---

## 📐 Architecture & Modules

```
src/
├── types/
│   └── index.ts                 # Full TypeScript definitions (BrandRule, Evidence, Finding, Review)
├── engine/
│   ├── complianceEngine.ts      # Pure deterministic rule engine with regex token matching & evidence cross-referencing
│   ├── rules.ts                 # Default seeded Acme Global 2025 v2.4 brand rules
│   ├── evidence.ts              # Indexed whitepapers, SLAs, and product catalogs
│   └── complianceEngine.test.ts # 6 comprehensive Vitest unit tests
├── storage/
│   ├── localStorage.ts          # Persistence layer with state isolation & demo reset capability
│   └── seedData.ts              # Seed reviews matching Google Stitch UI (#BG-8924, #BG-8921, etc.)
├── components/
│   ├── layout/                  # Sidebar and Topbar navigation
│   └── review/                  # ScoreMeter, EvaluatedCopySnippet, FindingCard, StickyActionBar, Modals
└── pages/
    ├── DashboardPage.tsx        # Dynamic metric cards, active policy guard banner, recent reviews table
    ├── NewReviewPage.tsx        # Content submission form with quick test presets & asset uploader
    ├── AnalysisResultsPage.tsx  # Interactive split-view results with inline token highlights & finding actions
    ├── ReviewHistoryPage.tsx    # Comprehensive review archive with status & channel filters
    ├── BrandGuidelinesPage.tsx  # Rule policy configuration & active enforcement toggles
    └── EvidenceLibraryPage.tsx  # Whitepapers, benchmarks, and SLA records manager
```

---

## 🧪 Verified Test Suite

Run `npm test` to execute the automated unit test suite in `src/engine/complianceEngine.test.ts`:

- `✓ detects critical violations, unsupported claims, trademark and tone issues on sample copy`
- `✓ recognizes verified SLA evidence for approved architecture claims`
- `✓ returns clean score of 100 for compliant marketing copy`
- `✓ replaces a single matched suggestion accurately in text`
- `✓ applies batch suggestions cleanly from end to start without index collisions`
- `✓ does not flag disabled / inactive rules`

---

## ☁️ Deployment on Vercel

The application is pre-configured for instant zero-configuration deployment to Vercel:
1. Connect the GitHub repository to [Vercel](https://vercel.com).
2. Framework preset: **Vite**.
3. Build command: `npm run build` (outputs to `dist`).
4. `vercel.json` provides client-side SPA routing rewrites.
