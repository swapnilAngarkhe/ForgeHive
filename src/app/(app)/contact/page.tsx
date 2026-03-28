'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, MessageSquare, Send, MapPin, Rocket, ExternalLink } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

export default function ContactPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      message: '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Simulated submission
    console.log('Form values:', values);
    toast({
      title: 'Message Sent!',
      description: "Thanks for reaching out. We'll get back to you soon.",
    });
    form.reset();
  };

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 md:p-12 bg-muted/40 animate-in fade-in duration-500">
      <div className="w-full max-w-4xl space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight font-headline">Contact Us</h1>
              <p className="text-lg text-muted-foreground">
                Have questions about ForgeHive or want to say hi? We'd love to hear from you.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-primary/10 text-primary">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Email</p>
                  <p className="text-muted-foreground">hello@forgehive.dev</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-accent/10 text-accent">
                  <MessageSquare className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Community</p>
                  <p className="text-muted-foreground">Join our Discord server for real-time support.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 rounded-full bg-secondary text-secondary-foreground">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <p className="font-semibold text-lg">Based in</p>
                  <p className="text-muted-foreground">The Open Source Cloud</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="border-none shadow-xl bg-card/50 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl font-bold font-headline">Send a message</CardTitle>
              <CardDescription>
                Fill out the form below and our team will be in touch.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Your Name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="m@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="How can we help you?" 
                            className="min-h-[120px] resize-none"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 group"
                  >
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                    Send Message
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Tool Submission Section */}
        <Card className="border-none shadow-lg bg-primary text-primary-foreground overflow-hidden">
          <div className="relative p-8 md:p-12 flex flex-col md:flex-row items-center gap-8">
            <div className="flex-1 space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 text-primary-foreground text-xs font-bold uppercase tracking-widest">
                <Rocket className="h-3 w-3" />
                Featured Tools
              </div>
              <h2 className="text-3xl font-bold font-headline">List your open source tool in ForgeHive</h2>
              <p className="text-primary-foreground/80 text-lg max-w-xl">
                Are you building something amazing? We want to see it. Submit your tool to our curated directory and help thousands of developers discover your project.
              </p>
            </div>
            <div className="shrink-0">
              <Button 
                asChild 
                size="lg" 
                variant="accent" 
                className="rounded-full px-8 py-6 h-auto text-lg font-bold group"
              >
                <a 
                  href="https://forms.gle/TvLBp3y3PxZqyZY26" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3"
                >
                  Submit Tool
                  <ExternalLink className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                </a>
              </Button>
            </div>
            
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl pointer-events-none" />
          </div>
        </Card>
      </div>
    </div>
  );
}
