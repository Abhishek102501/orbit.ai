/**
 * Newsletter subscription.
 *
 * This project has no newsletter backend, so there is nothing to call yet. Rather than
 * fake a success state — which would silently drop real addresses — the endpoint is a
 * single constant. Point it at your list provider (Buttondown, ConvertKit, Mailchimp,
 * your own /api/subscribe, …) and the footer form starts working with no other change.
 *
 *   export const NEWSLETTER_ENDPOINT = 'https://api.example.com/subscribe';
 *
 * The request shape is a plain JSON POST of `{ email }`. Adjust `subscribe()` if your
 * provider expects something else.
 */
export const NEWSLETTER_ENDPOINT = null;

/** Deliberately permissive: catches typos and empty input, rejects nothing deliverable. */
export function isValidEmail(value) {
  const email = String(value || '').trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

export class NotConfiguredError extends Error {
  constructor() {
    super('Newsletter signup is not connected yet.');
    this.name = 'NotConfiguredError';
  }
}

/**
 * Resolves on a successful subscription, throws otherwise. The footer renders the
 * thrown `message` verbatim, so keep messages user-facing.
 */
export async function subscribeToNewsletter(email, { signal } = {}) {
  if (!NEWSLETTER_ENDPOINT) throw new NotConfiguredError();

  const response = await fetch(NEWSLETTER_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: String(email).trim() }),
    signal,
  });

  if (!response.ok) {
    throw new Error('That didn’t go through. Please try again in a moment.');
  }

  return true;
}
