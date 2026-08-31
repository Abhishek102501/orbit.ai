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
    navPadding: isMobile ? '14px 16px' : '16px 40px',
    sidePad: isMobile ? '18px' : '40px',
    sectionGap: isMobile ? '52px' : '76px',
    pagePad: isMobile ? '32px 18px 60px' : '48px 40px 80px',
    footerPad: isMobile ? '36px 18px 24px' : '48px 40px 28px',
    footerDir: isMobile ? 'column' : 'row',
    mobileMenuBtnDisplay: isDesktopNav ? 'none' : 'flex',

    // grids
    catGridCols: isMobile ? 2 : isTablet ? 3 : 4,
    toolGridCols: isMobile ? 1 : isTablet ? 2 : 3,
    howGridCols: isMobile ? 1 : isTablet ? 2 : 4,
    categoriesGridCols: isMobile ? 1 : isTablet ? 2 : 3,
    savedGridCols: isMobile ? 1 : isTablet ? 2 : 3,
    detailGridCols: isMobile ? 1 : 3,
    detailColDir: isMobile ? 'column' : 'row',

    // hero
    heroPad: isMobile ? '40px 18px 0' : '84px 40px 0',
    heroTitleSize: isMobile ? '34px' : isTablet ? '50px' : '56px',
    heroSubSize: isMobile ? '15px' : '18px',
    heroFormDir: isMobile ? 'column' : 'row',
    heroSplitDir: isMobile || isTablet ? 'column' : 'row',
    heroSplitGap: isMobile ? '40px' : '56px',
    heroTextMaxW: isMobile || isTablet ? '640px' : '600px',
    heroTextAlign: isMobile || isTablet ? 'center' : 'left',
    heroSubMarginAuto: isMobile || isTablet,
    heroChipsJustify: isMobile || isTablet ? 'center' : 'flex-start',
    heroVideoDisplay: 'block',
    heroVideoHeight: isMobile ? 220 : isTablet ? 300 : 340,

    // find-my-ai-tool section (sits between the hero and Popular Categories)
    finderPadTop: isMobile ? '56px' : '110px',
    finderPadBottom: isMobile ? '64px' : '104px',
    finderPad: isMobile ? '26px 20px' : '40px 44px',

    // sections
    ctaPad: isMobile ? '32px 22px' : '52px',
    marqueeDuration: isMobile ? '26s' : '38s',
    advisorTitleSize: isMobile ? '24px' : '30px',
    filterAsideWidth: isMobile ? '100%' : '220px',
    discoverLayoutDir: isMobile ? 'column' : 'row',
    compareColDir: isMobile ? 'column' : 'row',
  };
}
