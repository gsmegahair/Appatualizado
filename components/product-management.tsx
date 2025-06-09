"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Edit, Trash2, Package, Barcode, Upload, Download, Camera } from "lucide-react"
import { generateBarcode, generateSKU } from "../utils/import-utils"
import { DataImport } from "./data-import"
import type { Product } from "../types"

interface ProductManagementProps {
  products: Product[]
  onAddProduct: (product: Omit<Product, "id" | "createdAt">) => void
  onUpdateProduct: (id: string, product: Partial<Product>) => void
  onDeleteProduct: (id: string) => void
  onImportProducts: (products: Partial<Product>[]) => void
}

export function ProductManagement({
  products,
  onAddProduct,
  onUpdateProduct,
  onDeleteProduct,
  onImportProducts,
}: ProductManagementProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: 0,
    cost: 0,
    barcode: "",
    sku: "",
    category: "",
    brand: "",
    supplier: "",
    quantity: 0,
    minQuantity: 0,
    imageUrl: "",
  })
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Extrair categorias únicas dos produtos
  const categories = Array.from(new Set(products.map((product) => product.category).filter(Boolean))) as string[]

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.includes(searchTerm) ||
      product.sku?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = !selectedCategory || product.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  const handleAddProduct = () => {
    if (!formData.name || formData.price <= 0) {
      alert("Por favor, preencha todos os campos obrigatórios")
      return
    }

    onAddProduct({
      ...formData,
      updatedAt: new Date().toISOString(),
    })
    setShowAddDialog(false)
    resetForm()
  }

  const handleEditProduct = () => {
    if (currentProduct && formData.name && formData.price > 0) {
      onUpdateProduct(currentProduct.id, {
        ...formData,
        updatedAt: new Date().toISOString(),
      })
      setShowEditDialog(false)
      setCurrentProduct(null)
      resetForm()
    }
  }

  const handleDeleteProduct = () => {
    if (currentProduct) {
      onDeleteProduct(currentProduct.id)
      setShowDeleteDialog(false)
      setCurrentProduct(null)
    }
  }

  const openEditDialog = (product: Product) => {
    setCurrentProduct(product)
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price,
      cost: product.cost || 0,
      barcode: product.barcode || "",
      sku: product.sku || "",
      category: product.category || "",
      brand: product.brand || "",
      supplier: product.supplier || "",
      quantity: product.quantity,
      minQuantity: product.minQuantity || 0,
      imageUrl: product.imageUrl || "",
    })
    setShowEditDialog(true)
  }

  const openDeleteDialog = (product: Product) => {
    setCurrentProduct(product)
    setShowDeleteDialog(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: 0,
      cost: 0,
      barcode: "",
      sku: "",
      category: "",
      brand: "",
      supplier: "",
      quantity: 0,
      minQuantity: 0,
      imageUrl: "",
    })
  }

  const generateNewBarcode = () => {
    setFormData({ ...formData, barcode: generateBarcode() })
  }

  const generateNewSKU = () => {
    if (formData.name) {
      setFormData({ ...formData, sku: generateSKU(formData.name) })
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setFormData({ ...formData, imageUrl: event.target?.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImportData = (data: { products?: Partial<Product>[] }) => {
    if (data.products && data.products.length > 0) {
      onImportProducts(data.products)
      setShowImportDialog(false)
    }
  }

  const exportToCSV = () => {
    const headers = [
      "Nome",
      "Descrição",
      "Preço",
      "Custo",
      "Código de Barras",
      "SKU",
      "Categoria",
      "Marca",
      "Fornecedor",
      "Quantidade",
      "Quantidade Mínima",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredProducts.map((product) =>
        [
          `"${product.name}"`,
          `"${product.description || ""}"`,
          product.price,
          product.cost || 0,
          `"${product.barcode || ""}"`,
          `"${product.sku || ""}"`,
          `"${product.category || ""}"`,
          `"${product.brand || ""}"`,
          `"${product.supplier || ""}"`,
          product.quantity,
          product.minQuantity || 0,
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "produtos.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex-1 w-full md:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar produtos por nome, código de barras ou SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 glass-card"
            />
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <Button variant="outline" onClick={() => setShowImportDialog(true)} className="glass-card">
            <Upload className="h-4 w-4 mr-2" />
            Importar
          </Button>

          <Button variant="outline" onClick={exportToCSV} className="glass-card">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>

          <Button onClick={() => setShowAddDialog(true)} className="btn-gradient-primary">
            <Plus className="h-4 w-4 mr-2" />
            Novo Produto
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="glass-card">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl || "/placeholder.svg"}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <Package className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      {product.category && (
                        <Badge variant="outline" className="text-xs">
                          {product.category}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {product.description && (
                    <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                  )}

                  <div className="mt-2 space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Preço:</span>
                      <span className="font-medium text-theme-primary">R$ {product.price.toFixed(2)}</span>
                    </div>

                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Estoque:</span>
                      <span
                        className={`font-medium ${product.quantity <= (product.minQuantity || 0) ? "text-red-500" : "text-green-500"}`}
                      >
                        {product.quantity} unid.
                      </span>
                    </div>

                    {product.barcode && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Barcode className="h-3 w-3" />
                        {product.barcode}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => openEditDialog(product)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => openDeleteDialog(product)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="glass-card">
          <CardContent className="p-8 text-center">
            <p className="text-muted-foreground">Nenhum produto encontrado</p>
            <Button onClick={() => setShowAddDialog(true)} className="mt-4 btn-gradient-primary">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Produto
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Modal para adicionar produto */}
      {showAddDialog && (
        <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Adicionar Novo Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome do Produto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Ex: Shampoo Profissional"
                    className="glass-card"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
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

                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantidade *</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                      className="glass-card"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Ex: Shampoos"
                    className="glass-card"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="barcode">Código de Barras</Label>
                    <Button type="button" variant="ghost" size="sm" onClick={generateNewBarcode} className="text-xs">
                      Gerar
                    </Button>
                  </div>
                  <Input
                    id="barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    placeholder="Ex: 7891234567890"
                    className="glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="sku">SKU</Label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={generateNewSKU}
                      className="text-xs"
                      disabled={!formData.name}
                    >
                      Gerar
                    </Button>
                  </div>
                  <Input
                    id="sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="Ex: SHA-0001"
                    className="glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem do Produto</Label>
                  <div className="flex items-center gap-2">
                    {formData.imageUrl ? (
                      <div className="relative w-16 h-16">
                        <img
                          src={formData.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white"
                          onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="glass-card"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Selecionar
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Descrição detalhada do produto"
                className="glass-card"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowAddDialog(false)} className="flex-1 glass-card">
                Cancelar
              </Button>
              <Button
                onClick={handleAddProduct}
                className="flex-1 btn-gradient-primary"
                disabled={!formData.name || formData.price <= 0}
              >
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para editar produto */}
      {showEditDialog && (
        <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h3 className="text-lg font-semibold mb-4">Editar Produto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Nome do Produto *</Label>
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

                  <div className="space-y-2">
                    <Label htmlFor="edit-quantity">Quantidade *</Label>
                    <Input
                      id="edit-quantity"
                      type="number"
                      min="0"
                      step="1"
                      value={formData.quantity}
                      onChange={(e) => setFormData({ ...formData, quantity: Number.parseInt(e.target.value) || 0 })}
                      className="glass-card"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-category">Categoria</Label>
                  <Input
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="glass-card"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-barcode">Código de Barras</Label>
                  <Input
                    id="edit-barcode"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-sku">SKU</Label>
                  <Input
                    id="edit-sku"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="glass-card"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Imagem do Produto</Label>
                  <div className="flex items-center gap-2">
                    {formData.imageUrl ? (
                      <div className="relative w-16 h-16">
                        <img
                          src={formData.imageUrl || "/placeholder.svg"}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white"
                          onClick={() => setFormData({ ...formData, imageUrl: "" })}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center">
                        <Package className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      className="glass-card"
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Alterar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 mt-4">
              <Label htmlFor="edit-description">Descrição</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="glass-card"
                rows={3}
              />
            </div>

            <div className="flex gap-3 mt-6">
              <Button variant="outline" onClick={() => setShowEditDialog(false)} className="flex-1 glass-card">
                Cancelar
              </Button>
              <Button
                onClick={handleEditProduct}
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
            <h3 className="text-lg font-semibold mb-4">Excluir Produto</h3>
            <p className="text-muted-foreground mb-6">
              Tem certeza que deseja excluir o produto "{currentProduct?.name}"? Esta ação não pode ser desfeita.
            </p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowDeleteDialog(false)} className="flex-1 glass-card">
                Cancelar
              </Button>
              <Button onClick={handleDeleteProduct} className="flex-1 bg-red-500 hover:bg-red-600 text-white">
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de importação */}
      {showImportDialog && (
        <div className="fixed inset-0 gradient-overlay flex items-center justify-center p-4 z-50">
          <div className="glass-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <DataImport onImport={handleImportData} onClose={() => setShowImportDialog(false)} />
          </div>
        </div>
      )}
    </div>
  )
}
