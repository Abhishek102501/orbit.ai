import { useMemo } from 'react';
import Icon from '../components/Icon.jsx';
import Hoverable from '../components/Hoverable.jsx';
import AutoVideo from '../components/AutoVideo.jsx';
import ToolCard from '../components/ToolCard.jsx';
import { MarqueeCategoryCard } from '../components/CategoryCard.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import {
  EXAMPLE_PROMPTS,
  HOW_STEPS,
  WHY_POINTS,
  HERO_VIDEO,
  SHOWCASE_VIDEO,
} from '../lib/content.js';

function SectionHeading({ title, action }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}
    >
      <h2 style={{ fontSize: 26, margin: 0 }}>{title}</h2>
      {action}
    </div>
  );
}

export function Home() {
  const {
    c,
    layout,
    heroQuery,
    setHeroQuery,
    setAdvisorText,
    go,
    TOOLS,
    CATEGORIES,
    countByCategory,
    buildCard,
  } = useOrbit();

  const finderReveal = useReveal();
  const categoriesReveal = useReveal();
  const trendingReveal = useReveal();
  const featuredReveal = useReveal();
  const showcaseReveal = useReveal();
  const howReveal = useReveal();
  const whyReveal = useReveal();
  const ctaReveal = useReveal();

  const marqueeCategories = useMemo(() => [...CATEGORIES, ...CATEGORIES], [CATEGORIES]);

  const trendingTools = useMemo(
    () => [...TOOLS].sort((a, b) => b.reviewCount - a.reviewCount).slice(0, 3).map(buildCard),
    [TOOLS, buildCard],
  );

  const featuredTools = useMemo(
    () =>
      TOOLS.filter((t) => t.skillLevel === 'beginner' && t.rating >= 4.4)
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 3)
        .map(buildCard),
    [TOOLS, buildCard],
  );

  const onHeroSubmit = (e) => {
    e.preventDefault();
    setAdvisorText(heroQuery);
    go('#/advisor');
  };

  /** Stand-in shown only if the hero .mp4 is missing or fails to decode. */
  const previewPanel = (
    <div
      style={{
        width: '100%',
        height: layout.heroVideoHeight,
        background: c.preview,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: c.ink(0.6),
        fontSize: 12,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
      }}
    >
      Product preview
    </div>
  );

  const section = (reveal) => ({
    maxWidth: 1160,
    margin: '0 auto',
    padding: `0 ${layout.sidePad} ${layout.sectionGap}`,
    ...reveal.style,
  });

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section data-screen-label="Home" style={{ position: 'relative', overflow: 'hidden', padding: layout.heroPad }}>
        <div
          style={{
            position: 'relative',
            zIndex: 1,
            maxWidth: 1240,
            margin: '0 auto',
            display: 'flex',
            flexDirection: layout.heroSplitDir,
            alignItems: 'center',
            gap: layout.heroSplitGap,
          }}
        >
          <div
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              maxWidth: layout.heroTextMaxW,
              textAlign: layout.heroTextAlign,
            }}
          >
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: c.accentText,
                border: `1px solid ${c.accentBorder}`,
                background: c.accentSoft,
                padding: '6px 14px',
                borderRadius: 20,
                marginBottom: 24,
                animation: 'fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.04s both',
              }}
            >
              <Icon name="sparkle" size={13} />
              Your AI discovery platform
            </div>

            <h1
              style={{
                fontFamily: 'Inter',
                fontWeight: 800,
                fontSize: layout.heroTitleSize,
                lineHeight: 1.02,
                letterSpacing: '-0.038em',
                margin: '0 0 22px',
              }}
            >
              <span
                style={{
                  display: 'block',
                  animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.12s both',
                }}
              >
                Find the right AI.
              </span>
              <span
                style={{
                  display: 'block',
                  color: c.ink(0.55),
                  animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.24s both',
                }}
              >
                Not just another AI.
              </span>
            </h1>

            <p
              style={{
                fontSize: layout.heroSubSize,
                lineHeight: 1.62,
                color: c.ink(0.62),
                margin: 0,
                maxWidth: 520,
                marginLeft: layout.heroSubMarginAuto ? 'auto' : undefined,
                marginRight: layout.heroSubMarginAuto ? 'auto' : undefined,
                animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.38s both',
              }}
            >
              Tell Orbit what you&apos;re trying to accomplish. Discover, compare, and choose the AI
              tools that actually fit your needs.
            </p>
          </div>

          {/* browser-chrome video panel */}
          <div
            style={{
              flex: 1,
              minWidth: 0,
              width: '100%',
              display: layout.heroVideoDisplay,
              position: 'relative',
              animation: 'mediaIn 1.1s cubic-bezier(0.16,1,0.3,1) 0.3s both',
            }}
          >
            <div
              aria-hidden="true"
              style={{
                position: 'absolute',
                inset: '8% 6%',
                borderRadius: '50%',
                background: 'radial-gradient(closest-side, rgba(145,132,217,0.22), transparent 70%)',
                filter: 'blur(40px)',
                pointerEvents: 'none',
                animation: 'floatGlow 11s ease-in-out infinite',
              }}
            />
            <Hoverable
              style={{
                position: 'relative',
                borderRadius: 18,
                overflow: 'hidden',
                border: '1px solid rgba(145,132,217,0.22)',
                boxShadow: `0 0 0 1px ${c.ring}, ${c.shadowLg}`,
                transition:
                  'transform 0.6s cubic-bezier(0.16,1,0.3,1), box-shadow 0.6s cubic-bezier(0.16,1,0.3,1)',
              }}
              hoverStyle={{
                transform: 'translateY(-4px)',
                boxShadow: `0 0 0 1px ${c.hoverRing}, ${c.shadowLg}, 0 0 60px rgba(145,132,217,0.16)`,
              }}
            >
              <div
                style={{
                  height: 34,
                  background: c.chrome,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '0 12px',
                  borderBottom: `1px solid ${c.ink(0.08)}`,
                }}
              >
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#e0605a' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dbb15a' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#5aa876' }} />
              </div>

              <AutoVideo
                src={HERO_VIDEO}
                style={{ display: 'block', width: '100%', height: layout.heroVideoHeight, objectFit: 'cover' }}
                fallback={previewPanel}
              />

              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  top: 34,
                  pointerEvents: 'none',
                  boxShadow: c.vignette,
                }}
              />
            </Hoverable>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------- find my ai tool */}
      <section
        ref={finderReveal.ref}
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: `${layout.finderPadTop} ${layout.sidePad} ${layout.finderPadBottom}`,
          ...finderReveal.style,
        }}
      >
        <div
          style={{
            position: 'relative',
            background: c.surface,
            border: `1px solid ${c.accentBorder}`,
            borderRadius: 18,
            padding: layout.finderPad,
            boxShadow: `0 0 0 1px ${c.ring}, ${c.shadowMd}`,
          }}
        >
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 18,
              background:
                'radial-gradient(120% 140% at 50% -20%, rgba(145,132,217,0.12), transparent 60%)',
              pointerEvents: 'none',
            }}
          />
          <div style={{ position: 'relative' }}>
            <h2 style={{ fontSize: 26, margin: '0 0 8px' }}>Find My AI Tool</h2>
            <p style={{ fontSize: 14, color: c.ink(0.6), margin: '0 0 22px' }}>
              What are you trying to accomplish?
            </p>

            <form
              onSubmit={onHeroSubmit}
              style={{
                display: 'flex',
                flexDirection: layout.heroFormDir,
                gap: 10,
                background: c.ink(0.03),
                border: `1px solid ${c.ink(0.14)}`,
                borderRadius: 14,
                padding: 8,
              }}
            >
              <input
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                placeholder="Describe your goal..."
                style={{
                  flex: 1,
                  minWidth: 0,
                  minHeight: 48,
                  padding: '0 16px',
                  fontSize: 15,
                  background: 'transparent',
                  border: 'none',
                  color: c.text,
                  outline: 'none',
                  fontFamily: 'Inter',
                }}
              />
              <button
                type="submit"
                id="heroSendBtn"
                style={{
                  minHeight: 48,
                  padding: '0 22px 0 26px',
                  background: c.accent,
                  border: `1px solid ${c.accent}`,
                  borderRadius: 10,
                  color: c.onAccent,
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  transition: 'box-shadow 0.25s ease',
                }}
              >
                <span className="send-icon-wrap" style={{ display: 'flex' }}>
                  <svg
                    className="send-icon"
                    viewBox="0 0 24 24"
                    width="18"
                    height="18"
                    style={{
                      display: 'block',
                      transformOrigin: 'center center',
                      transition: 'transform 0.3s ease-in-out',
                    }}
                  >
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path
                      fill="currentColor"
                      d="M1.946 9.315c-.522-.174-.527-.455.01-.634l19.087-6.362c.529-.176.832.12.684.638l-5.454 19.086c-.15.529-.455.547-.679.045L12 14l6-8-8 6-8.054-2.685z"
                    />
                  </svg>
                </span>
                <span
                  className="send-label"
                  style={{ display: 'block', marginLeft: 8, transition: 'transform 0.3s ease-in-out' }}
                >
                  Find My AI Tool
                </span>
              </button>
            </form>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 18 }}>
              {EXAMPLE_PROMPTS.map((text) => (
                <button
                  key={text}
                  type="button"
                  onClick={() => setHeroQuery(text)}
                  style={{
                    fontSize: '12.5px',
                    padding: '8px 14px',
                    borderRadius: 20,
                    border: `1px solid ${c.ink(0.14)}`,
                    background: c.ink(0.02),
                    color: c.ink(0.75),
                    cursor: 'pointer',
                  }}
                >
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ popular categories */}
      <section ref={categoriesReveal.ref} style={section(categoriesReveal)}>
        <SectionHeading
          title="Popular Categories"
          action={
            <a href="#/categories" style={{ textDecoration: 'none', fontSize: 13, color: c.accentText }}>
              View all
              <Icon name="chevronRight" size={13} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
            </a>
          }
        />
        <div
          style={{
            position: 'relative',
            overflow: 'hidden',
            margin: `0 -${layout.sidePad}`,
            padding: `0 ${layout.sidePad}`,
          }}
        >
          <div
            id="catMarqueeTrack"
            style={{
              display: 'flex',
              gap: 14,
              width: 'max-content',
              animation: `marqueeScroll ${layout.marqueeDuration} linear infinite`,
            }}
          >
            {marqueeCategories.map((cat, i) => (
              <MarqueeCategoryCard
                key={cat.id + '-' + i}
                category={cat}
                count={countByCategory[cat.id] || 0}
              />
            ))}
          </div>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 70,
              background: `linear-gradient(to right, ${c.bg}, transparent)`,
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              bottom: 0,
              width: 70,
              background: `linear-gradient(to left, ${c.bg}, transparent)`,
              pointerEvents: 'none',
            }}
          />
        </div>
      </section>

      {/* ------------------------------------------------------- trending */}
      <section ref={trendingReveal.ref} style={section(trendingReveal)}>
        <SectionHeading
          title="Trending AI Tools"
          action={
            <a href="#/discover" style={{ textDecoration: 'none', fontSize: 13, color: c.accentText }}>
              See all
              <Icon name="chevronRight" size={13} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
            </a>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.toolGridCols},1fr)`, gap: 16 }}>
          {trendingTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- featured */}
      <section ref={featuredReveal.ref} style={section(featuredReveal)}>
        <SectionHeading
          title="Featured Tools"
          action={
            <span style={{ fontSize: 12, color: c.ink(0.5) }}>
              Editorially selected, beginner friendly
            </span>
          }
        />
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.toolGridCols},1fr)`, gap: 16 }}>
          {featuredTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- showcase */}
      <section ref={showcaseReveal.ref} style={{ ...section(showcaseReveal), textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 11,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: c.accentText,
            border: `1px solid ${c.accentBorder}`,
            background: c.accentSoft,
            padding: '6px 14px',
            borderRadius: 20,
            marginBottom: 18,
          }}
        >
          <Icon name="sparkle" size={13} />
          Product
        </div>
        <h2 style={{ fontSize: 28, margin: '0 0 10px' }}>See Orbit in motion</h2>
        <p
          style={{
            color: c.ink(0.6),
            fontSize: 14,
            margin: '0 auto 30px',
            maxWidth: 520,
          }}
        >
          From a plain-language requirement to a ranked, explained recommendation — watch how Orbit
          organizes the AI ecosystem.
        </p>
        <div
          style={{
            position: 'relative',
            maxWidth: 920,
            margin: '0 auto',
            borderRadius: 18,
            overflow: 'hidden',
            boxShadow: `0 0 0 1px ${c.ring}, ${c.shadowLg}`,
            background: c.surface,
          }}
        >
          <AutoVideo
            src={SHOWCASE_VIDEO}
            style={{ display: 'block', width: '100%', height: 'auto', maxHeight: 520, objectFit: 'cover' }}
            fallback={
              <div
                style={{
                  width: '100%',
                  height: 420,
                  background: c.preview,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: c.ink(0.6),
                  fontSize: 12,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                Product preview
              </div>
            }
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              boxShadow: c.vignetteSoft,
              pointerEvents: 'none',
            }}
          />
        </div>
      </section>

      {/* ----------------------------------------------------- how it works */}
      <section ref={howReveal.ref} style={section(howReveal)}>
        <h2 style={{ fontSize: 26, margin: '0 0 8px', textAlign: 'center' }}>How Orbit Works</h2>
        <p
          style={{
            textAlign: 'center',
            color: c.ink(0.6),
            margin: '0 0 30px',
            fontSize: 14,
          }}
        >
          From requirement to decision in four steps
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.howGridCols},1fr)`, gap: 16 }}>
          {HOW_STEPS.map((s) => (
            <div
              key={s.n}
              style={{
                background: c.surface,
                borderRadius: 10,
                padding: 22,
                boxShadow: `0 0 0 1px ${c.ring}`,
              }}
            >
              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 9,
                  background: c.accentSoftStrong,
                  color: c.accentText,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 14,
                  fontFamily: 'Inter',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                {s.n}
              </div>
              <h3 style={{ fontSize: 16, margin: '0 0 6px' }}>{s.title}</h3>
              <p style={{ fontSize: 13, color: c.ink(0.65), margin: 0, lineHeight: 1.55 }}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------- why orbit */}
      <section ref={whyReveal.ref} style={section(whyReveal)}>
        <h2 style={{ fontSize: 26, margin: '0 0 20px', textAlign: 'center' }}>Why Orbit</h2>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.howGridCols},1fr)`, gap: 16 }}>
          {WHY_POINTS.map((w) => (
            <div
              key={w.title}
              style={{ padding: 22, borderRadius: 10, border: `1px solid ${c.ink(0.1)}` }}
            >
              <span style={{ color: c.accentText, marginBottom: 12, display: 'inline-flex' }}>
                <Icon name={w.icon} size={20} />
              </span>
              <h3 style={{ fontSize: 15, margin: '0 0 6px' }}>{w.title}</h3>
              <p style={{ fontSize: 13, color: c.ink(0.65), margin: 0, lineHeight: 1.55 }}>
                {w.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- cta */}
      <section
        ref={ctaReveal.ref}
        style={{
          maxWidth: 900,
          margin: '0 auto',
          padding: `0 ${layout.sidePad} ${layout.sectionGap}`,
          textAlign: 'center',
          ...ctaReveal.style,
        }}
      >
        <div
          style={{
            background: c.ctaPanel,
            border: `1px solid ${c.accentBorder}`,
            borderRadius: 16,
            padding: layout.ctaPad,
          }}
        >
          <h2 style={{ fontSize: 28, margin: '0 0 12px' }}>Stop guessing. Start matching.</h2>
          <p
            style={{
              color: c.ink(0.68),
              margin: '0 auto 24px',
              fontSize: 14,
              maxWidth: 480,
            }}
          >
            Describe what you need once — Orbit ranks the AI tools that actually fit, and explains why.
          </p>
          <a
            href="#/advisor"
            style={{
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              background: c.accent,
              color: c.onAccent,
              fontWeight: 600,
              padding: '13px 26px',
              borderRadius: 9,
              fontSize: 14,
            }}
          >
            Ask the AI Advisor
            <Icon name="arrowRight" size={14} />
          </a>
        </div>
      </section>
    </>
  );
}

export default Home;
