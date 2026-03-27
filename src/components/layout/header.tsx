import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { UserNav } from './user-nav';

export function AppHeader({ user }: { user: User | null }) {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="w-full max-w-5xl flex flex-col items-center">
        <div className="relative w-full h-14 px-5 bg-background/70 backdrop-blur-lg border border-border/60 shadow-lg flex items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-8 h-full">
            <Link 
              href="/" 
              className="font-bold text-xl text-foreground hover:text-accent transition-colors shrink-0"
            >
              FH
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link 
                href="/tools" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Browse
              </Link>

              <Link 
                href="/about" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                About
              </Link>

              <Link 
                href="/contact" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2">
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
