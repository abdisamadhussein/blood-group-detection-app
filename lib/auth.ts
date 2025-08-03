import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "operator" | "viewer"
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  setUser: (user: User) => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        console.log('🔐 Attempting login with:', email)
        
        // Simple authentication - in production, this would call your API
        if (email === "admin@bloodscan.com" && password === "admin123") {
          const user: User = {
            id: "1",
            email: "admin@bloodscan.com",
            name: "Admin User",
            role: "admin",
          }
          console.log('✅ Login successful for:', user.email)
          set({ user, isAuthenticated: true })
          return true
        }
        
        console.log('❌ Login failed for:', email)
        return false
      },
      logout: () => {
        console.log('🚪 Logging out user')
        set({ user: null, isAuthenticated: false })
      },
      setUser: (user: User) => {
        console.log('👤 Setting user:', user.email)
        set({ user, isAuthenticated: true })
      },
    }),
    {
      name: "auth-storage",
    },
  ),
)
