"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Clock, DollarSign, Tag } from "lucide-react"
import { serviceCategories } from "../utils/import-utils"
import type { Service } from "../types"

interface ServiceManagementProps {
  services: Service[]
  onAddService: (service: Omit<Service, "id">) => void
  onUpdateService: (id: string, service: Partial<Service>) => void
  onDeleteService: (id: string) => void
}

export function ServiceManagement({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
}: ServiceManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [currentService, setCurrentService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    duration: 60,
    price: 0,
    description: "",
    category: "",
  })

  // Filtrar serviços
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || service.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Agrupar serviços por categoria
  const servicesByCategory = filteredServices.reduce(
    (acc, service) => {
      const category = service.category || "Sem Categoria"
      if (!acc[category]) {
        acc[category] = []
      }
      acc[category].push(service)
      return acc
    },
    {} as Record<string, Service[]>,
  )

  const handleAddService = () => {
    if (!formData.name || formData.price <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    onAddService(formData)
    setShowAddDialog(false)
    resetForm()
  }

  const handleEditService = () => {
    if (currentService && formData.name && formData.price > 0) {
      onUpdateService(currentService.id, formData)
      setShowEditDialog(false)
      setCurrentService(null)
      resetForm()
    }
  }

  const handleDeleteService = () => {
    if (currentService) {
      try {
        onDeleteService(currentService.id)
        setShowDeleteDialog(false)
        setCurrentService(null)
      } catch (error) {
        alert(error instanceof Error ? error.message : "Erro ao excluir serviço")
      }
    }
  }

  const openEditDialog = (service: Service) => {
    setCurrentService(service)
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
      description: service.description || "",
      category: service.category || "",
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (service: Service) => {
    setCurrentService(service)
    setShowDeleteDialog(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      duration: 60,
      price: 0,
      description: "",
      category: "",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar serviços..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Select value={selectedCategory || ""} onValueChange={(value) => setSelectedCategory(value || null)}>
            <SelectTrigger className="glass-card w-full md:w-[180px]">
              <SelectValue placeholder="Todas as categorias" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as categorias</SelectItem>
              {serviceCategories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button onClick={() => setShowAddDialog(true)} className="btn-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Novo Serviço
          </Button>
        </div>
      </div>

      {Object.entries(servicesByCategory).map(([category, categoryServices]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold">{category}</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categoryServices.map((service) => (
              <Card key={service.id} className="glass-card">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-semibold">{service.name}</h4>
                      {service.description && (
                        <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {service.duration} min
                        </Badge>
                        <Badge
                          variant="outline"
                          className="flex items-center gap-1 bg-gradient-button-secondary text-white"
                        >
                          <DollarSign className="h-3 w-3" />
                          R$ {service.price.toFixed(2)}
                        </Badge>
                        {service.category && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Tag className="h-3 w-3" />
                            {service.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button size="sm" variant="ghost" onClick={() => openEditDialog(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(service)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}

      {filteredServices.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum serviço encontrado</p>
            <Button onClick={() => setShowAddDialog(true)} className="mt-4 btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Serviço
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal para adicionar serviço */}
      {showAddDialog && (
        <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Adicionar Novo Serviço</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Serviço *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Corte Feminino"
                  className="glass-card"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duração (min) *</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 60 })}
                    className="glass-card"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Preço (R$) *</Label>
                  <Input
                    id="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    className="glass-card"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Descrição detalhada do serviço"
                  className="glass-card"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1 glass-card">
                Cancelar
              </Button>
              <Button
                onClick={handleAddService}
                className="flex-1 btn-gradient-primary"
                disabled={!formData.name || formData.price <= 0}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar serviço */}
      {showEditDialog && (
        <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Editar Serviço</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-name">Nome do Serviço *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="glass-card"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duração (min) *</Label>
                  <Input
                    id="edit-duration"
                    type="number"
                    min="5"
                    step="5"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number.parseInt(e.target.value) || 60 })}
                    className="glass-card"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-price">Preço (R$) *</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number.parseFloat(e.target.value) || 0 })}
                    className="glass-card"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger className="glass-card">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {serviceCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description">Descrição</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="glass-card"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1 glass-card">
                Cancelar
              </Button>
              <Button
                onClick={handleEditService}
                className="flex-1 btn-gradient-primary"
                disabled={!formData.name || formData.price <= 0}
              >
                Salvar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmação para excluir */}
      {showDeleteDialog && (
        <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold mb-4">Excluir Serviço</h3>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja excluir o serviço "{currentService?.name}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1 glass-card">
                Cancelar
              </Button>
              <Button onClick={handleDeleteService} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
