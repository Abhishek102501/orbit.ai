import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Hoverable from '../components/Hoverable.jsx';
import Badge from '../components/Badge.jsx';
import ToolLogo from '../components/ToolLogo.jsx';
import PhotoBackdrop from '../components/PhotoBackdrop.jsx';
import SectionHeader from '../components/SectionHeader.jsx';
import OrbitalVisual from '../components/OrbitalVisual.jsx';
import FeaturedCarousel from '../components/news/FeaturedCarousel.jsx';
import NewsTicker from '../components/news/NewsTicker.jsx';
import ScrollRail from '../components/news/ScrollRail.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { IS_SAMPLE, NEWS_FILTERS, TICKER_ITEMS, TOPICS, newsImage, selectNews } from '../data/news.js';
import { faviconUrl, initials as initialsOf } from '../lib/tools.js';

/**
 * AI News — one connected intelligence surface rather than a stack of card grids.
 *
 * The sections share a single page flow: separators and heading rhythm carry the eye
 * from one to the next instead of each becoming its own rounded container. Only the
 * featured story is a panel, because it is the one thing that should dominate.
 *
 * Filtering is derived, never duplicated: the category row and the topic chips both
 * narrow the same call to `selectNews()`, so every section below reflects the current
 * lens without any of them holding their own copy of the feed.
 */
export function News() {
  const { c, layout, TOOLS, CATEGORIES, getToolBySlug } = useOrbit();

  /**
   * A story's logo, resolved from the catalog rather than stored on the item.
   *
   * When a story names a tool Orbit already tracks, the mark comes from that tool's
   * own site through the same favicon path every other logo in the app uses — so the
   * news page cannot drift out of step with the catalog, and no brand asset is copied
   * into this repository. Anything unmatched falls back to initials, which is what
   * <ToolLogo> already does when a favicon fails to load.
   */
  const logoFor = (item) => {
    const tool = item.toolSlug ? getToolBySlug(item.toolSlug) : null;
    return {
      logoUrl: tool ? faviconUrl(tool.website) : '',
      initials: initialsOf(tool ? tool.name : item.company || '?'),
    };
  };
  const [filter, setFilter] = useState('all');
  const [topic, setTopic] = useState(null);

  const feed = useMemo(() => selectNews(undefined, { filter, topic }), [filter, topic]);
  const filtering = filter !== 'all' || !!topic;
  const reset = () => {
    setFilter('all');
    setTopic(null);
  };

  const latestReveal = useReveal(0.12, { observe: true });
  const modelsReveal = useReveal(0.12, { observe: true });
  const toolsReveal = useReveal(0.12, { observe: true });
  const researchReveal = useReveal(0.12, { observe: true });

  const stacked = layout.isMobile || layout.isTablet;
  const sideBySide = stacked ? '1fr' : '1.55fr 0.95fr';

  return (
    <div
      data-screen-label="AI News"
      style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: layout.pagePad,
        animation: 'fadeUp 0.5s cubic-bezier(0.16,1,0.3,1) both',
      }}
    >
      {/* ------------------------------------------------------------- 1. hero */}
      <section
        aria-labelledby="news-heading"
        style={{
          display: 'grid',
          gridTemplateColumns: stacked ? '1fr' : '1.1fr 0.9fr',
          alignItems: 'center',
          gap: stacked ? 8 : 32,
        }}
      >
        <SectionHeader
          eyebrow="AI intelligence"
          titleId="news-heading"
          as="h1"
          title={
            <>
              AI <span className="accent-text">News</span>
            </>
          }
          subtitle="Model releases, tool updates and the shifts shaping how teams pick AI — connected back to the catalog so you can act on them."
          size={layout.pageTitleSize}
          maxWidth={480}
        />
        <div
          style={{
            display: stacked ? 'none' : 'flex',
            justifyContent: 'flex-end',
            marginRight: -40,
          }}
        >
          <OrbitalVisual size={300} />
        </div>
      </section>

      {/* -------------------------------------------------- 2. category filters */}
      <div
        role="group"
        aria-label="Filter news by kind"
        style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '28px 0 26px' }}
      >
        {NEWS_FILTERS.map((f) => {
          const on = filter === f.id;
          return (
            <Hoverable
              as="button"
              key={f.id}
              type="button"
              onClick={() => setFilter(f.id)}
              aria-pressed={on}
              style={{
                padding: '9px 16px',
                borderRadius: 999,
                border: `1px solid ${on ? c.signal : c.ink(0.14)}`,
                background: on ? c.signalTrack : 'transparent',
                color: on ? c.signalInk : c.ink(0.7),
                fontSize: 13,
                fontFamily: 'Inter, system-ui, sans-serif',
                fontWeight: on ? 600 : 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
              }}
              hoverStyle={{ color: c.text, borderColor: c.signal }}
            >
              {f.label}
            </Hoverable>
          );
        })}

        {topic ? (
          <Hoverable
            as="button"
            type="button"
            onClick={() => setTopic(null)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              marginLeft: 'auto',
              padding: '9px 14px',
              borderRadius: 999,
              border: `1px solid ${c.signal}`,
              background: c.signalTrack,
              color: c.signalInk,
              fontSize: 13,
              cursor: 'pointer',
            }}
            hoverStyle={{ color: c.text }}
          >
            {TOPICS.find((t) => t.id === topic)?.label}
            <Icon name="close" size={12} />
          </Hoverable>
        ) : null}
      </div>

      {/* ---------------------------------------------------- 3. featured now */}
      {feed.featured.length ? <FeaturedCarousel key={`${filter}-${topic}`} items={feed.featured} /> : null}

      {/* --------------------------------------------------------- 4. ticker */}
      <div style={{ margin: '22px 0 44px' }}>
        <NewsTicker items={TICKER_ITEMS} />
      </div>

      {/* ----------------------------------- 5. latest stories + trending now */}
      <div style={{ display: 'grid', gridTemplateColumns: sideBySide, gap: stacked ? 40 : 40 }}>
        <section ref={latestReveal.ref} className={latestReveal.className} aria-label="Latest stories">
          <Heading c={c} icon="clock" title="Latest stories" count={feed.latest.length} />
          {feed.latest.length ? (
            <div className="reveal-group" style={{ display: 'grid', gap: 14 }}>
              {feed.latest.map((item) => (
                <StoryCard key={item.id} item={item} c={c} logo={logoFor(item)} />
              ))}
            </div>
          ) : (
            <Empty c={c} line="Nothing matches this filter yet." onReset={filtering ? reset : undefined} />
          )}
        </section>

        <aside aria-label="Trending now">
          <Heading c={c} icon="bolt" title="Trending now" />
          <ol style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 2 }}>
            {feed.trending.map((item, i) => (
              <li key={item.id}>
                <Hoverable
                  as={item.toolSlug ? 'a' : 'div'}
                  href={item.toolSlug ? `#/tool/${item.toolSlug}` : undefined}
                  className="research-row"
                  style={{
                    display: 'flex',
                    gap: 12,
                    padding: '12px 10px',
                    borderRadius: 10,
                    textDecoration: 'none',
                    color: c.text,
                    borderBottom: `1px solid ${c.ink(0.07)}`,
                  }}
                  hoverStyle={{ background: c.ink(0.03) }}
                >
                  <span className="num research-index" style={{ fontSize: 11, color: c.signalInk, flex: 'none', paddingTop: 2 }}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600, lineHeight: 1.35 }}>
                      {item.title}
                    </span>
                    <span style={{ display: 'block', fontSize: 12, color: c.ink(0.55), marginTop: 3 }}>
                      {item.company}
                    </span>
                  </span>
                  <span className="research-go" aria-hidden="true" style={{ marginLeft: 'auto', color: c.signal, flex: 'none' }}>
                    <Icon name="arrowUpRight" size={13} />
                  </span>
                </Hoverable>
              </li>
            ))}
          </ol>
        </aside>
      </div>

      {/* ------------------------------------------------- 6. model releases */}
      <section
        ref={modelsReveal.ref}
        className={modelsReveal.className}
        aria-label="Model releases"
        style={{ marginTop: 52, paddingTop: 40, borderTop: `1px solid ${c.ink(0.09)}` }}
      >
        <Heading c={c} icon="layers" title="Model releases" count={feed.models.length} />
        {feed.models.length ? (
          <ScrollRail ariaLabel="Model releases" itemWidth={240}>
            {feed.models.map((item) => (
              <ReleaseCard key={item.id} item={item} c={c} logo={logoFor(item)} />
            ))}
          </ScrollRail>
        ) : (
          <Empty c={c} line="No model releases under this filter." onReset={filtering ? reset : undefined} />
        )}
      </section>

      {/* -------------------------------------- 7. AI tools & product updates */}
      <section
        ref={toolsReveal.ref}
        className={toolsReveal.className}
        aria-label="AI tools and product updates"
        style={{ marginTop: 48, paddingTop: 40, borderTop: `1px solid ${c.ink(0.09)}` }}
      >
        <Heading
          c={c}
          icon="sparkle"
          title="AI tools & product updates"
          count={feed.tools.length}
          action={
            <Hoverable
              as="a"
              href="#/discover"
              style={{ fontSize: 13, color: c.signalInk, textDecoration: 'none' }}
              hoverStyle={{ color: c.text }}
            >
              Browse all tools →
            </Hoverable>
          }
        />
        {feed.tools.length ? (
          <ScrollRail ariaLabel="Tool updates" itemWidth={250}>
            {feed.tools.map((item) => (
              <ToolCard key={item.id} item={item} c={c} logo={logoFor(item)} />
            ))}
          </ScrollRail>
        ) : (
          <Empty c={c} line="No tool updates under this filter." onReset={filtering ? reset : undefined} />
        )}
      </section>

      {/* --------------------------- 8. research + 9. trending topics ------- */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: sideBySide,
          gap: 40,
          marginTop: 48,
          paddingTop: 40,
          borderTop: `1px solid ${c.ink(0.09)}`,
        }}
      >
        <section ref={researchReveal.ref} className={researchReveal.className} aria-label="Research and breakthroughs">
          <Heading c={c} icon="shield" title="Research & breakthroughs" count={feed.research.length} />
          {feed.research.length ? (
            <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {feed.research.map((item, i) => (
                <li key={item.id} style={{ borderTop: i === 0 ? 'none' : `1px solid ${c.ink(0.08)}` }}>
                  <ResearchRow item={item} index={i + 1} c={c} />
                </li>
              ))}
            </ol>
          ) : (
            <Empty c={c} line="No research entries under this filter." onReset={filtering ? reset : undefined} />
          )}
        </section>

        <aside aria-label="Trending topics">
          <Heading c={c} icon="grid" title="Trending topics" />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {TOPICS.map((t) => {
              const on = topic === t.id;
              return (
                <Hoverable
                  as="button"
                  key={t.id}
                  type="button"
                  onClick={() => setTopic(on ? null : t.id)}
                  aria-pressed={on}
                  style={{
                    padding: '8px 13px',
                    borderRadius: 999,
                    border: `1px solid ${on ? c.signal : c.ink(0.14)}`,
                    background: on ? c.signalTrack : c.ink(0.02),
                    color: on ? c.signalInk : c.ink(0.7),
                    fontSize: 12.5,
                    fontFamily: 'Inter, system-ui, sans-serif',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease',
                  }}
                  hoverStyle={{ color: c.text, borderColor: c.signal }}
                >
                  {t.label}
                </Hoverable>
              );
            })}
          </div>

          <div
            style={{
              marginTop: 26,
              padding: 20,
              borderRadius: 14,
              border: `1px solid ${c.ink(0.12)}`,
              background: c.ink(0.03),
            }}
          >
            <Badge icon="sparkle" tone="signal">
              From the catalog
            </Badge>
            <p style={{ margin: '14px 0 16px', fontSize: 13.5, lineHeight: 1.6, color: c.ink(0.7) }}>
              {TOOLS.length} tools across {CATEGORIES.length} categories, each scored against what
              you actually need.
            </p>
            <Hoverable
              as="a"
              href="#/advisor"
              className="tf-cta"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '11px 18px',
                borderRadius: 999,
                border: `1px solid ${c.accent}`,
                background: 'transparent',
                color: c.accent,
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: 'none',
              }}
              hoverStyle={{ background: c.signalTrack }}
            >
              Ask the AI Advisor
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={14} />
              </span>
            </Hoverable>
          </div>
        </aside>
      </div>

      {IS_SAMPLE ? (
        <p
          role="status"
          style={{
            marginTop: 44,
            paddingTop: 20,
            borderTop: `1px solid ${c.ink(0.1)}`,
            fontSize: 12.5,
            lineHeight: 1.6,
            color: c.ink(0.5),
          }}
        >
          Showing sample data — Orbit does not publish a news feed yet. Entries name publicly
          known releases and link to the catalog rather than to articles. Replace{' '}
          <span className="num">NEWS_ITEMS</span> in{' '}
          <span className="num">src/data/news.js</span> to connect a real source.
        </p>
      ) : null}
    </div>
  );
}

/* --------------------------------------------------------------- pieces */

function Heading({ c, icon, title, count, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '0 0 18px' }}>
      <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
        <Icon name={icon} size={15} />
      </span>
      <h2 style={{ fontSize: 15, fontWeight: 600, margin: 0, letterSpacing: '-0.01em' }}>{title}</h2>
      {count ? (
        <span className="num" style={{ fontSize: 11, color: c.ink(0.45) }}>
          {count}
        </span>
      ) : null}
      {action ? <span style={{ marginLeft: 'auto' }}>{action}</span> : null}
    </div>
  );
}

/**
 * Filters compose, so a category and a topic together can legitimately match nothing
 * — "model releases about AI coding" is an empty set, not a fault. When that happens
 * the reader needs a way out of the corner they filtered themselves into, so the
 * empty state carries the reset rather than just explaining itself.
 */
function Empty({ c, line, onReset }) {
  return (
    <div
      style={{
        padding: '24px 20px',
        borderRadius: 12,
        border: `1px dashed ${c.ink(0.14)}`,
        color: c.ink(0.6),
        fontSize: 13.5,
      }}
    >
      {line}
      {onReset ? (
        <Hoverable
          as="button"
          type="button"
          onClick={onReset}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 7,
            marginTop: 14,
            padding: '9px 15px',
            borderRadius: 999,
            border: `1px solid ${c.ink(0.16)}`,
            background: 'transparent',
            color: c.ink(0.75),
            fontSize: 13,
            fontFamily: 'Inter, system-ui, sans-serif',
            cursor: 'pointer',
            transition: 'color 0.2s ease, border-color 0.2s ease',
          }}
          hoverStyle={{ color: c.text, borderColor: c.signal }}
        >
          <Icon name="close" size={12} />
          Clear filters
        </Hoverable>
      ) : null}
    </div>
  );
}

function Stamp({ c, item }) {
  return (
    <span style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 11.5, color: c.ink(0.5) }}>
      <span className="num">{item.company}</span>
      {item.publishedAt ? (
        <time className="num" dateTime={item.publishedAt}>
          {new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(
            new Date(item.publishedAt),
          )}
        </time>
      ) : null}
    </span>
  );
}

function StoryCard({ item, c, logo }) {
  const href = item.url || (item.toolSlug ? `#/tool/${item.toolSlug}` : null);
  const external = !!item.url;
  const art = newsImage(item);
  return (
    <article
      className="news-card"
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        borderRadius: 14,
        border: `1px solid ${c.ink(0.11)}`,
        background: c.ink(0.02),
      }}
    >
      {/* The photograph is decorative context, not a depiction of the story, so it
          carries an empty alt and the logo beside it does the identifying. */}
      <span
        style={{
          position: 'relative',
          flex: 'none',
          width: 92,
          height: 92,
          borderRadius: 12,
          overflow: 'hidden',
          border: `1px solid ${c.ink(0.09)}`,
          background: c.ink(0.04),
        }}
      >
        <PhotoBackdrop photo={art.photo} alt="" width={200} vivid className="news-art" />
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            background: `linear-gradient(180deg, rgba(${c.bgRgb},0.15), rgba(${c.bgRgb},0.72))`,
          }}
        />
        <span style={{ position: 'absolute', left: 8, bottom: 8 }}>
          <ToolLogo initials={logo.initials} logoUrl={logo.logoUrl} size={26} radius={7} fontSize={10} />
        </span>
      </span>

      <div style={{ minWidth: 0, flex: 1 }}>
        <Stamp c={c} item={item} />
        {href ? (
          <a
            href={href}
            {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : null)}
            style={{
              display: 'block',
              margin: '7px 0 6px',
              fontSize: 15,
              fontWeight: 600,
              lineHeight: 1.35,
              color: c.text,
              textDecoration: 'none',
            }}
          >
            {item.title}
          </a>
        ) : (
          <p style={{ margin: '7px 0 6px', fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
            {item.title}
          </p>
        )}
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.55, color: c.ink(0.62) }}>{item.summary}</p>
      </div>

      <span className="news-go" aria-hidden="true" style={{ color: c.signal, flex: 'none' }}>
        <Icon name="arrowRight" size={15} />
      </span>
    </article>
  );
}

function ReleaseCard({ item, c, logo }) {
  return (
    <article
      className="news-card"
      style={{
        flex: 'none',
        width: 240,
        padding: 16,
        borderRadius: 14,
        border: `1px solid ${c.ink(0.11)}`,
        background: c.ink(0.02),
      }}
    >
      <span className="news-art" style={{ display: 'inline-flex', marginBottom: 12 }}>
        <ToolLogo initials={logo.initials} logoUrl={logo.logoUrl} size={34} radius={9} fontSize={12} />
      </span>
      <p style={{ margin: '0 0 4px', fontSize: 15, fontWeight: 600 }}>{item.title}</p>
      <Stamp c={c} item={item} />
      <p style={{ margin: '10px 0 12px', fontSize: 12.5, lineHeight: 1.5, color: c.ink(0.6) }}>
        {item.summary}
      </p>
      {item.tag ? (
        <span
          className="num"
          style={{
            display: 'inline-flex',
            padding: '4px 9px',
            borderRadius: 6,
            fontSize: 10,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            background: c.ink(0.05),
            color: c.ink(0.6),
          }}
        >
          {item.tag}
        </span>
      ) : null}
    </article>
  );
}

const BADGE_TONE = { new: 'signal', updated: 'neutral', trending: 'accent' };

function ToolCard({ item, c, logo }) {
  const href = item.toolSlug ? `#/tool/${item.toolSlug}` : null;
  return (
    <article
      className="news-card"
      style={{
        flex: 'none',
        width: 250,
        padding: 16,
        borderRadius: 14,
        border: `1px solid ${c.ink(0.11)}`,
        background: c.ink(0.02),
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 12 }}>
        <span className="news-art" style={{ display: 'inline-flex' }}>
          <ToolLogo initials={logo.initials} logoUrl={logo.logoUrl} size={30} radius={8} fontSize={11} />
        </span>
        {item.badge ? (
          <Badge tone={BADGE_TONE[item.badge] || 'neutral'}>{item.badge}</Badge>
        ) : null}
        <span className="news-go" aria-hidden="true" style={{ marginLeft: 'auto', color: c.signal }}>
          <Icon name="arrowUpRight" size={13} />
        </span>
      </div>
      {href ? (
        <a
          href={href}
          style={{ display: 'block', fontSize: 15, fontWeight: 600, color: c.text, textDecoration: 'none' }}
        >
          {item.title}
        </a>
      ) : (
        <p style={{ margin: 0, fontSize: 15, fontWeight: 600 }}>{item.title}</p>
      )}
      <p style={{ margin: '6px 0 10px', fontSize: 12.5, lineHeight: 1.5, color: c.ink(0.6) }}>
        {item.summary}
      </p>
      <Stamp c={c} item={item} />
    </article>
  );
}

function ResearchRow({ item, index, c }) {
  return (
    <Hoverable
      as={item.toolSlug ? 'a' : 'div'}
      href={item.toolSlug ? `#/tool/${item.toolSlug}` : undefined}
      className="research-row"
      style={{
        display: 'flex',
        gap: 16,
        padding: '18px 0',
        textDecoration: 'none',
        color: c.text,
      }}
      hoverStyle={{ background: c.ink(0.02) }}
    >
      <span
        className="num research-index"
        style={{ flex: 'none', fontSize: 12, color: c.ink(0.35), paddingTop: 3 }}
      >
        {String(index).padStart(2, '0')}
      </span>
      <span style={{ minWidth: 0, flex: 1 }}>
        <span
          className="num research-kind"
          style={{
            display: 'block',
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: c.ink(0.45),
            marginBottom: 6,
          }}
        >
          {item.company}
        </span>
        <span style={{ display: 'block', fontSize: 15, fontWeight: 600, lineHeight: 1.35 }}>
          {item.title}
        </span>
        <span style={{ display: 'block', fontSize: 13, lineHeight: 1.55, color: c.ink(0.6), marginTop: 5 }}>
          {item.summary}
        </span>
      </span>
      <span className="research-go" aria-hidden="true" style={{ color: c.signal, flex: 'none', paddingTop: 3 }}>
        <Icon name="arrowRight" size={15} />
      </span>
    </Hoverable>
  );
}

export default News;
