"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Home, Users, UserPlus, Activity, BarChart3, LogOut, User } from "lucide-react"
import { useAuth } from "@/lib/auth"
import { trpc } from "@/lib/trpc/client"

const navigation = [
  { name: "Home", href: "/admin", icon: Home },
  { name: "Dashboard", href: "/admin/dashboard", icon: BarChart3 },
  { name: "Patients", href: "/admin/patients", icon: Users },
  { name: "Register Patient", href: "/admin/register", icon: UserPlus },
  { name: "Scan", href: "/admin/scan", icon: Activity },
]

export function AdminNavigation() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuth()

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout()
      router.push("/login")
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
      <div className="max-w-8xl mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-8">
            <Link href="/admin" className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">BloodScan Pro</span>
            </Link>

            <div className="hidden md:flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href
                return (
                  <Button
                    key={item.name}
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    asChild
                    className={isActive ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Link href={item.href} className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </Link>
                  </Button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <User className="h-4 w-4 text-gray-600" />
                <span className="text-sm font-medium text-gray-700">{user?.name}</span>
              </div>
              <Badge variant="secondary" className="text-xs">
                {user?.role}
              </Badge>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              disabled={logoutMutation.isLoading}
              className="flex items-center space-x-2 bg-transparent"
            >
              <LogOut className="h-4 w-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
