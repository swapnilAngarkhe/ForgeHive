import Link from 'next/link';
import { Menu, Package2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export function LandingHeader() {
  return (
    <header className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 md:p-6 z-50">
      <Link href="/" className="flex items-center gap-2" prefetch={false}>
        <Package2 className="h-6 w-6 text-primary" />
        <span className="sr-only">ForgeHive</span>
      </Link>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="right">
          <nav className="grid gap-6 text-lg font-medium mt-8">
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
              Categories
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
            <Link
              href="/login"
              className="text-foreground hover:text-foreground"
              prefetch={false}
            >
              Login
            </Link>
          </nav>
        </SheetContent>
      </Sheet>
       <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/tools" className="hover:text-accent" prefetch={false}>
            Browse Tools
          </Link>
          <Link href="#" className="hover:text-accent" prefetch={false}>
            Categories
          </Link>
          <Link href="#" className="hover:text-accent" prefetch={false}>
            About
          </Link>
          <Link href="#" className="hover:text-accent" prefetch={false}>
            Contact
          </Link>
          <Button asChild variant="ghost" className="hover:bg-secondary">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
             <Link href="/register">Sign Up</Link>
          </Button>
      </nav>
    </header>
  );
}
