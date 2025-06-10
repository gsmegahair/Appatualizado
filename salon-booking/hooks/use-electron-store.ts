"use client"

import { useState, useEffect } from "react"

// Verifica se estamos em ambiente Electron
const isElectron = typeof window !== "undefined" && window.electronAPI !== undefined

export function useElectronStore<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)
  const [loaded, setLoaded] = useState(false)

  // Carrega o valor do store ao inicializar
  useEffect(() => {
    const loadValue = async () => {
      if (isElectron) {
        try {
          const storedValue = await window.electronAPI.store.get(key)
          if (storedValue !== undefined) {
            setValue(storedValue)
          }
        } catch (error) {
          console.error(`Erro ao carregar valor para ${key}:`, error)
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
        }
      }
      setLoaded(true)
    }

    loadValue()
  }, [key])

  // Função para atualizar o valor
  const updateValue = async (newValue: T) => {
    setValue(newValue)

    if (isElectron) {
      try {
        await window.electronAPI.store.set(key, newValue)
      } catch (error) {
        console.error(`Erro ao salvar valor para ${key}:`, error)
      }
    } else {
      // Fallback para localStorage
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error(`Erro ao salvar no localStorage para ${key}:`, error)
      }
    }
  }

  return [value, updateValue, loaded] as const
}

// Hook específico para gerenciar imagens
export function useImageManager() {
  const saveImage = async (imageData: string): Promise<string> => {
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
  }

  const loadImage = async (imagePath: string): Promise<string> => {
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
  }

  const deleteImage = async (imagePath: string): Promise<boolean> => {
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
  }

  const selectImageFile = async (): Promise<string | null> => {
    if (typeof window !== "undefined" && window.electronAPI) {
      try {
        return await window.electronAPI.images.selectFile()
      } catch (error) {
        console.error("Erro ao selecionar arquivo:", error)
        return null
      }
    }
    return null
  }

  return {
    saveImage,
    loadImage,
    deleteImage,
    selectImageFile,
  }
}
