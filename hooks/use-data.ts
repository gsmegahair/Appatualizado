"use client"

import { useEffect } from "react"
import { useElectronStore } from "./use-electron-store"
import type { Client, Service, Appointment } from "../types"

export function useData() {
  const [clients, setClients, clientsLoaded] = useElectronStore<Client[]>("gs-mega-clients", [])
  const [services, setServices, servicesLoaded] = useElectronStore<Service[]>("gs-mega-services", [])
  const [appointments, setAppointments, appointmentsLoaded] = useElectronStore<Appointment[]>(
    "gs-mega-appointments",
    [],
  )

  // Inicializar serviços padrão se não houver nenhum
  useEffect(() => {
    if (servicesLoaded && services.length === 0) {
      const initialServices: Service[] = [
        { id: "1", name: "Corte Feminino", duration: 60, price: 80, description: "Corte personalizado" },
        { id: "2", name: "Mega Hair", duration: 180, price: 300, description: "Aplicação de mega hair" },
        { id: "3", name: "Coloração", duration: 120, price: 150, description: "Coloração completa" },
        { id: "4", name: "Escova", duration: 45, price: 50, description: "Escova modeladora" },
      ]
      setServices(initialServices)
    }
  }, [servicesLoaded, services, setServices])

  const addClient = (client: Omit<Client, "id" | "createdAt">) => {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setClients([...clients, newClient])
    return newClient
  }

  const addService = (service: Omit<Service, "id">) => {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
    }
    setServices([...services, newService])
    return newService
  }

  const addAppointment = (appointment: Omit<Appointment, "id" | "createdAt">) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setAppointments([...appointments, newAppointment])
    return newAppointment
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    const updatedClients = clients.map((client) => (client.id === id ? { ...client, ...updates } : client))
    setClients(updatedClients)
  }

  const deleteClient = (id: string) => {
    setClients(clients.filter((client) => client.id !== id))
  }

  const updateService = (id: string, updates: Partial<Service>) => {
    const updatedServices = services.map((service) => (service.id === id ? { ...service, ...updates } : service))
    setServices(updatedServices)
  }

  const deleteService = (id: string) => {
    setServices(services.filter((service) => service.id !== id))
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    const updatedAppointments = appointments.map((appointment) =>
      appointment.id === id ? { ...appointment, ...updates } : appointment,
    )
    setAppointments(updatedAppointments)
  }

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter((appointment) => appointment.id !== id))
  }

  const isLoaded = clientsLoaded && servicesLoaded && appointmentsLoaded

  return {
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
    isLoaded,
  }
}
