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

// Header rendered on its own, twice: once with an untouched session and once with
// items saved and queued for comparison. The navigation assertions below use string
// containment rather than patterns - an earlier attempt at a regex here wrote a
// literal control character into the file instead of a word boundary.
const headerWith = (opts) =>
  renderToString(
    <OrbitContext.Provider value={makeCtx(opts)}>
      <Header />
    </OrbitContext.Provider>,
  );
const navEmpty = headerWith({ route: r('home') });
const navFull = headerWith({ route: r('saved'), saved: ['t01', 't02'], compareIds: ['t03'] });
const checks = [
  ['hero headline', /Find the right AI\./],
  // Anchored on "Orbit scores every tool", which appears only in the hero. The old
  // check matched /Tell Orbit what you/, which also occurs in HOW_STEPS[0].body — it
  // passed off the How-It-Works section and never actually tested the hero.
  ['hero sub', /Describe the job, not the tool[\s\S]*?Orbit scores the catalog/],
  ['finder CTA', /Find the Right AI/],
  ['marquee track', /id="catMarqueeTrack"/],
  ['marquee animation', /marqueeScroll 38s linear infinite/],
  ['staggered hero headline', /fadeUp 0\.9s cubic-bezier\(0\.16,1,0\.3,1\) 0\.2s both/],
  // The finder is now the hero's primary interaction: the eyebrow, the headline and
  // the input have to render as one block, and the page must have exactly one <h1>.
  ['finder lives in the hero', /Scored across[\s\S]*?categories[\s\S]*?Find the right AI\.[\s\S]*?finder-input/],
  ['hero uses the display face', /class="hero-display"/],
  // React separates adjacent text nodes with empty comments; strip them so the
  // assertion reads the copy as a user would see it.
  ['announcement pill counts the catalog', (html) => {
    const flat = html.replace(/<!-- -->/g, '');
    return /href="#\/discover"[\s\S]{0,900}?\d+ tools[\s\S]{0,200}?Scored across \d+ categories/.test(flat);
  }],
  ['single h1', (html) => (html.match(/<h1/g) || []).length === 1],
  ['finder suggestions', /Try<\/span>[\s\S]*?Create a cinematic product video/],
  ['24 marquee cards', /(discover\?category=coding[\s\S]*?){2}/],
  ['how-it-works step', /Describe your requirement/],
  ['why orbit', /Works without a black box/],
  // The closing CTA highlights "Start matching" in a <span>, so the phrase is split
  // across markup. Strip tags and React's text-node separators and assert the copy a
  // visitor actually reads.
  ['cta', (html) => {
    const text = html.replace(/<!-- -->/g, '').replace(/<[^>]+>/g, '');
    return /Stop guessing\.\s*Start matching\./.test(text);
  }],
  ['cta orbital figure', /class="orb-ring/],
  // Matches the class inside a list, not the whole attribute - the steps carry
  // both `timeline-step` (reveal) and `step-row` (hover surface).
  ['contribution timeline', (html) => html.split('timeline-step').length - 1 === 3],
  ['section headers', (html) => (html.match(/class="section-header"/g) || []).length >= 2],
  ['showcase copy', /See Orbit in motion/],

  // --- navigation information architecture ---
  ['nav: no inert controls', () => !navEmpty.includes('aria-disabled')],
  [
    'nav: removed controls absent',
    () => !['Sign in', 'Get Started', 'Pricing', 'About'].some((t) => navEmpty.includes(t)),
  ],
  [
    'nav: saved, compare and advisor reachable',
    () =>
      ['#/saved', '#/compare', '#/advisor'].every((h) => navEmpty.includes('href="' + h + '"')),
  ],
  ['nav: zero counts hidden', () => !navEmpty.includes('aria-label="Saved (')],
  [
    'nav: counts render and pluralise',
    () =>
      navFull.includes('aria-label="Saved (2 items)"') &&
      navFull.includes('aria-label="Compare (1 item)"'),
  ],
];
let bad = 0;
for (const [label, re] of checks) {
  // A check is either a regex to match against the rendered HTML or a predicate,
  // for assertions a regex cannot express (counting elements, for instance).
  const ok = typeof re === 'function' ? re(home) : re.test(home);
  if (!ok) bad++;
  console.log('  ' + (ok ? 'PASS' : 'FAIL') + '  ' + label);
}

const failed = out.filter((x) => !x.ok).length;
console.log('\n' + (failed || bad ? 'FAILURES: ' + (failed + bad) : 'All ' + out.length + ' screens + ' + checks.length + ' content checks passed.'));
process.exit(failed + bad ? 1 : 0);
