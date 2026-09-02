import { useCallback, useMemo, useRef, useState } from 'react';
import BrandLogo from './BrandLogo.jsx';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import {
  FOOTER_BLURB,
  FOOTER_NAV,
  FOOTER_SIGNOFF,
  FOOTER_TAGLINE,
  SOCIAL_LINKS,
} from '../lib/content.js';
import { isValidEmail, subscribeToNewsletter } from '../lib/newsletter.js';

/** Column heading — the same mono uppercase label the rest of the app uses. */
function ColumnTitle({ children }) {
  const { c } = useOrbit();
  return (
    <h3
      style={{
        fontSize: 11,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        color: c.ink(0.45),
        margin: '0 0 16px',
        fontWeight: 500,
      }}
    >
      {children}
    </h3>
  );
}

/** Footer link with a restrained hover: colour shift plus a 2px nudge. */
function FooterLink({ href, children }) {
  const { c } = useOrbit();
  return (
    <Hoverable
      as="a"
      href={href}
      style={{
        textDecoration: 'none',
        fontSize: 13.5,
        lineHeight: 1.5,
        color: c.ink(0.7),
        display: 'inline-block',
        // index.css styles `nav a` as mono uppercase for the header and the mobile
        // drawer. These are nav landmarks too, so that inherits here — footer link lists
        // want sentence case. Overridden locally rather than by narrowing the global rule.
        fontFamily: 'Inter, system-ui, sans-serif',
        textTransform: 'none',
        letterSpacing: 'normal',
        transition: 'color 0.2s ease, transform 0.2s ease',
      }}
      hoverStyle={{ color: c.accentText, transform: 'translateX(2px)' }}
    >
      {children}
    </Hoverable>
  );
}

function LinkColumn({ title, links, columns = 1, style }) {
  return (
    <nav aria-label={title} style={style}>
      <ColumnTitle>{title}</ColumnTitle>
      <ul
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          rowGap: 11,
          columnGap: 24,
        }}
      >
        {links.map((l) => (
          <li key={l.href + l.label}>
            <FooterLink href={l.href}>{l.label}</FooterLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * A soft accent bloom behind the wordmark. Decorative only — hidden from assistive tech,
 * never takes pointer events, and stays inside the brand column so it reads as a glow on
 * the brand rather than a stray mark near the section rules.
 */
function BrandGlow() {
  const { c, isLight } = useOrbit();
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: -30,
        top: -40,
        width: 240,
        height: 160,
        pointerEvents: 'none',
        background: `radial-gradient(closest-side, ${c.accentGlow}, transparent 72%)`,
        filter: 'blur(28px)',
        opacity: isLight ? 0.7 : 1,
        animation: 'floatGlow 18s ease-in-out infinite',
      }}
    />
  );
}

/**
 * Newsletter form. Validates locally, then hands the address to `subscribeToNewsletter`
 * — see lib/newsletter.js for the single constant that points it at a real list.
 */
function Newsletter() {
  const { c, layout } = useOrbit();
  const [email, setEmail] = useState('');
  const [state, setState] = useState('idle'); // idle | loading | success | error
  const [message, setMessage] = useState('');
  const inputId = 'newsletter-email';
  const statusId = 'newsletter-status';
  const pending = useRef(false);

  const onSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      if (pending.current) return;

      if (!isValidEmail(email)) {
        setState('error');
        setMessage('Enter a valid email address, for example you@company.com.');
        // Put the caret back in the field the message is about.
        const field = document.getElementById(inputId);
        if (field) field.focus();
        return;
      }

      pending.current = true;
      setState('loading');
      setMessage('');
      try {
        await subscribeToNewsletter(email);
        setState('success');
        setMessage('You’re on the list. Check your inbox to confirm.');
        setEmail('');
      } catch (err) {
        setState('error');
        setMessage(err && err.message ? err.message : 'Something went wrong. Please try again.');
      } finally {
        pending.current = false;
      }
    },
    [email, inputId],
  );

  const invalid = state === 'error';
  const loading = state === 'loading';

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      style={{ width: '100%', maxWidth: layout.isMobile ? '100%' : 420 }}
    >
      <label
        htmlFor={inputId}
        style={{
          display: 'block',
          fontSize: 11,
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
          color: c.ink(0.45),
          marginBottom: 10,
        }}
      >
        Email address
      </label>

      <div
        style={{
          display: 'flex',
          flexDirection: layout.isMobile ? 'column' : 'row',
          gap: 8,
          background: c.ink(0.03),
          border: `1px solid ${invalid ? c.cons : c.ink(0.16)}`,
          borderRadius: 12,
          padding: 6,
          transition: 'border-color 0.2s ease',
        }}
      >
        <input
          id={inputId}
          type="email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state !== 'idle') {
              setState('idle');
              setMessage('');
            }
          }}
          placeholder="you@company.com…"
          inputMode="email"
          spellCheck={false}
          aria-invalid={invalid || undefined}
          aria-describedby={statusId}
          disabled={loading}
          style={{
            flex: 1,
            minWidth: 0,
            minHeight: 42,
            padding: '0 14px',
            fontSize: 14,
            background: 'transparent',
            border: 'none',
            color: c.text,
            outline: 'none',
            fontFamily: 'Inter',
          }}
        />
        <Hoverable
          as="button"
          type="submit"
          disabled={loading}
          style={{
            minHeight: 42,
            padding: '0 20px',
            background: c.accent,
            border: `1px solid ${c.accent}`,
            borderRadius: 9,
            color: c.onAccent,
            fontWeight: 600,
            fontSize: 13.5,
            fontFamily: 'Inter',
            cursor: loading ? 'progress' : 'pointer',
            whiteSpace: 'nowrap',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            opacity: loading ? 0.75 : 1,
            transition: 'filter 0.2s ease, opacity 0.2s ease',
          }}
          hoverStyle={loading ? undefined : { filter: 'brightness(1.08)' }}
        >
          {loading ? (
            <span
              aria-hidden="true"
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                border: `2px solid ${c.ink(0.25)}`,
                borderTopColor: c.onAccent,
                animation: 'orbitSpin 0.8s linear infinite',
              }}
            />
          ) : null}
          {loading ? 'Subscribing…' : 'Subscribe'}
        </Hoverable>
      </div>

      {/* One live region covers the validation, error and success copy. */}
      <p
        id={statusId}
        role="status"
        aria-live="polite"
        style={{
          fontSize: 12.5,
          lineHeight: 1.5,
          margin: '10px 0 0',
          minHeight: 18,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: state === 'success' ? c.pros : invalid ? c.cons : c.ink(0.5),
        }}
      >
        {state === 'success' ? <Icon name="checkCircle" size={13} /> : null}
        {message || 'No spam. Unsubscribe anytime.'}
      </p>
    </form>
  );
}

export function Footer() {
  const { c, layout, logoSrc, CATEGORIES } = useOrbit();
  const reveal = useReveal(0.05);

  const socials = useMemo(() => SOCIAL_LINKS.filter((s) => s.url), []);

  // Categories come from the real catalog rather than a hardcoded copy, and each one
  // deep-links into the Discover filter the marquee cards already use.
  const categoryLinks = useMemo(
    () =>
      (CATEGORIES || []).map((cat) => ({
        label: cat.name,
        href: `#/discover?category=${cat.id}`,
      })),
    [CATEGORIES],
  );

  const rule = `1px solid ${c.ink(0.1)}`;

  return (
    <footer
      style={{
        position: 'relative',
        // No top rule and no margin. A hard line plus a gap is what made the footer
        // read as a fourth slab; the surface fading up out of the page ground is
        // enough to mark the change, and the connector above already carries the eye
        // across the boundary.
        marginTop: 0,
        background:
          `linear-gradient(180deg, transparent 0%, rgba(${c.surfaceRgb},0.35) 140px, rgba(${c.surfaceRgb},0.5) 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        ref={reveal.ref}
        className={reveal.className}
        style={{
          maxWidth: 1160,
          margin: '0 auto',
          padding: layout.footerPad,
        }}
      >
        {/* ------------------------------------------------------- newsletter */}
        <section
          aria-labelledby="newsletter-heading"
          style={{
            display: 'flex',
            flexDirection: layout.footerNewsletterDir,
            alignItems: layout.footerNewsletterDir === 'row' ? 'flex-end' : 'stretch',
            justifyContent: 'space-between',
            gap: layout.isMobile ? 24 : 48,
            paddingBottom: layout.isMobile ? 34 : 44,
          }}
        >
          <div style={{ maxWidth: 460 }}>
            <h2
              id="newsletter-heading"
              style={{
                fontSize: layout.isMobile ? 24 : 28,
                letterSpacing: '-0.03em',
                margin: '0 0 10px',
              }}
            >
              Stay ahead of AI.
            </h2>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: c.ink(0.62), margin: 0 }}>
              Get the latest AI tools, trends, and discoveries delivered to your inbox.
            </p>
          </div>
          <Newsletter />
        </section>

        {/* ------------------------------------------------------------ links */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layout.footerGridCols,
            gap: layout.isMobile ? 32 : 40,
            padding: `${layout.isMobile ? 32 : 44}px 0`,
            borderTop: rule,
          }}
        >
          <div style={{ position: 'relative', maxWidth: 340, gridColumn: layout.footerBrandSpan }}>
            <BrandGlow />
            <div style={{ position: 'relative' }}>
              <a
                href="#/"
                aria-label="Orbit.ai — home"
                style={{ display: 'inline-flex', marginBottom: 16 }}
              >
                <BrandLogo
                  src={logoSrc}
                  height={26}
                  glow={c.logoGlow}
                  color={c.text}
                  markColor={c.accentText}
                />
              </a>
              <p
                style={{
                  fontSize: 14,
                  lineHeight: 1.6,
                  color: c.ink(0.78),
                  margin: '0 0 10px',
                  fontWeight: 500,
                }}
              >
                {FOOTER_TAGLINE}
              </p>
              <p style={{ fontSize: 13, lineHeight: 1.65, color: c.ink(0.55), margin: 0 }}>
                {FOOTER_BLURB}
              </p>

              {socials.length ? (
                <ul
                  aria-label="Orbit.ai on social media"
                  style={{
                    listStyle: 'none',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 10,
                    margin: '22px 0 0',
                    padding: 0,
                  }}
                >
                  {socials.map((s) => (
                    <li key={s.id}>
                      <Hoverable
                        as="a"
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Orbit.ai on ${s.label}`}
                        style={{
                          width: 34,
                          height: 34,
                          borderRadius: 9,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: c.ink(0.7),
                          background: c.ink(0.04),
                          border: `1px solid ${c.ink(0.12)}`,
                          transition:
                            'color 0.2s ease, background-color 0.2s ease, border-color 0.2s ease, transform 0.2s ease',
                        }}
                        hoverStyle={{
                          color: c.accentText,
                          background: c.accentSoft,
                          borderColor: c.accentBorder,
                          transform: 'translateY(-2px)',
                        }}
                      >
                        <Icon name={s.icon} size={16} />
                      </Hoverable>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>

          {FOOTER_NAV.map((group) => (
            <LinkColumn key={group.title} title={group.title} links={group.links} />
          ))}

          <LinkColumn
            title="Categories"
            links={categoryLinks}
            columns={layout.footerCategoryCols}
            style={{ gridColumn: layout.footerCategorySpan }}
          />
        </div>

        {/* ------------------------------------------------------- bottom bar */}
        <div
          style={{
            display: 'flex',
            flexDirection: layout.isMobile ? 'column' : 'row',
            alignItems: layout.isMobile ? 'flex-start' : 'center',
            justifyContent: 'space-between',
            gap: 10,
            paddingTop: layout.isMobile ? 24 : 28,
            borderTop: rule,
          }}
        >
          <p style={{ fontSize: 12.5, color: c.ink(0.5), margin: 0 }}>
            © 2026 Orbit.ai. All rights reserved.
          </p>
          <p
            style={{
              fontSize: 12.5,
              color: c.ink(0.4),
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 7,
            }}
          >
            <Icon name="sparkle" size={12} />
            {FOOTER_SIGNOFF}
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
