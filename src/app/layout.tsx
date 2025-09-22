import type { Metadata } from "next";
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import { Poppins } from 'next/font/google';

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins'
});

export const metadata: Metadata = {
  title: "Career Choice",
  description: "A platform to help students choose right career paths",
  manifest: "/manifest.json",
  keywords: ["career guidance", "education", "JEE", "NEET", "MBA", "Indian students"],
  authors: [{name: "Career Choice Team"}],
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Career Choice",
  },
  openGraph: {
    title: "Career Choice - AI Career Guidance",
    description: "AI-powered career guidance for Indian students. Works offline!",
    type: "website",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#1E40AF',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} font-sans`}>
        {/* Delegate rendering of Navbar & children to ClientLayout */}
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
