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
        {/* Unified Header Container */}
        <div className="w-full bg-card shadow-lg border border-border overflow-hidden transition-all duration-300">
          <nav className="relative flex h-12 w-full items-center justify-between p-2 px-4">
            {/* Left Section */}
            <div className="flex items-center flex-1">
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-foreground h-8 px-2"
                onClick={toggleMenu}
              >
                <Menu className="h-4 w-4" />
                <span className="text-xs font-medium">Menu</span>
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
                <Button asChild variant="ghost" className="h-8 px-3 text-xs">
                  <Link href="/profile">Profile</Link>
                </Button>
              ) : (
                <>
                  <Button asChild variant="outline" className="h-8 px-3 text-xs">
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="accent"
                    className="h-8 px-3 text-xs"
                  >
                    <Link href="/register">Join</Link>
                  </Button>
                </>
              )}
            </div>
          </nav>

          {/* Connected Horizontal Menu Bar */}
          <div 
            data-state={showMenu ? 'open' : 'closed'}
            className={cn(
              "w-full border-t border-border/20 bg-background/40 backdrop-blur-md transition-all duration-300 ease-in-out overflow-hidden",
              "data-[state=open]:opacity-100 data-[state=open]:max-h-20",
              "data-[state=closed]:opacity-0 data-[state=closed]:max-h-0 pointer-events-none data-[state=open]:pointer-events-auto"
            )}
          >
            <div className="flex items-center justify-center gap-6 py-3 px-4 text-xs tracking-tight">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative transition-all duration-200 after:absolute after:left-0 after:-bottom-1 after:h-[1px] after:bg-accent after:transition-all after:duration-200 hover:after:w-full",
                    pathname === link.href
                      ? "text-foreground font-semibold after:w-full"
                      : "text-muted-foreground hover:text-foreground after:w-0"
                  )}
                  onClick={() => setShowMenu(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <Ticker />
      </div>
    </header>
  );
}
