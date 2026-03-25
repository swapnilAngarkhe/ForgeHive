import { createClient as createSupabaseServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Mail, Shield, LogOut, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { ToolCard } from '@/components/tools/tool-card';

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  // Fetch favorites
  const { data: favorites } = await supabase
    .from('favorites')
    .select('tool_id')
    .eq('user_id', user.id);

  const toolIds = favorites?.map((f) => f.tool_id) || [];

  let savedTools = [];
  if (toolIds.length > 0) {
    const { data } = await supabase
      .from('tools')
      .select('*, categories(category_name)')
      .in('id', toolIds);

    savedTools = data || [];
  }

  const name = profile?.name || user.user_metadata?.name || 'User';
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-1 flex-col items-center p-4 md:p-10 gap-12 max-w-5xl mx-auto w-full">
      <div className="w-full max-w-md space-y-6">
        <Card className="border-border/50 shadow-xl overflow-hidden">
          <CardHeader className="text-center pb-2 pt-8">
            <div className="flex justify-center mb-4">
              <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                <AvatarImage src={profile?.avatar_url} alt={name} />
                <AvatarFallback className="text-2xl font-bold bg-accent text-accent-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <CardTitle className="text-3xl font-bold font-headline">{name}</CardTitle>
            <CardDescription className="text-muted-foreground flex items-center justify-center gap-1">
              <Mail className="h-3 w-3" />
              {user.email}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="px-6 pb-8 space-y-6">
            <div className="flex justify-center">
              <Badge variant="secondary" className="px-3 py-1 text-sm font-medium flex gap-2 items-center">
                <Shield className="h-3 w-3" />
                {profile?.role?.toUpperCase() || 'USER'}
              </Badge>
            </div>
            
            <Separator className="bg-border/50" />
            
            <div className="space-y-4">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account ID</span>
                <p className="text-sm font-mono bg-muted/50 p-2 rounded border border-border/30 truncate">
                  {user.id}
                </p>
              </div>
              
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Member Since</span>
                <p className="text-sm">
                  {new Date(user.created_at).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <form action={logout}>
              <Button 
                type="submit" 
                variant="destructive" 
                className="w-full mt-4 flex items-center justify-center gap-2 group"
              >
                <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Log out
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="w-full space-y-6">
        <div className="flex items-center gap-2 px-2">
          <Bookmark className="h-5 w-5 text-accent" />
          <h2 className="text-2xl font-bold font-headline">Saved Tools</h2>
          <Badge variant="outline" className="ml-2">
            {savedTools.length}
          </Badge>
        </div>

        {savedTools.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
            {savedTools.map((tool) => (
              <ToolCard 
                key={tool.id} 
                tool={tool} 
                isSaved={true}
                className="w-full"
              />
            ))}
          </div>
        ) : (
          <Card className="border-dashed p-12 text-center flex flex-col items-center gap-4">
            <div className="p-4 rounded-full bg-muted/50">
              <Bookmark className="h-8 w-8 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium">No saved tools yet</p>
              <p className="text-sm text-muted-foreground">Browse our collection and save tools you find interesting.</p>
            </div>
            <Button asChild variant="outline" className="mt-2">
              <Link href="/tools">Explore Tools</Link>
            </Button>
          </Card>
        )}
      </div>
      
      <p className="text-center text-xs text-muted-foreground font-medium pb-8">
        ForgeHive Account Dashboard
      </p>
    </div>
  );
}
