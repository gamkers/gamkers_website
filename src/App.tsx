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

export default function App() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-void)', color: 'var(--text-secondary)' }}>
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <SectionDivider />
        <About />
        <SectionDivider />
        <Courses />
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