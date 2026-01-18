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

      <div className="relative z-10 grid items-center justify-center grid-cols-1 md:grid-cols-[1fr_auto_1fr] w-full h-full max-w-7xl mx-auto px-4 md:px-8">
        <div ref={fRef} className="absolute top-0 left-0 p-4 md:p-8 translate-y-9">
          <div className="text-[60vh] font-semibold leading-none text-foreground font-display">
            F
          </div>
        </div>

        <motion.div
          className="relative flex items-center justify-center col-start-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 text-primary flex items-center justify-center">
            <svg
              width="322"
              height="322"
              viewBox="0 0 322 322"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-full"
            >
              <path
                d="M217.35 68.425C218.936 68.425 220.506 68.1127 221.971 67.5059C223.436 66.899 224.767 66.0096 225.888 64.8883C227.009 63.7671 227.899 62.4359 228.506 60.9709C229.113 59.5059 229.425 57.9357 229.425 56.35C229.425 54.7643 229.113 53.1941 228.506 51.7291C227.899 50.2641 227.009 48.933 225.888 47.8117C224.767 46.6904 223.436 45.801 221.971 45.1942C220.506 44.5874 218.936 44.275 217.35 44.275C214.147 44.275 211.076 45.5472 208.812 47.8117C206.547 50.0762 205.275 53.1475 205.275 56.35C205.275 59.5525 206.547 62.6238 208.812 64.8883C211.076 67.1528 214.147 68.425 217.35 68.425ZM80.4999 169.05C80.5002 167.626 80.1226 166.227 79.4056 164.996C78.6887 163.765 77.658 162.747 76.4189 162.045C75.1797 161.343 73.7764 160.982 72.3523 160.999C70.9281 161.016 69.5339 161.411 68.3122 162.143L28.0622 186.293C27.1552 186.836 26.364 187.553 25.734 188.402C25.1039 189.251 24.6473 190.216 24.3902 191.242C24.133 192.267 24.0804 193.334 24.2353 194.38C24.3902 195.426 24.7496 196.431 25.293 197.338C26.3904 199.17 28.1705 200.49 30.2418 201.01C31.2674 201.267 32.3335 201.32 33.3795 201.165C34.4254 201.01 35.4306 200.65 36.3376 200.107L64.3999 183.266V249.55C64.3999 260.225 68.6405 270.463 76.1888 278.011C83.7372 285.559 93.9749 289.8 104.65 289.8H217.35C228.025 289.8 238.263 285.559 245.811 278.011C253.359 270.463 257.6 260.225 257.6 249.55V183.266L285.662 200.107C287.494 201.204 289.687 201.529 291.758 201.01C293.829 200.49 295.609 199.17 296.707 197.338C297.804 195.506 298.129 193.313 297.61 191.242C297.09 189.171 295.769 187.391 293.938 186.293L253.688 162.143C252.466 161.411 251.072 161.016 249.648 160.999C248.223 160.982 246.82 161.343 245.581 162.045C244.342 162.747 243.311 163.765 242.594 164.996C241.877 166.227 241.5 167.626 241.5 169.05V249.55C241.5 255.955 238.956 262.098 234.427 266.627C229.898 271.156 223.755 273.7 217.35 273.7H104.65C98.2449 273.7 92.1023 271.156 87.5733 266.627C83.0443 262.098 80.4999 255.955 80.4999 249.55V169.05Z"
                fill="#8295C1"
              />
              <line
                x1="39.6141"
                y1="112.163"
                x2="115.184"
                y2="158.008"
                stroke="#8295C1"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <line
                x1="152.315"
                y1="41.0246"
                x2="156.549"
                y2="131.263"
                stroke="#8295C1"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <line
                x1="68.7693"
                y1="23.9064"
                x2="115.273"
                y2="111.631"
                stroke="#8295C1"
                strokeWidth="10"
                strokeLinecap="round"
              />
              <path
                d="M233.716 86.5716L244.251 100.97C244.375 101.144 244.453 101.346 244.479 101.558C244.504 101.77 244.474 101.985 244.394 102.183L237.502 118.639C237.399 118.89 237.381 119.167 237.449 119.429C237.518 119.691 237.671 119.924 237.883 120.092C238.096 120.26 238.358 120.354 238.629 120.36C238.9 120.365 239.165 120.283 239.385 120.124L253.784 109.59C253.957 109.466 254.16 109.387 254.372 109.362C254.584 109.337 254.799 109.366 254.997 109.447L271.452 116.339C271.703 116.442 271.981 116.46 272.243 116.391C272.505 116.322 272.738 116.17 272.905 115.957C273.073 115.745 273.167 115.483 273.173 115.212C273.179 114.941 273.096 114.675 272.938 114.456L262.404 100.057C262.279 99.8833 262.201 99.681 262.176 99.469C262.151 99.2569 262.18 99.042 262.26 98.8442L269.152 82.3882C269.255 82.1375 269.274 81.8601 269.205 81.5979C269.136 81.3358 268.984 81.1032 268.771 80.9353C268.558 80.7675 268.296 80.6735 268.025 80.6676C267.754 80.6618 267.489 80.7444 267.269 80.9029L252.87 91.4371C252.697 91.5615 252.495 91.6399 252.283 91.6649C252.07 91.69 251.856 91.6609 251.658 91.5803L235.202 84.6886C234.951 84.5856 234.674 84.5671 234.411 84.6359C234.149 84.7047 233.917 84.8571 233.749 85.0698C233.581 85.2826 233.487 85.5443 233.481 85.8153C233.475 86.0863 233.558 86.3518 233.716 86.5716Z"
                fill="url(#paint0_linear_59_117)"
                stroke="#8295C1"
                strokeWidth="0.125"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_59_117"
                  x1="256.453"
                  y1="78.9693"
                  x2="250.201"
                  y2="122.058"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#8295C1" />
                  <stop offset="0.5" stopColor="#8295C1" />
                  <stop offset="1" stopColor="#8295C1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <p className="absolute -bottom-8 text-muted-foreground lowercase text-sm">
            [ dip open source ]
          </p>
        </motion.div>

        <div ref={hRef} className="absolute bottom-0 right-0 p-4 md:p-8">
          <div className="text-[60vh] font-semibold leading-none text-foreground font-display">
            H
          </div>
        </div>
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
        className="fixed top-0 left-0 text-base pointer-events-none text-accent"
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
