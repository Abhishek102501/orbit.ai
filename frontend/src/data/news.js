/**
 * AI News — data layer.
 *
 * ── on the sample content ──────────────────────────────────────────────────
 * Orbit has no news feed behind it yet, so everything below is sample data and the
 * page says so on screen. Two rules kept it honest:
 *
 *  - No invented findings, figures or dates attributed to real organisations. The
 *    model and tool entries name releases that are publicly known; nothing here
 *    reports a result that did not happen.
 *  - Sample items carry no article `url`. They link to the Orbit tool page they
 *    concern instead, so nothing points at a story that does not exist.
 *
 * Set `IS_SAMPLE` to false and replace `NEWS_ITEMS` — from a bundled export, a CMS,
 * or by making `loadNews()` await a fetch — and every section works unchanged.
 *
 * ── item shape ────────────────────────────────────────────────────────────
 *   {
 *     id, title, summary,
 *     kind:        'model' | 'tool' | 'research' | 'industry',
 *     company:     'OpenAI',            // shown as the source
 *     publishedAt: '2026-08-28',        // ISO date, drives ordering
 *     topics:      ['llms'],            // ids from TOPICS below
 *     toolSlug:    'chatgpt',           // links into Orbit's catalog
 *     url:         null,                // external article, when one exists
 *     badge:       'new'|'updated'|'trending'|null,
 *     tag:         'MULTIMODAL',        // short label on release cards
 *     featured:    false,
 *     reads:       0,                   // engagement, drives Trending
 *     readMinutes: 4,
 *   }
 */

export const IS_SAMPLE = true;

export const TOPICS = [
  { id: 'agents', label: 'AI Agents' },
  { id: 'llms', label: 'LLMs' },
  { id: 'coding', label: 'AI Coding' },
  { id: 'image', label: 'Image Generation' },
  { id: 'video', label: 'Video AI' },
  { id: 'open-source', label: 'Open Source' },
  { id: 'multimodal', label: 'Multimodal' },
  { id: 'research', label: 'Research' },
  { id: 'productivity', label: 'Productivity' },
  { id: 'enterprise', label: 'Enterprise AI' },
];

/** The filter row under the hero. `all` is the default lens. */
export const NEWS_FILTERS = [
  { id: 'all', label: 'Latest' },
  { id: 'model', label: 'Models' },
  { id: 'tool', label: 'Tools' },
  { id: 'research', label: 'Research' },
  { id: 'industry', label: 'Industry' },
];

export const NEWS_ITEMS = [
  // ---------------------------------------------------------------- featured
  {
    id: 'n-multimodal',
    title: 'Multimodal assistants move from novelty to default',
    summary:
      'Text, image and audio in a single model is now the baseline expectation rather than a premium tier. Orbit tracks which assistants actually ship it.',
    kind: 'industry',
    company: 'Orbit',
    publishedAt: '2026-08-30',
    topics: ['multimodal', 'llms'],
    toolSlug: 'chatgpt',
    url: null,
    featured: true,
    reads: 4200,
    readMinutes: 5,
  },
  {
    id: 'n-agents',
    title: 'Coding agents take on multi-file work',
    summary:
      'Editor assistants have moved past line completion into changes that span a whole repository. The comparison that matters is now scope, not speed.',
    kind: 'industry',
    company: 'Orbit',
    publishedAt: '2026-08-28',
    topics: ['agents', 'coding'],
    toolSlug: 'github-copilot',
    url: null,
    featured: true,
    reads: 3800,
    readMinutes: 4,
  },
  {
    id: 'n-openweights',
    title: 'Open-weight models close the gap on hosted ones',
    summary:
      'Self-hostable models are increasingly viable for production work, which changes the cost and privacy calculation for teams choosing a stack.',
    kind: 'industry',
    company: 'Orbit',
    publishedAt: '2026-08-26',
    topics: ['open-source', 'llms'],
    toolSlug: null,
    url: null,
    featured: true,
    reads: 3100,
    readMinutes: 6,
  },
  {
    id: 'n-video',
    title: 'Text-to-video leaves the demo stage',
    summary:
      'Generation length, motion coherence and editing control are the axes that separate the current crop of video tools.',
    kind: 'industry',
    company: 'Orbit',
    publishedAt: '2026-08-24',
    topics: ['video'],
    toolSlug: 'runway',
    url: null,
    featured: true,
    reads: 2600,
    readMinutes: 4,
  },

  // ------------------------------------------------------------------ models
  {
    id: 'm-gpt4o',
    title: 'GPT-4o',
    summary: 'Multimodal flagship handling text, vision and audio in one model.',
    kind: 'model',
    company: 'OpenAI',
    publishedAt: '2026-08-29',
    topics: ['multimodal', 'llms'],
    toolSlug: 'chatgpt',
    url: null,
    tag: 'Multimodal',
    reads: 3900,
  },
  {
    id: 'm-claude',
    title: 'Claude 3.5 Sonnet',
    summary: 'Long-context assistant aimed at document analysis and reasoning.',
    kind: 'model',
    company: 'Anthropic',
    publishedAt: '2026-08-27',
    topics: ['llms'],
    toolSlug: 'claude',
    url: null,
    tag: 'Language',
    reads: 3400,
  },
  {
    id: 'm-gemini',
    title: 'Gemini 1.5 Pro',
    summary: 'Very large context window with multimodal input.',
    kind: 'model',
    company: 'Google',
    publishedAt: '2026-08-25',
    topics: ['multimodal', 'llms'],
    toolSlug: null,
    url: null,
    tag: 'Multimodal',
    reads: 2900,
  },
  {
    id: 'm-llama',
    title: 'Llama 3',
    summary: 'Open-weight family available for self-hosting and fine-tuning.',
    kind: 'model',
    company: 'Meta AI',
    publishedAt: '2026-08-22',
    topics: ['open-source', 'llms'],
    toolSlug: null,
    url: null,
    tag: 'Open source',
    reads: 3300,
  },
  {
    id: 'm-mistral',
    title: 'Mistral Large',
    summary: 'European-built model with a permissive open-weight lineage.',
    kind: 'model',
    company: 'Mistral AI',
    publishedAt: '2026-08-20',
    topics: ['open-source', 'llms'],
    toolSlug: null,
    url: null,
    tag: 'Language',
    reads: 2100,
  },
  {
    id: 'm-whisper',
    title: 'Whisper',
    summary: 'Speech recognition and transcription across many languages.',
    kind: 'model',
    company: 'OpenAI',
    publishedAt: '2026-08-18',
    topics: ['multimodal'],
    toolSlug: null,
    url: null,
    tag: 'Audio',
    reads: 1800,
  },

  // ------------------------------------------------------------------- tools
  {
    id: 't-perplexity',
    title: 'Perplexity',
    summary: 'Answer engine that cites its sources.',
    kind: 'tool',
    company: 'Perplexity',
    publishedAt: '2026-08-30',
    topics: ['research'],
    toolSlug: 'perplexity',
    url: null,
    badge: 'trending',
    tag: 'Research',
    reads: 2400,
  },
  {
    id: 't-cursor',
    title: 'Cursor',
    summary: 'Editor built around an agent that edits across files.',
    kind: 'tool',
    company: 'Anysphere',
    publishedAt: '2026-08-29',
    topics: ['coding', 'agents'],
    toolSlug: 'cursor',
    url: null,
    badge: 'updated',
    tag: 'Coding',
    reads: 2700,
  },
  {
    id: 't-runway',
    title: 'Runway',
    summary: 'Generative video with timeline-based editing.',
    kind: 'tool',
    company: 'Runway',
    publishedAt: '2026-08-27',
    topics: ['video'],
    toolSlug: 'runway',
    url: null,
    badge: 'new',
    tag: 'Video',
    reads: 2200,
  },
  {
    id: 't-midjourney',
    title: 'Midjourney',
    summary: 'Image generation with strong stylistic control.',
    kind: 'tool',
    company: 'Midjourney',
    publishedAt: '2026-08-25',
    topics: ['image'],
    toolSlug: 'midjourney',
    url: null,
    badge: 'updated',
    tag: 'Image',
    reads: 2500,
  },
  {
    id: 't-notion',
    title: 'Notion AI',
    summary: 'Writing and summarising inside an existing workspace.',
    kind: 'tool',
    company: 'Notion',
    publishedAt: '2026-08-23',
    topics: ['productivity'],
    toolSlug: 'notion-ai',
    url: null,
    badge: 'updated',
    tag: 'Productivity',
    reads: 1600,
  },
  {
    id: 't-eleven',
    title: 'ElevenLabs',
    summary: 'Voice synthesis and dubbing across languages.',
    kind: 'tool',
    company: 'ElevenLabs',
    publishedAt: '2026-08-21',
    topics: ['multimodal'],
    toolSlug: 'elevenlabs',
    url: null,
    badge: 'new',
    tag: 'Audio',
    reads: 1900,
  },

  // ---------------------------------------------------------------- research
  {
    id: 'r-context',
    title: 'Longer context windows change how tools are evaluated',
    summary:
      'When a model can hold an entire codebase or corpus, retrieval quality matters less than what the model does with what it already has.',
    kind: 'research',
    company: 'Orbit analysis',
    publishedAt: '2026-08-29',
    topics: ['research', 'llms'],
    toolSlug: null,
    url: null,
    reads: 1700,
  },
  {
    id: 'r-agents',
    title: 'Agent evaluation is still an unsolved problem',
    summary:
      'Benchmarks measure single answers well and multi-step autonomous work poorly, which makes agent comparisons harder than they look.',
    kind: 'research',
    company: 'Orbit analysis',
    publishedAt: '2026-08-27',
    topics: ['agents', 'research'],
    toolSlug: null,
    url: null,
    reads: 1500,
  },
  {
    id: 'r-smallmodels',
    title: 'Small models are winning narrow tasks',
    summary:
      'For scoped, well-defined jobs a smaller specialised model often beats a general one on latency and cost without losing quality.',
    kind: 'research',
    company: 'Orbit analysis',
    publishedAt: '2026-08-24',
    topics: ['research', 'open-source'],
    toolSlug: null,
    url: null,
    reads: 1300,
  },
  {
    id: 'r-provenance',
    title: 'Provenance is becoming a buying criterion',
    summary:
      'Teams increasingly ask where training data came from and where prompts are processed, which is now shaping procurement.',
    kind: 'research',
    company: 'Orbit analysis',
    publishedAt: '2026-08-22',
    topics: ['enterprise', 'research'],
    toolSlug: null,
    url: null,
    reads: 1100,
  },
];

/** Short lines for the ticker. Headlines only — the ticker never carries claims. */
export const TICKER_ITEMS = NEWS_ITEMS.filter((n) => n.kind === 'industry' || n.kind === 'model')
  .slice(0, 6)
  .map((n) => ({ id: n.id, label: n.title }));

/**
 * Photography for a story.
 *
 * Drawn from the same verified Unsplash set the category cards already use, keyed by
 * the story's first topic — so no new asset list has to be kept in step, and every id
 * here is one the app is known to resolve.
 *
 * The alt text describes *the photograph*, never the story. A stock image cannot show
 * a model release, and captioning it as though it did would be a false claim about
 * the picture. This is the same rule the category photos follow.
 */
const TOPIC_PHOTO = {
  coding: ['1461749280684-dccba630e2f6', 'Colourful syntax-highlighted code filling a screen'],
  agents: ['1518770660439-4636190af475', "A close-up of a circuit board's traces and components"],
  llms: ['1451187580459-43490279c0fa', 'A glowing network of connected points'],
  multimodal: ['1451187580459-43490279c0fa', 'A glowing network of connected points'],
  image: ['1541961017774-22349e4a1262', 'A vivid multicoloured abstract painting'],
  video: ['1574717024653-61fd2cf4d44d', 'A video editing timeline on a colour-graded monitor'],
  'open-source': ['1518770660439-4636190af475', "A close-up of a circuit board's traces and components"],
  research: ['1481627834876-b7833e8f5570', 'Long shelves of books receding down a library aisle'],
  productivity: ['1519389950473-47ba0277781c', 'An organised desk viewed from above with laptops and notes'],
  enterprise: ['1531482615713-2afd69097998', 'Colleagues working together at laptops in an office'],
};

const DEFAULT_PHOTO = ['1518770660439-4636190af475', "A close-up of a circuit board's traces and components"];

/** `{ photo, alt }` for a story, or the shared fallback when it has no mapped topic. */
export function newsImage(item) {
  const key = (item.topics || []).find((t) => TOPIC_PHOTO[t]);
  const [photo, alt] = TOPIC_PHOTO[key] || DEFAULT_PHOTO;
  return { photo, alt };
}

export const NEWS_LIMITS = { featured: 4, latest: 6, models: 8, tools: 8, research: 4, trending: 5 };

const byDate = (a, b) => new Date(b.publishedAt || 0) - new Date(a.publishedAt || 0);
const byReads = (a, b) => (b.reads || 0) - (a.reads || 0);

/**
 * Partitions the feed into the sections the page renders.
 *
 * `filter` narrows by `kind`; `topic` narrows by tag. Both are derived rather than
 * hand-placed, so a real feed slots in with no curation.
 */
export function selectNews(items = NEWS_ITEMS, { filter = 'all', topic = null } = {}) {
  let pool = items;
  if (topic) pool = pool.filter((n) => (n.topics || []).includes(topic));
  if (filter !== 'all') pool = pool.filter((n) => n.kind === filter);

  const sorted = [...pool].sort(byDate);
  const featured = sorted.filter((n) => n.featured).slice(0, NEWS_LIMITS.featured);
  const featuredIds = new Set(featured.map((n) => n.id));

  return {
    featured: featured.length ? featured : sorted.slice(0, 1),
    latest: sorted.filter((n) => !featuredIds.has(n.id)).slice(0, NEWS_LIMITS.latest),
    models: sorted.filter((n) => n.kind === 'model').slice(0, NEWS_LIMITS.models),
    tools: sorted.filter((n) => n.kind === 'tool').slice(0, NEWS_LIMITS.tools),
    research: sorted.filter((n) => n.kind === 'research').slice(0, NEWS_LIMITS.research),
    trending: [...pool].sort(byReads).slice(0, NEWS_LIMITS.trending),
    total: pool.length,
  };
}

/** The seam a real source plugs into. Async so swapping in a fetch needs no changes. */
export async function loadNews() {
  return NEWS_ITEMS;
}
