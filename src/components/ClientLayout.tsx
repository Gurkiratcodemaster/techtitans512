"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
  <div className="bg-blue-50 min-h-screen">
      {!hideNavbar && <Navbar />}
  <main className="pt-12">{children}</main>
    </div>
  );
}
