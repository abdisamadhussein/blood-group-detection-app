"use client"

import type React from "react"

import { ProtectedRoute } from "@/components/protected-route"
import { AdminNavigation } from "@/components/admin-navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        <AdminNavigation />
        <main>{children}</main>
      </div>
    </ProtectedRoute>
  )
}
