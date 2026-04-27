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
