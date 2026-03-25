import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import { UserNav } from './user-nav';

export function AppHeader({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 z-50 flex justify-center pt-4">
      <div className="w-full max-w-5xl px-4">
        <div className="w-full h-12 bg-card shadow-lg border border-border flex items-center justify-between px-4">
          {/* LEFT */}
          <div className="flex items-center gap-4">
            <Link href="/" className="font-bold text-lg hover:text-accent transition-colors">
              FH
            </Link>

            <Link href="/tools" className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
              Browse
            </Link>

            <Link href="/about" className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
              About
            </Link>

            <Link href="/contact" className="flex items-center gap-1 text-sm font-medium hover:text-accent transition-colors">
              Contact
            </Link>
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
