"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Plus, X } from "lucide-react"
import { ClientForm } from "./client-form"
import type { Client, Service, Appointment } from "../types"

interface AppointmentFormProps {
  clients: Client[]
  services: Service[]
  appointment?: Appointment
  onSave: (appointment: Omit<Appointment, "id" | "createdAt">) => void
  onCancel: () => void
  onAddClient: (client: Omit<Client, "id" | "createdAt">) => Client
}

export function AppointmentForm({
  clients,
  services,
  appointment,
  onSave,
  onCancel,
  onAddClient,
}: AppointmentFormProps) {
  const [showClientForm, setShowClientForm] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    appointment?.date ? new Date(appointment.date) : undefined,
  )
  const [formData, setFormData] = useState({
    clientId: appointment?.clientId || "",
    selectedServices: appointment?.services || [],
    time: appointment?.time || "",
    notes: appointment?.notes || "",
  })

  // Atualizar formulário se o agendamento mudar
  useEffect(() => {
    if (appointment) {
      setFormData({
        clientId: appointment.clientId || "",
        selectedServices: appointment.services || [],
        time: appointment.time || "",
        notes: appointment.notes || "",
      })
      setSelectedDate(appointment.date ? new Date(appointment.date) : undefined)
    }
  }, [appointment])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validações
    if (!formData.clientId) {
      alert("Por favor, selecione um cliente")
      return
    }

    if (formData.selectedServices.length === 0) {
      alert("Por favor, selecione pelo menos um serviço")
      return
    }

    if (!selectedDate) {
      alert("Por favor, selecione uma data")
      return
    }

    if (!formData.time) {
      alert("Por favor, selecione um horário")
      return
    }

    const client = clients.find((c) => c.id === formData.clientId)

    if (!client) {
      alert("Cliente não encontrado")
      return
    }

    try {
      onSave({
        clientId: formData.clientId,
        client,
        services: formData.selectedServices,
        date: selectedDate.toISOString().split("T")[0],
        time: formData.time,
        status: "scheduled",
        notes: formData.notes,
      })
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error)
      alert("Erro ao salvar agendamento. Tente novamente.")
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddClient = (clientData: Omit<Client, "id" | "createdAt">) => {
    try {
      const newClient = onAddClient(clientData)
      setFormData((prev) => ({ ...prev, clientId: newClient.id }))
      setShowClientForm(false)
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      alert("Erro ao adicionar cliente. Tente novamente.")
    }
  }

  const addService = (serviceId: string) => {
    const service = services.find((s) => s.id === serviceId)
    if (service && !formData.selectedServices.some((s) => s.serviceId === serviceId)) {
      const newServiceItem = {
        serviceId,
        service,
      }
      setFormData((prev) => ({
        ...prev,
        selectedServices: [...prev.selectedServices, newServiceItem],
      }))
    }
  }

  const removeService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedServices: prev.selectedServices.filter((s) => s.serviceId !== serviceId),
    }))
  }

  // Calcular duração total e preço total
  const totalDuration = formData.selectedServices.reduce((total, serviceItem) => {
    return total + serviceItem.service.duration
  }, 0)

  const totalPrice = formData.selectedServices.reduce((total, serviceItem) => {
    return total + serviceItem.service.price
  }, 0)

  // Calcular horário mínimo para hoje
  const getMinTime = () => {
    if (selectedDate && selectedDate.toDateString() === new Date().toDateString()) {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      return `${hours}:${minutes}`
    }
    return null
  }

  const minTime = getMinTime()

  // Agrupar serviços por categoria
  const servicesByCategory = services.reduce(
    (acc, service) => {
      const category = service.category || "Sem Categoria"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  if (showClientForm) {
    return <ClientForm onSave={handleAddClient} onCancel={() => setShowClientForm(false)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{appointment ? "Editar Agendamento" : "Novo Agendamento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleção de Cliente */}
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <div className="flex gap-2">
              <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.length === 0 ? (
                    <SelectItem value="" disabled>
                      Nenhum cliente cadastrado
                    </SelectItem>
                  ) : (
                    clients.map((client) => (
                      <SelectItem key={client.id} value={client.id}>
                        <div className="flex items-center gap-2">
                          <span>{client.name}</span>
                          {client.megaHairMethod && (
                            <Badge variant="outline" className="text-xs">
                              {client.megaHairMethod}
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={() => setShowClientForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Seleção de Serviços */}
          <div className="space-y-4">
            <Label>Serviços *</Label>

            {/* Serviços Selecionados */}
            {formData.selectedServices.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Serviços Selecionados:</h4>
                <div className="space-y-2">
                  {formData.selectedServices.map((serviceItem) => (
                    <div
                      key={serviceItem.serviceId}
                      className="flex items-center justify-between p-3 border rounded-lg bg-blue-50 dark:bg-blue-950"
                    >
                      <div>
                        <span className="font-medium">{serviceItem.service.name}</span>
                        <div className="flex gap-4 text-sm text-muted-foreground">
                          <span>{serviceItem.service.duration} min</span>
                          <span>R$ {serviceItem.service.price.toFixed(2)}</span>
                          {serviceItem.service.category && <span>{serviceItem.service.category}</span>}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeService(serviceItem.serviceId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

                {/* Resumo */}
                <div className="flex justify-between items-center p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                  <div className="flex gap-4 text-sm">
                    <span className="font-medium">Total: {totalDuration} min</span>
                    <span className="font-medium text-green-600">R$ {totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Adicionar Serviços */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Adicionar Serviços:</h4>
              {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
                <div key={category} className="space-y-2">
                  <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{category}</h5>
                  <div className="grid gap-2 md:grid-cols-2">
                    {categoryServices.map((service) => {
                      const isSelected = formData.selectedServices.some((s) => s.serviceId === service.id)
                      return (
                        <Button
                          key={service.id}
                          type="button"
                          variant={isSelected ? "default" : "outline"}
                          className="justify-start h-auto p-3"
                          onClick={() => (isSelected ? removeService(service.id) : addService(service.id))}
                          disabled={isSelected}
                        >
                          <div className="text-left">
                            <div className="font-medium">{service.name}</div>
                            <div className="text-xs opacity-70">
                              {service.duration} min • R$ {service.price.toFixed(2)}
                            </div>
                          </div>
                        </Button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data e Horário */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <div className="relative">
                <CalendarIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={selectedDate ? selectedDate.toISOString().split("T")[0] : ""}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : undefined)}
                  className="pl-10"
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Horário *</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="pl-10"
                  min={minTime || undefined}
                  required
                />
              </div>
              {minTime && selectedDate?.toDateString() === new Date().toDateString() && (
                <p className="text-xs text-amber-600">Para hoje, só é possível agendar a partir de {minTime}</p>
              )}
            </div>
          </div>

          {/* Observações */}
          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Observações sobre o agendamento..."
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={!formData.clientId || formData.selectedServices.length === 0 || !selectedDate || !formData.time}
            >
              {appointment ? "Atualizar" : "Agendar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
