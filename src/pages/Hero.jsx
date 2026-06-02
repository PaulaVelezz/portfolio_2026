import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const ASCII_ART = `
                                       J ] \` x :
                                    z t w   h % B % n
                                  n l j   W Q @ B @ U
                               w b @ % # @ # @ V # # W
                            * \` ( d @ B l d d [ h n ;
                        @ a u n m - | ]   g n J L d x ! U Q
                      _ a A W a @ J b @ l I '   @ k a ; _ } /
                    # & % $ # H q V U n / } + ^    k a _ | '
                   " # # h h # # w p [ x n z t [ ] _  :  - - }  p     Q
                  * a B W d w b A @ } t j c j [ } ]      { .   F     Q
                 k w @ M d W a X L J Y V l c } j > _           .     M f
               v k w & M a w X M r n X J Y f x [ - l :          :     o r
              h J c o o % C o w   [ _ f c C ( ? ? !             v     x
              L ; k @ u M C q f [ { ; - ; Y [ '                 '     Y
             & @ @ @ @ k v f f l {
            ( ? @ @ B B % V L ? \\ \`                            W
            J @ @ @ @ @ B B % W k   J                         W
            X @ @ B B B % B W W = I                           W
           ( ? @ B B B B % W K Y ;                            W
            n t @ @ < ^ ^ - k p Q i                           % 1
           @ z   @ h ^ + l a I C q                            b [
             q J @ } ~ ( C C W                                w w
             J D h @   a @ @                                  & o
            a @ 8 q 8   # # t   I'                            C t
            @ % % % B   # w p   X O }                         B %
            % @ % @ @   b w w & h h Z -                       C ,
            q % B B     q a M W W Q F ;                       I r
            B d - -     a w w w h x ;                         w w
            B d - _     q d Y j p n 1 +                       M N
            @ @ f [     ; [ y c n j ;                         8 N
            @ @ [ 1   ; h k m j +                             & S
            " & [ [     > f > i X                             B W
            # { ~ f f ;                                       B _
            p B % D . .                                       J &
            j o x t '                                         X v
                                                              o }
                             B Q < @ @ @ @ @ ] I ^            v /
                             @ @ % $ W I                    Y j
                             @ @ @ @ @ $ [ W *                k %
                             @ @ B @ Y J X ~                  W W
                            C j I X X v c J .                 W W
                            I > { f z Y r c \\ \`               B w
                            - x { z q x } s -                 w w
                            ~ v \\ | ? + [ n c { +             ) N
                            { ? ' ; l r c Y X n r             ] a
                            ) : " + - v L Q X X [             j 8
                            ~ ; ; n [ v } { f J '             ) W
                            , - r [ Y c [ ? 1 \\ {             ~ l
                            i i - j j Y } [ 1 + 1             -
                            i / x J r C x [ ! " + ? i         '
                            " C I Y 7 Y l r " [ : - ~ i
`;

export default function Hero({ setPage }) {
  const triggerRef = useRef(null);

  useEffect(() => {
    // Reveal animation
    const tl = gsap.timeline();
    tl.fromTo(
      '.hero-reveal',
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, stagger: 0.15, ease: 'power4.out', delay: 0.2 }
    );
  }, []);

  return (
    <section className="relative min-h-screen w-full bg-[#0a0a0c] text-white flex flex-col justify-between z-10">
      {/* Reconstructed Hero Header Bar */}
      <div className="w-full flex justify-between items-center px-6 py-6 md:px-12 border-b border-white/5">
        {/* Custom heavy block logo */}
        <div
          onClick={() => setPage('home')}
          className="text-3xl font-black tracking-tighter cursor-pointer text-white font-syne select-none hover:text-[#ff5c35] transition-colors"
          data-cursor="pointer"
        >
          PAULA
        </div>

        {/* Center menu link with horizontal bars */}
        <button
          onClick={() => setPage('about')} // Routing internally to about page
          className="flex items-center gap-3 group cursor-pointer text-xs font-space tracking-widest text-white/80 hover:text-white"
          data-cursor="magnetic"
        >
          MENU
          <div className="flex flex-col gap-1 w-6">
            <span className="h-[1px] bg-white w-full" />
            <span className="h-[1px] bg-white w-full" />
          </div>
        </button>

        {/* Orange-Red button cluster */}
        <div className="flex items-center">
          <a
            href="mailto:hello@paula-studio.com"
            className="h-10 px-5 bg-[#ff5c35] hover:bg-[#e04b27] flex items-center text-white text-[11px] font-space font-bold tracking-widest transition-colors cursor-pointer"
            data-cursor="magnetic"
          >
            LET'S WORK TOGETHER
          </a>
          <button
            onClick={() => setPage('detail')}
            className="w-10 h-10 bg-[#ff5c35]/90 hover:bg-[#ff5c35] text-white border-l border-black/10 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
            data-cursor="magnetic"
            aria-label="Add"
          >
            +
          </button>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 px-6 md:px-12 my-auto py-16 items-center">
        
        {/* Left Side: Typography Split */}
        <div className="lg:col-span-7 flex flex-col gap-8 select-none">
          <div className="hero-reveal">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-sans font-medium tracking-tight text-white leading-[1.05]">
              Interactive code. <br />
              <span className="text-neutral-400">Sensory logic.</span>
            </h1>
          </div>

          <div className="hero-reveal max-w-lg">
            <p className="text-base text-neutral-400 font-sans leading-relaxed">
              Paula A. is an interactive frontend developer sculpting hardware accelerated interfaces. Focused on motion design, interactive physics, and high-performance WebGL modules.
            </p>
          </div>

          {/* Action Button cluster */}
          <div className="hero-reveal flex items-center gap-6 mt-4">
            <div className="flex items-center">
              <button
                onClick={() => setPage('projects')}
                className="h-12 px-6 bg-[#ff5c35] hover:bg-[#e04b27] flex items-center text-white text-xs font-space font-bold tracking-widest transition-colors cursor-pointer"
                data-cursor="magnetic"
              >
                EXPLORE WORK
              </button>
              <button
                onClick={() => setPage('projects')}
                className="w-12 h-12 bg-[#ff5c35]/90 hover:bg-[#ff5c35] text-white border-l border-black/10 flex items-center justify-center text-lg font-bold transition-colors cursor-pointer"
                data-cursor="magnetic"
                aria-label="Add"
              >
                +
              </button>
            </div>

            <button
              onClick={() => setPage('about')}
              className="text-xs font-space tracking-widest text-white border-b border-white/40 pb-1 hover:border-white transition-colors cursor-pointer"
              data-cursor="pointer"
            >
              View philosophy
            </button>
          </div>
        </div>

        {/* Right Side: Reconstructed Monospace ASCII Art Face */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end overflow-hidden">
          <pre
            className="text-[#ff5c35] font-mono text-[7px] leading-[1.05] tracking-widest select-none opacity-80"
            style={{ fontFamily: 'monospace' }}
          >
            {ASCII_ART}
          </pre>
        </div>
      </div>

      {/* Hero bottom margin / decorative pad */}
      <div className="w-full border-t border-white/5 py-6 px-6 md:px-12 flex justify-between items-center text-[10px] font-space tracking-widest text-neutral-500">
        <span>© 2026 PAULA A.</span>
        <span>CREATIVE FRONTEND STUDIO</span>
      </div>
    </section>
  );
}
