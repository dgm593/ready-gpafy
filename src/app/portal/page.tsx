
"use client";

import { useState } from 'react';
import { ChevronLeft, Globe, ShieldCheck, ExternalLink, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import Link from 'next/link';

export default function PortalPage() {
  const JU_PORTAL_URL = 'https://portal.ju.edu.et';

  const handleOpenPortal = () => {
    window.open(JU_PORTAL_URL, '_blank');
  };

  return (
    <div className="py-6 space-y-6 max-w-md mx-auto pb-24">
      <header className="flex items-center gap-4 px-2">
        <Link href="/">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-headline text-primary">Academic Portal</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">University Gateway</p>
        </div>
      </header>

      <section className="px-2 space-y-6">
        <Card className="border-none shadow-2xl bg-white dark:bg-card rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 bg-primary/5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-white dark:bg-card flex items-center justify-center text-primary shadow-sm border border-primary/10">
                <GraduationCap className="w-5 h-5" />
              </div>
              <CardTitle className="text-lg font-black font-headline">Jimma University</CardTitle>
            </div>
            <CardDescription className="text-xs font-bold text-muted-foreground/70">
              Access your official academic records, course registrations, and grade reports directly from the JU student portal.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-8 space-y-6">
            <div className="p-4 bg-muted/20 rounded-2xl border border-border/50 text-center space-y-1">
              <p className="text-[8px] font-black uppercase text-muted-foreground tracking-widest">Official URL</p>
              <p className="text-sm font-black text-primary truncate">portal.ju.edu.et</p>
            </div>

            <Button 
              className="w-full h-16 font-black font-headline text-lg bg-secondary text-secondary-foreground shadow-xl shadow-secondary/20 active-scale rounded-2xl"
              onClick={handleOpenPortal}
            >
              Access Portal <ExternalLink className="w-5 h-5 ml-2" />
            </Button>
          </CardContent>
        </Card>

        <div className="p-6 bg-primary/5 rounded-[2rem] border border-dashed border-primary/20 flex items-start gap-4">
          <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-1" />
          <div className="space-y-1">
            <h4 className="text-xs font-black uppercase tracking-tight">Secure Bridge</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-bold">
              GPAfy acts as a shortcut to your university portal. We never see or store your login credentials. Your privacy is protected by local encryption.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
