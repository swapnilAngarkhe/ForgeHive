'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Code2, Rocket, Globe, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="flex flex-1 flex-col items-center p-6 md:p-12 lg:p-20 bg-muted/40 font-poppins animate-in fade-in duration-500">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About ForgeHive</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A centralized platform for discovering curated open-source tools for developers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="border-none shadow-md bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Globe className="h-6 w-6" />
              </div>
              <CardTitle>What is ForgeHive?</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                ForgeHive is a community-driven repository of high-quality open-source software and developer tools. We filter out the noise to bring you the best-in-class libraries, frameworks, and utilities to supercharge your workflow.
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-md bg-card/50 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 rounded-lg bg-accent/10 text-accent">
                <Rocket className="h-6 w-6" />
              </div>
              <CardTitle>Why we built it</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                Finding the right tool shouldn't be a chore. We built ForgeHive to solve the discovery problem in the open-source ecosystem, providing a clean interface where developers can find, save, and share the tools that matter most.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-none shadow-lg overflow-hidden">
          <CardHeader className="bg-primary text-primary-foreground p-8">
            <div className="flex items-center gap-3">
              <Code2 className="h-8 w-8" />
              <CardTitle className="text-2xl">Technologies Used</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-8 space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div className="space-y-2">
                <p className="font-semibold text-lg">Next.js 15</p>
                <p className="text-xs text-muted-foreground uppercase">Framework</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">Supabase</p>
                <p className="text-xs text-muted-foreground uppercase">Auth & DB</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">Tailwind CSS</p>
                <p className="text-xs text-muted-foreground uppercase">Styling</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-lg">ShadCN UI</p>
                <p className="text-xs text-muted-foreground uppercase">Components</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-green-500" />
                Modern & Secure Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Framer Motion</Badge>
                <Badge variant="secondary">GSAP</Badge>
                <Badge variant="secondary">Lucide Icons</Badge>
                <Badge variant="secondary">Zod</Badge>
                <Badge variant="secondary">React Hook Form</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                Built with a focus on performance, accessibility, and developer experience, ForgeHive leverages the latest advancements in the React and Next.js ecosystem.
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground pt-8">
          <p>© {new Date().getFullYear()} ForgeHive. Open Source for the Open Mind.</p>
        </footer>
      </div>
    </div>
  );
}
