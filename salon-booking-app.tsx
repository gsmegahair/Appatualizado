"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Scissors, Users, CheckCircle } from "lucide-react"
import { ServiceSelection } from "./components/service-selection"
import { ProfessionalSelection } from "./components/professional-selection"
import { DateTimeSelection } from "./components/datetime-selection"
import { BookingConfirmation } from "./components/booking-confirmation"
import { BookingList } from "./components/booking-list"
import { services, professionals, timeSlots } from "./data/salon-data"
import type { Service, Professional, Booking } from "./types/booking"

type BookingStep = "service" | "professional" | "datetime" | "confirmation" | "success"

export default function SalonBookingApp() {
  const [currentStep, setCurrentStep] = useState<BookingStep>("service")
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedProfessional, setSelectedProfessional] = useState<Professional | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [clientName, setClientName] = useState("")
  const [clientPhone, setClientPhone] = useState("")
  const [bookings, setBookings] = useState<Booking[]>([])

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service)
    setCurrentStep("professional")
  }

  const handleProfessionalSelect = (professional: Professional) => {
    setSelectedProfessional(professional)
    setCurrentStep("datetime")
  }

  const handleDateTimeNext = () => {
    if (selectedDate && selectedTime) {
      setCurrentStep("confirmation")
    }
  }

  const handleConfirmBooking = () => {
    if (selectedService && selectedProfessional && selectedDate && selectedTime) {
      const newBooking: Booking = {
        id: Date.now().toString(),
        clientName,
        clientPhone,
        service: selectedService,
        professional: selectedProfessional,
        date: selectedDate.toISOString(),
        time: selectedTime,
        status: "confirmed",
      }

      setBookings([...bookings, newBooking])
      setCurrentStep("success")
    }
  }

  const handleNewBooking = () => {
    setCurrentStep("service")
    setSelectedService(null)
    setSelectedProfessional(null)
    setSelectedDate(undefined)
    setSelectedTime(null)
    setClientName("")
    setClientPhone("")
  }

  const handleCancelBooking = (bookingId: string) => {
    setBookings(
      bookings.map((booking) => (booking.id === bookingId ? { ...booking, status: "cancelled" as const } : booking)),
    )
  }

  const renderBookingSteps = () => {
    switch (currentStep) {
      case "service":
        return (
          <ServiceSelection
            services={services}
            selectedService={selectedService}
            onServiceSelect={handleServiceSelect}
          />
        )

      case "professional":
        return (
          <div className="space-y-6">
            <ProfessionalSelection
              professionals={professionals}
              selectedProfessional={selectedProfessional}
              onProfessionalSelect={handleProfessionalSelect}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("service")}>
                Voltar
              </Button>
            </div>
          </div>
        )

      case "datetime":
        return (
          <div className="space-y-6">
            <DateTimeSelection
              selectedDate={selectedDate}
              selectedTime={selectedTime}
              onDateSelect={setSelectedDate}
              onTimeSelect={setSelectedTime}
              timeSlots={timeSlots}
            />
            <div className="flex justify-between">
              <Button variant="outline" onClick={() => setCurrentStep("professional")}>
                Voltar
              </Button>
              <Button onClick={handleDateTimeNext} disabled={!selectedDate || !selectedTime}>
                Continuar
              </Button>
            </div>
          </div>
        )

      case "confirmation":
        return selectedService && selectedProfessional && selectedDate && selectedTime ? (
          <BookingConfirmation
            service={selectedService}
            professional={selectedProfessional}
            date={selectedDate}
            time={selectedTime}
            clientName={clientName}
            clientPhone={clientPhone}
            onClientNameChange={setClientName}
            onClientPhoneChange={setClientPhone}
            onConfirm={handleConfirmBooking}
            onBack={() => setCurrentStep("datetime")}
          />
        ) : null

      case "success":
        return (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-green-700">Agendamento Confirmado!</h2>
              <p className="text-muted-foreground mt-2">
                Seu agendamento foi realizado com sucesso. Você receberá uma confirmação em breve.
              </p>
            </div>
            <Button onClick={handleNewBooking}>Fazer Novo Agendamento</Button>
          </div>
        )

      default:
        return null
    }
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case "service":
        return 1
      case "professional":
        return 2
      case "datetime":
        return 3
      case "confirmation":
        return 4
      default:
        return 0
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Salão Bella Vista</h1>
          <p className="text-lg text-muted-foreground">Agende seu horário de forma rápida e fácil</p>
        </div>

        <Tabs defaultValue="booking" className="max-w-6xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="booking" className="flex items-center gap-2">
              <Scissors className="h-4 w-4" />
              Novo Agendamento
            </TabsTrigger>
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Meus Agendamentos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="booking">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Agendamento</CardTitle>
                  {currentStep !== "success" && <Badge variant="outline">Etapa {getStepNumber()} de 4</Badge>}
                </div>
              </CardHeader>
              <CardContent>{renderBookingSteps()}</CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appointments">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Meus Agendamentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <BookingList bookings={bookings} onCancelBooking={handleCancelBooking} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
