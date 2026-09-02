import { useCallback, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import Modal from './Modal.jsx';
import GlassPanel from './GlassPanel.jsx';
import SectionHeader from './SectionHeader.jsx';
import ContributionSteps from './ContributionSteps.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { SUGGEST_STEPS } from '../lib/content.js';
import { LIMITS, submitToolSuggestion, validateSuggestion } from '../lib/suggestions.js';

/** Submit order, so a failed validation focuses the first field that is actually wrong. */
const FIELD_ORDER = [
  'toolName',
  'websiteUrl',
  'category',
  'description',
  'submitterName',
  'submitterEmail',
];

const EMPTY = {
  toolName: '',
  websiteUrl: '',
  category: '',
  description: '',
  submitterName: '',
  submitterEmail: '',
};

/** Shared field chrome so every input in the dialog reads the same. */
function Field({ id, label, icon, required, error, hint, counter, children }) {
  const { c } = useOrbit();
  return (
    <div style={{ display: 'grid', gap: 7 }}>
      <label
        htmlFor={id}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
          fontSize: 12,
          fontWeight: 500,
          color: c.ink(0.78),
        }}
      >
        {icon ? (
          <span style={{ display: 'flex', color: c.ink(0.45) }}>
            <Icon name={icon} size={13} />
          </span>
        ) : null}
        {label}
        {required ? (
          <span aria-hidden="true" style={{ color: c.cons }}>
            *
          </span>
        ) : (
          <span style={{ color: c.ink(0.4), fontWeight: 400 }}>optional</span>
        )}
        {counter ? (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: c.ink(0.42) }}>{counter}</span>
        ) : null}
      </label>
      {children}
      {error ? (
        <span
          id={`${id}-error`}
          style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: c.cons }}
        >
          <Icon name="close" size={11} />
          {error}
        </span>
      ) : hint ? (
        <span id={`${id}-hint`} style={{ fontSize: 11.5, color: c.ink(0.45) }}>
          {hint}
        </span>
      ) : null}
    </div>
  );
}

/**
 * "Suggest an AI Tool": a community entry point that sits between the closing CTA and
 * the footer. Submissions go through `lib/suggestions.js` and are always created with
 * status `pending` — nothing here writes into the live catalog.
 */
export function SuggestTool() {
  const { c, layout, CATEGORIES, TOOLS } = useOrbit();
  // Observer-driven: the timeline steps live inside a clipped panel, where a
  // scroll-driven timeline does not resolve against the viewport.
  const reveal = useReveal(0.12, { observe: true });

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | submitting | done | error
  const [formError, setFormError] = useState('');
  const pending = useRef(false);

  const liveErrors = useMemo(() => validateSuggestion(draft), [draft]);
  // Kept for the resting styling only. The button itself stays enabled until a
  // request actually starts: a submit disabled by validation gives a keyboard or
  // screen-reader user nothing to press and no explanation of what is wrong.
  const complete = Object.keys(liveErrors).length === 0;
  const busy = state === 'submitting';

  const set = (key) => (e) => {
    const { value } = e.target;
    setDraft((d) => ({ ...d, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
    if (state === 'error') {
      setState('idle');
      setFormError('');
    }
  };

  const close = useCallback(() => {
    setOpen(false);
    // Reset a moment later so the dialog does not visibly empty while it animates out.
    setTimeout(() => {
      setDraft(EMPTY);
      setErrors({});
      setState('idle');
      setFormError('');
    }, 180);
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (pending.current) return;

    const found = validateSuggestion(draft);
    if (Object.keys(found).length) {
      setErrors(found);
      // Land the caret on the first problem rather than leaving the user to hunt
      // for the red border — especially when the dialog has scrolled.
      const first = FIELD_ORDER.find((key) => found[key]);
      if (first) {
        const el = document.getElementById(`suggest-${first}`);
        if (el) el.focus();
      }
      return;
    }

    pending.current = true;
    setState('submitting');
    setFormError('');
    try {
      await submitToolSuggestion(draft);
      setState('done');
    } catch (err) {
      setState('error');
      if (err && err.fields) setErrors(err.fields);
      setFormError((err && err.message) || 'Something went wrong. Please try again.');
    } finally {
      pending.current = false;
    }
  };

  const inputStyle = (key) => ({
    width: '100%',
    minHeight: 44,
    padding: '10px 13px',
    fontSize: 14,
    fontFamily: 'Inter',
    background: c.ink(0.03),
    border: `1px solid ${errors[key] ? c.cons : c.ink(0.16)}`,
    borderRadius: 10,
    color: c.text,
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  });

  const describedBy = (key) => (errors[key] ? `suggest-${key}-error` : undefined);

  // Both figures come straight from the loaded catalog rather than being written
  // into the page, so they cannot drift out of date.
  const stats = [
    { value: TOOLS.length, label: 'AI tools listed', icon: 'layers' },
    { value: CATEGORIES.length, label: 'Categories covered', icon: 'grid' },
  ];

  return (
    <section
      ref={reveal.ref}
      className={reveal.className}
      aria-labelledby="suggest-heading"
      style={{
        position: 'relative',
        maxWidth: 1160,
        margin: '0 auto',
        padding: `0 ${layout.sidePad}`,
      }}
    >
      <GlassPanel variant="flow" padding={layout.suggestPad} bloom="right" pattern>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: layout.suggestDir === 'row' ? '1.05fr 0.95fr' : '1fr',
            gap: layout.isMobile ? 36 : 56,
            alignItems: 'center',
          }}
        >
          {/* ------------------------------------------------------------ copy */}
          <div style={{ minWidth: 0 }}>
            <SectionHeader
              eyebrow="Community contribution"
              titleId="suggest-heading"
              title={
                <>
                  Know an AI tool
                  <br />
                  <span className="accent-text">we missed?</span>
                </>
              }
              subtitle="The AI ecosystem is growing every day. Help us keep Orbit ahead by suggesting tools that deserve to be discovered."
              size="clamp(28px, 3vw, 40px)"
              maxWidth={420}
            />

            <Hoverable
              as="button"
              type="button"
              className="tf-cta cta-lift"
              onClick={() => setOpen(true)}
              style={{
                marginTop: 28,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 9,
                minHeight: 48,
                padding: '0 24px',
                // Outlined, not filled. The Advisor block above carries the one
                // filled action on this stretch of the page; a second solid button
                // here would flatten the order between the two sections.
                background: 'transparent',
                border: `1px solid ${c.accent}`,
                borderRadius: 999,
                color: c.accent,
                fontWeight: 600,
                fontSize: 14.5,
                fontFamily: 'Inter',
                cursor: 'pointer',
              }}
              hoverStyle={{ background: c.signalTrack }}
            >
              <Icon name="plus" size={15} />
              Suggest an AI Tool
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={15} />
              </span>
            </Hoverable>

            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12.5,
                color: c.ink(0.55),
                margin: '16px 0 0',
              }}
            >
              <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
                <Icon name="shield" size={13} />
              </span>
              Your suggestion will be reviewed before being added to the directory.
            </p>

            {/* --------------------------------------------------------- metrics */}
            <dl
              style={{
                display: 'flex',
                alignItems: 'stretch',
                flexWrap: 'wrap',
                gap: layout.isMobile ? 22 : 32,
                margin: 0,
                marginTop: layout.isMobile ? 28 : 36,
                paddingTop: layout.isMobile ? 22 : 26,
                borderTop: `1px solid ${c.ink(0.1)}`,
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    display: 'flex',
                    alignItems: 'stretch',
                    gap: layout.isMobile ? 22 : 32,
                  }}
                >
                  {i > 0 && !layout.isMobile ? (
                    <span aria-hidden="true" style={{ width: 1, background: c.ink(0.12) }} />
                  ) : null}
                  {/* Column flex so `order` can put the figure above its label while
                      the markup keeps the term-then-definition order a description
                      list requires. */}
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <dt
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 12.5,
                        color: c.ink(0.6),
                        order: 2,
                      }}
                    >
                      {stat.label}
                    </dt>
                    <dd
                      className="num"
                      style={{
                        margin: '0 0 4px',
                        fontSize: 26,
                        fontWeight: 500,
                        letterSpacing: '-0.02em',
                        lineHeight: 1,
                        color: c.text,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 9,
                      }}
                    >
                      <span aria-hidden="true" style={{ display: 'flex', color: c.signal }}>
                        <Icon name={stat.icon} size={15} />
                      </span>
                      {stat.value}
                    </dd>
                  </div>
                </div>
              ))}
            </dl>
          </div>

          {/* -------------------------------------------------------- timeline */}
          <div style={{ minWidth: 0 }}>
            <ContributionSteps steps={SUGGEST_STEPS} />

            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                color: c.ink(0.5),
                margin: '18px 0 0',
                paddingLeft: 50,
              }}
            >
              <Icon name="sparkle" size={12} />
              Built by AI explorers, improved by the community.
            </p>
          </div>
        </div>
      </GlassPanel>

      {/* ---------------------------------------------------------------- modal */}
      <Modal
        open={open}
        onClose={close}
        labelId="suggest-modal-title"
        title={state === 'done' ? 'Suggestion received' : 'Suggest an AI tool'}
        description={
          state === 'done'
            ? undefined
            : "Found something we don't have yet? Tell us about it."
        }
      >
        {state === 'done' ? (
          <div style={{ marginTop: 24 }}>
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: c.accentSoftStrong,
                color: c.pros,
                marginBottom: 16,
              }}
            >
              <Icon name="checkCircle" size={22} />
            </span>
            <p style={{ fontSize: 14.5, lineHeight: 1.6, color: c.ink(0.72), margin: '0 0 22px' }}>
              Thanks for helping improve Orbit. We&apos;ll review your suggestion and consider
              adding it to the directory.
            </p>
            <Hoverable
              as="button"
              type="button"
              onClick={close}
              style={{
                minHeight: 44,
                padding: '0 22px',
                background: c.accent,
                border: `1px solid ${c.accent}`,
                borderRadius: 10,
                color: c.onAccent,
                fontWeight: 600,
                fontSize: 14,
                fontFamily: 'Inter',
                cursor: 'pointer',
                transition: 'filter 0.2s ease',
              }}
              hoverStyle={{ filter: 'brightness(1.07)' }}
            >
              Done
            </Hoverable>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate style={{ display: 'grid', gap: 16, marginTop: 22 }}>
            <Field id="suggest-toolName" label="AI tool name" icon="sparkle" required error={errors.toolName}>
              <input
                id="suggest-toolName"
                value={draft.toolName}
                onChange={set('toolName')}
                placeholder="e.g. Perplexity…"
                maxLength={LIMITS.toolName}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={errors.toolName ? true : undefined}
                aria-describedby={describedBy('toolName')}
                style={inputStyle('toolName')}
              />
            </Field>

            <Field id="suggest-websiteUrl" label="Website URL" icon="globe" required error={errors.websiteUrl}>
              <input
                id="suggest-websiteUrl"
                type="url"
                inputMode="url"
                value={draft.websiteUrl}
                onChange={set('websiteUrl')}
                placeholder="https://example.com…"
                maxLength={LIMITS.websiteUrl}
                autoComplete="off"
                spellCheck={false}
                aria-invalid={errors.websiteUrl ? true : undefined}
                aria-describedby={describedBy('websiteUrl')}
                style={inputStyle('websiteUrl')}
              />
            </Field>

            <Field id="suggest-category" label="Category" icon="layers" required error={errors.category}>
              <select
                id="suggest-category"
                value={draft.category}
                onChange={set('category')}
                aria-invalid={errors.category ? true : undefined}
                aria-describedby={describedBy('category')}
                style={inputStyle('category')}
              >
                <option value="">Choose a category…</option>
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
                <option value="other">Other</option>
              </select>
            </Field>

            <Field
              id="suggest-description"
              label="Short description"
              icon="edit"
              required
              error={errors.description}
              counter={
                <span className="tabular">
                  {draft.description.length}/{LIMITS.description}
                  <span className="sr-only"> characters used</span>
                </span>
              }
            >
              <textarea
                id="suggest-description"
                value={draft.description}
                onChange={set('description')}
                placeholder="What makes this AI tool worth discovering?…"
                maxLength={LIMITS.description}
                rows={3}
                aria-invalid={errors.description ? true : undefined}
                aria-describedby={describedBy('description')}
                style={{ ...inputStyle('description'), minHeight: 84, resize: 'vertical', lineHeight: 1.5 }}
              />
            </Field>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: layout.isMobile ? '1fr' : '1fr 1fr',
                // Without this the shorter field stretches to the taller one's height and
                // its label and input drift out of line with the pair beside it.
                alignItems: 'start',
                gap: 16,
              }}
            >
              <Field id="suggest-submitterName" label="Your name" icon="user">
                <input
                  id="suggest-submitterName"
                  value={draft.submitterName}
                  onChange={set('submitterName')}
                  placeholder="e.g. Ada Lovelace…"
                  maxLength={LIMITS.submitterName}
                  autoComplete="name"
                  style={inputStyle('submitterName')}
                />
              </Field>

              <Field
                id="suggest-submitterEmail"
                label="Your email"
                icon="mail"
                error={errors.submitterEmail}
                hint="Only used if we need to clarify something."
              >
                <input
                  id="suggest-submitterEmail"
                  type="email"
                  value={draft.submitterEmail}
                  onChange={set('submitterEmail')}
                  placeholder="you@company.com…"
                  maxLength={LIMITS.submitterEmail}
                  autoComplete="email"
                  inputMode="email"
                  spellCheck={false}
                  aria-invalid={errors.submitterEmail ? true : undefined}
                  aria-describedby={
                    errors.submitterEmail ? 'suggest-submitterEmail-error' : 'suggest-submitterEmail-hint'
                  }
                  style={inputStyle('submitterEmail')}
                />
              </Field>
            </div>

            <p role="status" aria-live="polite" style={{ margin: 0, minHeight: 0 }}>
              {formError ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: c.cons }}>
                  <Icon name="close" size={12} />
                  {formError}
                </span>
              ) : null}
            </p>

            <Hoverable
              as="button"
              type="submit"
              className="tf-cta"
              disabled={busy}
              style={{
                minHeight: 48,
                padding: '0 22px',
                background: c.accent,
                border: `1px solid ${c.accent}`,
                borderRadius: 12,
                color: c.onAccent,
                fontWeight: 600,
                fontSize: 14.5,
                fontFamily: 'Inter',
                cursor: busy ? 'progress' : 'pointer',
                // Dimmed while incomplete as a hint, but still pressable — pressing
                // it is what surfaces the inline errors.
                opacity: complete && !busy ? 1 : 0.72,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'filter 0.2s ease, opacity 0.2s ease',
              }}
              hoverStyle={busy ? undefined : { filter: 'brightness(1.07)' }}
            >
              {busy ? (
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
              {busy ? 'Submitting…' : 'Submit Suggestion'}
              {busy ? null : (
                <span className="tf-arrow" style={{ display: 'flex' }}>
                  <Icon name="arrowRight" size={15} />
                </span>
              )}
            </Hoverable>
          </form>
        )}
      </Modal>
    </section>
  );
}

export default SuggestTool;
