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
import { ForgeHiveLogo } from '../icons/logo';
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
            const displacement = (distFromCenter * 1.5) * gauss;
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
          y: '-50vh',
          duration: 1,
          ease: 'power3.out',
        },
        0
      ).from(
        hRef.current,
        {
          y: '50vh',
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

      <div className="relative grid items-center justify-center grid-cols-1 md:grid-cols-[1fr_auto_1fr] w-full h-full max-w-7xl mx-auto px-4 md:px-8">
        <div ref={fRef} className="absolute top-0 left-0 p-4 md:p-8">
          <div className="text-[50vh] font-bold leading-none text-foreground font-display">
            F
          </div>
        </div>

        <motion.div
          className="relative flex items-center justify-center col-start-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ForgeHiveLogo className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-primary" />
          <p className="absolute -bottom-8 text-muted-foreground lowercase text-sm">
            [ dip open source ]
          </p>
        </motion.div>

        <div ref={hRef} className="absolute bottom-0 right-0 p-4 md:p-8">
          <div className="text-[50vh] font-bold leading-none text-foreground font-display">
            H
          </div>
        </div>
      </div>

      <div
        ref={lineRef}
        className="absolute w-full h-20 -translate-y-1/2 cursor-none top-1/2"
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
        className="fixed top-0 left-0 text-sm pointer-events-none text-accent"
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
