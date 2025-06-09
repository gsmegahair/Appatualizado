"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, ImageIcon } from "lucide-react"

interface ImageUploadProps {
  label: string
  value: string
  onChange: (imageUrl: string) => void
  className?: string
  maxWidth?: number
  maxHeight?: number
}

export function ImageUpload({ label, value, onChange, className, maxWidth = 300, maxHeight = 200 }: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState<string>("/placeholder.svg")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Carregar imagem quando o valor mudar
  useEffect(() => {
    if (value) {
      loadImage(value)
    } else {
      setImageSrc("/placeholder.svg")
      setImageError(false)
    }
  }, [value])

  const loadImage = async (src: string) => {
    setIsLoading(true)
    setImageError(false)

    try {
      if (src.startsWith("electron://image/")) {
        if (typeof window !== "undefined" && window.electronAPI) {
          try {
            const imageId = src.replace("electron://image/", "")
            const base64 = await window.electronAPI.store.get(`image_${imageId}`)
            if (base64) {
              setImageSrc(base64)
            } else {
              setImageSrc("/placeholder.svg")
              setImageError(true)
            }
          } catch (error) {
            console.error("Erro ao carregar imagem:", error)
            setImageSrc("/placeholder.svg")
            setImageError(true)
          }
        } else {
          setImageSrc("/placeholder.svg")
        }
      } else {
        setImageSrc(src || "/placeholder.svg")
      }
    } catch (error) {
      console.error("Erro ao carregar imagem:", error)
      setImageSrc("/placeholder.svg")
      setImageError(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    setIsLoading(true)

    try {
      const reader = new FileReader()
      reader.onload = async (e) => {
        const base64 = e.target?.result as string

        if (typeof window !== "undefined" && window.electronAPI) {
          // Salvar no Electron Store
          const imageId = Date.now().toString()
          await window.electronAPI.store.set(`image_${imageId}`, base64)
          const imageUrl = `electron://image/${imageId}`
          onChange(imageUrl)
        } else {
          // Para web, usar base64 diretamente
          onChange(base64)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Erro ao processar imagem:", error)
      alert("Erro ao processar a imagem.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    setImageSrc("/placeholder.svg")
    setImageError(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className={className}>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <Card className={`relative ${isDragging ? "border-blue-500 bg-blue-50" : ""}`}>
        <CardContent className="p-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-2"></div>
                <p className="text-sm text-gray-500">Carregando...</p>
              </div>
            ) : imageSrc !== "/placeholder.svg" && !imageError ? (
              <div className="relative">
                <img
                  src={imageSrc || "/placeholder.svg"}
                  alt="Preview"
                  className="max-w-full max-h-48 mx-auto rounded-lg object-contain"
                  style={{ maxWidth: maxWidth, maxHeight: maxHeight }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemoveImage()
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <ImageIcon className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm text-gray-500 mb-1">Clique para selecionar ou arraste uma imagem</p>
                <p className="text-xs text-gray-400">PNG, JPG, GIF até 10MB</p>
                <Button type="button" variant="outline" className="mt-2">
                  <Upload className="h-4 w-4 mr-2" />
                  Selecionar Arquivo
                </Button>
              </div>
            )}
          </div>

          <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />

          {imageError && <p className="text-sm text-red-500 mt-2">Erro ao carregar a imagem. Tente novamente.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
