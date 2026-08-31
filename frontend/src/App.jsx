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
        overflowX: 'hidden',
      }}
    >
      <Header />
      <MobileNav />

      <main style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        <Screen />
      </main>

      <Footer />
      <Toast />
    </div>
  );
}

export default App;
