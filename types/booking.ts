export interface Service {
  id: string
  name: string
  duration: number // em minutos
  price: number
  description: string
}

export interface Professional {
  id: string
  name: string
  specialties: string[]
  avatar: string
  rating: number
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Booking {
  id: string
  clientName: string
  clientPhone: string
  service: Service
  professional: Professional
  date: string
  time: string
  status: "confirmed" | "pending" | "cancelled"
}
