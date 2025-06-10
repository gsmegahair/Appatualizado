"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, Phone, Trash2 } from "lucide-react"
import type { Booking } from "../types/booking"

interface BookingListProps {
  bookings: Booking[]
  onCancelBooking: (bookingId: string) => void
}

export function BookingList({ bookings, onCancelBooking }: BookingListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("pt-BR", {
      weekday: "short",
      day: "2-digit",
      month: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  if (bookings.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Nenhum agendamento encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{booking.service.name}</CardTitle>
              <Badge className={getStatusColor(booking.status)}>{getStatusText(booking.status)}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={booking.professional.avatar || "/placeholder.svg"}
                      alt={booking.professional.name}
                    />
                    <AvatarFallback>
                      {booking.professional.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{booking.professional.name}</p>
                    <p className="text-sm text-muted-foreground">Profissional</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{formatDate(booking.date)}</span>
                  <Clock className="h-4 w-4 text-muted-foreground ml-2" />
                  <span className="text-sm">{booking.time}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="font-medium">{booking.clientName}</p>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">{booking.clientPhone}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">R$ {booking.service.price}</span>
                  {booking.status === "confirmed" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onCancelBooking(booking.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Cancelar
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
