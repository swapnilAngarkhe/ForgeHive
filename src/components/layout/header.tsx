import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { UserNav } from './user-nav';

export function AppHeader({ user }: { user: User | null }) {
  return (
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex justify-center">
      <div className="w-full max-w-md flex flex-col items-center gap-2">
        <div className="relative w-full h-12 bg-background/60 backdrop-blur-md border border-border/50 shadow-md overflow-hidden flex items-center justify-between px-4 h-full">
          {/* LEFT */}
          <div className="flex items-center gap-4 h-full">
            <Link 
              href="/" 
              className="font-bold text-xl text-foreground hover:text-accent transition-colors"
            >
              FH
            </Link>

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
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 h-full">
            <UserNav user={user} />
          </div>
        </div>
      </div>
    </header>
  );
}
