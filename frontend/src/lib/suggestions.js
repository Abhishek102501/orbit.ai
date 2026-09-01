/**
 * Tool suggestions from the community.
 *
 * There is no backend in this project, so the submission path is isolated behind one
 * constant and one function — the same shape `newsletter.js` uses. Point the endpoint at
 * a real API and the section starts posting with no other change:
 *
 *   export const SUGGESTION_ENDPOINT = '/api/suggestions';
 *
 * Until then, submissions are queued in the visitor's own browser (`localStorage`) so
 * nothing is silently thrown away and the flow is complete end to end. Note what that
 * means: a queued suggestion never leaves that browser and nobody on the team ever sees
 * it. Wire the endpoint before launch.
 *
 * Nothing here publishes anything. A suggestion is always created with status `pending`;
 * promoting one into the catalog is a separate, deliberate admin step.
 */
export const SUGGESTION_ENDPOINT = null;

const QUEUE_KEY = 'orbit_suggestions';

export const LIMITS = {
  toolName: 60,
  websiteUrl: 200,
  description: 280,
  submitterName: 60,
  submitterEmail: 120,
};

/** Permissive enough for real addresses, strict enough to catch typos. */
export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(value || '').trim());
}

/**
 * Accepts a bare host ("perplexity.ai") as well as a full URL, and returns the
 * normalised absolute URL — or null if it is not something we would ever link to.
 * Only http/https: a `javascript:` or `data:` URL must never survive this.
 */
export function normalizeUrl(value) {
  const raw = String(value || '').trim();
  if (!raw) return null;
  const candidate = /^[a-z][a-z0-9+.-]*:/i.test(raw) ? raw : `https://${raw}`;
  let url;
  try {
    url = new URL(candidate);
  } catch (e) {
    return null;
  }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
  if (!url.hostname.includes('.')) return null;
  return url.href;
}

/**
 * Field-by-field validation. Returns `{}` when the draft is submittable, otherwise a map
 * of field name to the message shown under that field.
 */
export function validateSuggestion(draft) {
  const errors = {};
  const name = String(draft.toolName || '').trim();
  const description = String(draft.description || '').trim();

  if (!name) errors.toolName = 'Enter the name of the tool.';
  else if (name.length > LIMITS.toolName) errors.toolName = `Keep this under ${LIMITS.toolName} characters.`;

  if (!String(draft.websiteUrl || '').trim()) errors.websiteUrl = 'Enter the tool’s website.';
  else if (!normalizeUrl(draft.websiteUrl)) errors.websiteUrl = 'Please enter a valid website URL.';

  if (!draft.category) errors.category = 'Pick the closest category.';

  if (!description) errors.description = 'Tell us what makes it worth discovering.';
  else if (description.length < 10) errors.description = 'A little more detail, please — at least 10 characters.';
  else if (description.length > LIMITS.description) {
    errors.description = `Keep this under ${LIMITS.description} characters.`;
  }

  const email = String(draft.submitterEmail || '').trim();
  if (email && !isValidEmail(email)) errors.submitterEmail = 'That email doesn’t look right.';

  return errors;
}

/** The record shape an API (or an admin table) receives. */
export function buildSuggestion(draft) {
  return {
    toolName: String(draft.toolName || '').trim(),
    websiteUrl: normalizeUrl(draft.websiteUrl),
    category: draft.category,
    description: String(draft.description || '').trim(),
    submitterName: String(draft.submitterName || '').trim() || null,
    submitterEmail: String(draft.submitterEmail || '').trim() || null,
    status: 'pending',
    submittedAt: new Date().toISOString(),
  };
}

function queueLocally(record) {
  try {
    const raw = localStorage.getItem(QUEUE_KEY);
    const queue = raw ? JSON.parse(raw) : [];
    queue.push(record);
    localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-50)));
  } catch (e) {
    /* storage unavailable — the submission still resolves for this session */
  }
}

/** Every suggestion queued in this browser. Useful for an admin view later. */
export function readQueuedSuggestions() {
  try {
    return JSON.parse(localStorage.getItem(QUEUE_KEY) || '[]');
  } catch (e) {
    return [];
  }
}

/**
 * Validates, normalises and submits. Resolves with the stored record, or throws with a
 * user-facing `message` — the modal renders it verbatim.
 */
export async function submitToolSuggestion(draft, { signal } = {}) {
  const errors = validateSuggestion(draft);
  if (Object.keys(errors).length) {
    const err = new Error('Please fix the highlighted fields.');
    err.fields = errors;
    throw err;
  }

  const record = buildSuggestion(draft);

  if (SUGGESTION_ENDPOINT) {
    const response = await fetch(SUGGESTION_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
      signal,
    });
    if (!response.ok) {
      throw new Error('That didn’t go through. Please try again in a moment.');
    }
    return record;
  }

  queueLocally(record);
  return record;
}
