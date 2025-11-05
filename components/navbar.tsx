"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const pathname = usePathname()

  const linkClass = (path: string) =>
    `px-3 py-2 rounded-lg font-semibold transition ${
      pathname === path
        ? "bg-red-600 text-white"
        : "text-gray-400 hover:text-white hover:bg-gray-800"
    }`

  return (
    <nav className="flex items-center justify-center gap-4 bg-black/80 backdrop-blur sticky top-0 z-50 border-b border-gray-800 py-3">
      <Link href="/" className={linkClass("/")}>
        Cockpit 🏎️
      </Link>
      <Link href="/tasks" className={linkClass("/tasks")}>
        Tasks ✅
      </Link>
    </nav>
  )
}
