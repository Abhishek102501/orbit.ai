import { initials as toInitials, faviconUrl, categoryName, pricingLabel } from './tools.js';

/**
 * Expands a raw tool record into the display shape every card, table row and detail
 * header consumes — the design's `buildCard`. Pure: all state arrives via `ctx`.
 *
 * @param {object} tool  raw record from data/tools.js
 * @param {object} ctx   { c, saved, compareIds, matchScore, onToggleSave, onToggleCompare }
 */
export function buildCard(tool, ctx) {
  const { c, saved, compareIds, matchScore, onToggleSave, onToggleCompare } = ctx;
  const isSaved = saved.includes(tool.id);
  const isComparing = compareIds.includes(tool.id);

  return {
    ...tool,
    initials: tool.initials || toInitials(tool.name),
    logoUrl: faviconUrl(tool.website),
    categoryLabel: categoryName(tool.category),
    pricingLabel: pricingLabel(tool.pricing),
    pricingColor: tool.pricing === 'paid' ? c.text : c.badgeText,
    pricingBg: tool.pricing === 'paid' ? c.ink(0.08) : c.badgeBg,
    isSaved,
    isComparing,
    matchScore: matchScore ? matchScore(tool) : null,
    detailHref: '#/tool/' + tool.slug,
    topFeatures: (tool.features || []).slice(0, 3),
    onToggleSave: () => onToggleSave(tool.id),
    onToggleCompare: () => onToggleCompare(tool.id),
    saveColor: isSaved ? c.accentText : c.text,
    compareLabel: isComparing ? 'In Compare' : 'Compare',
    compareBorder: isComparing ? c.accent : c.ink(0.16),
    compareBg: isComparing ? 'rgba(145,132,217,0.12)' : 'transparent',
    compareColor: isComparing ? c.accentText : c.text,
    saveLabel: isSaved ? 'Saved' : 'Save',
  };
}
