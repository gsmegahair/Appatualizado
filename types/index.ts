export interface Client {
  id: string
  name: string
  megaHairMethod?: string
  phone?: string
  email?: string
  birthDate?: string
  address?: string
  notes?: string
  lastMaintenance?: string
  createdAt: string
  lastVisit?: string
  // Dados de acesso do cliente
  loginInfo?: {
    username: string
    password: string
    lastLogin?: string
    registrationDate: string
    active: boolean
  }
}

export interface Service {
  id: string
  name: string
  duration: number
  price: number
  description?: string
  category?: string
}

export interface Appointment {
  id: string
  clientId: string
  client: Client
  services: {
    serviceId: string
    service: Service
  }[]
  date: string
  time: string
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  createdAt: string
  totalPrice?: number
  paymentStatus?: "pending" | "paid" | "partial"
  paymentMethod?: string
  notificationSent?: boolean
  googleCalendarId?: string
}

export interface Product {
  id: string
  name: string
  description?: string
  price: number
  cost?: number
  barcode?: string
  sku?: string
  category?: string
  brand?: string
  supplier?: string
  quantity: number
  minQuantity?: number
  imageUrl?: string
  createdAt: string
  updatedAt?: string
}

export interface ColorPalette {
  name: string
  primary: string
  secondary: string
  accent: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  warning: string
  error: string
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
  theme: {
    mode: "light" | "dark" | "auto"
    colorPalette: string
    customColors?: ColorPalette
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
    showMegaHairMethod: boolean
    requirePhone: boolean
    requireEmail: boolean
  }
  appointmentSettings: {
    allowSameDayBooking: boolean
    maxAdvanceBookingDays: number
    defaultDuration: number
    showPrice: boolean
    enableClientAccess: boolean
    enableNotifications: boolean
    googleCalendarIntegration: boolean
    googleCalendarId?: string
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

// Tipos para importação de dados
export interface ImportedData {
  clients?: Partial<Client>[]
  appointments?: Partial<Appointment>[]
  services?: Partial<Service>[]
  products?: Partial<Product>[]
}

// Tipos para exportação de calendário
export interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  location?: string
  start: {
    dateTime: string
    timeZone?: string
  }
  end: {
    dateTime: string
    timeZone?: string
  }
  attendees?: {
    email: string
    name?: string
  }[]
  reminders?: {
    useDefault: boolean
    overrides?: {
      method: "email" | "popup"
      minutes: number
    }[]
  }
}
