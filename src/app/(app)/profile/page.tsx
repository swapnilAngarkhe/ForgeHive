import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { logout } from '@/lib/actions/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Shield, LogOut } from 'lucide-react';

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  const name = profile?.name || user.user_metadata?.name || 'User';
  const initials = name
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  return (
    <div className="flex flex-1 items-center justify-center p-4 md:p-10">
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
        
        <p className="text-center text-xs text-muted-foreground font-medium">
          ForgeHive Account Dashboard
        </p>
      </div>
    </div>
  );
}
