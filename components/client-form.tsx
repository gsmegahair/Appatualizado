"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Phone, Mail, MapPin, Calendar, FileText, Scissors } from "lucide-react"
import { megaHairMethods } from "../utils/import-utils"
import type { Client } from "../types"

interface ClientFormProps {
  client?: Client
  onSave: (client: Omit<Client, "id" | "createdAt">) => void
  onCancel: () => void
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  // Converter data de aniversário para dia/mês se existir
  const getBirthDayMonth = (birthDate?: string) => {
    if (!birthDate) return { day: "", month: "" }

    if (birthDate.includes("/")) {
      // Formato DD/MM
      const [day, month] = birthDate.split("/")
      return { day: day.padStart(2, "0"), month: month.padStart(2, "0") }
    }

    return { day: "", month: "" }
  }

  const initialBirth = getBirthDayMonth(client?.birthDate)

  const [formData, setFormData] = useState({
    name: client?.name || "",
    megaHairMethod: client?.megaHairMethod || "",
    phone: client?.phone || "",
    email: client?.email || "",
    birthDay: initialBirth.day,
    birthMonth: initialBirth.month,
    address: client?.address || "",
    notes: client?.notes || "",
    lastMaintenance: client?.lastMaintenance || "",
  })

  // Atualizar formulário se o cliente mudar
  useEffect(() => {
    if (client) {
      const birthInfo = getBirthDayMonth(client.birthDate)
      setFormData({
        name: client.name || "",
        megaHairMethod: client.megaHairMethod || "",
        phone: client.phone || "",
        email: client.email || "",
        birthDay: birthInfo.day,
        birthMonth: birthInfo.month,
        address: client.address || "",
        notes: client.notes || "",
        lastMaintenance: client.lastMaintenance || "",
      })
    }
  }, [client])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validação básica
    if (!formData.name.trim()) {
      alert("Nome é obrigatório")
      return
    }

    // Formar data de aniversário no formato DD/MM
    let birthDate = ""
    if (
      formData.birthDay &&
      formData.birthMonth &&
      formData.birthDay !== "default" &&
      formData.birthMonth !== "default"
    ) {
      birthDate = `${formData.birthDay.padStart(2, "0")}/${formData.birthMonth.padStart(2, "0")}`
    }

    try {
      onSave({
        name: formData.name.trim(),
        megaHairMethod: formData.megaHairMethod || undefined,
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        birthDate,
        address: formData.address.trim(),
        notes: formData.notes.trim(),
        lastMaintenance: formData.lastMaintenance,
      })
    } catch (error) {
      console.error("Erro ao salvar cliente:", error)
      alert("Erro ao salvar cliente. Tente novamente.")
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Gerar opções de dias (1-31)
  const dayOptions = Array.from({ length: 31 }, (_, i) => {
    const day = (i + 1).toString().padStart(2, "0")
    return { value: day, label: day }
  })

  // Gerar opções de meses
  const monthOptions = [
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>{client ? "Editar Cliente" : "Novo Cliente"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="pl-10"
                  placeholder="Digite o nome completo"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="megaHairMethod">Método de Mega Hair</Label>
              <div className="relative">
                <Scissors className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Select
                  value={formData.megaHairMethod}
                  onValueChange={(value) => handleChange("megaHairMethod", value)}
                >
                  <SelectTrigger className="pl-10">
                    <SelectValue placeholder="Selecione o método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Nenhum</SelectItem>
                    {megaHairMethods.map((method) => (
                      <SelectItem key={method} value={method}>
                        {method}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="pl-10"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="pl-10"
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Data de Aniversário - Apenas Dia e Mês */}
          <div className="space-y-2">
            <Label>Data de Aniversário (Dia e Mês)</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="birthDay" className="text-sm text-muted-foreground">
                  Dia
                </Label>
                <Select value={formData.birthDay} onValueChange={(value) => handleChange("birthDay", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Dia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Selecione</SelectItem>
                    {dayOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="birthMonth" className="text-sm text-muted-foreground">
                  Mês
                </Label>
                <Select value={formData.birthMonth} onValueChange={(value) => handleChange("birthMonth", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Mês" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="default">Selecione</SelectItem>
                    {monthOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {formData.birthDay && formData.birthMonth && (
              <p className="text-sm text-muted-foreground">
                Aniversário: {formData.birthDay}/{formData.birthMonth}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastMaintenance">Última Manutenção</Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastMaintenance"
                type="date"
                value={formData.lastMaintenance}
                onChange={(e) => handleChange("lastMaintenance", e.target.value)}
                className="pl-10"
                max={new Date().toISOString().split("T")[0]} // Não permitir datas futuras
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
                className="pl-10"
                placeholder="Endereço completo"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <div className="relative">
              <FileText className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                className="pl-10 min-h-[80px]"
                placeholder="Observações sobre o cliente, preferências, alergias, método de mega hair usado, etc."
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {client ? "Atualizar" : "Cadastrar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
