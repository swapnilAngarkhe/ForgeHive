'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
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
  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="w-full max-w-sm flex flex-col items-center gap-2 px-2">
        <div className="relative w-full h-12 bg-card shadow-lg border border-border overflow-hidden">
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
        </div>

        {/* Horizontal Menu Bar */}
        {showMenu && (
          <div className="w-full border-b border-border/30 bg-background/60 backdrop-blur-sm animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-center gap-8 py-2 text-sm">
              <Link
                href="/tools"
                className="text-muted-foreground hover:text-foreground transition"
                onClick={() => setShowMenu(false)}
              >
                Browse Tools
              </Link>
              <Link
                href="/about"
                className="text-muted-foreground hover:text-foreground transition"
                onClick={() => setShowMenu(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-foreground transition"
                onClick={() => setShowMenu(false)}
              >
                Contact Us
              </Link>
            </div>
          </div>
        )}

        <Ticker />
      </div>
    </header>
  );
}
