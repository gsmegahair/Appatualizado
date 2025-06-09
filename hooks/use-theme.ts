"use client"

import { useEffect, useState } from "react"
import { useConfig } from "../contexts/config-context"
import { getColorPalette, applyTheme, detectSystemTheme } from "../utils/color-palettes"

export function useTheme() {
  const { config, updateConfig } = useConfig()
  const [currentMode, setCurrentMode] = useState<"light" | "dark">("light")

  useEffect(() => {
    // Determinar o modo atual
    let mode: "light" | "dark"

    if (config.theme.mode === "auto") {
      mode = detectSystemTheme()
    } else {
      mode = config.theme.mode
    }

    setCurrentMode(mode)

    // Aplicar o tema com gradientes
    const palette = getColorPalette(config.theme.colorPalette, mode)
    applyTheme(palette, mode)

    // Adicionar classe ao body para modo escuro
    if (mode === "dark") {
      document.body.classList.add("dark")
    } else {
      document.body.classList.remove("dark")
    }

    // Aplicar gradiente de fundo ao body
    document.body.style.background = "var(--gradient-background)"
    document.body.style.minHeight = "100vh"
    document.body.style.transition = "background 0.5s ease"

    // Listener para mudanças no tema do sistema
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)")
    const handleChange = () => {
      if (config.theme.mode === "auto") {
        const newMode = detectSystemTheme()
        setCurrentMode(newMode)
        const newPalette = getColorPalette(config.theme.colorPalette, newMode)
        applyTheme(newPalette, newMode)

        if (newMode === "dark") {
          document.body.classList.add("dark")
        } else {
          document.body.classList.remove("dark")
        }

        // Atualizar gradiente de fundo
        document.body.style.background = "var(--gradient-background)"
      }
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [config.theme])

  const setThemeMode = (mode: "light" | "dark" | "auto") => {
    updateConfig({
      theme: {
        ...config.theme,
        mode,
      },
    })
  }

  const setColorPalette = (paletteKey: string) => {
    updateConfig({
      theme: {
        ...config.theme,
        colorPalette: paletteKey,
      },
    })
  }

  const toggleTheme = () => {
    const newMode = currentMode === "light" ? "dark" : "light"
    setThemeMode(newMode)
  }

  return {
    currentMode,
    themeMode: config.theme.mode,
    colorPalette: config.theme.colorPalette,
    setThemeMode,
    setColorPalette,
    toggleTheme,
  }
}
