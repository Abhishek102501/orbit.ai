/**
 * Render smoke test: mounts every screen with the real components and a fully populated
 * context, and reports node counts + any thrown error. Run with:
 *   npx vite-node ssr-smoke.jsx      (or via `npm run smoke`)
 */
import { renderToString } from 'react-dom/server';
import { OrbitContext } from './src/store/OrbitProvider.jsx';
import { paletteFor } from './src/lib/palette.js';
import { layoutFor } from './src/lib/layout.js';
import { buildCard } from './src/lib/card.js';
import { initials } from './src/lib/tools.js';
import { TOOLS as RAW_TOOLS } from './src/data/tools.js';
import { CATEGORIES, PLATFORMS } from './src/data/categories.js';
import * as catalog from './src/data/categories.js';
import * as engine from './src/data/engine.js';

import Home from './src/pages/Home.jsx';
import Discover from './src/pages/Discover.jsx';
import Categories from './src/pages/Categories.jsx';
import Advisor from './src/pages/Advisor.jsx';
import ToolDetail from './src/pages/ToolDetail.jsx';
import Compare from './src/pages/Compare.jsx';
import Saved from './src/pages/Saved.jsx';
import NotFound from './src/pages/NotFound.jsx';
import Header from './src/components/Header.jsx';
import Footer from './src/components/Footer.jsx';

const TOOLS = RAW_TOOLS.map((t) => ({ ...t, initials: initials(t.name) }));
const noop = () => {};

function makeCtx({ theme = 'dark', vw = 1280, route, saved = [], compareIds = [], lastCriteria = null, advisorResult = null } = {}) {
  const c = paletteFor(theme);
  const countByCategory = {};
  TOOLS.forEach((t) => { countByCategory[t.category] = (countByCategory[t.category] || 0) + 1; });
  const matchScore = (tool) => (lastCriteria ? engine.scoreTool(tool, lastCriteria).score : null);

  return {
    ready: true, TOOLS, CATEGORIES, PLATFORMS, dataMod: catalog, engine, countByCategory,
    theme, isLight: theme === 'light', c, toggleTheme: noop,
    logoSrc: '/assets/orbit-logo-full.png',
    vw, layout: layoutFor(vw), route, go: noop,
    saved, compareIds, lastCriteria,
    toggleSave: noop, toggleCompare: noop, compareSavedNow: noop,
    toast: null, showToast: noop, mobileNavOpen: false, toggleMobileNav: noop,
    heroQuery: '', setHeroQuery: noop,
    getTool: (id) => TOOLS.find((t) => t.id === id),
    getToolBySlug: (s) => TOOLS.find((t) => t.slug === s),
    buildCard: (tool) => buildCard(tool, { c, saved, compareIds, matchScore, onToggleSave: noop, onToggleCompare: noop }),
    matchScoreFor: matchScore,
    searchQuery: '', filterCategory: 'all', filterPricing: 'all', filterPlatform: 'all',
    minRating: 0, sortBy: 'relevance', discoverLoading: false, discoverVisible: 12,
    setDiscoverVisible: noop, filteredTools: TOOLS, hasActiveFilters: false, clearFilters: noop,
    onSearchChange: noop, onCategorySelect: noop, onPricingSelect: noop,
    onPlatformSelect: noop, onSortSelect: noop, onRatingSelect: noop,
    advisorText: '', setAdvisorText: noop, advisorBudget: 'any', setAdvisorBudget: noop,
    advisorSkill: 'any', setAdvisorSkill: noop, advisorTask: 'any', setAdvisorTask: noop,
    advisorResult, advisorLoading: false, runAdvisor: noop, resetAdvisor: noop,
    compareSearch: '', setCompareSearch: noop,
  };
}

function render(label, Comp, ctxOpts) {
  try {
    const html = renderToString(
      <OrbitContext.Provider value={makeCtx(ctxOpts)}>
        <Comp />
      </OrbitContext.Provider>,
    );
    const tags = (html.match(/<[a-z]/g) || []).length;
    console.log('  PASS  ' + label.padEnd(30) + ' ' + String(tags).padStart(5) + ' elements');
    return { ok: true, html };
  } catch (e) {
    console.log('  FAIL  ' + label.padEnd(30) + ' ' + e.message);
    console.log('        ' + String(e.stack).split('\n').slice(1, 4).join('\n        '));
    return { ok: false };
  }
}

const r = (name, params = {}) => ({ name, params, query: {} });
const advisorResults = engine.recommend('free tool to make a presentation, beginner', {}, 6).results;
const criteria = engine.recommend('free tool to make a presentation, beginner', {}, 6).criteria;

console.log('\n=== screens (dark, 1280px) ===');
const out = [
  render('Home', Home, { route: r('home') }),
  render('Discover', Discover, { route: r('discover') }),
  render('Categories', Categories, { route: r('categories') }),
  render('Advisor (empty)', Advisor, { route: r('advisor') }),
  render('Advisor (results)', Advisor, { route: r('advisor'), advisorResult: advisorResults, lastCriteria: criteria }),
  render('ToolDetail /cursor', ToolDetail, { route: r('tool', { slug: 'cursor' }) }),
  render('ToolDetail /bogus', ToolDetail, { route: r('tool', { slug: 'nope' }) }),
  render('Compare (empty)', Compare, { route: r('compare') }),
  render('Compare (3 tools)', Compare, { route: r('compare'), compareIds: ['t01', 't02', 't03'], lastCriteria: criteria }),
  render('Saved (empty)', Saved, { route: r('saved') }),
  render('Saved (2 tools)', Saved, { route: r('saved'), saved: ['t01', 't05'] }),
  render('NotFound', NotFound, { route: r('notfound') }),
  render('Header', Header, { route: r('home'), saved: ['t01'] }),
  render('Footer', Footer, { route: r('home') }),
];

console.log('\n=== responsive + light theme ===');
out.push(render('Home @ 640 mobile', Home, { route: r('home'), vw: 640 }));
out.push(render('Home @ 900 tablet', Home, { route: r('home'), vw: 900 }));
out.push(render('Home light theme', Home, { route: r('home'), theme: 'light' }));
out.push(render('Discover @ 640', Discover, { route: r('discover'), vw: 640 }));

console.log('\n=== content spot-checks ===');
const home = out[0].html;
const checks = [
  ['hero headline', /Find the right AI\./],
  ['hero sub', /Tell Orbit what you/],
  ['send button label', /Find My AI Tool/],
  ['marquee track', /id="catMarqueeTrack"/],
  ['marquee animation', /marqueeScroll 38s linear infinite/],
  ['staggered hero headline', /fadeUp 0\.9s cubic-bezier\(0\.16,1,0\.3,1\) 0\.24s both/],
  ['find my ai tool section', /Find My AI Tool[\s\S]*?What are you trying to accomplish\?/],
  ['24 marquee cards', /(discover\?category=coding[\s\S]*?){2}/],
  ['how-it-works step', /Describe your requirement/],
  ['why orbit', /Works without a black box/],
  ['cta', /Stop guessing\. Start matching\./],
  ['showcase copy', /See Orbit in motion/],
];
let bad = 0;
for (const [label, re] of checks) {
  const ok = re.test(home);
  if (!ok) bad++;
  console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + label);
}

const failed = out.filter((x) => !x.ok).length;
console.log('\n' + (failed || bad ? 'FAILURES: ' + (failed + bad) : 'All ' + out.length + ' screens + ' + checks.length + ' content checks passed.'));
process.exit(failed + bad ? 1 : 0);
