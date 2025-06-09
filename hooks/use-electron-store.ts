"use client"

import { useState, useEffect } from "react"

// Verifica se estamos em ambiente Electron
const isElectron = typeof window !== "undefined" && window.electronAPI !== undefined

export function useElectronStore<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Carrega o valor do store ao inicializar
  useEffect(() => {
    const loadValue = async () => {
      try {
        if (isElectron) {
          try {
            const storedValue = await window.electronAPI.store.get(key)
            if (storedValue !== undefined) {
              setValue(storedValue)
            }
          } catch (error) {
            console.error(`Erro ao carregar valor para ${key}:`, error)
            setError(error instanceof Error ? error : new Error("Erro desconhecido"))
          }
        } else {
          // Fallback para localStorage quando não estiver no Electron
          try {
            const item = localStorage.getItem(key)
            if (item) {
              setValue(JSON.parse(item))
            }
          } catch (error) {
            console.error(`Erro ao carregar do localStorage para ${key}:`, error)
            setError(error instanceof Error ? error : new Error("Erro ao carregar do localStorage"))
          }
        }
      } catch (e) {
        console.error("Erro ao carregar dados:", e)
        setError(e instanceof Error ? e : new Error("Erro desconhecido"))
      } finally {
        setLoaded(true)
      }
    }

    loadValue()
  }, [key])

  // Função para atualizar o valor
  const updateValue = async (newValue: T) => {
    try {
      setValue(newValue)

      if (isElectron) {
        try {
          await window.electronAPI.store.set(key, newValue)
        } catch (error) {
          console.error(`Erro ao salvar valor para ${key}:`, error)
          throw error
        }
      } else {
        // Fallback para localStorage
        try {
          localStorage.setItem(key, JSON.stringify(newValue))
        } catch (error) {
          console.error(`Erro ao salvar no localStorage para ${key}:`, error)
          throw error
        }
      }
    } catch (e) {
      console.error("Erro ao atualizar dados:", e)
      throw e
    }
  }

  return [value, updateValue, loaded, error] as const
}

// Hook específico para gerenciar imagens
export function useImageManager() {
  const saveImage = async (imageData: string): Promise<string> => {
    if (!imageData) {
      throw new Error("Dados da imagem não fornecidos")
    }

    try {
      if (typeof window !== "undefined" && window.electronAPI) {
        try {
          const fileName = `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}.jpg`
          const savedPath = await window.electronAPI.images.save(imageData, fileName)
          return `electron://image/${fileName}`
        } catch (error) {
          console.error("Erro ao salvar imagem:", error)
          throw error
        }
      } else {
        // No navegador, retornar o base64 diretamente
        return imageData
      }
    } catch (error) {
      console.error("Erro ao salvar imagem:", error)
      throw error
    }
  }

  const loadImage = async (imagePath: string): Promise<string> => {
    if (!imagePath) {
      return "/placeholder.svg"
    }

    try {
      if (imagePath.startsWith("electron://image/")) {
        const fileName = imagePath.replace("electron://image/", "")
        if (typeof window !== "undefined" && window.electronAPI) {
          try {
            const imageData = await window.electronAPI.images.load(fileName)
            return imageData || "/placeholder.svg"
          } catch (error) {
            console.error("Erro ao carregar imagem:", error)
            return "/placeholder.svg"
          }
        }
      }
      return imagePath || "/placeholder.svg"
    } catch (error) {
      console.error("Erro ao carregar imagem:", error)
      return "/placeholder.svg"
    }
  }

  const deleteImage = async (imagePath: string): Promise<boolean> => {
    if (!imagePath) {
      return false
    }

    try {
      if (imagePath.startsWith("electron://image/")) {
        const fileName = imagePath.replace("electron://image/", "")
        if (typeof window !== "undefined" && window.electronAPI) {
          try {
            return await window.electronAPI.images.delete(fileName)
          } catch (error) {
            console.error("Erro ao deletar imagem:", error)
            return false
          }
        }
      }
      return true
    } catch (error) {
      console.error("Erro ao deletar imagem:", error)
      return false
    }
  }

  const selectImageFile = async (): Promise<string | null> => {
    try {
      if (typeof window !== "undefined" && window.electronAPI) {
        try {
          return await window.electronAPI.images.selectFile()
        } catch (error) {
          console.error("Erro ao selecionar arquivo:", error)
          return null
        }
      }
      return null
    } catch (error) {
      console.error("Erro ao selecionar arquivo:", error)
      return null
    }
  }

  return {
    saveImage,
    loadImage,
    deleteImage,
    selectImageFile,
  }
}
