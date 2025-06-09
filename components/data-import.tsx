"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Upload, FileText, FileSpreadsheet, Presentation, FileImage, CheckCircle, AlertCircle, X } from "lucide-react"
import { processImportFile, validateImportedData } from "../utils/import-utils"
import type { ImportedData, Client } from "../types"

interface DataImportProps {
  onImport: (clients: Partial<Client>[]) => void
  onClose: () => void
}

export function DataImport({ onImport, onClose }: DataImportProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [importedData, setImportedData] = useState<ImportedData | null>(null)
  const [errors, setErrors] = useState<string[]>([])
  const [success, setSuccess] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const supportedFormats = [
    { ext: ".csv", icon: FileSpreadsheet, name: "CSV", description: "Arquivo de valores separados por vírgula" },
    { ext: ".xlsx,.xls", icon: FileSpreadsheet, name: "Excel", description: "Planilha do Microsoft Excel" },
    { ext: ".pdf", icon: FileText, name: "PDF", description: "Documento PDF" },
    { ext: ".doc,.docx", icon: FileText, name: "Word", description: "Documento do Microsoft Word" },
    { ext: ".ppt,.pptx", icon: Presentation, name: "PowerPoint", description: "Apresentação do Microsoft PowerPoint" },
  ]

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setImportedData(null)
      setErrors([])
      setSuccess(false)
    }
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      setSelectedFile(file)
      setImportedData(null)
      setErrors([])
      setSuccess(false)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const processFile = async () => {
    if (!selectedFile) return

    setIsProcessing(true)
    setProgress(0)
    setErrors([])

    try {
      // Simular progresso
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 200)

      const data = await processImportFile(selectedFile)

      clearInterval(progressInterval)
      setProgress(100)

      // Validar dados
      const validation = validateImportedData(data)

      if (!validation.valid) {
        setErrors(validation.errors)
        return
      }

      setImportedData(data)
      setSuccess(true)
    } catch (error) {
      setErrors([error instanceof Error ? error.message : "Erro ao processar arquivo"])
    } finally {
      setIsProcessing(false)
    }
  }

  const confirmImport = () => {
    if (importedData?.clients) {
      onImport(importedData.clients)
      onClose()
    }
  }

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase()
    switch (ext) {
      case "csv":
      case "xlsx":
      case "xls":
        return FileSpreadsheet
      case "pdf":
        return FileText
      case "doc":
      case "docx":
        return FileText
      case "ppt":
      case "pptx":
        return Presentation
      default:
        return FileImage
    }
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Importar Dados de Clientes
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formatos Suportados */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Formatos Suportados</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {supportedFormats.map((format) => {
              const Icon = format.icon
              return (
                <div key={format.name} className="flex items-center gap-3 p-3 border rounded-lg">
                  <Icon className="h-8 w-8 text-blue-500" />
                  <div>
                    <div className="font-medium">{format.name}</div>
                    <div className="text-xs text-muted-foreground">{format.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Área de Upload */}
        <div>
          <Label className="text-base font-semibold mb-3 block">Selecionar Arquivo</Label>
          <div
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center hover:border-gray-400 dark:hover:border-gray-500 transition-colors cursor-pointer"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium mb-2">Arraste e solte seu arquivo aqui ou clique para selecionar</p>
            <p className="text-sm text-muted-foreground">Suporte para CSV, Excel, PDF, Word e PowerPoint</p>
            <Input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls,.pdf,.doc,.docx,.ppt,.pptx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Arquivo Selecionado */}
        {selectedFile && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
              {(() => {
                const Icon = getFileIcon(selectedFile.name)
                return <Icon className="h-8 w-8 text-blue-500" />
              })()}
              <div className="flex-1">
                <div className="font-medium">{selectedFile.name}</div>
                <div className="text-sm text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <Button onClick={processFile} disabled={isProcessing}>
                {isProcessing ? "Processando..." : "Processar Arquivo"}
              </Button>
            </div>

            {/* Progresso */}
            {isProcessing && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processando arquivo...</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        )}

        {/* Erros */}
        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <div className="space-y-1">
                <div className="font-medium">Erros encontrados:</div>
                <ul className="list-disc list-inside space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm">
                      {error}
                    </li>
                  ))}
                </ul>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Sucesso e Prévia */}
        {success && importedData?.clients && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="font-medium">
                  Arquivo processado com sucesso! {importedData.clients.length} cliente(s) encontrado(s).
                </div>
              </AlertDescription>
            </Alert>

            {/* Prévia dos dados */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Prévia dos Dados</Label>
              <div className="border rounded-lg max-h-60 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th className="text-left p-3 border-b">Nome</th>
                      <th className="text-left p-3 border-b">Telefone</th>
                      <th className="text-left p-3 border-b">E-mail</th>
                      <th className="text-left p-3 border-b">Aniversário</th>
                      <th className="text-left p-3 border-b">Método Mega Hair</th>
                    </tr>
                  </thead>
                  <tbody>
                    {importedData.clients.slice(0, 10).map((client, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-3">{client.name || "-"}</td>
                        <td className="p-3">{client.phone || "-"}</td>
                        <td className="p-3">{client.email || "-"}</td>
                        <td className="p-3">{client.birthDate || "-"}</td>
                        <td className="p-3">{client.megaHairMethod || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {importedData.clients.length > 10 && (
                  <div className="p-3 text-center text-muted-foreground">
                    ... e mais {importedData.clients.length - 10} cliente(s)
                  </div>
                )}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button onClick={confirmImport}>Importar {importedData.clients.length} Cliente(s)</Button>
            </div>
          </div>
        )}

        {/* Instruções */}
        <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="font-semibold mb-2">Instruções para Importação:</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>
              • <strong>CSV/Excel:</strong> Use colunas com nomes: Nome, Telefone, E-mail, Aniversário, Método
            </li>
            <li>
              • <strong>Aniversário:</strong> Use formato DD/MM (exemplo: 15/03)
            </li>
            <li>
              • <strong>Telefone:</strong> Use formato (11) 99999-9999
            </li>
            <li>
              • <strong>PDF/Word/PowerPoint:</strong> O sistema tentará extrair dados automaticamente
            </li>
            <li>
              • <strong>Método Mega Hair:</strong> Fita Adesiva, Queratina, Microlink, etc.
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
