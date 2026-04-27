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
import Loader from './components/Loader';
import useScrollReveal from './hooks/useScrollReveal';
import useSparkle from './hooks/useSparkle';
import usePortfolioData from './hooks/usePortfolioData';

function App() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const portfolioData = usePortfolioData();
  useScrollReveal();
  useSparkle();

  const openContact = () => setDialogOpen(true);

  return (
    <>
      {/* Rocket launch loader */}
      {!loaded && <Loader onDone={() => setLoaded(true)} />}

      {/* Aurora at top */}
      <div className="aurora" aria-hidden="true">
        <div className="aurora-band" />
        <div className="aurora-band" />
      </div>

      {/* Space background canvas */}
      <SpaceCanvas />
      {/* Side constellation decorations (desktop only) */}
      <SideDecorations />

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
