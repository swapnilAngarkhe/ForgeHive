'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Code2, 
  Rocket, 
  Globe, 
  ShieldCheck, 
  Github, 
  Linkedin, 
  Mail, 
  Users,
  Copy,
  Heart
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AboutPage() {
  const { toast } = useToast();

  const handleCopyEmail = (email: string, name: string) => {
    navigator.clipboard.writeText(email);
    toast({
      title: "Email Copied",
      description: `${name}'s email has been copied to your clipboard.`,
    });
  };

  const developers = [
    {
      name: "Swapnil",
      github: "https://github.com/swapnilAngarkhe",
      linkedin: "https://www.linkedin.com/in/swapnilangarkhe/",
      email: "swapnilangarkhe@proton.me",
      role: "Founder & Lead Engineer",
      description: "A Full Stack Engineer and Web Designer proficient in Next.js, Django, and Flask, currently pivoting towards DevOps. Swapnil is the visionary behind ForgeHive, leading the frontend architecture, system integration, deployment, and version control."
    },
    {
      name: "Ahmed",
      github: "https://github.com/IAK477",
      linkedin: "https://www.linkedin.com/in/ahmed-kazi-4891a2294/",
      email: "ahmedkazi477@gmail.com",
      role: "Backend Architect & Designer",
      description: "A specialist in backend engineering and database design. Ahmed architected ForgeHive's data infrastructure using Supabase, where he expertly handled authentication flows and engineered robust SQL schemas. Efficient table structures and secure data management ensures the platform's reliability."
    }
  ];

  return (
    <div className="flex flex-1 flex-col items-center p-6 md:p-12 lg:p-20 bg-muted/40 font-poppins animate-in fade-in duration-500">
      <div className="w-full max-w-4xl space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-headline">About ForgeHive</h1>
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

        {/* Developers Section */}
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <Users className="h-8 w-8 text-accent" />
            <h2 className="text-3xl font-bold font-headline">Meet the Developers</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {developers.map((dev) => (
              <Card key={dev.name} className="border-none shadow-lg bg-card/50 backdrop-blur-sm group hover:bg-card/80 transition-all duration-300">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">{dev.name}</CardTitle>
                  <p className="text-sm text-accent uppercase tracking-widest font-semibold">{dev.role}</p>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-muted-foreground">
                    {dev.description}
                  </p>
                  
                  <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" asChild className="rounded-full hover:border-primary hover:text-primary transition-colors">
                      <a href={dev.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4 mr-2" />
                        GitHub
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors">
                      <a href={dev.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-4 w-4 mr-2" />
                        LinkedIn
                      </a>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleCopyEmail(dev.email, dev.name)}
                      className="rounded-full hover:border-green-500 hover:text-green-500 transition-colors group/mail"
                    >
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                      <Copy className="h-3 w-3 ml-2 opacity-0 group-hover/mail:opacity-100 transition-opacity" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
                100% Open Source Stack
              </h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Framer Motion</Badge>
                <Badge variant="secondary">GSAP</Badge>
                <Badge variant="secondary">Lucide Icons</Badge>
                <Badge variant="secondary">Zod</Badge>
                <Badge variant="secondary">React Hook Form</Badge>
              </div>
              <p className="text-sm text-muted-foreground italic flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 fill-current" />
                Every single technology used to build ForgeHive is open source itself. This is a community platform built by open source nerds, for open source nerds, leveraging the latest advancements in the React and Next.js ecosystem to empower the next generation of builders.
              </p>
            </div>
          </CardContent>
        </Card>

        <footer className="text-center text-sm text-muted-foreground pt-8 pb-12">
          <p>© {new Date().getFullYear()} ForgeHive. Open Source for the Open Mind.</p>
        </footer>
      </div>
    </div>
  );
}
