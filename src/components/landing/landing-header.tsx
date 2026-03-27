'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState, useRef, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';

const TickerText = () => {
  const text = 'not backed by Y Combinator';
  const repeatedText = Array(15).fill(text).join('   ✦   ');

  return (
    <p className="py-1 whitespace-nowrap text-sm font-medium">
      {repeatedText}
    </p>
  );
};

const Ticker = () => {
  return (
    <div className="w-full bg-accent text-accent-foreground overflow-hidden">
      <div className="flex animate-marquee">
        <TickerText />
        <TickerText />
      </div>
    </div>
  );
};

export function LandingHeader({ user }: { user: User | null }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuContainerRef = useRef<HTMLDivElement>(null);
  const menuItemsRef = useRef<HTMLDivElement>(null);

  const tl = useRef<gsap.core.Timeline | null>(null);

  useLayoutEffect(() => {
    if (!menuContainerRef.current || !menuItemsRef.current) return;

    const menuItems = gsap.utils.toArray(menuItemsRef.current.children);

    gsap.set(menuItems, { opacity: 0, y: 15 });

    tl.current = gsap
      .timeline({ paused: true, reversed: true })
      .to(menuContainerRef.current, {
        height: '220px', // Uniform height since logout is removed
        duration: 0.4,
        ease: 'power2.out',
      })
      .to(
        menuItems,
        {
          opacity: 1,
          y: 0,
          stagger: 0.05,
          duration: 0.3,
          ease: 'power2.out',
        },
        '-=0.2'
      );

    return () => {
      tl.current?.kill();
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => {
      const nextState = !prev;
      if (nextState) {
        tl.current?.play();
      } else {
        tl.current?.reverse();
      }
      return nextState;
    });
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-2 px-2">
        <div
          ref={menuContainerRef}
          className="relative w-full h-12 bg-card shadow-lg border border-border overflow-hidden"
        >
          <nav className="relative flex h-12 w-full items-center justify-between p-2 px-4">
            {/* Left Section */}
            <div className="flex items-center flex-1">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-foreground"
                onClick={toggleMenu}
              >
                <Menu className="h-5 w-5" />
                <span className="text-sm font-medium">Menu</span>
              </Button>
            </div>

            {/* Center Section (Branding - Only visible when authenticated) */}
            {user && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                <Link 
                  href="/" 
                  className="font-display text-2xl text-foreground hover:text-accent transition-colors tracking-tighter"
                >
                  FH
                </Link>
              </div>
            )}

            {/* Right Section */}
            <div className="flex items-center justify-end gap-2 flex-1">
              {user ? (
                <Button asChild variant="ghost">
                  <Link href="/profile">Profile</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="accent"
                  >
                    <Link href="/register">Join</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          <div
            ref={menuItemsRef}
            className="absolute top-16 w-full pt-4 flex flex-col items-center gap-6"
          >
            <Link
              href="/tools"
              className="text-muted-foreground hover:text-foreground text-lg font-medium"
              prefetch={false}
              onClick={toggleMenu}
            >
              Browse Tools
            </Link>
            <Link
              href="/about"
              className="text-muted-foreground hover:text-foreground text-lg font-medium"
              prefetch={false}
              onClick={toggleMenu}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-muted-foreground hover:text-foreground text-lg font-medium"
              prefetch={false}
              onClick={toggleMenu}
            >
              Contact Us
            </Link>
          </div>
        </div>

        <Ticker />
      </div>
    </header>
  );
}
