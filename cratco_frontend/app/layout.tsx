import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import {NavigationBar} from "@/components/NavigationBar";
import { AuthProvider } from '@/contexts/AuthContext';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Cratco",
  description: "Cratco - Custom links and URL shortener.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
          <AuthProvider>
              <NavigationBar/>
              <div id="content" >
                  {children}
              </div>
          </AuthProvider>
          </body>
    </html>
  );
}
