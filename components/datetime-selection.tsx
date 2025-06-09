"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Clock } from "lucide-react"

interface DateTimeSelectionProps {
  selectedDate: Date | undefined
  selectedTime: string | null
  onDateSelect: (date: Date | undefined) => void
  onTimeSelect: (time: string) => void
  timeSlots: string[]
}

export function DateTimeSelection({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  timeSlots,
}: DateTimeSelectionProps) {
  const today = new Date()

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Escolha Data e Horário</h2>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Selecione a Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={onDateSelect}
              disabled={(date) => date < today}
              className="rounded-md border"
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horários Disponíveis</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedDate ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time}
                    variant={selectedTime === time ? "default" : "outline"}
                    size="sm"
                    onClick={() => onTimeSelect(time)}
                    className="text-sm"
                  >
                    {time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">
                Selecione uma data para ver os horários disponíveis
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
