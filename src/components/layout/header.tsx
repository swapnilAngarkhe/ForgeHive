import Link from 'next/link';
import { Menu, Package2 } from 'lucide-react';
import type { User } from '@supabase/supabase-js';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { UserNav } from './user-nav';

export function AppHeader({ user }: { user: User | null }) {
  return (
    <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6 z-50">
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Package2 className="h-6 w-6" />
          <span className="sr-only">ForgeHive</span>
        </Link>
        <Link
          href="/tools"
          className="text-foreground transition-colors hover:text-foreground"
        >
          Tools
        </Link>
        <Link
          href="/profile"
          className="text-muted-foreground transition-colors hover:text-foreground"
        >
          Profile
        </Link>
      </nav>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="#"
              className="flex items-center gap-2 text-lg font-semibold"
            >
              <Package2 className="h-6 w-6" />
              <span className="sr-only">ForgeHive</span>
            </Link>
            <Link href="/tools" className="hover:text-foreground">
              Tools
            </Link>
            <Link href="/profile" className="text-muted-foreground hover:text-foreground">
              Profile
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
      <div className="flex w-full items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          {/* Search can go here later */}
        </div>
        <UserNav user={user} />
      </div>
    </header>
  );
}
