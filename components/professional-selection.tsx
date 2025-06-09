"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import type { Professional } from "../types/booking"

interface ProfessionalSelectionProps {
  professionals: Professional[]
  selectedProfessional: Professional | null
  onProfessionalSelect: (professional: Professional) => void
}

export function ProfessionalSelection({
  professionals,
  selectedProfessional,
  onProfessionalSelect,
}: ProfessionalSelectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Escolha o Profissional</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {professionals.map((professional) => (
          <Card
            key={professional.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedProfessional?.id === professional.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onProfessionalSelect(professional)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={professional.avatar || "/placeholder.svg"} alt={professional.name} />
                  <AvatarFallback>
                    {professional.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-lg">{professional.name}</CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{professional.rating}</span>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {professional.specialties.map((specialty) => (
                  <Badge key={specialty} variant="outline" className="text-xs">
                    {specialty}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
