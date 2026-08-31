// Deterministic local recommendation engine. Works with zero external API calls;
// an LLM (if available) may only enhance parsing/explanations on top of this.
import { TOOLS } from './tools.js';
import { CATEGORIES } from './categories.js';

const CATEGORY_KEYWORDS = {
  coding: ['code', 'coding', 'developer', 'programming', 'app', 'build a website', 'debug', 'software', 'api', 'refactor'],
  design: ['design', 'ui', 'ux', 'wireframe', 'mockup', 'logo', 'brand', 'prototype'],
  writing: ['write', 'writing', 'essay', 'blog', 'copy', 'email', 'article', 'proofread', 'edit', 'grammar', 'story', 'novel'],
  image: ['image', 'picture', 'art', 'illustration', 'photo', 'graphic', 'poster', 'artwork'],
  video: ['video', 'clip', 'film', 'movie', 'animation', 'avatar video', 'edit video'],
  audio: ['audio', 'voice', 'voiceover', 'music', 'song', 'podcast', 'narration', 'sound'],
  research: ['research', 'citation', 'source', 'paper', 'study', 'literature', 'fact-check', 'academic'],
  productivity: ['schedule', 'calendar', 'meeting', 'notes', 'task', 'productivity', 'email inbox', 'transcribe'],
  marketing: ['marketing', 'ad', 'ads', 'campaign', 'seo', 'social media', 'growth', 'conversion'],
  education: ['learn', 'study', 'tutor', 'presentation', 'course', 'homework', 'teach', 'slide', 'deck', 'class'],
  business: ['sales', 'crm', 'customer support', 'lead', 'pipeline', 'operations', 'helpdesk', 'forecast'],
  automation: ['automate', 'automation', 'workflow', 'integrate', 'zap', 'repetitive', 'no-code workflow'],
};

const BUDGET_KEYWORDS = {
  free: ['free', 'no cost', 'zero budget', 'no budget', 'without paying'],
  paid: ['premium', 'best possible', 'no budget limit', 'enterprise', 'paid is fine'],
};

const SKILL_KEYWORDS = {
  beginner: ['beginner', 'new to this', 'no experience', 'never used', 'simple', 'easy', 'non-technical', "don't know how to code", 'no-code'],
  advanced: ['advanced', 'developer', 'engineer', 'expert', 'technical', 'api', 'self-host', 'power user'],
};

const PLATFORM_KEYWORDS = {
  'iOS': ['iphone', 'ios'], 'Android': ['android'], 'Mac': ['macbook', 'mac'], 'Windows': ['windows', 'pc'],
  'Web': ['browser', 'web app'], 'Chrome Extension': ['chrome extension', 'browser extension'], 'API': ['api', 'integrate with my app'],
};

function textHas(text, list) { return list.some((k) => text.includes(k)); }

/** Turn free text + optional chip selections into structured criteria. */
export function parseRequirement(rawText, chips = {}) {
  const text = (rawText || '').toLowerCase();
  const categories = new Set(chips.category ? [chips.category] : []);
  const keywords = new Set();

  for (const [cat, words] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const w of words) {
      if (text.includes(w)) { categories.add(cat); keywords.add(w); }
    }
  }

  let budget = chips.budget || null;
  if (!budget) {
    if (textHas(text, BUDGET_KEYWORDS.free)) budget = 'free';
    else if (textHas(text, BUDGET_KEYWORDS.paid)) budget = 'paid';
  }

  let skillLevel = chips.skillLevel || null;
  if (!skillLevel) {
    if (textHas(text, SKILL_KEYWORDS.beginner)) skillLevel = 'beginner';
    else if (textHas(text, SKILL_KEYWORDS.advanced)) skillLevel = 'advanced';
  }

  const platforms = new Set(chips.platform ? [chips.platform] : []);
  for (const [p, words] of Object.entries(PLATFORM_KEYWORDS)) {
    if (textHas(text, words)) platforms.add(p);
  }

  // Every non-trivial word becomes a loose keyword for feature/use-case overlap scoring.
  text.split(/[^a-z0-9]+/).filter((w) => w.length > 3).forEach((w) => keywords.add(w));

  return {
    rawText: rawText || '',
    categories: [...categories],
    budget,
    skillLevel,
    platforms: [...platforms],
    keywords: [...keywords],
  };
}

function corpus(tool) {
  return [tool.name, tool.description, ...(tool.features || []), ...(tool.useCases || []), ...(tool.tags || []), ...(tool.subcategories || [])]
    .join(' ').toLowerCase();
}

/** Score one tool against parsed criteria. Returns {score(0-100), reasons[]}. */
export function scoreTool(tool, criteria) {
  let score = 0;
  const reasons = [];
  const body = corpus(tool);

  if (criteria.categories.length) {
    if (criteria.categories.includes(tool.category)) {
      score += 34;
      const cat = CATEGORIES.find((c) => c.id === tool.category);
      reasons.push(`Built for ${cat ? cat.name.toLowerCase() : tool.category} work`);
    }
  } else {
    score += 10; // no category signal — don't penalize
  }

  const kw = criteria.keywords.filter((k) => k.length > 3 && body.includes(k));
  if (kw.length) {
    score += Math.min(26, kw.length * 6);
    const featureHit = (tool.features || []).find((f) => kw.some((k) => f.toLowerCase().includes(k)));
    const useCaseHit = (tool.useCases || []).find((u) => kw.some((k) => u.toLowerCase().includes(k)));
    if (useCaseHit) reasons.push(useCaseHit);
    else if (featureHit) reasons.push(featureHit);
  }

  if (criteria.budget === 'free') {
    if (tool.pricing === 'free') { score += 16; reasons.push('Completely free'); }
    else if (tool.pricing === 'freemium') { score += 13; reasons.push('Free option available'); }
    else { score -= 10; }
  } else if (criteria.budget === 'paid') {
    score += 4;
  } else {
    if (tool.pricing !== 'paid') score += 4;
  }

  if (criteria.skillLevel === 'beginner') {
    if (tool.skillLevel === 'beginner') { score += 13; reasons.push('Beginner friendly'); }
    else if (tool.skillLevel === 'advanced') { score -= 12; }
  } else if (criteria.skillLevel === 'advanced') {
    if (tool.skillLevel === 'advanced') { score += 8; reasons.push('Built for technical/advanced users'); }
  } else {
    score += 3;
  }

  if (criteria.platforms.length) {
    const hit = criteria.platforms.filter((p) => (tool.platforms || []).includes(p));
    if (hit.length) { score += 8; reasons.push(`Available on ${hit.join(', ')}`); }
  }

  score += (tool.rating || 4) * 2.2; // quality/relevance baseline tiebreak, ~+8.8 to +10.8

  if (tool.features && tool.features.length >= 4 && reasons.length < 2) {
    reasons.push('Relevant AI capabilities');
  }

  return { score: Math.max(0, Math.min(100, Math.round(score))), reasons: reasons.slice(0, 4) };
}

/** Full pipeline: text + chips -> ranked recommendations. */
export function recommend(rawText, chips = {}, limit = 6) {
  const criteria = parseRequirement(rawText, chips);
  const ranked = TOOLS.map((tool) => ({ tool, ...scoreTool(tool, criteria) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
  return { criteria, results: ranked };
}

/** Simple search across name/description/tags/features, independent of the advisor engine. */
export function searchTools(query) {
  const q = (query || '').toLowerCase().trim();
  if (!q) return TOOLS;
  return TOOLS.filter((t) => corpus(t).includes(q) || t.name.toLowerCase().includes(q));
}
