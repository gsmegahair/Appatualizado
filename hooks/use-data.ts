"use client"

import { useEffect, useState } from "react"
import { useElectronStore } from "./use-electron-store"
import { defaultServices } from "../utils/import-utils"
import type { Client, Service, Appointment, Product } from "../types"

export function useData() {
  const [clients, setClients, clientsLoaded] = useElectronStore<Client[]>("gs-mega-clients", [])
  const [services, setServices, servicesLoaded] = useElectronStore<Service[]>("gs-mega-services", [])
  const [appointments, setAppointments, appointmentsLoaded] = useElectronStore<Appointment[]>(
    "gs-mega-appointments",
    [],
  )
  const [products, setProducts, productsLoaded] = useElectronStore<Product[]>("gs-mega-products", [])

  const [isInitialized, setIsInitialized] = useState(false)

  // Inicializar serviços padrão se não houver nenhum
  useEffect(() => {
    if (servicesLoaded && services.length === 0) {
      setServices(defaultServices)
    }

    if (clientsLoaded && servicesLoaded && appointmentsLoaded && productsLoaded) {
      setIsInitialized(true)
    }
  }, [servicesLoaded, services.length, setServices, clientsLoaded, appointmentsLoaded, productsLoaded])

  // Função para gerar ID único
  const generateId = () => {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  const addClient = (client: Omit<Client, "id" | "createdAt">) => {
    try {
      const newClient: Client = {
        ...client,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      setClients([...clients, newClient])
      return newClient
    } catch (error) {
      console.error("Erro ao adicionar cliente:", error)
      throw new Error("Erro ao adicionar cliente")
    }
  }

  const addService = (service: Omit<Service, "id">) => {
    try {
      const newService: Service = {
        ...service,
        id: generateId(),
      }
      setServices([...services, newService])
      return newService
    } catch (error) {
      console.error("Erro ao adicionar serviço:", error)
      throw new Error("Erro ao adicionar serviço")
    }
  }

  const addProduct = (product: Omit<Product, "id" | "createdAt">) => {
    try {
      const newProduct: Product = {
        ...product,
        id: generateId(),
        createdAt: new Date().toISOString(),
      }
      setProducts([...products, newProduct])
      return newProduct
    } catch (error) {
      console.error("Erro ao adicionar produto:", error)
      throw new Error("Erro ao adicionar produto")
    }
  }

  const addAppointment = (appointment: Omit<Appointment, "id" | "createdAt">) => {
    try {
      // Calcular preço total dos serviços
      const totalPrice =
        appointment.services?.reduce((total, serviceItem) => {
          return total + (serviceItem.service?.price || 0)
        }, 0) || 0

      const newAppointment: Appointment = {
        ...appointment,
        id: generateId(),
        createdAt: new Date().toISOString(),
        totalPrice,
      }
      setAppointments([...appointments, newAppointment])
      return newAppointment
    } catch (error) {
      console.error("Erro ao adicionar agendamento:", error)
      throw new Error("Erro ao adicionar agendamento")
    }
  }

  const updateClient = (id: string, updates: Partial<Client>) => {
    try {
      const clientIndex = clients.findIndex((client) => client.id === id)
      if (clientIndex === -1) {
        throw new Error("Cliente não encontrado")
      }

      const updatedClients = [...clients]
      updatedClients[clientIndex] = { ...updatedClients[clientIndex], ...updates }
      setClients(updatedClients)

      // Atualizar referências em agendamentos
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.clientId === id) {
          return {
            ...appointment,
            client: { ...updatedClients[clientIndex] },
          }
        }
        return appointment
      })

      setAppointments(updatedAppointments)
    } catch (error) {
      console.error("Erro ao atualizar cliente:", error)
      throw new Error("Erro ao atualizar cliente")
    }
  }

  const deleteClient = (id: string) => {
    try {
      // Verificar se o cliente tem agendamentos
      const hasAppointments = appointments.some((appointment) => appointment.clientId === id)
      if (hasAppointments) {
        throw new Error("Não é possível excluir um cliente com agendamentos")
      }

      setClients(clients.filter((client) => client.id !== id))
    } catch (error) {
      console.error("Erro ao excluir cliente:", error)
      throw new Error(error instanceof Error ? error.message : "Erro ao excluir cliente")
    }
  }

  const updateService = (id: string, updates: Partial<Service>) => {
    try {
      const serviceIndex = services.findIndex((service) => service.id === id)
      if (serviceIndex === -1) {
        throw new Error("Serviço não encontrado")
      }

      const updatedServices = [...services]
      updatedServices[serviceIndex] = { ...updatedServices[serviceIndex], ...updates }
      setServices(updatedServices)

      // Atualizar referências em agendamentos
      const updatedAppointments = appointments.map((appointment) => {
        const updatedServices = appointment.services.map((serviceItem) => {
          if (serviceItem.serviceId === id) {
            return {
              ...serviceItem,
              service: { ...updatedServices[serviceIndex] },
            }
          }
          return serviceItem
        })

        // Recalcular preço total
        const totalPrice = updatedServices.reduce((total, serviceItem) => {
          return total + serviceItem.service.price
        }, 0)

        return {
          ...appointment,
          services: updatedServices,
          totalPrice,
        }
      })

      setAppointments(updatedAppointments)
    } catch (error) {
      console.error("Erro ao atualizar serviço:", error)
      throw new Error("Erro ao atualizar serviço")
    }
  }

  const deleteService = (id: string) => {
    try {
      // Verificar se o serviço tem agendamentos
      const hasAppointments = appointments.some((appointment) =>
        appointment.services.some((serviceItem) => serviceItem.serviceId === id),
      )
      if (hasAppointments) {
        throw new Error("Não é possível excluir um serviço com agendamentos")
      }

      setServices(services.filter((service) => service.id !== id))
    } catch (error) {
      console.error("Erro ao excluir serviço:", error)
      throw new Error(error instanceof Error ? error.message : "Erro ao excluir serviço")
    }
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    try {
      const updatedProducts = products.map((product) => (product.id === id ? { ...product, ...updates } : product))
      setProducts(updatedProducts)
    } catch (error) {
      console.error("Erro ao atualizar produto:", error)
      throw new Error("Erro ao atualizar produto")
    }
  }

  const deleteProduct = (id: string) => {
    try {
      setProducts(products.filter((product) => product.id !== id))
    } catch (error) {
      console.error("Erro ao excluir produto:", error)
      throw new Error("Erro ao excluir produto")
    }
  }

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    try {
      const updatedAppointments = appointments.map((appointment) => {
        if (appointment.id === id) {
          const updatedAppointment = { ...appointment, ...updates }

          // Recalcular preço total se os serviços foram atualizados
          if (updates.services) {
            updatedAppointment.totalPrice = updates.services.reduce((total, serviceItem) => {
              return total + serviceItem.service.price
            }, 0)
          }

          return updatedAppointment
        }
        return appointment
      })
      setAppointments(updatedAppointments)
    } catch (error) {
      console.error("Erro ao atualizar agendamento:", error)
      throw new Error("Erro ao atualizar agendamento")
    }
  }

  const deleteAppointment = (id: string) => {
    try {
      setAppointments(appointments.filter((appointment) => appointment.id !== id))
    } catch (error) {
      console.error("Erro ao excluir agendamento:", error)
      throw new Error("Erro ao excluir agendamento")
    }
  }

  const importProducts = (importedProducts: Partial<Product>[]) => {
    try {
      const newProducts = importedProducts.map((productData) => ({
        ...productData,
        id: generateId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        name: productData.name || "",
        price: productData.price || 0,
        quantity: productData.quantity || 0,
      })) as Product[]

      setProducts([...products, ...newProducts])
      return newProducts
    } catch (error) {
      console.error("Erro ao importar produtos:", error)
      throw new Error("Erro ao importar produtos")
    }
  }

  const isLoaded = clientsLoaded && servicesLoaded && appointmentsLoaded && productsLoaded && isInitialized

  return {
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
    isLoaded,
  }
}
