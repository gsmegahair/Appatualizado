"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file) return

    // Verificar se é uma imagem
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem (PNG, JPG, JPEG, GIF)")
      return
    }

    // Verificar tamanho do arquivo (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("O arquivo deve ter no máximo 5MB")
      return
    }

    setIsLoading(true)

    try {
      // Converter arquivo para base64
      const base64 = await fileToBase64(file)

      // Se estivermos no Electron, salvar a imagem localmente
      if (typeof window !== "undefined" && window.electronAPI) {
        const imageId = `logo_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        await window.electronAPI.store.set(`image_${imageId}`, base64)
        onChange(`electron://image/${imageId}`)
      } else {
        // No navegador, usar base64 diretamente
        onChange(base64)
      }
    } catch (error) {
      console.error("Erro ao processar imagem:", error)
      alert("Erro ao processar a imagem. Tente novamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      handleFileSelect(files[0])
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

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileSelect(files[0])
    }
  }

  const handleRemoveImage = () => {
    onChange("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const getImageSrc = async (imagePath: string): Promise<string> => {
    if (imagePath.startsWith("electron://image/")) {
      const imageId = imagePath.replace("electron://image/", "")
      if (typeof window !== "undefined" && window.electronAPI) {
        try {
          const base64 = await window.electronAPI.store.get(`image_${imageId}`)
          return base64 || "/placeholder.svg"
        } catch (error) {
          console.error("Erro ao carregar imagem:", error)
          return "/placeholder.svg"
        }
      }
    }
    return imagePath || "/placeholder.svg"
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <Label>{label}</Label>

      {value ? (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={value.startsWith("electron://") ? "/placeholder.svg" : value}
                  alt={label}
                  className="object-contain border rounded"
                  style={{ maxWidth: `${maxWidth}px`, maxHeight: `${maxHeight}px` }}
                  onLoad={async (e) => {
                    if (value.startsWith("electron://")) {
                      const src = await getImageSrc(value)
                      ;(e.target as HTMLImageElement).src = src
                    }
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2">Imagem carregada com sucesso</p>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-4 w-4 mr-2" />
                    Trocar Imagem
                  </Button>
                  <Button type="button" variant="outline" size="sm" onClick={handleRemoveImage}>
                    <X className="h-4 w-4 mr-2" />
                    Remover
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <CardContent className="p-8">
            <div className="text-center">
              <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">Arraste uma imagem aqui ou clique para selecionar</p>
                <p className="text-xs text-muted-foreground">Formatos aceitos: PNG, JPG, JPEG, GIF (máx. 5MB)</p>
              </div>
              <Button
                type="button"
                variant="outline"
                className="mt-4"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
              >
                <Upload className="h-4 w-4 mr-2" />
                {isLoading ? "Processando..." : "Selecionar Imagem"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileInputChange} className="hidden" />
    </div>
  )
}
