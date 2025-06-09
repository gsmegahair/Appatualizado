"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Monitor, Palette, Check } from "lucide-react"
import { useTheme } from "../hooks/use-theme"
import { colorPalettes } from "../utils/color-palettes"

export function ThemeSelector() {
  const { currentMode, themeMode, colorPalette, setThemeMode, setColorPalette } = useTheme()

  const themeModeOptions = [
    { value: "light", label: "Claro", icon: Sun },
    { value: "dark", label: "Escuro", icon: Moon },
    { value: "auto", label: "Automático", icon: Monitor },
  ]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sun className="h-5 w-5" />
            Modo de Tema
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {themeModeOptions.map((option) => {
              const Icon = option.icon
              const isSelected = themeMode === option.value

              return (
                <Button
                  key={option.value}
                  variant={isSelected ? "default" : "outline"}
                  className="flex flex-col items-center gap-2 h-auto py-4"
                  onClick={() => setThemeMode(option.value as "light" | "dark" | "auto")}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-sm">{option.label}</span>
                  {isSelected && <Check className="h-4 w-4" />}
                </Button>
              )
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Modo atual:</strong> {currentMode === "light" ? "Claro" : "Escuro"}
              {themeMode === "auto" && " (detectado automaticamente)"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Paleta de Cores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Object.entries(colorPalettes).map(([key, palette]) => {
              const isSelected = colorPalette === key
              const currentPalette = palette[currentMode]

              return (
                <div
                  key={key}
                  className={`relative cursor-pointer rounded-lg border-2 transition-all ${
                    isSelected
                      ? "border-primary shadow-lg scale-105"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                  onClick={() => setColorPalette(key)}
                >
                  <div className="p-3">
                    <div className="flex items-center gap-2 mb-3">
                      <div
                        className="w-4 h-4 rounded-full border"
                        style={{ backgroundColor: currentPalette.primary }}
                      />
                      <span className="text-sm font-medium">{currentPalette.name}</span>
                    </div>

                    <div className="grid grid-cols-4 gap-1 mb-2">
                      <div
                        className="w-full h-6 rounded"
                        style={{ backgroundColor: currentPalette.primary }}
                        title="Primária"
                      />
                      <div
                        className="w-full h-6 rounded"
                        style={{ backgroundColor: currentPalette.secondary }}
                        title="Secundária"
                      />
                      <div
                        className="w-full h-6 rounded"
                        style={{ backgroundColor: currentPalette.accent }}
                        title="Destaque"
                      />
                      <div
                        className="w-full h-6 rounded border"
                        style={{ backgroundColor: currentPalette.background }}
                        title="Fundo"
                      />
                    </div>

                    <div className="text-xs text-center text-gray-600 dark:text-gray-400">
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div
            className="mt-6 p-4 border rounded-lg"
            style={{
              backgroundColor: colorPalettes[colorPalette][currentMode].surface,
              borderColor: colorPalettes[colorPalette][currentMode].border,
            }}
          >
            <h4
              className="font-semibold mb-3"
              style={{
                color: colorPalettes[colorPalette][currentMode].text,
              }}
            >
              Prévia do Tema Selecionado
            </h4>

            <div className="flex flex-wrap gap-2 mb-3">
              <div
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: colorPalettes[colorPalette][currentMode].primary }}
              >
                Botão Primário
              </div>
              <div
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: colorPalettes[colorPalette][currentMode].secondary }}
              >
                Botão Secundário
              </div>
              <div
                className="px-3 py-1 rounded text-white text-sm"
                style={{ backgroundColor: colorPalettes[colorPalette][currentMode].accent }}
              >
                Destaque
              </div>
            </div>

            <p
              className="text-sm"
              style={{
                color: colorPalettes[colorPalette][currentMode].textSecondary,
              }}
            >
              Este é um exemplo de texto secundário com a paleta selecionada.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
