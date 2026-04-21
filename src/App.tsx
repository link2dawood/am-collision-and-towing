import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Services from './pages/Services';
import Towing from './pages/Towing';
import Gallery from './pages/Gallery';
import About from './pages/About';
import Contact from './pages/Contact';
import { Page } from './types';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  // Handle scroll top on page change
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as ScrollBehavior
    });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home setPage={setCurrentPage} />;
      case 'services':
        return <Services />;
      case 'towing':
        return <Towing />;
      case 'gallery':
        return <Gallery />;
      case 'about':
        return <About />;
      case 'contact':
        return <Contact />;
      default:
        return <Home setPage={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-iron text-[#e2e8f0] selection:bg-primary selection:text-white relative overflow-x-hidden">
      <div className="fixed inset-0 blueprint-grid opacity-20 pointer-events-none z-0"></div>
      
      <Navbar currentPage={currentPage} setPage={setCurrentPage} />
      
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {renderPage()}
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer setPage={setCurrentPage} />

      {/* Floating CTA for Tows */}
      <div className="fixed bottom-8 right-8 z-40 hidden sm:block">
        <motion.a
          href="tel:+15551234567"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 bg-primary hover:bg-white text-iron px-6 py-4 rounded-none font-nav font-bold shadow-2xl shadow-primary/20 group uppercase tracking-widest border border-primary"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
          </span>
          24/7 EMERGENCY TOW
        </motion.a>
      </div>
    </div>
  );
}

