import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from './providers';
import ClientLayout from '@/components/ClientLayout';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Career Path Explorer",
  description: "Discover your career path and plan your future",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
