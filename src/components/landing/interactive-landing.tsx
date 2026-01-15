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
  const techTextRef = useRef<HTMLSpanElement>(null);
  const prevRevealedTech = useRef<string | null>(null);

  const mouseX = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 200 };
  const smoothedMouseX = useSpring(mouseX, springConfig);

  const lineAttractionY = useSpring(0, { damping: 15, stiffness: 150 });

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

  const lineY = useTransform(lineAttractionY, (v) => `calc(-50% + ${v}px)`);

  useEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      mouseX.set(window.innerWidth / 2);
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (lineRef.current) {
        const { left, top, width, height } =
          lineRef.current.getBoundingClientRect();
        const y = e.clientY - top;

        if (y > 0 && y < height) {
          const xPos = e.clientX - left;
          const segmentWidth = width / tech.length;
          const index = Math.floor(xPos / segmentWidth);
          setRevealedTech(tech[index] || null);
          setCursorPos({ x: e.clientX, y: e.clientY });

          const distance = e.clientY - (top + height / 2);
          lineAttractionY.set(distance * 0.1);
        } else {
          setRevealedTech(null);
          lineAttractionY.set(0);
        }
      }
      mouseX.set(e.clientX);
    };

    const handleMouseLeave = () => {
      setRevealedTech(null);
      lineAttractionY.set(0);
      if (typeof window !== 'undefined') {
        mouseX.set(window.innerWidth / 2);
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
  }, [mouseX, lineAttractionY]);

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


  if (!isMounted) {
    return null; // Or a loading spinner
  }

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden bg-background font-headline">
      <LandingHeader />

      <div className="relative grid items-center justify-center grid-cols-1 md:grid-cols-[1fr_auto_1fr] w-full max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-left absolute -top-28 left-4 md:left-8 pt-[50px]">
          <span className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-none text-secondary">
            F
          </span>
          <span className="text-[4vw] md:text-[3vw] lg:text-[2.5vw] text-muted-foreground">
            orge
          </span>
        </div>

        <motion.div
          className="relative flex items-center justify-center col-start-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <ForgeHiveLogo className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-primary" />
        </motion.div>

        <div className="text-right absolute right-4 md:right-8 pt-[100px]">
          <span className="text-[12vw] md:text-[10vw] lg:text-[8vw] font-bold leading-none text-secondary">
            H
          </span>
          <span className="text-[4vw] md:text-[3vw] lg:text-[2.5vw] text-muted-foreground">
            ive
          </span>
        </div>
      </div>

      <motion.div
        ref={lineRef}
        className="absolute w-full h-20 -translate-y-1/2 cursor-none top-1/2"
        style={{ perspective: '1000px' }}
      >
        <motion.div
          className="w-full h-px bg-border"
          style={{
            rotateX: bend,
            y: lineY,
            position: 'absolute',
            top: '50%',
          }}
          transition={springConfig}
        />
      </motion.div>

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
