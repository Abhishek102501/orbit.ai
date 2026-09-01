import { useCallback, useMemo, useRef, useState } from 'react';
import Icon from './Icon.jsx';
import Hoverable from './Hoverable.jsx';
import Modal from './Modal.jsx';
import { useReveal } from '../hooks/useReveal.js';
import { useOrbit } from '../store/OrbitProvider.jsx';
import { SUGGEST_STEPS } from '../lib/content.js';
import { LIMITS, submitToolSuggestion, validateSuggestion } from '../lib/suggestions.js';

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
  const reveal = useReveal();

  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [state, setState] = useState('idle'); // idle | submitting | done | error
  const [formError, setFormError] = useState('');
  const pending = useRef(false);

  const liveErrors = useMemo(() => validateSuggestion(draft), [draft]);
  const submittable = Object.keys(liveErrors).length === 0;

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

  return (
    <section
      ref={reveal.ref}
      aria-labelledby="suggest-heading"
      style={{
        maxWidth: 1160,
        margin: '0 auto',
        padding: `0 ${layout.sidePad} ${layout.sectionGap}`,
        ...reveal.style,
      }}
    >
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
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
            background: `radial-gradient(110% 130% at 82% -10%, ${c.accentSoft}, transparent 60%)`,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: layout.suggestDir,
            gap: layout.isMobile ? 28 : 48,
            alignItems: layout.suggestDir === 'row' ? 'center' : 'stretch',
          }}
        >
          {/* ------------------------------------------------------------ copy */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 11,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: c.accentText,
                marginBottom: 14,
              }}
            >
              <Icon name="sparkle" size={12} />
              Community contribution
            </span>

            <h2
              id="suggest-heading"
              style={{
                fontSize: layout.finderTitleSize,
                letterSpacing: '-0.03em',
                lineHeight: 1.15,
                margin: '0 0 10px',
                maxWidth: 460,
              }}
            >
              Know an AI tool we missed?
            </h2>

            <p
              style={{
                fontSize: 14.5,
                lineHeight: 1.6,
                color: c.ink(0.62),
                margin: '0 0 22px',
                maxWidth: 460,
              }}
            >
              The AI ecosystem is growing every day. Help us keep Orbit ahead by suggesting tools
              that deserve to be discovered.
            </p>

            <Hoverable
              as="button"
              type="button"
              className="tf-cta"
              onClick={() => setOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                minHeight: 48,
                padding: '0 22px',
                background: c.accent,
                border: `1px solid ${c.accent}`,
                borderRadius: 12,
                color: c.onAccent,
                fontWeight: 600,
                fontSize: 14.5,
                fontFamily: 'Inter',
                cursor: 'pointer',
                transition: 'filter 0.25s ease',
              }}
              hoverStyle={{ filter: 'brightness(1.07)' }}
            >
              <Icon name="plus" size={15} />
              Suggest an AI Tool
              <span className="tf-arrow" style={{ display: 'flex' }}>
                <Icon name="arrowRight" size={15} />
              </span>
            </Hoverable>

            <p style={{ fontSize: 12.5, color: c.ink(0.5), margin: '14px 0 0' }}>
              Your suggestion will be reviewed before being added to the directory.
            </p>
          </div>

          {/* -------------------------------------------------------- how it works */}
          <div
            style={{
              flex: 'none',
              width: layout.suggestDir === 'row' ? 300 : '100%',
              display: 'grid',
              gap: 10,
            }}
          >
            {SUGGEST_STEPS.map((step) => (
              <div
                key={step.n}
                style={{
                  display: 'flex',
                  gap: 12,
                  padding: '13px 15px',
                  borderRadius: 12,
                  border: `1px solid ${c.ink(0.1)}`,
                  background: c.ink(0.02),
                }}
              >
                <span
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: c.accentText,
                    fontFamily: 'JetBrains Mono, monospace',
                    flex: 'none',
                    paddingTop: 1,
                  }}
                >
                  {step.n}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 13.5, fontWeight: 600 }}>
                    {step.title}
                  </span>
                  <span
                    style={{
                      display: 'block',
                      fontSize: 12.5,
                      lineHeight: 1.5,
                      color: c.ink(0.58),
                      marginTop: 3,
                    }}
                  >
                    {step.body}
                  </span>
                </span>
              </div>
            ))}

            <p
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 7,
                fontSize: 12,
                color: c.ink(0.45),
                margin: '4px 0 0',
              }}
            >
              <Icon name="sparkle" size={12} />
              Built by AI explorers, improved by the community.
            </p>
          </div>
        </div>

        {/* --------------------------------------------------------------- stats */}
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexWrap: 'wrap',
            gap: layout.isMobile ? 22 : 44,
            marginTop: layout.isMobile ? 26 : 34,
            paddingTop: layout.isMobile ? 22 : 26,
            borderTop: `1px solid ${c.ink(0.1)}`,
          }}
        >
          {[
            { value: TOOLS.length, label: 'AI tools listed' },
            { value: CATEGORIES.length, label: 'Categories covered' },
          ].map((stat) => (
            <div key={stat.label}>
              <span style={{ display: 'block', fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {stat.value}
              </span>
              <span style={{ display: 'block', fontSize: 12, color: c.ink(0.55), marginTop: 2 }}>
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>

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
                placeholder="e.g. Perplexity"
                maxLength={LIMITS.toolName}
                autoComplete="off"
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
                placeholder="https://example.com"
                maxLength={LIMITS.websiteUrl}
                autoComplete="off"
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
              counter={`${draft.description.length}/${LIMITS.description}`}
            >
              <textarea
                id="suggest-description"
                value={draft.description}
                onChange={set('description')}
                placeholder="What makes this AI tool worth discovering?"
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
                  placeholder="Optional"
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
                  placeholder="Optional"
                  maxLength={LIMITS.submitterEmail}
                  autoComplete="email"
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
              disabled={!submittable || state === 'submitting'}
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
                cursor: submittable && state !== 'submitting' ? 'pointer' : 'not-allowed',
                opacity: submittable && state !== 'submitting' ? 1 : 0.5,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                transition: 'filter 0.2s ease, opacity 0.2s ease',
              }}
              hoverStyle={submittable && state !== 'submitting' ? { filter: 'brightness(1.07)' } : undefined}
            >
              {state === 'submitting' ? (
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
              {state === 'submitting' ? 'Submitting…' : 'Submit suggestion'}
              {state === 'submitting' ? null : (
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
