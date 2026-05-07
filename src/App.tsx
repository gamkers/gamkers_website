import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Courses from '@/components/Courses';
import Workshops from '@/components/Workshops';
import Leadership from '@/components/Leadership';
import Footer from '@/components/Footer';
import ScrollProgress from '@/components/ScrollProgress';
import CustomCursor from '@/components/CustomCursor';
import SectionDivider from '@/components/SectionDivider';
import Products from '@/components/Products';
import GhostChipPage from '@/components/GhostChipPage';
import Phantom32Page from '@/components/Phantom32Page';

type Page = 'home' | 'ghostchip' | 'phantom32';

function getPageFromHash(): Page {
  const hash = window.location.hash.replace('#', '').toLowerCase();
  if (hash === 'ghostchip') return 'ghostchip';
  if (hash === 'phantom32') return 'phantom32';
  return 'home';
}

export default function App() {
  const [page, setPage] = useState<Page>(getPageFromHash);

  // Sync page state ↔ URL hash
  useEffect(() => {
    const onHashChange = () => setPage(getPageFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (target: 'ghostchip' | 'phantom32') => {
    window.location.hash = target;
    setPage(target);
  };

  const goHome = (targetSection?: string) => {
    setPage('home');
    if (targetSection) {
      window.location.hash = targetSection;
      setTimeout(() => {
        const el = document.getElementById(targetSection);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      window.location.hash = '';
      setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 60);
    }
  };

  const handleLogoClick = () => goHome();

  const handleNavClick = (href: string) => {
    const target = href.replace('#', '');
    if (page !== 'home') {
      goHome(target);
    } else {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (page === 'ghostchip') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-void)', color: 'var(--text-secondary)' }}>
        <ScrollProgress />
        <CustomCursor />
        <Navbar onLogoClick={handleLogoClick} onNavClick={handleNavClick} />
        <GhostChipPage onBack={goHome} />
        <Footer />
      </div>
    );
  }

  if (page === 'phantom32') {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg-void)', color: 'var(--text-secondary)' }}>
        <ScrollProgress />
        <CustomCursor />
        <Navbar onLogoClick={handleLogoClick} onNavClick={handleNavClick} />
        <Phantom32Page onBack={goHome} />
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-void)', color: 'var(--text-secondary)' }}>
      <ScrollProgress />
      <CustomCursor />
      <Navbar onLogoClick={handleLogoClick} onNavClick={handleNavClick} />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Courses />
        <SectionDivider />
        <Products onNavigate={navigate} />
        <SectionDivider />
        <Workshops />
        <SectionDivider />
        <Leadership />
      </main>
      <SectionDivider />
      <Footer />
    </div>
  );
}