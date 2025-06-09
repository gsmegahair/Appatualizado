"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Calendar,
  Users,
  Settings,
  Plus,
  Download,
  MessageCircle,
  Gift,
  LogOut,
  Printer,
  Upload,
  Package,
  Bell,
  DollarSign,
} from "lucide-react"
import { ClientForm } from "./client-form"
import { AppointmentForm } from "./appointment-form"
import { ServiceManagement } from "./service-management"
import { ProductManagement } from "./product-management"
import { AdvancedSettingsForm } from "./advanced-settings-form"
import { DataImport } from "./data-import"
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
  checkBirthdays,
} from "../utils/export-utils"
import type { Client, Product } from "../types"

export function Dashboard() {
  const { logout } = useAuth()
  const { config } = useConfig()
  const {
    clients,
    services,
    appointments,
    products,
    addClient,
    addService,
    addProduct,
    addAppointment,
    updateClient,
    updateService,
    updateProduct,
    updateAppointment,
    deleteClient,
    deleteService,
    deleteProduct,
    deleteAppointment,
    importProducts,
  } = useData()

  const [activeTab, setActiveTab] = useState("calendar")
  const [showClientForm, setShowClientForm] = useState(false)
  const [showAppointmentForm, setShowAppointmentForm] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showImport, setShowImport] = useState(false)
  const [editingClient, setEditingClient] = useState(null)
  const [editingAppointment, setEditingAppointment] = useState(null)

  const todayAppointments = appointments.filter((apt) => apt.date === new Date().toISOString().split("T")[0])

  // Usar a nova função para verificar aniversários
  const upcomingBirthdays = checkBirthdays(clients)

  // Calcular estatísticas
  const totalRevenue = appointments
    .filter((apt) => apt.status === "completed")
    .reduce((total, apt) => total + (apt.totalPrice || 0), 0)

  const lowStockProducts = products.filter((product) => product.quantity <= (product.minQuantity || 0))

  const handleExportClients = () => {
    exportToCSV(clients, "clientes")
  }

  const handleExportAppointments = () => {
    exportToCSV(appointments, "agendamentos")
  }

  const handleImportData = (importedData: { clients?: Partial<Client>[]; products?: Partial<Product>[] }) => {
    let importCount = 0

    if (importedData.clients) {
      importedData.clients.forEach((clientData) => {
        if (clientData.name) {
          addClient(clientData as Omit<Client, "id" | "createdAt">)
          importCount++
        }
      })
    }

    if (importedData.products) {
      importProducts(importedData.products)
      importCount += importedData.products.length
    }

    alert(`${importCount} item(s) importado(s) com sucesso!`)
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

  const markAppointmentAsCompleted = (appointmentId: string) => {
    updateAppointment(appointmentId, { status: "completed" })
  }

  if (showSettings) {
    return (
      <div className="main-container bg-gradient-theme">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <Button variant="outline" onClick={() => setShowSettings(false)} className="glass-card">
              Voltar ao Dashboard
            </Button>
            <Button variant="outline" onClick={logout} className="glass-card">
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
    <div className="main-container bg-gradient-theme">
      <div className="container mx-auto px-4 py-8">
        {/* Header com gradiente */}
        <div className="flex justify-between items-center mb-8 p-6 rounded-xl gradient-header">
          <div className="flex items-center gap-4">
            <img
              src={config.headerLogoUrl || "/placeholder.svg"}
              alt={config.appName}
              className="h-12 glow-effect rounded-lg"
            />
            <h1 className="text-3xl font-bold text-white drop-shadow-lg">{config.appName}</h1>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="glass-card text-white border-white/30 hover:bg-white/20"
            >
              <Settings className="h-4 w-4 mr-2" />
              Configurações
            </Button>
            <Button
              variant="outline"
              onClick={logout}
              className="glass-card text-white border-white/30 hover:bg-white/20"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>

        {/* Stats Cards com gradiente */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mb-8">
          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agendamentos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-theme-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-theme-primary">{todayAppointments.length}</div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Clientes</CardTitle>
              <Users className="h-4 w-4 text-theme-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-theme-secondary">{clients.length}</div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Produtos</CardTitle>
              <Package className="h-4 w-4 text-theme-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-theme-accent">{products.length}</div>
              {lowStockProducts.length > 0 && (
                <p className="text-xs text-red-500 mt-1">{lowStockProducts.length} com estoque baixo</p>
              )}
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-500">R$ {totalRevenue.toFixed(2)}</div>
            </CardContent>
          </Card>

          <Card className="stats-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Aniversários Hoje</CardTitle>
              <Gift className="h-4 w-4 text-pink-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-pink-500">{upcomingBirthdays.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-6 glass-card">
            <TabsTrigger value="calendar">Agenda</TabsTrigger>
            <TabsTrigger value="clients">Clientes</TabsTrigger>
            <TabsTrigger value="services">Serviços</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
            <TabsTrigger value="appointments">Agendamentos</TabsTrigger>
            <TabsTrigger value="alerts">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Agenda do Dia</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handlePrintDayAgenda} className="glass-card">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Dia
                </Button>
                <Button variant="outline" onClick={handlePrintWeekAgenda} className="glass-card">
                  <Printer className="h-4 w-4 mr-2" />
                  Imprimir Semana
                </Button>
                <Button onClick={() => setShowAppointmentForm(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <div className="text-center mb-6">
              <img
                src={config.calendarLogoUrl || "/placeholder.svg"}
                alt="Logo"
                className="h-20 mx-auto mb-4 glow-effect rounded-lg"
              />
            </div>

            <div className="grid gap-4">
              {todayAppointments.length === 0 ? (
                <Card className="glass-card">
                  <CardContent className="text-center py-8">
                    <p className="text-muted-foreground">Nenhum agendamento para hoje</p>
                  </CardContent>
                </Card>
              ) : (
                todayAppointments.map((appointment) => (
                  <Card key={appointment.id} className="glass-card">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{appointment.client.name}</h3>
                          {appointment.client.megaHairMethod && (
                            <p className="text-sm text-theme-primary font-medium">
                              Método: {appointment.client.megaHairMethod}
                            </p>
                          )}
                          <div className="mt-2 space-y-1">
                            {appointment.services.map((serviceItem) => (
                              <div key={serviceItem.serviceId} className="flex items-center gap-2">
                                <Badge variant="outline" className="text-xs">
                                  {serviceItem.service.name}
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {serviceItem.service.duration}min • R$ {serviceItem.service.price}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {appointment.time} • Total: R$ {appointment.totalPrice?.toFixed(2)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          {appointment.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAppointmentAsCompleted(appointment.id)}
                              className="glass-card text-green-600"
                            >
                              Concluir
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleSendWhatsAppReminder(appointment)}
                            title="Enviar lembrete WhatsApp"
                            className="glass-card"
                          >
                            <MessageCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handlePrintAppointment(appointment)}
                            title="Imprimir agendamento"
                            className="glass-card"
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
                <Button variant="outline" onClick={() => setShowImport(true)} className="glass-card">
                  <Upload className="h-4 w-4 mr-2" />
                  Importar
                </Button>
                <Button variant="outline" onClick={handleExportClients} className="glass-card">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => setShowClientForm(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Cliente
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {clients.map((client) => (
                <Card key={client.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{client.name}</h3>
                          {client.megaHairMethod && (
                            <Badge variant="secondary" className="text-xs bg-gradient-button-secondary text-white">
                              {client.megaHairMethod}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {client.phone} • {client.email}
                        </p>
                        {client.birthDate && <p className="text-sm text-green-600">Aniversário: {client.birthDate}</p>}
                        {client.lastMaintenance && (
                          <p className="text-sm text-blue-600">
                            Última manutenção: {new Date(client.lastMaintenance).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        {client.birthDate && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => generateBirthdayMessage(client, config)}
                            className="glass-card"
                          >
                            <Gift className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingClient(client)}
                          className="glass-card"
                        >
                          Editar
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <h2 className="text-2xl font-bold">Gerenciar Serviços</h2>
            <ServiceManagement
              services={services}
              onAddService={addService}
              onUpdateService={updateService}
              onDeleteService={deleteService}
            />
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
            <ProductManagement
              products={products}
              onAddProduct={addProduct}
              onUpdateProduct={updateProduct}
              onDeleteProduct={deleteProduct}
              onImportProducts={importProducts}
            />
          </TabsContent>

          <TabsContent value="appointments" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Todos os Agendamentos</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={handleExportAppointments} className="glass-card">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
                <Button onClick={() => setShowAppointmentForm(true)} className="btn-gradient-primary">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Agendamento
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {appointments.map((appointment) => (
                <Card key={appointment.id} className="glass-card">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{appointment.client.name}</h3>
                          {appointment.client.megaHairMethod && (
                            <Badge variant="outline" className="text-xs border-theme-primary text-theme-primary">
                              {appointment.client.megaHairMethod}
                            </Badge>
                          )}
                        </div>
                        <div className="space-y-1">
                          {appointment.services.map((serviceItem) => (
                            <p key={serviceItem.serviceId} className="text-sm text-muted-foreground">
                              {serviceItem.service.name} • R$ {serviceItem.service.price}
                            </p>
                          ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {new Date(appointment.date).toLocaleDateString("pt-BR")} • {appointment.time}
                        </p>
                        <p className="text-sm text-theme-accent font-medium">
                          Total: R$ {appointment.totalPrice?.toFixed(2)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Badge
                          variant={appointment.status === "scheduled" ? "default" : "secondary"}
                          className="bg-gradient-button-primary text-white"
                        >
                          {appointment.status === "scheduled" ? "Agendado" : "Concluído"}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleSendWhatsAppReminder(appointment)}
                          title="Enviar lembrete WhatsApp"
                          className="glass-card"
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handlePrintAppointment(appointment)}
                          title="Imprimir agendamento"
                          className="glass-card"
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

            {/* Aniversários */}
            {upcomingBirthdays.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Gift className="h-5 w-5 text-pink-500" />
                    Aniversários de Hoje
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {upcomingBirthdays.map((client) => (
                      <div key={client.id} className="flex justify-between items-center">
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium">{client.name}</p>
                            {client.megaHairMethod && (
                              <Badge variant="outline" className="text-xs border-theme-primary text-theme-primary">
                                {client.megaHairMethod}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">Aniversário: {client.birthDate}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => generateBirthdayMessage(client, config)}
                          className="btn-gradient-primary"
                        >
                          <MessageCircle className="h-4 w-4 mr-2" />
                          Parabenizar
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Produtos com estoque baixo */}
            {lowStockProducts.length > 0 && (
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5 text-red-500" />
                    Produtos com Estoque Baixo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-red-500">
                            Estoque: {product.quantity} unid. (Mínimo: {product.minQuantity || 0})
                          </p>
                        </div>
                        <Badge variant="destructive">Estoque Baixo</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {upcomingBirthdays.length === 0 && lowStockProducts.length === 0 && (
              <Card className="glass-card">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">Nenhum alerta no momento</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Modals */}
        {showClientForm && (
          <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
            <div className="glass-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
          <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
            <div className="glass-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
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

        {showImport && (
          <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
            <div className="glass-card rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
              <DataImport onImport={handleImportData} onClose={() => setShowImport(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
