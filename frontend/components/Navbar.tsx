"use client";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { FiLogOut } from "react-icons/fi";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex items-center justify-between px-4 py-2 bg-primary text-white">
      <Link href="/dashboard" className="font-bold text-lg">
        Task Manager
      </Link>
      {session ? (
        <div className="flex items-center gap-2">
          <span>{session.user?.name ?? session.user?.email}</span>
          <button
            onClick={() => signOut()}
            className="p-2 rounded hover:bg-primary/80"
          >
            <FiLogOut />
          </button>
        </div>
      ) : (
        <div className="flex gap-4">
          <Link href="/login" className="underline">
            ログイン
          </Link>
          <Link href="/register" className="underline">
            新規登録
          </Link>
        </div>
      )}
    </nav>
  );
} 