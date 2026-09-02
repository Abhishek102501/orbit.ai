import { MOBILE_MAX, TABLET_MAX, DESKTOP_NAV_MIN } from './palette.js';

/**
 * The design computes every responsive value up-front in `renderVals()` from a single
 * viewport width. This reproduces that table exactly so components stay declarative.
 */
export function layoutFor(vw) {
  const isMobile = vw < MOBILE_MAX;
  const isTablet = vw >= MOBILE_MAX && vw < TABLET_MAX;
  const isDesktopNav = vw >= DESKTOP_NAV_MIN;

  return {
    isMobile,
    isTablet,
    isDesktopNav,

    // chrome
    // The header is a floating capsule: the outer padding positions it, the inner
    // padding shapes the pill itself.
    navPadding: isMobile ? '14px 16px' : '16px 40px',
    navOuterPad: isMobile
      ? 'calc(10px + env(safe-area-inset-top)) 14px 10px'
      : 'calc(14px + env(safe-area-inset-top)) 40px 14px',
    navPillPad: isMobile ? '8px 10px 8px 14px' : '7px 8px 7px 18px',
    sidePad: isMobile ? '18px' : '40px',
    sectionGap: isMobile ? '52px' : '76px',
    // The closing run (Advisor -> Community -> Newsletter -> Footer) is one region
    // rather than three sections, so its internal spacing is tighter than the gap
    // used between the browsing sections above it. The connector occupies it.
    flowGap: isMobile ? '44px' : '72px',
    pagePad: isMobile ? '32px 18px 60px' : '48px 40px 80px',
    footerPad: isMobile ? '40px 18px 30px' : isTablet ? '52px 32px 34px' : '60px 40px 36px',
    footerDir: isMobile ? 'column' : 'row',
    // brand | Discover | Categories. On tablet the brand block spans the full row and the
    // two nav landmarks share the one below it.
    footerGridCols: isMobile ? '1fr' : isTablet ? 'repeat(2, minmax(0, 1fr))' : '1.5fr 1fr 1.7fr',
    footerBrandSpan: isTablet ? 'span 2' : 'auto',
    footerCategorySpan: 'auto',
    footerCategoryCols: isMobile ? 2 : isTablet ? 2 : 2,
    footerNewsletterDir: isMobile || isTablet ? 'column' : 'row',
    mobileMenuBtnDisplay: isDesktopNav ? 'none' : 'flex',

    // grids
    catGridCols: isMobile ? 2 : isTablet ? 3 : 4,
    toolGridCols: isMobile ? 1 : isTablet ? 2 : 3,
    howGridCols: isMobile ? 1 : isTablet ? 2 : 4,
    categoriesGridCols: isMobile ? 1 : isTablet ? 2 : 3,
    // Matches the tool card's desktop height (312px in the same 1160 container),
    // so the two card families read as one system. The extra height is what lets
    // the photograph actually show: at the old 211px the scrim covered most of it.
    categoryCardMinH: isMobile ? 260 : isTablet ? 290 : 312,
    savedGridCols: isMobile ? 1 : isTablet ? 2 : 3,
    detailGridCols: isMobile ? 1 : 3,
    detailColDir: isMobile ? 'column' : 'row',

    // hero
    // The hero is the finder: one column, left-aligned, headline straight into the
    // input. It carries its own bottom padding now that the separate "Find My AI
    // Tool" section below it is gone.
    heroPad: isMobile ? '28px 18px 52px' : isTablet ? '52px 40px 72px' : '72px 40px 92px',
    // Matches the header capsule so the hero's left edge lines up with the wordmark.
    heroMaxW: 1240,
    // Copy on the left, the product video on the right; they stack below desktop so
    // neither column gets squeezed. The finder spans the full width underneath both.
    heroSplitDir: isMobile || isTablet ? 'column' : 'row',
    heroSplitGap: isMobile ? '32px' : '48px',
    heroMediaBasis: isMobile || isTablet ? '100%' : '500px',
    heroFinderGap: isMobile ? '36px' : '52px',
    // Fluid between the breakpoints so the 320-430 and 720-1080 ranges scale
    // continuously instead of stepping. The clamp bounds are the sizes the design
    // already used at the small and large ends.
    // A display serif set large is the hero's whole silhouette, so the ceiling is
    // well above the old 56px — at 1440 this lands around 74px.
    heroTitleSize: 'clamp(38px, 5.6vw, 76px)',
    heroSubSize: 'clamp(15.5px, 1.4vw, 19px)',
    pageTitleSize: 'clamp(26px, 3.6vw, 34px)',
    sectionTitleSize: 'clamp(21px, 2.2vw, 26px)',
    heroFormDir: isMobile ? 'column' : 'row',

    // match instrument — the score readout scales with the card it sits in
    matchScoreSize: isMobile ? '34px' : '46px',
    matchScoreSizeAlt: isMobile ? '20px' : '24px',

    // suggest-a-tool panel (still uses the finder panel padding and title size)
    finderPad: isMobile ? '26px 20px' : '40px 44px',
    finderTitleSize: 'clamp(22px, 2.9vw, 32px)',
    // The Suggest section runs copy beside the three-step flow; they stack below tablet.
    suggestDir: isMobile || isTablet ? 'column' : 'row',

    // sections
    ctaPad: isMobile ? '32px 24px' : isTablet ? '40px 38px' : '56px 60px',
    // Advisor CTA: copy left, orbital visual right. Stacks below desktop, where the
    // visual drops under the text rather than competing with it for width.
    ctaSplitDir: isMobile || isTablet ? 'column' : 'row',
    ctaSplitGap: isMobile ? 34 : 48,
    // Larger than the column it sits in: the figure is allowed to run past the panel
    // edge, which is what stops the block reading as a rectangle with contents.
    orbitalSize: isMobile ? 240 : isTablet ? 300 : 380,
    // Asymmetric on purpose — the copy holds the larger share.
    ctaCopyBasis: '1.15fr',
    // Contribution section: copy left, timeline right.
    suggestPad: isMobile ? '32px 24px' : isTablet ? '40px 38px' : '52px 60px',
    marqueeDuration: isMobile ? '26s' : '38s',
    advisorTitleSize: isMobile ? '24px' : '30px',
    filterAsideWidth: isMobile ? '100%' : '220px',
    discoverLayoutDir: isMobile ? 'column' : 'row',
    compareColDir: isMobile ? 'column' : 'row',
  };
}
