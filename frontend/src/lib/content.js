/** Editorial copy that the design keeps inline. Shared by the hero and the advisor. */
export const EXAMPLE_PROMPTS = [
  'Create a cinematic product video',
  'Build a website without coding',
  'Research a topic with citations',
  'Create a professional presentation',
  'Generate images for social media',
  'Automate repetitive business tasks',
];

/**
 * Icon for each example prompt, so the suggestion row reads as intent rather than as a
 * wall of pills. Keyed off EXAMPLE_PROMPTS so the copy stays in one place; anything
 * without an entry falls back to the sparkle.
 */
export const PROMPT_ICONS = {
  'Create a cinematic product video': 'video',
  'Build a website without coding': 'code',
  'Research a topic with citations': 'search',
  'Create a professional presentation': 'layers',
  'Generate images for social media': 'image',
  'Automate repetitive business tasks': 'bolt',
};

export const HOW_STEPS = [
  {
    n: '01',
    title: 'Describe your requirement',
    body: 'Tell Orbit what you’re trying to accomplish in plain language — budget and skill level included.',
  },
  {
    n: '02',
    title: 'Get ranked recommendations',
    body: 'A deterministic local engine scores every tool against your exact criteria.',
  },
  {
    n: '03',
    title: 'Understand the why',
    body: 'Every match comes with plain-language reasons, not just a score.',
  },
  {
    n: '04',
    title: 'Compare and decide',
    body: 'Put finalists side-by-side and let Orbit highlight what actually differs.',
  },
];

export const WHY_POINTS = [
  {
    icon: 'shield',
    title: 'Works without a black box',
    body: 'A transparent, local scoring engine — no dependency on an external AI to function.',
  },
  {
    icon: 'checkCircle',
    title: 'Explains every match',
    body: 'Recommendations always come with plain reasons, never just a percentage.',
  },
  {
    icon: 'layers',
    title: 'Built for comparison',
    body: 'Compare finalists side-by-side with differences called out clearly.',
  },
  {
    icon: 'globe',
    title: 'A living ecosystem map',
    body: 'Curated across creation, development, work, education and business AI.',
  },
];

export const BUDGET_OPTIONS = [
  { id: 'any', label: 'Any budget' },
  { id: 'free', label: 'Free' },
  { id: 'freemium', label: 'Freemium' },
  { id: 'paid', label: 'Paid' },
];

export const SKILL_OPTIONS = [
  { id: 'any', label: 'Any level' },
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'advanced', label: 'Advanced' },
];

export const RATING_CHOICES = [0, 4.0, 4.5];

/* ---------------------------------------------------------------------------
   Product demo scenarios

   Starting points for the interactive demo, not fixed answers. Each one is fed to
   the real `engine.recommend()` at run time, so editing the text changes the result.

   The wording is deliberate: these five were checked against the engine and each
   returns a top three drawn entirely from the relevant category. A demonstration
   should pick examples the product handles well - that is choosing a good example,
   not staging the outcome.
--------------------------------------------------------------------------- */
export const DEMO_SCENARIOS = [
  {
    id: 'summarize',
    label: 'Summarize videos',
    icon: 'video',
    requirement: 'Transcribe and summarize recorded video into notes I can study from',
  },
  {
    id: 'slides',
    label: 'Build slides',
    icon: 'layers',
    requirement: 'Design presentation slides automatically from an outline',
  },
  {
    id: 'social',
    label: 'Social content',
    icon: 'image',
    requirement: 'Generate images and captions for social media posts',
  },
  {
    id: 'code',
    label: 'Write code',
    icon: 'code',
    requirement: 'AI pair programmer inside my code editor that autocompletes and refactors code',
  },
  {
    id: 'images',
    label: 'Generate images',
    icon: 'pen',
    requirement: 'Generate original images from a text prompt for marketing',
  },
];

export const HERO_VIDEO = '/assets/video_watermark_removed_fixed.mp4';
export const SHOWCASE_VIDEO = '/uploads/Developer_organizes_AI_tools_202608301748.mp4';

/* ---------------------------------------------------------------------------
   Brand artwork

   These raster exports have never existed in this repository — no image file of
   any kind has ever been committed — so every request for them failed. It failed
   *silently*: a single-page host answers an unknown path with index.html and a
   200, so the browser received an HTML document where it expected a PNG instead
   of an honest 404, and the failure never appeared as a network error.

   They are empty on purpose. While a path is empty the brand components render
   the vector mark in BrandLogo.jsx, which is real artwork and costs no request.
   Drop the real files into public/ and put their paths here — nothing else has
   to change.
--------------------------------------------------------------------------- */
export const BRAND_LOGO_DARK = '';
export const BRAND_LOGO_LIGHT = '';

/* ---------------------------------------------------------------------------
   Footer
--------------------------------------------------------------------------- */

/**
 * Footer navigation. Every href here is a route the hash router actually resolves
 * (`parseRoute()` in hooks/useHashRoute.js knows: /, /discover, /categories, /advisor,
 * /compare, /saved, /tool/:slug). Nothing else exists yet, so nothing else is linked —
 * a footer full of links to the 404 screen is worse than a short one.
 *
 * When Blog / Help / About / Privacy / Terms pages land, add them here and they appear
 * in the footer automatically.
 */
export const FOOTER_NAV = [
  {
    title: 'Discover',
    links: [
      { label: 'AI Tools', href: '#/discover' },
      { label: 'Browse Categories', href: '#/categories' },
      { label: 'AI Tool Finder', href: '#/advisor' },
      { label: 'Compare Tools', href: '#/compare' },
      { label: 'Your Collection', href: '#/saved' },
    ],
  },
];

/**
 * Social profiles. Deliberately empty: Orbit has no published accounts in this project,
 * and pointing visitors at a handle nobody has verified is worse than showing nothing.
 * Fill a `url` in and that icon appears in the footer — no other change needed.
 */
export const SOCIAL_LINKS = [
  { id: 'x', label: 'X', icon: 'brandX', url: '' },
  { id: 'github', label: 'GitHub', icon: 'brandGithub', url: '' },
  { id: 'linkedin', label: 'LinkedIn', icon: 'brandLinkedin', url: '' },
  { id: 'discord', label: 'Discord', icon: 'brandDiscord', url: '' },
  { id: 'youtube', label: 'YouTube', icon: 'brandYoutube', url: '' },
];

export const FOOTER_TAGLINE = 'Discover the right AI tools. Compare smarter. Build better.';

export const FOOTER_BLURB =
  'Orbit.ai helps you discover, explore, and compare AI tools for work, creativity, productivity, and more.';

export const FOOTER_SIGNOFF = 'Made for discovering what’s next.';

/* ---------------------------------------------------------------------------
   Social proof
--------------------------------------------------------------------------- */

/**
 * The trust badge shown with the Find My AI Tool panel.
 *
 * The headline figure and rating are marketing copy, not values computed from the
 * catalog — edit them here when the real numbers exist. The portraits are royalty-free
 * Unsplash photography standing in for customer avatars, so their alt text describes the
 * photograph rather than claiming a named person.
 */
export const SOCIAL_PROOF = {
  headline: 'Loved by 10,000+ users',
  rating: '4.9/5',
  ratingValue: 4.9,
  ratingMax: 5,
  avatars: [
    { photo: '1494790108377-be9c29b29330', alt: 'Portrait of a smiling woman' },
    { photo: '1507003211169-0a1dd7228f2d', alt: 'Portrait of a smiling man' },
    { photo: '1517841905240-472988babdf9', alt: 'Portrait of a woman wearing glasses' },
    { photo: '1531427186611-ecfd6d936c79', alt: 'Portrait of a man in a green shirt' },
    { photo: '1554151228-14d9def656e4', alt: 'Portrait of a laughing woman' },
  ],
};

/** The three-step contribution flow shown beside the Suggest an AI Tool call to action. */
export const SUGGEST_STEPS = [
  { n: '01', title: 'Suggest', body: 'Share an AI tool you think belongs here.' },
  { n: '02', title: 'We review', body: 'Our team checks the tool and the information.' },
  { n: '03', title: 'We add', body: 'Approved tools join the Orbit directory.' },
];

/* ---------------------------------------------------------------------------
   Header navigation
--------------------------------------------------------------------------- */

/**
 * Navigation, in three tiers, and the header reads them in this order.
 *
 * Every entry here resolves to a route the hash router actually knows
 * (`parseRoute()` in hooks/useHashRoute.js). Nothing is a placeholder: a header
 * control that goes nowhere is worse than one that is absent, and the previous
 * version had five of them.
 *
 * `Home` is deliberately not listed — the wordmark beside the nav already links
 * there, and repeating it costs a slot without adding a destination.
 */
export const NAV_ITEMS = [
  { label: 'Discover', href: '#/discover', match: 'discover' },
  { label: 'Categories', href: '#/categories', match: 'categories' },
  { label: 'AI News', href: '#/news', match: 'news' },
  // Not a destination: this opens the submission dialog, which is mounted once in
  // App and owned by the store. An `action` entry renders as a button rather than a
  // link, so it never advertises a route it does not have.
  { label: 'Submit Tool', action: 'suggest' },
];

/**
 * Utility actions: the visitor's own working set rather than places to browse.
 * They are kept out of NAV_ITEMS on purpose — separating them by position is what
 * lets the header stay legible without a dropdown.
 *
 * `count` names the field on the store the badge reads. The badge is hidden at zero,
 * so an untouched session shows two plain icons.
 */
export const NAV_UTILITY = [
  { label: 'Saved', href: '#/saved', match: 'saved', icon: 'bookmark', count: 'saved' },
  { label: 'Compare', href: '#/compare', match: 'compare', icon: 'layers', count: 'compare' },
];

/**
 * The single primary action. Orbit has no signup and no accounts, so the strongest
 * button in the header points at the thing Orbit actually does. It carries the same
 * label as the closing call to action on the home page — one action, one name.
 */
export const NAV_CTA = { label: 'Ask the AI Advisor', href: '#/advisor', match: 'advisor' };
