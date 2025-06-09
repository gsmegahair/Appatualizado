import type { ColorPalette } from "../types"

export const colorPalettes: Record<string, { light: ColorPalette; dark: ColorPalette }> = {
  pink: {
    light: {
      name: "Rosa Clássico",
      primary: "#ec4899",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#fdf2f8",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Rosa Clássico",
      primary: "#f472b6",
      secondary: "#a78bfa",
      accent: "#fbbf24",
      background: "#0f0f23",
      surface: "#1e1b4b",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#374151",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  purple: {
    light: {
      name: "Roxo Elegante",
      primary: "#8b5cf6",
      secondary: "#06b6d4",
      accent: "#f59e0b",
      background: "#faf5ff",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Roxo Elegante",
      primary: "#a78bfa",
      secondary: "#22d3ee",
      accent: "#fbbf24",
      background: "#1e1b4b",
      surface: "#312e81",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#4c1d95",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  blue: {
    light: {
      name: "Azul Profissional",
      primary: "#3b82f6",
      secondary: "#06b6d4",
      accent: "#f59e0b",
      background: "#eff6ff",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Azul Profissional",
      primary: "#60a5fa",
      secondary: "#22d3ee",
      accent: "#fbbf24",
      background: "#0c1426",
      surface: "#1e3a8a",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#1e40af",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  green: {
    light: {
      name: "Verde Natural",
      primary: "#10b981",
      secondary: "#06b6d4",
      accent: "#f59e0b",
      background: "#ecfdf5",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Verde Natural",
      primary: "#34d399",
      secondary: "#22d3ee",
      accent: "#fbbf24",
      background: "#064e3b",
      surface: "#065f46",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#047857",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  orange: {
    light: {
      name: "Laranja Vibrante",
      primary: "#f97316",
      secondary: "#8b5cf6",
      accent: "#06b6d4",
      background: "#fff7ed",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Laranja Vibrante",
      primary: "#fb923c",
      secondary: "#a78bfa",
      accent: "#22d3ee",
      background: "#7c2d12",
      surface: "#9a3412",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#c2410c",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  red: {
    light: {
      name: "Vermelho Paixão",
      primary: "#ef4444",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#fef2f2",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Vermelho Paixão",
      primary: "#f87171",
      secondary: "#a78bfa",
      accent: "#fbbf24",
      background: "#7f1d1d",
      surface: "#991b1b",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#b91c1c",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  teal: {
    light: {
      name: "Azul Turquesa",
      primary: "#14b8a6",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#f0fdfa",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Azul Turquesa",
      primary: "#2dd4bf",
      secondary: "#a78bfa",
      accent: "#fbbf24",
      background: "#134e4a",
      surface: "#115e59",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#0f766e",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  indigo: {
    light: {
      name: "Índigo Moderno",
      primary: "#6366f1",
      secondary: "#06b6d4",
      accent: "#f59e0b",
      background: "#eef2ff",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Índigo Moderno",
      primary: "#818cf8",
      secondary: "#22d3ee",
      accent: "#fbbf24",
      background: "#312e81",
      surface: "#3730a3",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#4338ca",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  rose: {
    light: {
      name: "Rosa Suave",
      primary: "#f43f5e",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#fff1f2",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Rosa Suave",
      primary: "#fb7185",
      secondary: "#a78bfa",
      accent: "#fbbf24",
      background: "#881337",
      surface: "#9f1239",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#be123c",
      success: "#34d399",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
  emerald: {
    light: {
      name: "Esmeralda",
      primary: "#059669",
      secondary: "#8b5cf6",
      accent: "#f59e0b",
      background: "#ecfdf5",
      surface: "#ffffff",
      text: "#1f2937",
      textSecondary: "#6b7280",
      border: "#e5e7eb",
      success: "#10b981",
      warning: "#f59e0b",
      error: "#ef4444",
    },
    dark: {
      name: "Esmeralda",
      primary: "#10b981",
      secondary: "#a78bfa",
      accent: "#fbbf24",
      background: "#064e3b",
      surface: "#065f46",
      text: "#f9fafb",
      textSecondary: "#d1d5db",
      border: "#047857",
      success: "#10b981",
      warning: "#fbbf24",
      error: "#f87171",
    },
  },
}

export const getColorPalette = (paletteKey: string, mode: "light" | "dark"): ColorPalette => {
  const palette = colorPalettes[paletteKey]
  if (!palette) {
    return colorPalettes.pink[mode]
  }
  return palette[mode]
}

// Função para converter hex para RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? {
        r: Number.parseInt(result[1], 16),
        g: Number.parseInt(result[2], 16),
        b: Number.parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 }
}

// Função para gerar cores de gradiente baseadas na cor primária
const generateGradientColors = (primaryColor: string, mode: "light" | "dark") => {
  const rgb = hexToRgb(primaryColor)

  if (mode === "light") {
    // Para modo claro: gradiente mais suave
    const lighterRgb = {
      r: Math.min(255, rgb.r + 40),
      g: Math.min(255, rgb.g + 40),
      b: Math.min(255, rgb.b + 40),
    }

    const evenLighterRgb = {
      r: Math.min(255, rgb.r + 80),
      g: Math.min(255, rgb.g + 80),
      b: Math.min(255, rgb.b + 80),
    }

    return {
      primary: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      secondary: `rgb(${lighterRgb.r}, ${lighterRgb.g}, ${lighterRgb.b})`,
      tertiary: `rgb(${evenLighterRgb.r}, ${evenLighterRgb.g}, ${evenLighterRgb.b})`,
      quaternary: `rgb(${Math.min(255, evenLighterRgb.r + 30)}, ${Math.min(255, evenLighterRgb.g + 30)}, ${Math.min(255, evenLighterRgb.b + 30)})`,
    }
  } else {
    // Para modo escuro: gradiente mais escuro
    const darkerRgb = {
      r: Math.max(0, rgb.r - 60),
      g: Math.max(0, rgb.g - 60),
      b: Math.max(0, rgb.b - 60),
    }

    const evenDarkerRgb = {
      r: Math.max(0, rgb.r - 100),
      g: Math.max(0, rgb.g - 100),
      b: Math.max(0, rgb.b - 100),
    }

    return {
      primary: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
      secondary: `rgb(${darkerRgb.r}, ${darkerRgb.g}, ${darkerRgb.b})`,
      tertiary: `rgb(${evenDarkerRgb.r}, ${evenDarkerRgb.g}, ${evenDarkerRgb.b})`,
      quaternary: `rgb(${Math.max(0, evenDarkerRgb.r - 20)}, ${Math.max(0, evenDarkerRgb.g - 20)}, ${Math.max(0, evenDarkerRgb.b - 20)})`,
    }
  }
}

export const applyTheme = (palette: ColorPalette, mode: "light" | "dark") => {
  const root = document.documentElement

  // Aplicar variáveis CSS customizadas
  root.style.setProperty("--color-primary", palette.primary)
  root.style.setProperty("--color-secondary", palette.secondary)
  root.style.setProperty("--color-accent", palette.accent)
  root.style.setProperty("--color-background", palette.background)
  root.style.setProperty("--color-surface", palette.surface)
  root.style.setProperty("--color-text", palette.text)
  root.style.setProperty("--color-text-secondary", palette.textSecondary)
  root.style.setProperty("--color-border", palette.border)
  root.style.setProperty("--color-success", palette.success)
  root.style.setProperty("--color-warning", palette.warning)
  root.style.setProperty("--color-error", palette.error)

  // Gerar cores de gradiente baseadas na cor primária
  const gradientColors = generateGradientColors(palette.primary, mode)

  // Aplicar variáveis de gradiente
  root.style.setProperty("--gradient-primary", gradientColors.primary)
  root.style.setProperty("--gradient-secondary", gradientColors.secondary)
  root.style.setProperty("--gradient-tertiary", gradientColors.tertiary)
  root.style.setProperty("--gradient-quaternary", gradientColors.quaternary)

  // Criar gradientes dinâmicos
  if (mode === "light") {
    root.style.setProperty(
      "--gradient-background",
      `linear-gradient(135deg, ${gradientColors.quaternary} 0%, ${gradientColors.tertiary} 25%, ${gradientColors.secondary} 75%, ${gradientColors.primary} 100%)`,
    )
    root.style.setProperty(
      "--gradient-surface",
      `linear-gradient(145deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)`,
    )
    root.style.setProperty(
      "--gradient-card",
      `linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.85) 100%)`,
    )
  } else {
    root.style.setProperty(
      "--gradient-background",
      `linear-gradient(135deg, ${gradientColors.quaternary} 0%, ${gradientColors.tertiary} 25%, ${gradientColors.secondary} 75%, ${gradientColors.primary} 100%)`,
    )
    root.style.setProperty(
      "--gradient-surface",
      `linear-gradient(145deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.8) 100%)`,
    )
    root.style.setProperty(
      "--gradient-card",
      `linear-gradient(145deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)`,
    )
  }

  // Gradientes para botões
  root.style.setProperty(
    "--gradient-button-primary",
    `linear-gradient(135deg, ${palette.primary} 0%, ${gradientColors.secondary} 100%)`,
  )

  root.style.setProperty(
    "--gradient-button-secondary",
    `linear-gradient(135deg, ${palette.secondary} 0%, ${gradientColors.tertiary} 100%)`,
  )

  // Gradientes para headers
  root.style.setProperty(
    "--gradient-header",
    `linear-gradient(90deg, ${gradientColors.primary} 0%, ${gradientColors.secondary} 50%, ${gradientColors.tertiary} 100%)`,
  )
}

export const detectSystemTheme = (): "light" | "dark" => {
  if (typeof window !== "undefined") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
  }
  return "light"
}
