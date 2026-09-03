import { useCallback, useEffect, useState } from 'react';

const KNOWN = ['discover', 'categories', 'advisor', 'compare', 'saved', 'news'];

/** Mirrors parseRoute() from the design: #/, #/discover?category=x, #/tool/:slug, … */
export function parseRoute() {
  const hash = (window.location.hash || '#/').replace(/^#/, '');
  const [pathPart, queryPart] = hash.split('?');
  const parts = pathPart.split('/').filter(Boolean);
  const query = {};
  if (queryPart) {
    queryPart.split('&').forEach((kv) => {
      const [k, v] = kv.split('=');
      if (k) query[decodeURIComponent(k)] = decodeURIComponent(v || '');
    });
  }
  if (parts.length === 0) return { name: 'home', params: {}, query };
  if (KNOWN.includes(parts[0])) return { name: parts[0], params: {}, query };
  if (parts[0] === 'tool' && parts[1]) return { name: 'tool', params: { slug: parts[1] }, query };
  return { name: 'notfound', params: {}, query };
}

/**
 * Hash router. `onChange` fires with the new route on every navigation, which the store
 * uses to sync the Discover category filter from `?category=`.
 */
export function useHashRoute(onChange) {
  const [route, setRoute] = useState(parseRoute);

  useEffect(() => {
    const onHashChange = () => {
      const next = parseRoute();
      setRoute(next);
      if (onChange) onChange(next);
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [onChange]);

  const go = useCallback((hash) => {
    window.location.hash = hash;
  }, []);

  return { route, go };
}
