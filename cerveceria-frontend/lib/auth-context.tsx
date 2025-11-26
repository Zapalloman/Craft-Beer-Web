"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { api } from "./api-client"
import type { Usuario, LoginCredentials, RegisterData } from "./types"

interface AuthContextType {
  usuario: Usuario | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay sesion al cargar
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("access_token")
      const usuarioGuardado = localStorage.getItem("usuario")

      if (token && usuarioGuardado) {
        try {
          setUsuario(JSON.parse(usuarioGuardado))
        } catch {
          localStorage.removeItem("access_token")
          localStorage.removeItem("usuario")
        }
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = useCallback(async (credentials: LoginCredentials) => {
    const response = await api.login(credentials)
    setUsuario(response.usuario)
  }, [])

  const register = useCallback(async (data: RegisterData) => {
    const response = await api.register(data)
    setUsuario(response.usuario)
  }, [])

  const logout = useCallback(() => {
    api.logout()
    setUsuario(null)
    localStorage.removeItem("usuario")
  }, [])

  return (
    <AuthContext.Provider
      value={{
        usuario,
        isLoading,
        isAuthenticated: !!usuario,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider")
  }
  return context
}
