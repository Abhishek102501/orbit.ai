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

export const HERO_VIDEO = '/assets/video_watermark_removed_fixed.mp4';
export const SHOWCASE_VIDEO = '/uploads/Developer_organizes_AI_tools_202608301748.mp4';

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
 * The primary nav. Items with an `href` point at routes the hash router resolves;
 * items marked `soon` have no destination yet and render as inert buttons rather than
 * links, so nothing in the header can navigate to the 404 screen. Give one an `href`
 * (and a `match` for the active state) and it becomes a real link with no other change.
 */
export const NAV_ITEMS = [
  { label: 'Home', href: '#/', match: 'home' },
  { label: 'Explore', href: '#/discover', match: 'discover' },
  { label: 'Categories', href: '#/categories', match: 'categories' },
  { label: 'Features', soon: true },
  { label: 'Pricing', soon: true },
  { label: 'About', soon: true },
];

/** Header account actions. Same rule: no destination yet, so they are inert buttons. */
export const NAV_ACTIONS = {
  signIn: { label: 'Sign in', soon: true },
  getStarted: { label: 'Get Started', soon: true },
};
