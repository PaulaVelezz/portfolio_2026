import { useState, useRef } from 'react';
import Header from './components/Header';
import BackgroundWave from './components/BackgroundWave';
import CustomCursor from './components/CustomCursor';
import SmoothScroll from './components/SmoothScroll';
import Hero from './pages/Hero';
import About from './pages/About';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import { gsap } from 'gsap';

export default function App() {
  const [page, setPageState] = useState('home');
  const [menuOpen, setMenuOpen] = useState(false);
  const overlayRef = useRef(null);

  // Staged Page Transition Animation (Lusion style curtain slide)
  const changePage = (newPage) => {
    if (newPage === page) return;

    // Trigger overlay timeline
    const tl = gsap.timeline();

    tl.to(overlayRef.current, {
      scaleY: 1,
      transformOrigin: 'bottom left',
      duration: 0.5,
      ease: 'power3.inOut',
      onComplete: () => {
        setPageState(newPage);
        window.scrollTo(0, 0);
      },
    })
    .to(overlayRef.current, {
      scaleY: 0,
      transformOrigin: 'top left',
      duration: 0.5,
      ease: 'power3.inOut',
      delay: 0.1,
    });
  };

  // Render Page Component dynamically based on route state
  const renderPage = () => {
    switch (page) {
      case 'home':
        return <Hero setPage={changePage} />;
      case 'about':
        return <About setPage={changePage} />;
      case 'projects':
        return <Projects setPage={changePage} />;
      case 'detail':
        return <ProjectDetail setPage={changePage} />;
      default:
        return <Hero setPage={changePage} />;
    }
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-x-hidden">
      {/* 1. Global Interactive WebGL Waves */}
      <BackgroundWave />

      {/* 2. Custom Magnetic Cursor Trail */}
      <CustomCursor />

      {/* 3. Global Header Menu Bar */}
      <Header
        currentPage={page}
        setPage={changePage}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />

      {/* 4. Smooth Scroll Page Content Wrapper */}
      <SmoothScroll>
        <main className="relative z-10 w-full">
          {renderPage()}
        </main>
      </SmoothScroll>

      {/* 5. Cinematic Page Transition Overlay Curtain */}
      <div
        ref={overlayRef}
        className="fixed inset-0 w-full h-full bg-[#0d0d0f] z-50 scale-y-0 pointer-events-none"
        style={{ transformOrigin: 'bottom left' }}
      />
    </div>
  );
}
