import { useCallback, useState } from 'react';
import AmbientField from './components/AmbientField';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Stats from './components/Stats';
import BentoGrid from './components/BentoGrid';
import ScrollStory from './components/ScrollStory';
import UniverseSection from './components/UniverseSection';
import AppShowcase from './components/AppShowcase';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Loader from './components/Loader';
import { useCursorHalo } from './lib/interactions';

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);
  useCursorHalo();

  return (
    <>
      <Loader onDone={handleDone} />
      <AmbientField />
      <div
        className="relative z-10"
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s' }}
      >
        <Nav />
        <main>
          <Hero />
          <Stats />
          <BentoGrid />
          <ScrollStory />
          <UniverseSection />
          <AppShowcase />
          <Contact />
        </main>
        <Footer />
      </div>
    </>
  );
}
