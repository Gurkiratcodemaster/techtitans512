"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import LoginButton from "./loginbutton";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const hideNavbar = pathname === "/login";

  return (
    <div className="bg-blue-50 min-h-screen">
      {!hideNavbar && <>
        <Navbar />
        <LoginButton />
      </>}
      <main>{children}</main>
    </div>
  );
}
