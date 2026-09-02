import Header from './components/Header.jsx';
import MobileNav from './components/MobileNav.jsx';
import Footer from './components/Footer.jsx';
import Toast from './components/Toast.jsx';
import Splash from './components/Splash.jsx';
import Home from './pages/Home.jsx';
import Discover from './pages/Discover.jsx';
import Categories from './pages/Categories.jsx';
import Advisor from './pages/Advisor.jsx';
import ToolDetail from './pages/ToolDetail.jsx';
import Compare from './pages/Compare.jsx';
import Saved from './pages/Saved.jsx';
import NotFound from './pages/NotFound.jsx';
import { useOrbit } from './store/OrbitProvider.jsx';

const SCREENS = {
  home: Home,
  discover: Discover,
  categories: Categories,
  advisor: Advisor,
  tool: ToolDetail,
  compare: Compare,
  saved: Saved,
  notfound: NotFound,
};

function skipToMain(e) {
  e.preventDefault();
  const main = document.getElementById('main');
  if (!main) return;
  main.focus();
  main.scrollIntoView();
}

export function App() {
  const { ready, c, route } = useOrbit();

  if (!ready) return <Splash />;

  const Screen = SCREENS[route.name] || NotFound;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: c.bg,
        position: 'relative',
        // `clip`, not `hidden`. When one axis is non-visible, the other computes to
        // `auto` — which turns this element into a scroll container and silently
        // breaks `position: sticky` for everything inside it, the header and the
        // pinned step list included. `clip` contains the overflow without
        // establishing a scroll container, so sticky keeps resolving to the viewport.
        overflowX: 'clip',
      }}
    >
      {/* One ambient environment for the whole document. Each section used to paint
          its own ground, which is what made them read as separate slabs; this puts a
          single, very faint light behind all of them so the page changes gradually
          instead of restarting at every container edge. */}
      <div
        aria-hidden="true"
        className="page-ambient"
        style={{
          background:
            `radial-gradient(52% 22% at 78% 63%, ${c.signalGlow}, transparent 70%),`
            + `radial-gradient(60% 20% at 20% 78%, ${c.signalTrack}, transparent 72%),`
            + `radial-gradient(80% 30% at 50% 92%, ${c.accentSoft}, transparent 76%),`
            + `radial-gradient(100% 34% at 50% 100%, rgba(${c.surfaceRgb},0.45), transparent 80%)`,
        }}
      />

      {/* First tab stop on every screen: jumps past the sticky header and the
          primary nav straight to the routed content. The default jump is
          suppressed because the app routes on the hash — `#main` would be parsed
          as a route and land on the 404 screen — so focus is moved directly. */}
      <a className="skip-link" href="#main" onClick={skipToMain}>
        Skip to Main Content
      </a>

      <Header />
      <MobileNav />

      <main id="main" tabIndex={-1} style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Screen />
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default App;
