import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useViewport } from '../hooks/useViewport.js';
import { useHashRoute } from '../hooks/useHashRoute.js';
import { paletteFor } from '../lib/palette.js';
import { layoutFor } from '../lib/layout.js';
import * as catalog from '../data/categories.js';
import {
  CATEGORIES as ALL_CATEGORIES,
  PLATFORMS as ALL_PLATFORMS,
} from '../data/categories.js';
import { initials as toInitials } from '../lib/tools.js';
import { buildCard as makeCard } from '../lib/card.js';

export const OrbitContext = createContext(null);

export function useOrbit() {
  const ctx = useContext(OrbitContext);
  if (!ctx) throw new Error('useOrbit must be used inside <OrbitProvider>');
  return ctx;
}

function readJson(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
  } catch (e) {
    return fallback;
  }
}

/**
 * Resolved during the first render (not after the catalog import) so the very first
 * paint already uses the stored theme — otherwise a light-mode visitor sees the dark
 * palette flash by while the data chunks load.
 */
function readTheme() {
  try {
    return localStorage.getItem('orbit_theme') === 'light' ? 'light' : 'dark';
  } catch (e) {
    return 'dark';
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    /* storage unavailable — state still works for this session */
  }
}

/**
 * Holds every piece of state the design kept on its single root component, so that
 * navigating between screens preserves filters, advisor results and the shortlist
 * exactly as it did in the original.
 */
export function OrbitProvider({ children }) {
  // ---------------- data loading (drives the splash screen) ----------------
  const [ready, setReady] = useState(false);
  const [data, setData] = useState({ TOOLS: [], CATEGORIES: [], PLATFORMS: [], dataMod: null, engine: null });

  // ---------------- persisted state ----------------
  const [theme, setTheme] = useState(readTheme);
  const [saved, setSaved] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [lastCriteria, setLastCriteria] = useState(null);

  // ---------------- ephemeral UI state ----------------
  const [toast, setToast] = useState(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [heroQuery, setHeroQuery] = useState('');

  // ---------------- discover ----------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPricing, setFilterPricing] = useState('all');
  const [filterPlatform, setFilterPlatform] = useState('all');
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('relevance');
  const [discoverLoading, setDiscoverLoading] = useState(false);
  const [discoverVisible, setDiscoverVisible] = useState(12);

  // ---------------- advisor ----------------
  const [advisorText, setAdvisorText] = useState('');
  const [advisorBudget, setAdvisorBudget] = useState('any');
  const [advisorSkill, setAdvisorSkill] = useState('any');
  const [advisorTask, setAdvisorTask] = useState('any');
  const [advisorResult, setAdvisorResult] = useState(null);
  const [advisorLoading, setAdvisorLoading] = useState(false);

  // ---------------- compare ----------------
  const [compareSearch, setCompareSearch] = useState('');

  const toastTimer = useRef(null);
  const filterTimer = useRef(null);
  const advisorTimer = useRef(null);

  const vw = useViewport();

  const onRouteChange = useCallback((next) => {
    if (next.name === 'discover' && next.query.category) setFilterCategory(next.query.category);
  }, []);
  const { route, go } = useHashRoute(onRouteChange);

  // Load the catalog, then restore persisted state — the splash shows until this settles.
  useEffect(() => {
    let alive = true;
    Promise.all([import('../data/tools.js'), import('../data/engine.js')]).then(
      ([toolsMod, engineMod]) => {
      if (!alive) return;
      setData({
        TOOLS: toolsMod.TOOLS.map((t) => ({ ...t, initials: toInitials(t.name) })),
        CATEGORIES: ALL_CATEGORIES,
        PLATFORMS: ALL_PLATFORMS,
        dataMod: catalog,
        engine: engineMod,
      });

      setSaved(readJson('orbit_saved', []));
      setCompareIds(readJson('orbit_compare', []));
      setLastCriteria(readJson('orbit_lastCriteria', null));

      const initial = parseInitialCategory();
      if (initial) setFilterCategory(initial);

      setReady(true);
      },
    );
    return () => {
      alive = false;
    };
  }, []);

  // Keep <body> in step with the active theme, as the design does, and publish the few
  // palette roles that stylesheet rules need — global link colour, selection, focus ring
  // — so index.css does not have to hardcode the dark-theme values.
  useEffect(() => {
    const p = paletteFor(theme);
    const root = document.documentElement;

    document.body.style.background = p.bg;
    document.body.style.color = p.text;

    root.setAttribute('data-theme', theme);
    root.style.setProperty('--orbit-link', p.accentText);
    root.style.setProperty('--orbit-link-hover', p.accent);
    root.style.setProperty('--orbit-focus', p.accent);
    root.style.setProperty('--orbit-selection', p.accentSoftStrong);
  }, [theme]);

  useEffect(
    () => () => {
      clearTimeout(toastTimer.current);
      clearTimeout(filterTimer.current);
      clearTimeout(advisorTimer.current);
    },
    [],
  );

  const isLight = theme === 'light';
  const c = useMemo(() => paletteFor(theme), [theme]);
  const layout = useMemo(() => layoutFor(vw), [vw]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      try {
        localStorage.setItem('orbit_theme', next);
      } catch (e) {
        /* ignore */
      }
      return next;
    });
  }, []);

  const toggleMobileNav = useCallback(() => setMobileNavOpen((v) => !v), []);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2400);
  }, []);

  const toggleSave = useCallback(
    (id) => {
      setSaved((prev) => {
        const has = prev.includes(id);
        const next = has ? prev.filter((x) => x !== id) : [...prev, id];
        writeJson('orbit_saved', next);
        showToast(has ? 'Removed from saved' : 'Saved to your list');
        return next;
      });
    },
    [showToast],
  );

  const toggleCompare = useCallback(
    (id) => {
      setCompareIds((prev) => {
        if (!prev.includes(id) && prev.length >= 4) {
          showToast('Compare up to 4 tools at a time');
          return prev;
        }
        const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
        writeJson('orbit_compare', next);
        return next;
      });
    },
    [showToast],
  );

  const { TOOLS, CATEGORIES, PLATFORMS, dataMod, engine } = data;

  const getTool = useCallback((id) => TOOLS.find((t) => t.id === id), [TOOLS]);
  const getToolBySlug = useCallback((slug) => TOOLS.find((t) => t.slug === slug), [TOOLS]);

  const matchScoreFor = useCallback(
    (tool) => (lastCriteria && engine ? engine.scoreTool(tool, lastCriteria).score : null),
    [lastCriteria, engine],
  );

  const countByCategory = useMemo(() => {
    const counts = {};
    TOOLS.forEach((t) => {
      counts[t.category] = (counts[t.category] || 0) + 1;
    });
    return counts;
  }, [TOOLS]);

  const buildCard = useCallback(
    (tool) =>
      makeCard(tool, {
        c,
        saved,
        compareIds,
        matchScore: matchScoreFor,
        onToggleSave: toggleSave,
        onToggleCompare: toggleCompare,
      }),
    [matchScoreFor, saved, compareIds, c, toggleSave, toggleCompare],
  );

  // ---------------- discover filtering ----------------
  const setFilter = useCallback((setter, value) => {
    setter(value);
    setDiscoverVisible(12);
    setDiscoverLoading(true);
    clearTimeout(filterTimer.current);
    filterTimer.current = setTimeout(() => setDiscoverLoading(false), 320);
  }, []);

  const clearFilters = useCallback(() => {
    setFilter(setSearchQuery, '');
    setFilterCategory('all');
    setFilterPricing('all');
    setFilterPlatform('all');
    setMinRating(0);
    setSortBy('relevance');
  }, [setFilter]);

  const filteredTools = useMemo(() => {
    let list = TOOLS;
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          (t.tags || []).some((x) => x.includes(q)) ||
          (t.features || []).some((f) => f.toLowerCase().includes(q)),
      );
    }
    if (filterCategory !== 'all') list = list.filter((t) => t.category === filterCategory);
    if (filterPricing !== 'all') list = list.filter((t) => t.pricing === filterPricing);
    if (filterPlatform !== 'all') list = list.filter((t) => (t.platforms || []).includes(filterPlatform));
    if (minRating > 0) list = list.filter((t) => t.rating >= minRating);

    const sorted = [...list];
    if (sortBy === 'rating') sorted.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'reviews') sorted.sort((a, b) => b.reviewCount - a.reviewCount);
    else if (sortBy === 'name') sorted.sort((a, b) => a.name.localeCompare(b.name));
    else if (lastCriteria && engine)
      sorted.sort(
        (a, b) => engine.scoreTool(b, lastCriteria).score - engine.scoreTool(a, lastCriteria).score,
      );
    else sorted.sort((a, b) => b.rating - a.rating);
    return sorted;
  }, [TOOLS, searchQuery, filterCategory, filterPricing, filterPlatform, minRating, sortBy, lastCriteria, engine]);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    filterCategory !== 'all' ||
    filterPricing !== 'all' ||
    filterPlatform !== 'all' ||
    minRating > 0;

  // ---------------- advisor ----------------
  const runAdvisor = useCallback(() => {
    if (!advisorText.trim() || !engine) return;
    setAdvisorLoading(true);
    const chips = {
      budget: advisorBudget !== 'any' ? advisorBudget : null,
      skillLevel: advisorSkill !== 'any' ? advisorSkill : null,
      category: advisorTask !== 'any' ? advisorTask : null,
    };
    clearTimeout(advisorTimer.current);
    advisorTimer.current = setTimeout(() => {
      const { criteria, results } = engine.recommend(advisorText, chips, 6);
      writeJson('orbit_lastCriteria', criteria);
      setAdvisorResult(results);
      setLastCriteria(criteria);
      setAdvisorLoading(false);
    }, 700);
  }, [advisorText, advisorBudget, advisorSkill, advisorTask, engine]);

  const resetAdvisor = useCallback(() => {
    setAdvisorResult(null);
    setAdvisorText('');
    setAdvisorBudget('any');
    setAdvisorSkill('any');
    setAdvisorTask('any');
  }, []);

  const compareSavedNow = useCallback(() => {
    const ids = saved.slice(0, 4);
    setCompareIds(ids);
    writeJson('orbit_compare', ids);
    go('#/compare');
  }, [saved, go]);

  const value = {
    ready,
    TOOLS,
    CATEGORIES,
    PLATFORMS,
    dataMod,
    engine,
    countByCategory,

    theme,
    isLight,
    c,
    toggleTheme,
    logoSrc: isLight ? '/assets/orbit-logo-full-light.png' : '/assets/orbit-logo-full.png',

    vw,
    layout,
    route,
    go,

    saved,
    compareIds,
    lastCriteria,
    toggleSave,
    toggleCompare,
    compareSavedNow,

    toast,
    showToast,
    mobileNavOpen,
    toggleMobileNav,

    heroQuery,
    setHeroQuery,

    getTool,
    getToolBySlug,
    buildCard,
    matchScoreFor,

    searchQuery,
    filterCategory,
    filterPricing,
    filterPlatform,
    minRating,
    sortBy,
    discoverLoading,
    discoverVisible,
    setDiscoverVisible,
    filteredTools,
    hasActiveFilters,
    clearFilters,
    onSearchChange: (v) => setFilter(setSearchQuery, v),
    onCategorySelect: (v) => setFilter(setFilterCategory, v),
    onPricingSelect: (v) => setFilter(setFilterPricing, v),
    onPlatformSelect: (v) => setFilter(setFilterPlatform, v),
    onSortSelect: (v) => setFilter(setSortBy, v),
    onRatingSelect: (v) => setFilter(setMinRating, v),

    advisorText,
    setAdvisorText,
    advisorBudget,
    setAdvisorBudget,
    advisorSkill,
    setAdvisorSkill,
    advisorTask,
    setAdvisorTask,
    advisorResult,
    advisorLoading,
    runAdvisor,
    resetAdvisor,

    compareSearch,
    setCompareSearch,
  };

  return <OrbitContext.Provider value={value}>{children}</OrbitContext.Provider>;
}

function parseInitialCategory() {
  const hash = (window.location.hash || '').replace(/^#/, '');
  const [path, queryPart] = hash.split('?');
  if (!path.startsWith('/discover') || !queryPart) return null;
  const found = queryPart.split('&').find((kv) => kv.startsWith('category='));
  return found ? decodeURIComponent(found.slice('category='.length)) : null;
}
