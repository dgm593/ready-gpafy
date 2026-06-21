import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navigation } from '@/components/Navigation';
import { Toaster } from '@/components/ui/toaster';
import { SplashScreen } from '@/components/SplashScreen';
import { LockScreen } from '@/components/LockScreen';

export const metadata: Metadata = {
  title: 'GPAfy',
  description: 'Minimal academic utility for modern students.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'GPAfy',
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
};

export const viewport: Viewport = {
  themeColor: '#B8860B',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap" rel="stylesheet" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <link rel="apple-touch-icon" href="https://picsum.photos/seed/gpafy_app_192/192/192" />
      </head>
      <body className="font-body min-h-[100dvh] bg-background text-foreground overflow-x-hidden select-none touch-manipulation">
        <SplashScreen />
        <LockScreen>
          <main className="max-w-md mx-auto px-4 min-h-[100dvh] relative pb-[calc(100px+env(safe-area-inset-bottom))] pt-[env(safe-area-inset-top)]">
            {children}
          </main>
          <Navigation />
        </LockScreen>
        <Toaster />
      </body>
    </html>
  );
}
