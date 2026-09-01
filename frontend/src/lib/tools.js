import { CATEGORIES } from '../data/categories.js';

/** "GitHub Copilot" -> "GC"; "Cursor" -> "CU". Matches the design's initials(). */
export function initials(name) {
  const words = name.replace(/\./g, '').split(/\s+/).filter(Boolean);
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

/** Tool logos are pulled from the site's own favicon, as in the design. */
export function faviconUrl(website) {
  try {
    // 256 so the mark stays sharp on the 64px detail-page avatar at 2x.
    return 'https://www.google.com/s2/favicons?sz=256&domain=' + new URL(website).hostname;
  } catch (e) {
    return '';
  }
}

export function categoryName(id) {
  const c = CATEGORIES.find((x) => x.id === id);
  return c ? c.name : id;
}

export function pricingLabel(p) {
  return p === 'free' ? 'Free' : p === 'freemium' ? 'Freemium' : 'Paid';
}

export function verdict(tool) {
  const strength = tool.pros && tool.pros[0] ? tool.pros[0].toLowerCase() : 'strong AI capabilities';
  const caveat = tool.cons && tool.cons[0] ? tool.cons[0].toLowerCase() : 'a small learning curve';
  return (
    tool.name + ' earns its ' + tool.rating.toFixed(1) + ' rating on ' + strength +
    '. Go in expecting ' + caveat + '.'
  );
}

export function getAlternatives(tools, tool) {
  return tools
    .filter((t) => t.category === tool.category && t.id !== tool.id)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);
}

export function getSimilar(tools, tool, altIds) {
  const shared = (t) => (t.subcategories || []).some((s) => (tool.subcategories || []).includes(s));
  let similar = tools.filter(
    (t) => t.category === tool.category && t.id !== tool.id && !altIds.includes(t.id) && shared(t),
  );
  if (similar.length < 3) {
    const more = tools.filter(
      (t) =>
        t.category === tool.category &&
        t.id !== tool.id &&
        !altIds.includes(t.id) &&
        !similar.includes(t),
    );
    similar = [...similar, ...more];
  }
  return similar.slice(0, 3);
}

/** Highest scorer against the stored criteria, falling back to raw rating. */
export function bestOf(tools, lastCriteria, scoreTool) {
  if (!tools.length) return null;
  let best = tools[0];
  for (const t of tools) {
    const bs = lastCriteria ? scoreTool(best, lastCriteria).score : best.rating * 20;
    const ts = lastCriteria ? scoreTool(t, lastCriteria).score : t.rating * 20;
    if (ts > bs) best = t;
  }
  return best;
}
