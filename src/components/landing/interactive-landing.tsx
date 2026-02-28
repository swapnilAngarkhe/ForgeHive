'use client';

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion';
import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { LandingHeader } from './landing-header';

const tech = [
  'React',
  'Next.js',
  'Supabase',
  'Tailwind',
  'PostgreSQL',
  'Docker',
  'Git',
  'Linux',
  'Node.js',
];

export function InteractiveLanding() {
  const [revealedTech, setRevealedTech] = useState<string | null>(null);
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [isMounted, setIsMounted] = useState(false);

  const lineRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const techTextRef = useRef<HTMLSpanElement>(null);
  const prevRevealedTech = useRef<string | null>(null);
  const fRef = useRef<HTMLDivElement>(null);
  const hRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const smoothedMouseX = useSpring(mouseX, springConfig);

  const bend = useTransform(
    smoothedMouseX,
    (val) => {
      if (typeof window === 'undefined') return 0;
      const center = window.innerWidth / 2;
      return (val - center) * 0.05;
    },
    {
      clamp: false,
    }
  );

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      
      if (lineRef.current && pathRef.current) {
        const { left, top, width, height } =
          lineRef.current.getBoundingClientRect();
        const yInRect = e.clientY - top;
        const xInRect = e.clientX - left;
        const centerY = height / 2;

        if (yInRect > 0 && yInRect < height) {
          const segmentWidth = width / tech.length;
          const index = Math.floor(xInRect / segmentWidth);
          setRevealedTech(tech[index] || null);
          setCursorPos({ x: e.clientX, y: e.clientY });

          // Line bending logic
          const distFromCenter = yInRect - centerY;
          const spread = 150; // How wide the curve is

          let d = `M 0 ${centerY}`;
          const segments = 50;
          for (let i = 0; i <= segments; i++) {
            const px = (width / segments) * i;
            // Gaussian falloff
            const gauss = Math.exp(-((px - xInRect) ** 2) / (2 * spread ** 2));
            const displacement = (distFromCenter * 1.6) * gauss;
            const py = centerY + displacement;
            d += ` L ${px} ${py}`;
          }

          gsap.to(pathRef.current, {
            attr: { d: d },
            duration: 0.3,
            ease: 'power2.out',
          });
        } else {
          setRevealedTech(null);
          // Relax line
          gsap.to(pathRef.current, {
            attr: { d: `M 0,${centerY} L ${width},${centerY}` },
            duration: 0.5,
            ease: 'elastic.out(1, 0.75)',
          });
        }
      }
    };

    const handleMouseLeave = () => {
      setRevealedTech(null);
      if (typeof window !== 'undefined') {
        mouseX.set(window.innerWidth / 2);
      }
      if (lineRef.current && pathRef.current) {
        const { width, height } = lineRef.current.getBoundingClientRect();
        const centerY = height / 2;
        gsap.to(pathRef.current, {
          attr: { d: `M 0,${centerY} L ${width},${centerY}` },
          duration: 0.5,
          ease: 'elastic.out(1, 0.75)',
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener(
        'mouseleave',
        handleMouseLeave
      );
    };
  }, [mouseX]);

  useLayoutEffect(() => {
    const handleResize = () => {
        if (lineRef.current && pathRef.current) {
            const { width, height } = lineRef.current.getBoundingClientRect();
            const centerY = height / 2;
            const d = `M 0,${centerY} L ${width},${centerY}`;
            gsap.set(pathRef.current, { attr: { d } });
        }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call once to set initial path

    return () => window.removeEventListener('resize', handleResize);
  }, []);


  useLayoutEffect(() => {
    const target = techTextRef.current;
    if (!target) return;

    if (revealedTech && revealedTech !== prevRevealedTech.current) {
      gsap.to(target, {
        duration: 0.7,
        scrambleText: {
          text: revealedTech,
          chars: 'lowerCase',
          speed: 0.3,
        },
      });
    } else if (!revealedTech && prevRevealedTech.current) {
      target.textContent = '';
    }

    prevRevealedTech.current = revealedTech;
  }, [revealedTech]);

  useLayoutEffect(() => {
    if (fRef.current && hRef.current) {
      const tl = gsap.timeline();
      tl.from(
        fRef.current,
        {
          y: '50vh',
          duration: 1,
          ease: 'power3.out',
        },
        0
      ).from(
        hRef.current,
        {
          y: '-50vh',
          duration: 1,
          ease: 'power3.out',
        },
        0
      );
    }
  }, []);


  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-background font-headline">
      <LandingHeader />

      <div ref={fRef} className="absolute -bottom-10 -left-4">
        <div className="text-[60vh] font-semibold leading-none text-foreground font-display">
          F
        </div>
      </div>

      <div ref={hRef} className="absolute -top-10 -right-4">
        <div className="text-[60vh] font-semibold leading-none text-foreground font-display">
          H
        </div>
      </div>

      <div className="relative z-10 grid items-center justify-center grid-cols-1 md:grid-cols-[1fr_auto_1fr] w-full h-full max-w-7xl mx-auto px-4 md:px-8">
        <motion.div
          className="relative flex items-center justify-center col-start-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-56 h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 text-primary flex items-center justify-center">
            <svg width="364" height="364" viewBox="0 0 364 364" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
<path d="M42.6941 182L78.3054 120.294H149.566L185.185 182L149.558 243.706H78.2978L42.6941 182ZM178.815 260.586L214.419 198.881H285.679L321.306 260.586L285.679 322.292H214.419L178.815 260.586ZM178.815 103.414L214.411 41.7084H285.672L321.298 103.414L285.672 165.12H214.411L178.815 103.414Z" stroke="#8295C1" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M42.6941 182L78.3054 120.294H149.566L185.185 182L149.558 243.706H78.2978L42.6941 182ZM178.815 260.586L214.419 198.881H285.679L321.306 260.586L285.679 322.292H214.419L178.815 260.586ZM178.815 103.414L214.411 41.7084H285.672L321.298 103.414L285.672 165.12H214.411L178.815 103.414Z" stroke="#8295C1" strokeWidth="19" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M99.0921 162.091L103.934 179.247C103.99 179.453 103.992 179.671 103.94 179.88C103.888 180.089 103.783 180.282 103.636 180.442L91.2077 193.703C91.0203 193.905 90.9035 194.162 90.8749 194.433C90.8464 194.704 90.9076 194.975 91.0495 195.205C91.1913 195.435 91.406 195.612 91.661 195.708C91.916 195.805 92.1975 195.816 92.4628 195.739L109.895 190.599C110.104 190.54 110.324 190.533 110.534 190.581C110.744 190.628 110.938 190.728 111.097 190.87L124.244 202.909C124.445 203.09 124.702 203.201 124.975 203.223C125.249 203.246 125.524 203.18 125.759 203.035C125.995 202.89 126.178 202.674 126.28 202.419C126.383 202.165 126.399 201.886 126.328 201.625L121.485 184.469C121.43 184.263 121.428 184.045 121.48 183.836C121.532 183.627 121.636 183.433 121.784 183.273L134.212 170.013C134.4 169.81 134.516 169.554 134.545 169.283C134.573 169.012 134.512 168.741 134.37 168.51C134.229 168.28 134.014 168.104 133.759 168.007C133.504 167.911 133.222 167.9 132.957 167.976L115.525 173.116C115.316 173.176 115.096 173.182 114.886 173.135C114.675 173.087 114.482 172.988 114.323 172.845L101.175 160.807C100.974 160.626 100.718 160.515 100.444 160.492C100.171 160.47 99.8958 160.536 99.6604 160.681C99.4249 160.826 99.2421 161.042 99.1396 161.296C99.0371 161.551 99.0204 161.83 99.0921 162.091Z" fill="url(#paint0_linear_70_123)" stroke="#8295C1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M237.759 240.091L242.601 257.247C242.657 257.453 242.659 257.671 242.607 257.88C242.555 258.089 242.45 258.282 242.303 258.442L229.874 271.703C229.687 271.905 229.57 272.162 229.542 272.433C229.513 272.704 229.513 272.704 229.513 272.704C229.513 272.704 229.574 272.975 229.716 273.205C229.858 273.435 230.073 273.612 230.328 273.708C230.583 273.805 230.864 273.816 231.13 273.739L248.562 268.599C248.771 268.54 248.991 268.533 249.201 268.581C249.411 268.628 249.605 268.728 249.764 268.87L262.911 280.909C263.112 281.09 263.369 281.201 263.642 281.223C263.916 281.246 264.191 281.18 264.426 281.035C264.662 280.89 264.844 280.674 264.947 280.419C265.049 280.165 265.066 279.886 264.994 279.625L260.152 262.469C260.096 262.263 260.094 262.045 260.146 261.836C260.199 261.627 260.303 261.433 260.45 261.273L272.879 248.013C273.066 247.81 273.183 247.554 273.212 247.283C273.24 247.012 273.179 246.741 273.037 246.51C272.895 246.28 272.681 246.104 272.426 246.007C272.171 245.911 271.889 245.9 271.624 245.976L254.192 251.116C253.982 251.176 253.762 251.182 253.552 251.135C253.342 251.087 253.149 250.988 252.99 250.845L239.842 238.807C239.641 238.626 239.384 238.515 239.111 238.492C238.838 238.47 238.563 238.536 238.327 238.681C238.092 238.826 237.909 239.042 237.806 239.296C237.704 239.551 237.687 239.83 237.759 240.091Z" fill="url(#paint1_linear_70_123)" stroke="#8295C1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
<path d="M237.759 84.0909L242.601 101.247C242.657 101.453 242.659 101.671 242.607 101.88C242.555 102.089 242.45 102.282 242.303 102.442L229.874 115.703C229.687 115.905 229.57 116.162 229.542 116.433C229.513 116.704 229.574 116.975 229.716 117.205C229.858 117.435 230.073 117.612 230.328 117.708C230.583 117.805 230.864 117.816 231.13 117.739L248.562 112.599C248.771 112.54 248.991 112.533 249.201 112.581C249.411 112.628 249.605 112.728 249.764 112.87L262.911 124.909C263.112 125.09 263.369 125.201 263.642 125.223C263.916 125.246 264.191 125.18 264.426 125.035C264.662 124.89 264.844 124.674 264.947 124.419C265.049 124.165 265.066 123.886 264.994 123.625L260.152 106.469C260.096 106.263 260.094 106.045 260.146 105.836C260.199 105.627 260.303 105.433 260.45 105.273L272.879 92.013C273.066 91.8103 273.183 91.554 273.212 91.2829C273.24 91.0118 273.179 90.7406 273.037 90.5104C272.895 90.2803 272.681 90.1036 272.426 90.0072C272.171 89.9108 271.889 89.9 271.624 89.9762L254.192 95.1164C253.982 95.1759 253.762 95.1823 253.552 95.1349C253.342 95.0875 253.149 94.9879 252.99 94.8453L239.842 82.8071C239.641 82.6256 239.384 82.5151 239.111 82.4923C238.838 82.4695 238.563 82.5357 238.327 82.6808C238.092 82.8258 237.909 83.0419 237.806 83.2964C237.704 83.5508 237.687 83.8297 237.759 84.0909Z" fill="url(#paint2_linear_70_123)" stroke="#8295C1" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
<defs>
<linearGradient id="paint0_linear_70_123" x1="123.386" y1="162.52" x2="102.797" y2="201.598" gradientUnits="userSpaceOnUse">
<stop stopColor="#8295C1"/>
<stop offset="0.5" stopColor="#8295C1"/>
<stop offset="1" stopColor="#8295C1"/>
</linearGradient>
<linearGradient id="paint1_linear_70_123" x1="262.053" y1="240.52" x2="241.464" y2="279.598" gradientUnits="userSpaceOnUse">
<stop stopColor="#8295C1"/>
<stop offset="0.5" stopColor="#8295C1"/>
<stop offset="1" stopColor="#8295C1"/>
</linearGradient>
<linearGradient id="paint2_linear_70_123" x1="262.053" y1="84.5204" x2="241.464" y2="123.598" gradientUnits="userSpaceOnUse">
<stop stopColor="#8295C1"/>
<stop offset="0.5" stopColor="#8295C1"/>
<stop offset="1" stopColor="#8295C1"/>
</linearGradient>
</defs>
</svg>
          </div>
          <p className="absolute -bottom-8 text-muted-foreground lowercase text-sm">
            [ dip open source ]
          </p>
        </motion.div>
      </div>

      <div
        ref={lineRef}
        className="absolute w-full h-20 -translate-y-1/2 cursor-none top-1/2 z-0"
        style={{
          maskImage:
            'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
        }}
      >
        <motion.svg
          width="100%"
          height="100%"
          style={{ rotateX: bend }}
          transition={springConfig}
        >
          <path
            ref={pathRef}
            stroke="hsl(var(--border))"
            strokeWidth="1"
            fill="none"
          />
        </motion.svg>
      </div>

      <motion.div
        className="fixed top-0 left-0 text-[18px] pointer-events-none text-accent"
        style={{
          x: cursorPos.x,
          y: cursorPos.y,
          translateX: '-50%',
          translateY: '-150%',
        }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: revealedTech ? 1 : 0,
          scale: revealedTech ? 1 : 0.8,
        }}
        transition={{ duration: 0.2 }}
      >
        <span ref={techTextRef} />
      </motion.div>
    </div>
  );
}