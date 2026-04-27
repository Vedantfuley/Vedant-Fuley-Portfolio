import { useState } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Socials from './components/Socials';
import ContactSection from './components/ContactSection';
import ContactDialog from './components/ContactDialog';
import Footer from './components/Footer';
import SpaceCanvas from './components/SpaceCanvas';
import SideDecorations from './components/SideDecorations';
import useScrollReveal from './hooks/useScrollReveal';
import useSparkle from './hooks/useSparkle';
import usePortfolioData from './hooks/usePortfolioData';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const portfolioData = usePortfolioData();
  useScrollReveal();
  useSparkle();

  const openContact = () => setDialogOpen(true);

  return (
    <>
      {/* Space background canvas */}
      <SpaceCanvas />
      {/* Side constellation decorations (desktop/tablet only) */}
      <SideDecorations />

      {/* ── DEBUG BADGE — remove after confirming Supabase works ── */}
      {import.meta.env.DEV && (
        <div style={{
          position: 'fixed', bottom: '1rem', right: '1rem',
          zIndex: 9999, padding: '0.4rem 0.9rem',
          borderRadius: '100px', fontSize: '0.75rem', fontFamily: 'monospace',
          fontWeight: 600, border: '1px solid',
          background: portfolioData.loading
            ? 'rgba(255,200,0,0.1)'
            : portfolioData.source === 'supabase'
              ? 'rgba(104,211,145,0.12)'
              : 'rgba(252,129,129,0.12)',
          borderColor: portfolioData.loading ? '#f6c90e'
            : portfolioData.source === 'supabase' ? '#68d391' : '#fc8181',
          color: portfolioData.loading ? '#f6c90e'
            : portfolioData.source === 'supabase' ? '#68d391' : '#fc8181',
        }}>
          {portfolioData.loading
            ? '⏳ fetching from supabase...'
            : portfolioData.source === 'supabase'
              ? '✅ data from supabase'
              : '⚠ using fallback data'}
        </div>
      )}

      <Navbar onContactClick={openContact} profile={portfolioData.profile} />
      <main>
        <Hero onContactClick={openContact} profile={portfolioData.profile} />
        <About profile={portfolioData.profile} skills={portfolioData.skills} education={portfolioData.education} />
        <Experience experience={portfolioData.experience} />
        <Projects projects={portfolioData.projects} />
        <Socials socials={portfolioData.socials} />
        <ContactSection onContactClick={openContact} />
      </main>
      <Footer profile={portfolioData.profile} />
      <ContactDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} profile={portfolioData.profile} />
    </>
  );
}

export default App;
