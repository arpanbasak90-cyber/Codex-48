import type { BrandRule, EvidenceRecord, ReviewRecord, ReviewVersion, AuditLogEntry, UserProfile } from '../types';
import { DEFAULT_RULES } from '../engine/rules';
import { DEFAULT_EVIDENCE } from '../engine/evidence';
import { SEED_REVIEWS } from './seedData';

const STORAGE_KEYS = {
  RULES: 'brandguard_rules_v2',
  EVIDENCE: 'brandguard_evidence_v2',
  REVIEWS: 'brandguard_reviews_v2',
  INITIALIZED: 'brandguard_initialized_v2',
  USER: 'brandguard_user_session_v1',
};

export class StorageService {
  /**
   * Initialize local storage with default demo workspace data safely
   */
  static initialize(): void {
    if (typeof window === 'undefined') return;

    const isInitialized = localStorage.getItem(STORAGE_KEYS.INITIALIZED);
    if (!isInitialized) {
      if (!localStorage.getItem(STORAGE_KEYS.RULES)) {
        localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(DEFAULT_RULES));
      }
      if (!localStorage.getItem(STORAGE_KEYS.EVIDENCE)) {
        localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(DEFAULT_EVIDENCE));
      }
      if (!localStorage.getItem(STORAGE_KEYS.REVIEWS)) {
        localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
      }
      localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
    }
  }

  /**
   * Reset all workspace data to factory Acme demo state
   */
  static resetToDemo(): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(DEFAULT_RULES));
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(DEFAULT_EVIDENCE));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(SEED_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.INITIALIZED, 'true');
  }

  // --- RULES ---
  static getRules(): BrandRule[] {
    if (typeof window === 'undefined') return DEFAULT_RULES;
    const data = localStorage.getItem(STORAGE_KEYS.RULES);
    if (!data) return DEFAULT_RULES;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_RULES;
    }
  }

  static saveRules(rules: BrandRule[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.RULES, JSON.stringify(rules));
  }

  static addRule(rule: BrandRule): void {
    const rules = this.getRules();
    rules.unshift(rule);
    this.saveRules(rules);
  }

  static updateRule(ruleId: string, updates: Partial<BrandRule>): void {
    const rules = this.getRules().map(r => (r.id === ruleId ? { ...r, ...updates } : r));
    this.saveRules(rules);
  }

  static toggleRuleActive(ruleId: string): void {
    const rules = this.getRules().map(r => (r.id === ruleId ? { ...r, isActive: !r.isActive } : r));
    this.saveRules(rules);
  }

  // --- EVIDENCE ---
  static getEvidence(): EvidenceRecord[] {
    if (typeof window === 'undefined') return DEFAULT_EVIDENCE;
    const data = localStorage.getItem(STORAGE_KEYS.EVIDENCE);
    if (!data) return DEFAULT_EVIDENCE;
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_EVIDENCE;
    }
  }

  static saveEvidence(evidence: EvidenceRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.EVIDENCE, JSON.stringify(evidence));
  }

  static addEvidence(record: EvidenceRecord): void {
    const list = this.getEvidence();
    list.unshift(record);
    this.saveEvidence(list);
  }

  static updateEvidence(id: string, updates: Partial<EvidenceRecord>): void {
    const list = this.getEvidence().map(e => (e.id === id ? { ...e, ...updates } : e));
    this.saveEvidence(list);
  }

  // --- REVIEWS ---
  static getReviews(): ReviewRecord[] {
    if (typeof window === 'undefined') return SEED_REVIEWS;
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) return SEED_REVIEWS;
    try {
      return JSON.parse(data);
    } catch {
      return SEED_REVIEWS;
    }
  }

  static saveReviews(reviews: ReviewRecord[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }

  static getReviewById(id: string): ReviewRecord | undefined {
    const reviews = this.getReviews();
    return reviews.find(r => r.id === id);
  }

  static saveReview(review: ReviewRecord): void {
    const reviews = this.getReviews();
    const index = reviews.findIndex(r => r.id === review.id);
    if (index >= 0) {
      reviews[index] = review;
    } else {
      reviews.unshift(review);
    }
    this.saveReviews(reviews);
  }

  static generateReviewId(): string {
    const reviews = this.getReviews();
    const numbers = reviews
      .map(r => {
        const match = r.id.match(/\d+/);
        return match ? parseInt(match[0], 10) : 0;
      })
      .filter(n => n > 8000);
    const maxNum = numbers.length > 0 ? Math.max(...numbers) : 8924;
    return `#BG-${maxNum + 1}`;
  }

  static deleteReview(reviewId: string): void {
    const reviews = this.getReviews().filter(r => r.id !== reviewId);
    this.saveReviews(reviews);
  }

  static clearAllReviews(): void {
    this.saveReviews([]);
  }

  // --- USER AUTH / SESSION ---
  static getUserSession(): UserProfile | null {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER);
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  }

  static saveUserSession(user: UserProfile): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  }

  static clearUserSession(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(STORAGE_KEYS.USER);
  }

  static addAuditLog(reviewId: string, entry: AuditLogEntry): void {
    const review = this.getReviewById(reviewId);
    if (!review) return;
    review.auditLog = [entry, ...(review.auditLog || [])];
    review.updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveReview(review);
  }

  static addRevisionVersion(reviewId: string, version: ReviewVersion): void {
    const review = this.getReviewById(reviewId);
    if (!review) return;
    review.versions = [...(review.versions || []), version];
    review.currentVersion = version.version;
    review.content = version.content;
    review.brandHealthScore = version.score;
    review.findings = version.findings;
    review.updatedAt = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.saveReview(review);
  }
}
