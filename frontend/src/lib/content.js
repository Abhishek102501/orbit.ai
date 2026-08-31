/** Editorial copy that the design keeps inline. Shared by the hero and the advisor. */
export const EXAMPLE_PROMPTS = [
  'Create a cinematic product video',
  'Build a website without coding',
  'Research a topic with citations',
  'Create a professional presentation',
  'Generate images for social media',
  'Automate repetitive business tasks',
];

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
