"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Scissors, Settings, Plus, Download, MessageCircle, Gift, LogOut, Printer } from "lucide-react"
import { ClientForm } from "./client-form"
import { AppointmentForm } from "./appointment-form"
import { AdvancedSettingsForm } from "./advanced-settings-form"
import { useAuth } from "../contexts/auth-context"
import { useConfig } from "../contexts/config-context"
import { useData } from "../hooks/use-data"
import {
  exportToCSV,
  generateBirthdayMessage,
  generateAppointmentReminderMessage,
  printClientAppointment,
  printDayAgenda,
  printWeekAgenda,
} from "../utils/export-utils"

export function Dashboard() {
  const { logout } = useAuth()
  const { config } = useConfig()
  const {
    clients,
    services,
    appointments,
    addClient,
    addService,
    addAppointment,
    updateClient,
    updateService,
    updateAppointment,
    deleteClient,
    deleteService,
    deleteAppointment,
  } = useData()

  const [activeTab, setActiveTab] = useState("calendar")
  const [showClientForm, setShowClientForm] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [showServiceForm, setShowServiceForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [editingAppointment, setEditingAppointment] = useState(null)

  const todayAppointments = appointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0])

  const upcomingBirthdays = clients.filter((client) => {
    if (!client.birthDate) return false
    const today = new Date()
    const birthday = new Date(client.birthDate)
    birthday.setFullYear(today.getFullYear())
    const diffTime = birthday.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays >= 0 && diffDays <= 7
  })

  const handleExportClients = () => {
    exportToCSV(clients, "clientes")
  }

  const handleExportAppointments = () => {
    exportToCSV(appointments, "agendamentos")
  }

  const handlePrintAppointment = (appointment: any) => {
    printClientAppointment(appointment, config)
  }

  const handlePrintDayAgenda = () => {
    const today = new Date().toISOString().split("T")[0]
    printDayAgenda(appointments, today, config)
  }

  const handlePrintWeekAgenda = () => {
    const today = new Date()
    const monday = new Date(today)
    monday.setDate(today.getDate() - today.getDay() + 1) // Começar na segunda-feira
    const mondayStr = monday.toISOString().split("T")[0]
    printWeekAgenda(appointments, mondayStr, config)
  }

  const handleSendWhatsAppReminder = (appointment: any) => {
    generateAppointmentReminderMessage(appointment, config)
  }

  if (showSettings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Voltar ao Dashboard
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
          <AdvancedSettingsForm />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <img src={config.headerLogoUrl || "/placeholder.svg"} alt={config.appName} className="h-12" />
            <h1 className="text-3xl font-bold">{config.appName}</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowSettings(true)}>
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button variant="outline" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{todayAppointments.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{clients.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Serviços</CardTitle>
              <Scissors className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{services.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aniversários</CardTitle>
              <Gift className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{upcomingBirthdays.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Agenda do Dia</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrintDayAgenda}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Dia
                </Button>
                <Button variant="outline" onClick={handlePrintWeekAgenda}>
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Semana
                </Button>
                <Button onClick={() => setShowAppointmentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <div className="text-center mb-6">
              <img src={config.calendarLogoUrl || "/placeholder.svg"} alt="Logo" className="h-20 mx-auto mb-4" />
            </div>

            <div className="grid gap-4">
              {todayAppointments.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum agendamento para hoje</p>
                  </CardContent>
                </Card>
              ) : (
                todayAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{appointment.client.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {appointment.service.name} - {appointment.time}
                          </p>
                          <p className="text-sm text-blue-600">
                            R$ {appointment.service.price} • {appointment.service.duration}min
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendWhatsAppReminder(appointment)}
                            title="Enviar lembrete WhatsApp"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintAppointment(appointment)}
                            title="Imprimir agendamento"
                          >
                            <Printer className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </TabsContent>

          <TabsContent value="clients" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Clientes</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportClients}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => setShowClientForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {clients.map((client) => (
                <Card key={client.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{client.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {client.phone} • {client.email}
                        </p>
                        {client.lastMaintenance && (
                          <p className="text-sm text-blue-600">
                            Última manutenção: {new Date(client.lastMaintenance).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {client.birthDate && (
                          <Button size="sm" variant="outline" onClick={() => generateBirthdayMessage(client, config)}>
                            <Gift className="h-4 w-4" />
                          </Button>
                        )}
                        <Button size="sm" variant="outline" onClick={() => setEditingClient(client)}>
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Todos os Agendamentos</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportAppointments}>
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => setShowAppointmentForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold">{appointment.client.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {appointment.service.name} • {new Date(appointment.date).toLocaleDateString("pt-BR")} •{" "}
                          {appointment.time}
                        </p>
                        <p className="text-sm text-blue-600">R$ {appointment.service.price}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant={appointment.status === "scheduled" ? "default" : "secondary"}>
                          {appointment.status === "scheduled" ? "Agendado" : "Concluído"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendWhatsAppReminder(appointment)}
                          title="Enviar lembrete WhatsApp"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrintAppointment(appointment)}
                          title="Imprimir agendamento"
                        >
                          <Printer className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <h2 className="text-2xl font-bold">Alertas e Lembretes</h2>

            {upcomingBirthdays.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5" />
                    Aniversários da Semana
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upcomingBirthdays.map((client) => (
                      <div key={client.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{client.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(client.birthDate!).toLocaleDateString("pt-BR")}
                          </p>
                        </div>
                        <Button size="sm" onClick={() => generateBirthdayMessage(client, config)}>
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Parabenizar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showClientForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ClientForm
                client={editingClient}
                onSave={(clientData) => {
                  if (editingClient) {
                    updateClient(editingClient.id, clientData)
                  } else {
                    addClient(clientData)
                  }
                  setShowClientForm(false)
                  setEditingClient(null)
                }}
                onCancel={() => {
                  setShowClientForm(false)
                  setEditingClient(null)
                }}
              />
            </div>
          </div>
        )}

        {showAppointmentForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <AppointmentForm
                clients={clients}
                services={services}
                appointment={editingAppointment}
                onSave={(appointmentData) => {
                  if (editingAppointment) {
                    updateAppointment(editingAppointment.id, appointmentData)
                  } else {
                    addAppointment(appointmentData)
                  }
                  setShowAppointmentForm(false)
                  setEditingAppointment(null)
                }}
                onCancel={() => {
                  setShowAppointmentForm(false)
                  setEditingAppointment(null)
                }}
                onAddClient={addClient}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
