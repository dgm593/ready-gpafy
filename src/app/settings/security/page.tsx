
"use client";

import { useState, useEffect } from 'react';
import { ChevronLeft, ShieldCheck, Lock, Trash2, Save, KeyRound } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function SecuritySettingsPage() {
  const { toast } = useToast();
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [hasPin, setHasPin] = useState(false);

  useEffect(() => {
    const savedPin = localStorage.getItem('gpafy_pin');
    setHasPin(!!savedPin);
  }, []);

  const handleSavePin = () => {
    if (pin.length !== 4) {
      toast({ variant: "destructive", title: "Invalid PIN", description: "PIN must be 4 digits long." });
      return;
    }
    if (pin !== confirmPin) {
      toast({ variant: "destructive", title: "Mismatch", description: "PINs do not match." });
      return;
    }

    localStorage.setItem('gpafy_pin', pin);
    setHasPin(true);
    setPin('');
    setConfirmPin('');
    toast({ title: "Security Enabled", description: "Your app is now protected by a PIN." });
  };

  const handleRemovePin = () => {
    localStorage.removeItem('gpafy_pin');
    setHasPin(false);
    toast({ title: "Security Disabled", description: "PIN protection has been removed." });
  };

  return (
    <div className="py-6 space-y-6 max-w-md mx-auto pb-24">
      <header className="flex items-center gap-4 px-2">
        <Link href="/settings">
          <Button variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-bold font-headline">Security Lock</h1>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tight">App Protection</p>
        </div>
      </header>

      <section className="px-2 space-y-6">
        <Card className="border-none shadow-sm bg-white dark:bg-card rounded-[2rem] overflow-hidden">
          <CardHeader className="p-6 bg-primary/5">
            <div className="flex items-center gap-2 mb-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <CardTitle className="text-lg font-black font-headline">Privacy Lock</CardTitle>
            </div>
            <CardDescription className="text-xs font-medium">
              Protect your academic records with a 4-digit PIN.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {!hasPin ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">New 4-Digit PIN</Label>
                  <Input 
                    type="password" 
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="...."
                    value={pin}
                    onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="h-14 rounded-2xl text-center text-2xl font-black tracking-[1em] border-border/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase text-muted-foreground">Confirm PIN</Label>
                  <Input 
                    type="password" 
                    inputMode="numeric"
                    maxLength={4}
                    placeholder="...."
                    value={confirmPin}
                    onChange={e => setConfirmPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    className="h-14 rounded-2xl text-center text-2xl font-black tracking-[1em] border-border/50"
                  />
                </div>
                <Button 
                  className="w-full h-14 rounded-2xl font-black bg-secondary text-secondary-foreground shadow-lg shadow-secondary/20"
                  onClick={handleSavePin}
                >
                  <Save className="w-4 h-4 mr-2" /> Enable PIN Lock
                </Button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
                  <div className="w-10 h-10 bg-white dark:bg-card rounded-xl flex items-center justify-center text-primary shadow-sm">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold">App Lock is Active</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Your data is currently protected.</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full h-14 rounded-2xl font-black text-destructive border-destructive/20 hover:bg-destructive/5"
                  onClick={handleRemovePin}
                >
                  <Trash2 className="w-4 h-4 mr-2" /> Disable Security
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="p-6 bg-muted/30 rounded-[2rem] border border-dashed border-border flex flex-col items-center text-center space-y-3">
          <KeyRound className="w-8 h-8 text-primary/40" />
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-primary">Local Storage Only</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed font-medium">
              Your security PIN is stored locally on this device. If you clear your browser cache, the PIN will be reset.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
