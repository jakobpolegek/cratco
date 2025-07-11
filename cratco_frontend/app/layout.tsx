import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { NavigationBar } from '@/components/NavigationBar';
import { AuthProvider } from '@/contexts/AuthContext';
import NextAuthProvider from '@/components/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Cratco - Custom links and URL shortener.',
  description: 'Cratco - Custom links and URL shortener.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextAuthProvider>
          <AuthProvider>
            <NavigationBar />
            <div id="content" className="mx-5 mt-20 pt-4 min-h-screen">
              {children}
            </div>
          </AuthProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
