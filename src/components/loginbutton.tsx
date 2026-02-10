"use client";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login">
      <button className="px-5 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold transition-all duration-300 hover:from-blue-500 hover:to-blue-600 cursor-pointer hover:scale-105">
        Login
      </button>
    </Link>
  );
}
