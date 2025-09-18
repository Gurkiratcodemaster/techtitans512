import type { Metadata } from "next";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";
import Chatbot from "@/components/chatbot";

export const metadata: Metadata = {
  title: "Career Choice",
  description: "A platform to help students choose right career paths",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Delegate rendering of Navbar & children to ClientLayout */}
        <ClientLayout>{children}</ClientLayout>
        <Chatbot />

      </body>
    </html>
  );
}
