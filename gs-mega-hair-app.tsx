"use client"

import { AuthProvider, useAuth } from "./contexts/auth-context"
import { ConfigProvider, useConfig } from "./contexts/config-context"
import { LoginForm } from "./components/login-form"
import { Dashboard } from "./components/dashboard"
import { LoadingScreen } from "./components/loading-screen"
import { useData } from "./hooks/use-data"
import { useTheme } from "./hooks/use-theme"

function AppContent() {
  const { user, isLoaded: authLoaded } = useAuth()
  const { isLoaded: configLoaded } = useConfig()
  const { isLoaded: dataLoaded } = useData()

  // Inicializar o tema
  useTheme()

  // Mostrar tela de carregamento enquanto os dados estão sendo carregados
  if (!authLoaded || !configLoaded || !dataLoaded) {
    return <LoadingScreen />
  }

  if (!user) {
    return <LoginForm />
  }

  return <Dashboard />
}

export default function GSMegaHairApp() {
  return (
    <div className="bg-gradient-theme min-h-screen">
      <ConfigProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ConfigProvider>
    </div>
  )
}
