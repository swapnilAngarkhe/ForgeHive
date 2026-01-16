'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const TickerText = () => {
  const text = 'not backed by open labs';
  const repeatedText = Array(15).fill(text).join('   ✦   ');

  return (
    <p className="py-1 whitespace-nowrap text-sm font-medium">
      {repeatedText}
    </p>
  );
};

const Ticker = () => {
  return (
    <div className="w-full bg-accent text-accent-foreground rounded-full overflow-hidden">
      <div className="flex animate-marquee">
        <TickerText />
        <TickerText />
      </div>
    </div>
  );
};

export function LandingHeader() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-6">
      <div className="w-full max-w-md flex flex-col items-center gap-3 px-4">
        <nav className="relative flex h-12 w-full items-center justify-between rounded-full bg-card p-2 px-4 shadow-lg border border-border">
          {/* Left Section */}
          <div className="flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 text-foreground">
                  <Menu className="h-5 w-5" />
                  <span className="text-sm font-medium">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="bg-card">
                <nav className="grid gap-6 text-lg font-medium mt-8">
                   <Link
                      href="/"
                      className="flex items-center gap-2 text-lg font-semibold"
                      prefetch={false}
                    >
                      <span className="font-bold text-foreground">FH</span>
                      <span className="sr-only">ForgeHive</span>
                    </Link>
                  <Link
                    href="/tools"
                    className="text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    Browse Tools
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    About
                  </Link>
                  <Link
                    href="#"
                    className="text-muted-foreground hover:text-foreground"
                    prefetch={false}
                  >
                    Contact
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Center Section */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link href="/" className="font-bold text-xl text-foreground" prefetch={false}>
              FH
            </Link>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost">
              <Link href="/login">Login</Link>
            </Button>
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/register">Join</Link>
            </Button>
          </div>
        </nav>

        {/* Ticker Bar */}
        <Ticker />
      </div>
    </header>
  );
}
