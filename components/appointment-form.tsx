"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Clock, Plus } from "lucide-react"
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
  const [formData, setFormData] = useState({
    clientId: appointment?.clientId || "",
    serviceId: appointment?.serviceId || "",
    date: appointment?.date || "",
    time: appointment?.time || "",
    notes: appointment?.notes || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const client = clients.find((c) => c.id === formData.clientId)
    const service = services.find((s) => s.id === formData.serviceId)

    if (!client || !service) return

    onSave({
      clientId: formData.clientId,
      client,
      serviceId: formData.serviceId,
      service,
      date: formData.date,
      time: formData.time,
      status: "scheduled",
      notes: formData.notes,
    })
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAddClient = (clientData: Omit<Client, "id" | "createdAt">) => {
    const newClient = onAddClient(clientData)
    setFormData((prev) => ({ ...prev, clientId: newClient.id }))
    setShowClientForm(false)
  }

  if (showClientForm) {
    return <ClientForm onSave={handleAddClient} onCancel={() => setShowClientForm(false)} />
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{appointment ? "Editar Agendamento" : "Novo Agendamento"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Cliente *</Label>
            <div className="flex gap-2">
              <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button type="button" variant="outline" size="icon" onClick={() => setShowClientForm(true)}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Serviço *</Label>
            <Select value={formData.serviceId} onValueChange={(value) => handleChange("serviceId", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione um serviço" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.id}>
                    {service.name} - R$ {service.price} ({service.duration}min)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="date">Data *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="pl-10"
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
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observações</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Observações sobre o agendamento..."
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {appointment ? "Atualizar" : "Agendar"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
