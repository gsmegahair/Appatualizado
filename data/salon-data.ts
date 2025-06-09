import type { Service, Professional } from "../types/booking"

export const services: Service[] = [
  {
    id: "1",
    name: "Corte Feminino",
    duration: 60,
    price: 80,
    description: "Corte personalizado com lavagem e finalização",
  },
  {
    id: "2",
    name: "Corte Masculino",
    duration: 45,
    price: 50,
    description: "Corte tradicional ou moderno com acabamento",
  },
  {
    id: "3",
    name: "Coloração",
    duration: 120,
    price: 150,
    description: "Coloração completa com produtos profissionais",
  },
  {
    id: "4",
    name: "Escova Progressiva",
    duration: 180,
    price: 200,
    description: "Alisamento com escova progressiva",
  },
  {
    id: "5",
    name: "Manicure",
    duration: 45,
    price: 35,
    description: "Cuidados completos para as unhas das mãos",
  },
  {
    id: "6",
    name: "Pedicure",
    duration: 60,
    price: 45,
    description: "Cuidados completos para os pés",
  },
]

export const professionals: Professional[] = [
  {
    id: "1",
    name: "Ana Silva",
    specialties: ["Corte Feminino", "Coloração"],
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
  },
  {
    id: "2",
    name: "Carlos Santos",
    specialties: ["Corte Masculino", "Barba"],
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.8,
  },
  {
    id: "3",
    name: "Maria Oliveira",
    specialties: ["Escova Progressiva", "Coloração"],
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.7,
  },
  {
    id: "4",
    name: "Julia Costa",
    specialties: ["Manicure", "Pedicure"],
    avatar: "/placeholder.svg?height=100&width=100",
    rating: 4.9,
  },
]

export const timeSlots = [
  "08:00",
  "08:30",
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
  "17:30",
  "18:00",
  "18:30",
]
