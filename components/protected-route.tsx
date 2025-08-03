"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth"

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Small delay to ensure auth state is loaded from storage
    const timer = setTimeout(() => {
      if (!isAuthenticated) {
        console.log("🔒 Not authenticated, redirecting to login...")
        router.push("/login")
      } else {
        console.log("✅ Authenticated, allowing access...")
        setIsChecking(false)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [isAuthenticated, router])

  // Show loading while checking authentication
  if (isChecking || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
