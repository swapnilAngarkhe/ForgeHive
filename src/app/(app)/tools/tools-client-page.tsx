'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import type { Tool } from '@/lib/db-types';
import { ToolCard } from '@/components/tools/tool-card';

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
};

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

  return (
    <div className="flex items-center justify-center pt-8 pb-12 gap-4">
      {currentPage > 1 && (
        <Button asChild variant="outline">
          <Link href={createPageURL(currentPage - 1)}>← Previous</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        Page {currentPage} of {totalPages}
      </span>
      {currentPage < totalPages && (
        <Button asChild variant="outline">
          <Link href={createPageURL(currentPage + 1)}>Next →</Link>
        </Button>
      )}
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
}: ToolsClientPageProps) {
  const currentCategory = searchParams?.category || 'All';

  return (
    <div className="flex w-full h-full animate-in fade-in duration-300">
      {/* Left Sidebar */}
      <aside className="w-64 shrink-0 border-r border-border hidden md:flex flex-col">
        <div className="sticky top-16 h-[calc(100vh-4rem)] p-6 overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4 font-headline">
            Categories
          </h2>
          <div className="flex flex-col gap-2">
            {categories.map((category) => {
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
                  className="justify-start"
                >
                  <Link href={href}>#{category}</Link>
                </Button>
              );
            })}
          </div>
        </div>
      </aside>

      {/* Right Content - Split Layout */}
      <div className="flex-1 h-[calc(100vh-6rem)] overflow-hidden">
        <div className="flex flex-col max-w-4xl mx-auto h-full px-6 md:px-10">
          
          {/* 🔹 Fixed Top Section */}
          <div className="flex flex-col gap-6 py-6 border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-10">
            
            <form className="flex w-full items-center space-x-2">
              <Input
                type="search"
                name="q"
                placeholder="Search tools..."
                className="flex-1"
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
              <Button type="submit">Search</Button>
            </form>

            {/* Mobile categories - visible only on mobile */}
            <div className="flex items-center flex-wrap gap-2 md:hidden">
              <span className="text-sm font-semibold">Categories:</span>
              {categories.map((category) => {
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
                  <Link key={category} href={href}>
                    <Badge
                      variant={
                        currentCategory === category ? 'default' : 'secondary'
                      }
                      className="cursor-pointer"
                    >
                      #{category}
                    </Badge>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* 🔹 Scrollable Tools Section */}
          <div className="flex-1 overflow-y-auto pt-8 pr-2">
            
            <div className="grid grid-cols-1 gap-8">
              {tools && tools.length > 0 ? (
                tools.map((tool) => (
                  <div key={tool.id} className="flex flex-col items-center">
                    <ToolCard 
                      tool={tool} 
                      isSaved={favoriteToolIds.includes(tool.id)} 
                      className="w-full max-w-2xl"
                    />
                  </div>
                ))
              ) : (
                <div className="text-center py-20">
                  <p className="text-muted-foreground">No tools found matching your criteria.</p>
                </div>
              )}
            </div>

            {totalPages > 1 && (
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
