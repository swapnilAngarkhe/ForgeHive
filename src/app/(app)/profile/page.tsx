import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('');
}

export default async function ProfilePage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: favorites } = await supabase
    .from('favorites')
    .select('*, tools(*, categories(category_name))')
    .eq('user_id', user.id);

  const name = user.user_metadata?.name || 'Anonymous';
  const avatarUrl = user.user_metadata?.avatar_url;

  return (
    <div className="w-full p-4 md:p-10">
      <div className="container mx-auto max-w-4xl py-8">
        <div className="flex items-center gap-6 mb-8">
          <Avatar className="h-24 w-24">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-3xl">
              {getInitials(name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-4xl font-bold font-headline">{name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Favorite Tools</CardTitle>
          </CardHeader>
          <CardContent>
            {favorites && favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((fav) => (
                  <div
                    key={fav.favorite_id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h3 className="font-semibold">{fav.tools?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {fav.tools?.description}
                      </p>
                    </div>
                    <Link href={`/tools/${fav.tools?.slug}`}>
                      <span className="text-sm underline">View</span>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">
                You haven&apos;t saved any favorite tools yet.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
