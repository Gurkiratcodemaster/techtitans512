"use client";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login">
      <button className="px-5 py-2 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-full font-semibold transition-all duration-300 hover:bg-blue-700 cursor-pointer hover:scale-105">
        Login
      </button>
    </Link>
  );
}
