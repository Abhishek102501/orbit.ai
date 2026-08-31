# Orbit.ai — React frontend

A complete React port of the `Orbit.dc.html` Claude Design project. Every screen, style,
animation and interaction from the design is reproduced; the template DSL (`sc-if`,
`sc-for`, `{{ }}` bindings) and the single `DCLogic` state class have been rewritten as
idiomatic React components, hooks and a context store.

## Running it

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production bundle -> dist/
npm run preview  # serve the production build
npm run smoke    # renders every screen and reports failures
```

## Brand assets — one manual step

Five binary files live in the Claude Design project but **could not be exported through
the design API**: `DesignSync.get_file` caps responses at 256 KiB and returns
`truncated: true` for each of them, so only partial data comes back.

Copy these out of the design project and drop them in — no code changes needed:

| Put the file here | Used by |
| --- | --- |
| `public/assets/orbit-logo-full.png` | header, footer, splash (dark theme) |
| `public/assets/orbit-logo-full-light.png` | header, footer (light theme) |
| `public/assets/orbit-mark-icon.png` | splash animation, browser favicon |
| `public/uploads/Developer_organizing_browser_tab..._202608301607.mp4` | hero panel |
| `public/uploads/Developer_organizes_AI_tools_202608301748.mp4` | "See Orbit in motion" |

Until then the app runs and looks right: `BrandLogo` / `BrandMark` fall back to a vector
wordmark at the same pixel height, and `AutoVideo` falls back to the design's own
"Product preview" gradient panel (the same one the light theme uses). Both swap back to
the real files automatically the moment they exist — the fallback is an `onError` handler,
not a code path you have to remove.

> The filename with `...` in it is verbatim from the design — keep it exactly as-is.

## Layout

```
src/
  main.jsx                 entry
  App.jsx                  chrome + screen switch
  index.css                global styles & keyframes, ported verbatim from <helmet>
  store/OrbitProvider.jsx  all shared state (the design's single state object)
  hooks/
    useViewport.js         window width -> responsive table
    useHashRoute.js        #/, #/discover?category=, #/tool/:slug, …
    useReveal.js           one-shot IntersectionObserver scroll reveal
    useHover.js            React stand-in for the design's style-hover attribute
  lib/
    palette.js             DARK / LIGHT colour schemes (the design's `c`)
    layout.js              every responsive value, keyed off viewport width
    card.js                buildCard() — raw tool -> display shape (pure)
    tools.js               initials, favicon, verdict, alternatives, similar, bestOf
    content.js             editorial copy the design keeps inline
  data/                    tools, categories, icons, recommendation engine (unchanged)
  components/              Header, MobileNav, Footer, Toast, Splash, ToolCard,
                           CategoryCard, ToolLogo, BrandLogo, PhotoBackdrop,
                           AutoVideo, Icon, Hoverable
  pages/                   Home, Discover, Categories, Advisor, ToolDetail,
                           Compare, Saved, NotFound
```

`data/` is the design's data-access layer, carried over byte-for-byte — swap it for a real
backend later without touching the UI.

## Notes on fidelity

- **State lives in one place.** The design kept filters, advisor results and the shortlist
  on a single root component, so they survived navigation. `OrbitProvider` does the same;
  page components stay presentational.
- **Inline styles are kept inline.** The design expresses nearly everything as inline
  style strings. Those were carried across as style objects rather than refactored into
  classes, so the rendered output stays comparable to the original.
- **One selector was widened.** The design targets uppercase labels with
  `[style*="text-transform:uppercase"]` to give them the mono face. React serializes
  inline styles *with* a space after the colon, so `index.css` matches both spellings.
  Without this the JetBrains Mono treatment on uppercase labels would silently disappear.
- **`support.js` was not ported.** It is the generated Claude Design canvas runtime (the
  `x-dc` parser and React bridge), not application code — React replaces it wholesale.
- **Persistence.** `orbit_saved`, `orbit_compare`, `orbit_lastCriteria` and `orbit_theme`
  are read and written in localStorage under the same keys as the design, so existing
  browser state carries over.
- **Timings preserved.** 320 ms filter shimmer, 700 ms advisor scoring, 2400 ms toast,
  26 s/38 s marquee, and the full `fadeUp` stagger on the hero.
