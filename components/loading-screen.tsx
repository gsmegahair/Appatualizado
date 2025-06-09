"use client"

import { LoaderPinwheelIcon as Spinner } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="main-container bg-gradient-theme min-h-screen flex flex-col items-center justify-center">
      <div className="glass-card p-8 rounded-xl text-center">
        <Spinner className="h-12 w-12 animate-spin text-theme-primary mb-4 mx-auto glow-effect" />
        <h2 className="text-2xl font-bold bg-gradient-header bg-clip-text text-transparent mb-2">Carregando...</h2>
        <p className="text-muted-foreground">Iniciando GS Mega Hair Studio</p>

        {/* Barra de loading com gradiente */}
        <div className="mt-6 w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full gradient-loading rounded-full"></div>
        </div>
      </div>
    </div>
  )
}
