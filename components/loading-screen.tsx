"use client"

import { LoaderPinwheelIcon as Spinner } from "lucide-react"

export function LoadingScreen() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
      <Spinner className="h-12 w-12 animate-spin text-pink-500 mb-4" />
      <h2 className="text-2xl font-bold text-gray-800">Carregando...</h2>
      <p className="text-gray-600 mt-2">Iniciando GS Mega Hair Studio</p>
    </div>
  )
}
