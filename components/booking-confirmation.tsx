"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Calendar, Clock, DollarSign, User, Phone } from "lucide-react"
import type { Service, Professional } from "../types/booking"

interface BookingConfirmationProps {
  service: Service
  professional: Professional
  date: Date
  time: string
  clientName: string
  clientPhone: string
  onClientNameChange: (name: string) => void
  onClientPhoneChange: (phone: string) => void
  onConfirm: () => void
  onBack: () => void
}

export function BookingConfirmation({
  service,
  professional,
  date,
  time,
  clientName,
  clientPhone,
  onClientNameChange,
  onClientPhoneChange,
  onConfirm,
  onBack,
}: BookingConfirmationProps) {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Confirmar Agendamento</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Resumo do Agendamento</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge variant="secondary">{service.name}</Badge>
              <span className="text-sm text-muted-foreground">{service.duration}min</span>
            </div>

            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
                <AvatarFallback>
                  {professional.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{professional.name}</p>
                <p className="text-sm text-muted-foreground">Profissional</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{formatDate(date)}</p>
                <p className="text-sm text-muted-foreground">Data</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">{time}</p>
                <p className="text-sm text-muted-foreground">Horário</p>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-4 border-t">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium text-lg">R$ {service.price}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Seus Dados</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome Completo</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  placeholder="Digite seu nome"
                  value={clientName}
                  onChange={(e) => onClientNameChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="(11) 99999-9999"
                  value={clientPhone}
                  onChange={(e) => onClientPhoneChange(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={onBack} className="flex-1">
                Voltar
              </Button>
              <Button onClick={onConfirm} className="flex-1" disabled={!clientName || !clientPhone}>
                Confirmar Agendamento
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
