export interface Client {
  id: string
  name: string
  phone?: string
  email?: string
  birthDate?: string
  address?: string
  notes?: string
  lastMaintenance?: string // Nova linha adicionada
  createdAt: string
  lastVisit?: string
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
}

export interface Appointment {
  id: string
  clientId: string
  client: Client
  serviceId: string
  service: Service
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  createdAt: string
}

export interface AppConfig {
  appName: string
  logoUrl: string
  headerLogoUrl: string
  calendarLogoUrl: string
  businessName: string
  businessPhone: string
  businessEmail: string
  businessAddress: string
  whatsappNumber: string
  reminderSettings: {
    monthly: boolean
    bimonthly: boolean
    quarterly: boolean
  }
  birthdayReminders: boolean
  // Novas configurações adicionadas
  theme: {
    primaryColor: string
    secondaryColor: string
    backgroundColor: string
    textColor: string
    accentColor: string
  }
  loginCredentials: {
    username: string
    password: string
  }
  clientFields: {
    showPhone: boolean
    showEmail: boolean
    showBirthDate: boolean
    showAddress: boolean
    showNotes: boolean
    showLastMaintenance: boolean
    requirePhone: boolean
    requireEmail: boolean
  }
  appointmentSettings: {
    allowSameDayBooking: boolean
    maxAdvanceBookingDays: number
    defaultDuration: number
    showPrice: boolean
  }
  exportSettings: {
    includePersonalData: boolean
    dateFormat: string
    currency: string
  }
}

export interface User {
  id: string
  username: string
  role: "admin" | "client"
  clientId?: string
}
