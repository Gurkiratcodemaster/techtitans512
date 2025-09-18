"use client";
import Link from "next/link";

export default function LoginButton() {
  return (
    <Link href="/login">
      <button className="px-5 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700">
        Login
      </button>
    </Link>
  );
}
