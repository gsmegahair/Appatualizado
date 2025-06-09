"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useElectronStore } from "../hooks/use-electron-store"
import type { AppConfig } from "../types"

const defaultConfig: AppConfig = {
  appName: "GS Mega Hair Studio Agendamento",
  logoUrl: "/placeholder.svg?height=100&width=200",
  headerLogoUrl: "/placeholder.svg?height=60&width=120",
  calendarLogoUrl: "/placeholder.svg?height=80&width=80",
  businessName: "GS Mega Hair Studio",
  businessPhone: "(11) 99999-9999",
  businessEmail: "contato@gsmegahair.com",
  businessAddress: "Rua das Flores, 123 - Centro",
  whatsappNumber: "5511999999999",
  reminderSettings: {
    monthly: true,
    bimonthly: true,
    quarterly: true,
  },
  birthdayReminders: true,
  theme: {
    mode: "light",
    colorPalette: "pink",
  },
  loginCredentials: {
    username: "GSmega",
    password: "4846",
  },
  clientFields: {
    showPhone: true,
    showEmail: true,
    showBirthDate: true,
    showAddress: true,
    showNotes: true,
    showLastMaintenance: true,
    showMegaHairMethod: true, // Novo campo
    requirePhone: false,
    requireEmail: false,
  },
  appointmentSettings: {
    allowSameDayBooking: true,
    maxAdvanceBookingDays: 90,
    defaultDuration: 60,
    showPrice: true,
  },
  exportSettings: {
    includePersonalData: true,
    dateFormat: "DD/MM/YYYY",
    currency: "BRL",
  },
}

interface ConfigContextType {
  config: AppConfig
  updateConfig: (newConfig: Partial<AppConfig>) => void
  isLoaded: boolean
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined)

export function ConfigProvider({ children }: { children: ReactNode }) {
  const [config, setConfig, isLoaded] = useElectronStore<AppConfig>("gs-mega-config", defaultConfig)

  const updateConfig = (newConfig: Partial<AppConfig>) => {
    const updatedConfig = { ...config, ...newConfig }
    setConfig(updatedConfig)
  }

  return <ConfigContext.Provider value={{ config, updateConfig, isLoaded }}>{children}</ConfigContext.Provider>
}

export function useConfig() {
  const context = useContext(ConfigContext)
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider")
  }
  return context
}
