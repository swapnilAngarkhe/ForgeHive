'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Tool } from '@/lib/db-types';
import { ToolCard } from '@/components/tools/tool-card';
import { ToolCardSkeleton } from '@/components/skeletons/tool-card-skeleton';
import type { User } from '@supabase/supabase-js';

type ToolsClientPageProps = {
  tools: Tool[];
  categories: string[];
  searchParams?: {
    q?: string;
    category?: string;
    page?: string;
  };
  currentPage: number;
  totalPages: number;
  favoriteToolIds: number[];
  user: User | null;
};

const MAX_VISIBLE_CATEGORIES = 6;

function PaginationControls({
  currentPage,
  totalPages,
}: {
  currentPage: number;
  totalPages: number;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = [];
    if (totalPages <= 1) return pages;

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center pt-16 pb-6 gap-2 w-full">
      <Button
        asChild
        variant="outline"
        size="icon"
        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
      >
        <Link
          href={createPageURL(currentPage - 1)}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronLeft className="h-4 w-4" />
        </Link>
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((p, i) =>
          p === 'ellipsis' ? (
            <span key={`ellipsis-${i}`} className="px-2 text-muted-foreground select-none">
              ...
            </span>
          ) : (
            <Button
              key={p}
              asChild
              variant={p === currentPage ? 'default' : 'outline'}
              size="sm"
              className="w-9 h-9 p-0"
            >
              <Link
                href={createPageURL(p)}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                {p}
              </Link>
            </Button>
          )
        )}
      </div>

      <Button
        asChild
        variant="outline"
        size="icon"
        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
      >
        <Link
          href={createPageURL(currentPage + 1)}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <ChevronRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>
  );
}

export function ToolsClientPage({
  tools,
  categories,
  searchParams,
  currentPage,
  totalPages,
  favoriteToolIds,
  user,
}: ToolsClientPageProps) {
  const [showAllCategories, setShowAllCategories] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const currentCategory = searchParams?.category || 'All';

  React.useEffect(() => {
    setIsLoading(false);
  }, [tools]);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, MAX_VISIBLE_CATEGORIES);

  return (
    <div className="flex w-full h-full animate-in fade-in duration-300">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border hidden md:flex flex-col">
        <div className="sticky top-20 h-[calc(100vh-5rem)] p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 font-headline uppercase tracking-tighter text-foreground">
            Categories
          </h2>
          <div className="flex flex-col gap-2">
            {visibleCategories.map((category) => {
              const params = new URLSearchParams(searchParams);
              if (category === 'All') {
                params.delete('category');
              } else {
                params.set('category', category);
              }
              params.set('page', '1');
              const queryString = params.toString();
              const href = queryString ? `/tools?${queryString}` : '/tools';

              return (
                <Button
                  key={category}
                  asChild
                  variant={
                    currentCategory === category ? 'default' : 'ghost'
                  }
                  className="justify-start text-xs px-2 py-1 h-auto rounded-sm"
                >
                  <Link href={href}>#{category.toLowerCase()}</Link>
                </Button>
              );
            })}
            
            {categories.length > MAX_VISIBLE_CATEGORIES && (
              <button
                onClick={() => setShowAllCategories((prev) => !prev)}
                className="text-xs text-accent hover:opacity-80 mt-2 text-left px-2 font-medium transition-opacity"
              >
                {showAllCategories
                  ? 'Show less'
                  : `+${categories.length - MAX_VISIBLE_CATEGORIES} more`}
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Right Content - Grid Layout */}
      <div className="flex-1 h-[calc(100vh-6rem)] overflow-hidden">
        <div className="flex flex-col w-full h-full px-6 md:px-10">
          
          {/* 🔹 Fixed Top Section */}
          <div className="sticky top-0 z-20 pt-4 pb-8 bg-background/0">
            <form className="w-full mt-6">
              <div className="flex items-center gap-3 p-3 border border-border/50 bg-card/60 backdrop-blur-md shadow-md">
                <Input
                  type="search"
                  name="q"
                  placeholder="Search tools..."
                  className="flex-1 bg-transparent border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 h-10 text-base"
                  defaultValue={searchParams?.q || ''}
                />
                {searchParams?.category && searchParams.category !== 'All' && (
                  <input
                    type="hidden"
                    name="category"
                    value={searchParams.category}
                  />
                )}
                <input type="hidden" name="page" value="1" />
                <Button type="submit" variant="accent" className="px-8">
                  Search
                </Button>
              </div>
            </form>
          </div>

          {/* 🔹 Scrollable Tools Section (GRID) */}
          <div className="flex-1 overflow-y-auto pr-2 scroll-area pb-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <ToolCardSkeleton key={i} />
                ))}
              </div>
            ) : tools && tools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tools.map((tool) => (
                  <ToolCard 
                    key={tool.id} 
                    tool={tool} 
                    isSaved={favoriteToolIds.includes(tool.id)} 
                    className="w-full"
                    user={user}
                  />
                ))}
              </div>
            ) : (
              <div className="col-span-full text-center py-20 bg-muted/20 border border-dashed border-border p-12">
                <p className="text-muted-foreground font-medium">No tools found matching your criteria.</p>
              </div>
            )}

            {!isLoading && totalPages > 1 && (
              <PaginationControls
                currentPage={currentPage}
                totalPages={totalPages}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
