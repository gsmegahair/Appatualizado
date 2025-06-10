"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, DollarSign } from "lucide-react"
import type { Service } from "../types/booking"

interface ServiceSelectionProps {
  services: Service[]
  selectedService: Service | null
  onServiceSelect: (service: Service) => void
}

export function ServiceSelection({ services, selectedService, onServiceSelect }: ServiceSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Escolha o Serviço</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
          <Card
            key={service.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedService?.id === service.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onServiceSelect(service)}
          >
            <CardHeader>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{service.duration}min</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  R$ {service.price}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
