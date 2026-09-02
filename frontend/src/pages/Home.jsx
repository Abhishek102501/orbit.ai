import { useMemo, useState } from 'react';
import Icon from '../components/Icon.jsx';
import Hoverable from '../components/Hoverable.jsx';
import HeroVideo from '../components/HeroVideo.jsx';
import PhotoBackdrop from '../components/PhotoBackdrop.jsx';
import ToolFinder from '../components/ToolFinder.jsx';
import SuggestTool from '../components/SuggestTool.jsx';
import AdvisorCTA from '../components/AdvisorCTA.jsx';
import ProductDemo from '../components/ProductDemo.jsx';
import DiscoveryFlow from '../components/DiscoveryFlow.jsx';
import ToolCard from '../components/ToolCard.jsx';
import { MarqueeCategoryCard } from '../components/CategoryCard.jsx';
import StepScroller from '../components/StepScroller.jsx';
import { MatchBar, MatchScore } from '../components/MatchBar.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { PRODUCT_STILL_PHOTO } from '../data/categories.js';
import { HOW_STEPS, WHY_POINTS, HERO_VIDEO, EXAMPLE_PROMPTS } from '../lib/content.js';

function SectionHeading({ title, action }) {
  const { layout } = useOrbit();
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        marginBottom: 20,
      }}
    >
      <h2 style={{ fontSize: layout.sectionTitleSize, margin: 0 }}>{title}</h2>
      {action}
    </div>
  );
}

export function Home() {
  const {
    c,
    layout,
    TOOLS,
    CATEGORIES,
    countByCategory,
    buildCard,
    quickMatch,
  } = useOrbit();

  const categoriesReveal = useReveal();
  const trendingReveal = useReveal();
  const featuredReveal = useReveal();
  const showcaseReveal = useReveal();
  // Holds the pinned step list, so it must not leave a transform behind.
  const howReveal = useReveal(0.12, { fade: true });
  const whyReveal = useReveal();

  const marqueeCategories = useMemo(() => [...CATEGORIES, ...CATEGORIES], [CATEGORIES]);

  // The walkthrough shows Orbit's own output rather than a mock-up: this is the
  // deterministic engine scored against one fixed example requirement, so the number
  // and the reasons on the page are the same ones a visitor would get by typing it.
  const walkthroughQuery = EXAMPLE_PROMPTS[0];
  const walkthrough = useMemo(
    () => (quickMatch ? quickMatch(walkthroughQuery, 1)[0] : null),
    [quickMatch, walkthroughQuery],
  );

  // The category track scrolls continuously for far longer than five seconds
  // alongside the rest of the page, so it needs a control that is not hover —
  // CSS already pauses it on hover, which no keyboard or touch user can reach.
  const [marqueePaused, setMarqueePaused] = useState(false);

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

  /**
   * Stand-in shown only if a product .mp4 is missing or fails to decode. A real
   * photograph rather than a flat gradient, so a missing video degrades to something
   * that still looks like part of the product.
   */
  const productStill = (height) => (
    <div style={{ position: 'relative', width: '100%', height, overflow: 'hidden' }}>
      <PhotoBackdrop
        photo={PRODUCT_STILL_PHOTO}
        alt="A code editor open on a dark screen"
        width={800}
        vivid
      />
      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, boxShadow: c.vignette }} />
    </div>
  );

  // Reveal travel is a class now (see .reveal in index.css), so the section style is
  // pure layout again and no longer varies per section.
  /**
   * The artifact shown beside each step. Steps that have something real to show get
   * it; the others get nothing rather than a placeholder.
   */
  const buildWalkthroughPanel = (index) => {
    if (index === 0) {
      return (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxWidth: 520 }}>
          {EXAMPLE_PROMPTS.slice(0, 3).map((text) => (
            <span
              key={text}
              style={{
                fontSize: 12.5,
                padding: '8px 13px',
                borderRadius: 8,
                border: `1px solid ${c.ink(0.14)}`,
                background: c.ink(0.02),
                color: c.ink(0.7),
              }}
            >
              {text}
            </span>
          ))}
        </div>
      );
    }

    if (!walkthrough) return null;

    if (index === 1) {
      return (
        <div
          style={{
            maxWidth: 460,
            padding: '18px 20px',
            borderRadius: 12,
            border: `1px solid ${c.ink(0.12)}`,
            borderLeft: `2px solid ${c.signal}`,
            background: c.ink(0.03),
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span id="walkthrough-tool" style={{ fontSize: 16, fontWeight: 600 }}>
              {walkthrough.tool.name}
            </span>
            <MatchScore score={walkthrough.score} size="28px" />
          </div>
          <div style={{ marginTop: 14 }}>
            <MatchBar score={walkthrough.score} labelId="walkthrough-tool" height={14} />
          </div>
        </div>
      );
    }

    if (index === 2) {
      const reasons = (walkthrough.reasons || []).slice(0, 3);
      return (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'grid', gap: 8, maxWidth: 460 }}>
          {reasons.map((reason) => (
            <li
              key={reason}
              style={{ display: 'flex', gap: 8, fontSize: 13.5, lineHeight: 1.5, color: c.ink(0.75) }}
            >
              <span aria-hidden="true" style={{ color: c.signal, flex: 'none', marginTop: 1 }}>
                <Icon name="check" size={13} />
              </span>
              {reason}
            </li>
          ))}
        </ul>
      );
    }

    return null;
  };

  const section = () => ({
    maxWidth: 1160,
    margin: '0 auto',
    padding: `0 ${layout.sidePad} ${layout.sectionGap}`,
  });

  return (
    <>
      {/* ---------------------------------------------------------------- hero
          The hero is the product: headline, then the finder itself. Results resolve
          in place below the input, so the first thing a visitor sees Orbit do is the
          one thing Orbit does — score the catalog against a requirement and say why.
          ToolFinder owns everything from the input down. */}
      <section
        data-screen-label="Home"
        style={{ position: 'relative', overflow: 'hidden', padding: layout.heroPad }}
      >
        <div style={{ position: 'relative', zIndex: 1, maxWidth: layout.heroMaxW, margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexDirection: layout.heroSplitDir,
              alignItems: 'flex-start',
              gap: layout.heroSplitGap,
            }}
          >
            <div style={{ flex: '1 1 0', minWidth: 0, width: '100%' }}>
          {/* Announcement pill. Carries the live catalog size rather than a slogan,
              and links to the catalog it is counting. */}
          <Hoverable
            as="a"
            href="#/discover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 9,
              padding: '5px 14px 5px 6px',
              borderRadius: 999,
              border: `1px solid ${c.ink(0.14)}`,
              background: c.ink(0.03),
              textDecoration: 'none',
              color: c.ink(0.75),
              fontSize: 13,
              marginBottom: 26,
              transition: 'border-color 0.2s ease, background-color 0.2s ease, color 0.2s ease',
              animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both',
            }}
            hoverStyle={{ borderColor: c.signal, background: c.signalTrack, color: c.text }}
          >
            <span
              className="num"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                padding: '3px 9px',
                borderRadius: 999,
                background: c.signalTrack,
                color: c.signalInk,
                fontSize: 11,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              {TOOLS.length} tools
            </span>
            Scored across {CATEGORIES.length} categories
            <span aria-hidden="true" style={{ display: 'flex', color: c.ink(0.5) }}>
              <Icon name="arrowRight" size={13} />
            </span>
          </Hoverable>

          <h1
            className="hero-display"
            style={{
              fontWeight: 600,
              fontSize: layout.heroTitleSize,
              lineHeight: 1.0,
              letterSpacing: '-0.022em',
              margin: '0 0 24px',
            }}
          >
            <span
              style={{
                display: 'block',
                animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s both',
              }}
            >
              Find the right AI.
            </span>
            <span
              style={{
                display: 'block',
                color: c.ink(0.78),
                animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both',
              }}
            >
              Not just another AI.
            </span>
          </h1>

          <p
            style={{
              fontSize: layout.heroSubSize,
              lineHeight: 1.5,
              color: c.ink(0.78),
              margin: '0 0 22px',
              maxWidth: 470,
              animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.3s both',
            }}
          >
            Describe the job, not the tool.
            <br />
            Orbit scores the catalog and shows its working.
          </p>

          {/* The reference puts a platform line under its CTA; this is the same slot,
              carrying facts that are true of Orbit rather than a list of app stores. */}
          <p
            style={{
              display: 'flex',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 8,
              fontSize: 12.5,
              color: c.ink(0.58),
              margin: 0,
              animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.36s both',
            }}
          >
            <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
              <Icon name="checkCircle" size={14} />
            </span>
            No account needed
            <span aria-hidden="true" style={{ color: c.ink(0.25) }}>·</span>
            Runs locally
            <span aria-hidden="true" style={{ color: c.ink(0.25) }}>·</span>
            Every match explained
          </p>

            </div>

            <div
              style={{
                position: 'relative',
                flex: `0 1 ${layout.heroMediaBasis}`,
                minWidth: 0,
                width: '100%',
                animation: 'mediaIn 1.1s cubic-bezier(0.16,1,0.3,1) 0.35s both',
              }}
            >
              <div style={{ position: 'relative' }}>
                <HeroVideo
                  src={HERO_VIDEO}
                  label="See Orbit in action"
                  caption="Watch how Orbit helps you find the perfect AI tool"
                  fallback={productStill(320)}
                />
              </div>
            </div>
          </div>

          <div
            style={{
              marginTop: layout.heroFinderGap,
              animation: 'fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.45s both',
            }}
          >
            <ToolFinder />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------ popular categories */}
      <section ref={categoriesReveal.ref} className={categoriesReveal.className} style={section()}>
        <SectionHeading
          title="Popular Categories"
          action={
            <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <Hoverable
                as="button"
                type="button"
                onClick={() => setMarqueePaused((v) => !v)}
                aria-pressed={marqueePaused}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  fontSize: 12,
                  fontFamily: 'Inter, system-ui, sans-serif',
                  padding: '6px 12px',
                  borderRadius: 999,
                  border: `1px solid ${c.ink(0.14)}`,
                  background: 'transparent',
                  color: c.ink(0.65),
                  cursor: 'pointer',
                  transition: 'color 0.2s ease, border-color 0.2s ease, background-color 0.2s ease',
                }}
                hoverStyle={{ color: c.text, borderColor: c.accentBorder, background: c.accentSoft }}
              >
                <Icon name={marqueePaused ? 'play' : 'pause'} size={12} />
                {marqueePaused ? 'Resume Scrolling' : 'Pause Scrolling'}
              </Hoverable>
              <a href="#/categories" style={{ textDecoration: 'none', fontSize: 13, color: c.accentText }}>
                View all
                <Icon name="chevronRight" size={13} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
              </a>
            </span>
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
              animationPlayState: marqueePaused ? 'paused' : 'running',
            }}
          >
            {marqueeCategories.map((cat, i) => (
              <MarqueeCategoryCard
                key={cat.id + '-' + i}
                category={cat}
                count={countByCategory[cat.id] || 0}
                duplicate={i >= CATEGORIES.length}
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
      <section ref={trendingReveal.ref} className={trendingReveal.className} style={section()}>
        <SectionHeading
          title="Trending AI Tools"
          action={
            <a href="#/discover" style={{ textDecoration: 'none', fontSize: 13, color: c.accentText }}>
              See all
              <Icon name="chevronRight" size={13} style={{ display: 'inline-block', verticalAlign: 'middle' }} />
            </a>
          }
        />
        <div
          className="reveal-group"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.toolGridCols},1fr)`, gap: 16 }}
        >
          {trendingTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- featured */}
      <section ref={featuredReveal.ref} className={featuredReveal.className} style={section()}>
        <SectionHeading
          title="Featured Tools"
          action={
            <span style={{ fontSize: 12, color: c.ink(0.5) }}>
              Editorially selected, beginner friendly
            </span>
          }
        />
        <div
          className="reveal-group"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.toolGridCols},1fr)`, gap: 16 }}
        >
          {featuredTools.map((t) => (
            <ToolCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------- showcase */}
      <section
        ref={showcaseReveal.ref}
        className={showcaseReveal.className}
        style={{ ...section(), textAlign: 'center' }}
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
            marginBottom: 18,
          }}
        >
          <Icon name="sparkle" size={13} />
          Product
        </div>
        <h2 style={{ fontSize: layout.sectionTitleSize, margin: '0 0 10px' }}>See Orbit in motion</h2>
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
        <div style={{ maxWidth: 1040, margin: '0 auto' }}>
          <ProductDemo />
        </div>
      </section>

      {/* ----------------------------------------------------- how it works
          Read by scrolling: the step list pins on the left while each step passes
          through on the right. See StepScroller. */}
      <section ref={howReveal.ref} className={howReveal.className} style={section()}>
        <h2
          className="hero-display"
          style={{
            fontWeight: 600,
            fontSize: 'clamp(28px, 3.4vw, 44px)',
            letterSpacing: '-0.02em',
            lineHeight: 1.1,
            margin: '0 0 10px',
            maxWidth: 620,
          }}
        >
          From requirement to decision.
        </h2>
        <p
          style={{
            color: c.ink(0.65),
            margin: '0 0 48px',
            fontSize: 15,
            maxWidth: 520,
            lineHeight: 1.6,
          }}
        >
          Four steps, and the scoring is the same on every one of them.
        </p>

        <StepScroller
          ariaLabel="How Orbit works"
          steps={HOW_STEPS.map((step, i) => ({
            ...step,
            panel: buildWalkthroughPanel(i),
          }))}
        />
      </section>

      {/* ---------------------------------------------------------- why orbit */}
      <section ref={whyReveal.ref} className={whyReveal.className} style={section()}>
        <h2 style={{ fontSize: layout.sectionTitleSize, margin: '0 0 20px', textAlign: 'center' }}>Why Orbit</h2>
        <div
          className="reveal-group"
          style={{ display: 'grid', gridTemplateColumns: `repeat(${layout.howGridCols},1fr)`, gap: 16 }}
        >
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

      {/* ------------------------------------------- closing discovery run
          One environment, not two sections. DiscoveryFlow owns the ground, the
          ambient light, the spacing between the two, and the single measured path
          that runs from the orbital figure down to the first contribution step. */}
      <DiscoveryFlow gap={layout.flowGap}>
        <AdvisorCTA />
        <SuggestTool />
      </DiscoveryFlow>
    </>
  );
}

export default Home;
