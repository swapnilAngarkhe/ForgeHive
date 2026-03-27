'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import type { User } from '@supabase/supabase-js';
import { cn } from '@/lib/utils';
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
  const pathname = usePathname();

  const toggleMenu = () => {
    setShowMenu((prev) => !prev);
  };

  const navLinks = [
    { name: 'Browse Tools', href: '/tools' },
    { name: 'About', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
  ];

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
        <div 
          data-state={showMenu ? 'open' : 'closed'}
          className={cn(
            "w-full border-b border-border/30 bg-background/60 backdrop-blur-sm transition-all duration-200 ease-out overflow-hidden",
            "data-[state=open]:opacity-100 data-[state=open]:translate-y-0 data-[state=open]:max-h-20",
            "data-[state=closed]:opacity-0 data-[state=closed]:-translate-y-2 data-[state=closed]:max-h-0 pointer-events-none data-[state=open]:pointer-events-auto"
          )}
        >
          <div className="flex items-center justify-center gap-8 py-2 text-sm">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative transition-all duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:bg-accent after:transition-all after:duration-200 hover:after:w-full",
                  pathname === link.href
                    ? "text-foreground font-medium after:w-full"
                    : "text-muted-foreground hover:text-foreground after:w-0"
                )}
                onClick={() => setShowMenu(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        <Ticker />
      </div>
    </header>
  );
}
