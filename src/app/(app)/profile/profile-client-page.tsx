'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Bookmark, X } from 'lucide-react';
import Link from 'next/link';
import { ToolCard } from '@/components/tools/tool-card';
import { CopyButton } from '@/components/profile/copy-button';
import { logout } from '@/lib/actions/auth';
import type { User } from '@supabase/supabase-js';

type ProfileClientPageProps = {
  user: User;
  profile: any;
  savedTools: any[];
};

export function ProfileClientPage({ user, profile, savedTools }: ProfileClientPageProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  const name = profile?.name || user.user_metadata?.name || 'User';
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  const filteredTools = selectedCategory
    ? savedTools.filter((t) => t.categories?.category_name === selectedCategory)
    : savedTools;

  return (
    <div className="flex flex-1 flex-col items-center p-4 md:p-10 gap-12 max-w-5xl mx-auto w-full animate-in fade-in duration-300">
      {/* Profile Info Section (Horizontal Layout) */}
      <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 border-b border-border/50 pb-8">
        <div className="flex items-center gap-6">
          <Avatar className="h-24 w-24 border border-border/50 shadow-sm">
            <AvatarImage src={profile?.avatar_url} alt={name} />
            <AvatarFallback className="text-xl font-bold bg-accent text-accent-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col gap-1">
            <h2 className="text-2xl font-bold font-headline">
              {name}
            </h2>

            <div className="flex items-center text-muted-foreground text-sm group">
              <span>{user.email}</span>
              <CopyButton text={user.email || ''} label="Email" />
            </div>

            <div className="flex items-center text-xs text-muted-foreground mt-2">
              <span>ID: {user.id}</span>
              <CopyButton text={user.id} label="User ID" />
            </div>

            <p className="text-xs text-muted-foreground">
              Member since: {new Date(user.created_at).toLocaleDateString()}
            </p>

            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mt-1">
              {profile?.role || 'user'}
            </p>
          </div>
        </div>

        <form action={logout}>
          <Button 
            type="submit" 
            variant="destructive" 
            className="flex items-center justify-center gap-2 group px-6"
          >
            <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Log out
          </Button>
        </form>
      </div>

      <div className="w-full space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Bookmark className="h-5 w-5 text-accent" />
            <h2 className="text-2xl font-bold font-headline">Saved Tools</h2>
            <Badge variant="outline" className="ml-2">
              {filteredTools.length}
            </Badge>
          </div>

          {selectedCategory && (
            <div className="flex items-center gap-3 animate-in slide-in-from-right-2 duration-300">
              <p className="text-sm text-muted-foreground">
                Showing tools for <span className="text-accent font-medium">#{selectedCategory.toLowerCase()}</span>
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedCategory(null)}
                className="h-8 gap-2"
              >
                <X className="h-3 w-3" />
                Clear Filter
              </Button>
            </div>
          )}
        </div>

        {filteredTools.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isSaved={true}
                user={user}
                onTagClick={(category) => setSelectedCategory(category)}
              />
            ))}
          </div>
        ) : (
          <div className="border border-dashed border-border rounded-lg p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted/50">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium">
                {selectedCategory ? `No saved tools in #${selectedCategory.toLowerCase()}` : "No saved tools yet"}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedCategory ? "Try clearing the filter or browse other categories." : "Browse our collection and save tools you find interesting."}
              </p>
            </div>
            {selectedCategory ? (
              <Button onClick={() => setSelectedCategory(null)} variant="outline">
                Clear Filter
              </Button>
            ) : (
              <Button asChild variant="outline" className="mt-2">
                <Link href="/tools">Explore Tools</Link>
              </Button>
            )}
          </div>
        )}
      </div>
      
      <p className="text-center text-xs text-muted-foreground font-medium pb-8">
        ForgeHive Account Dashboard
      </p>
    </div>
  );
}
