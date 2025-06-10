"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Settings, Palette, User, Users, Calendar, Eye, EyeOff, Save, RotateCcw } from "lucide-react"
import { ImageUpload } from "./image-upload"
import { useConfig } from "../contexts/config-context"

export function AdvancedSettingsForm() {
  const { config, updateConfig } = useConfig()
  const [formData, setFormData] = useState(config)
  const [showPassword, setShowPassword] = useState(false)

  const handleSave = () => {
    updateConfig(formData)
    alert("Configurações salvas com sucesso!")
  }

  const handleReset = () => {
    if (confirm("Tem certeza que deseja restaurar as configurações padrão?")) {
      // Reset to default values
      const defaultConfig = {
        appName: "GS Mega Hair Studio Agendamento",
        logoUrl: "/placeholder.svg?height=100&width=200",
        headerLogoUrl: "/placeholder.svg?height=60&width=120",
        calendarLogoUrl: "/placeholder.svg?height=80&width=80",
        businessName: "GS Mega Hair Studio",
        businessPhone: "(11) 99999-9999",
        businessEmail: "contato@gsmegahair.com",
        businessAddress: "Rua das Flores, 123 - Centro",
        whatsappNumber: "5511999999999",
        reminderSettings: {
          monthly: true,
          bimonthly: true,
          quarterly: true,
        },
        birthdayReminders: true,
        theme: {
          primaryColor: "#ec4899",
          secondaryColor: "#8b5cf6",
          backgroundColor: "#fdf2f8",
          textColor: "#1f2937",
          accentColor: "#f59e0b",
        },
        loginCredentials: {
          username: "GSmega",
          password: "4846",
        },
        clientFields: {
          showPhone: true,
          showEmail: true,
          showBirthDate: true,
          showAddress: true,
          showNotes: true,
          showLastMaintenance: true,
          requirePhone: false,
          requireEmail: false,
        },
        appointmentSettings: {
          allowSameDayBooking: true,
          maxAdvanceBookingDays: 90,
          defaultDuration: 60,
          showPrice: true,
        },
        exportSettings: {
          includePersonalData: true,
          dateFormat: "DD/MM/YYYY",
          currency: "BRL",
        },
      }
      setFormData(defaultConfig)
      updateConfig(defaultConfig)
    }
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleNestedChange = (parent: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: value,
      },
    }))
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Configurações Avançadas</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Restaurar Padrão
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Salvar Tudo
          </Button>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
          <TabsTrigger value="theme">Tema</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="clients">Clientes</TabsTrigger>
          <TabsTrigger value="appointments">Agenda</TabsTrigger>
          <TabsTrigger value="notifications">Alertas</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Configurações Gerais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="appName">Nome do Aplicativo</Label>
                  <Input
                    id="appName"
                    value={formData.appName}
                    onChange={(e) => handleChange("appName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessName">Nome da Empresa</Label>
                  <Input
                    id="businessName"
                    value={formData.businessName}
                    onChange={(e) => handleChange("businessName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessPhone">Telefone da Empresa</Label>
                  <Input
                    id="businessPhone"
                    value={formData.businessPhone}
                    onChange={(e) => handleChange("businessPhone", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="businessEmail">E-mail da Empresa</Label>
                  <Input
                    id="businessEmail"
                    type="email"
                    value={formData.businessEmail}
                    onChange={(e) => handleChange("businessEmail", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsappNumber">WhatsApp (com código do país)</Label>
                  <Input
                    id="whatsappNumber"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                    placeholder="5511999999999"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessAddress">Endereço da Empresa</Label>
                <Textarea
                  id="businessAddress"
                  value={formData.businessAddress}
                  onChange={(e) => handleChange("businessAddress", e.target.value)}
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="logos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personalização de Logos</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
                <ImageUpload
                  label="Logo Principal"
                  value={formData.logoUrl}
                  onChange={(url) => handleChange("logoUrl", url)}
                  maxWidth={300}
                  maxHeight={150}
                />

                <ImageUpload
                  label="Logo do Cabeçalho"
                  value={formData.headerLogoUrl}
                  onChange={(url) => handleChange("headerLogoUrl", url)}
                  maxWidth={200}
                  maxHeight={80}
                />

                <ImageUpload
                  label="Logo do Calendário"
                  value={formData.calendarLogoUrl}
                  onChange={(url) => handleChange("calendarLogoUrl", url)}
                  maxWidth={150}
                  maxHeight={150}
                />
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Dicas para Logos:</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Use imagens em alta resolução (PNG ou JPG)</li>
                  <li>• Prefira fundos transparentes (PNG) para melhor integração</li>
                  <li>• Logo principal: ideal para tela de login e relatórios</li>
                  <li>• Logo do cabeçalho: aparece no topo de todas as páginas</li>
                  <li>• Logo do calendário: exibido no centro da agenda</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="theme" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Personalização de Cores e Tema
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="primaryColor">Cor Primária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={formData.theme.primaryColor}
                      onChange={(e) => handleNestedChange("theme", "primaryColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.primaryColor}
                      onChange={(e) => handleNestedChange("theme", "primaryColor", e.target.value)}
                      placeholder="#ec4899"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondaryColor">Cor Secundária</Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={formData.theme.secondaryColor}
                      onChange={(e) => handleNestedChange("theme", "secondaryColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.secondaryColor}
                      onChange={(e) => handleNestedChange("theme", "secondaryColor", e.target.value)}
                      placeholder="#8b5cf6"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundColor">Cor de Fundo</Label>
                  <div className="flex gap-2">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={formData.theme.backgroundColor}
                      onChange={(e) => handleNestedChange("theme", "backgroundColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.backgroundColor}
                      onChange={(e) => handleNestedChange("theme", "backgroundColor", e.target.value)}
                      placeholder="#fdf2f8"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="textColor">Cor do Texto</Label>
                  <div className="flex gap-2">
                    <Input
                      id="textColor"
                      type="color"
                      value={formData.theme.textColor}
                      onChange={(e) => handleNestedChange("theme", "textColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.textColor}
                      onChange={(e) => handleNestedChange("theme", "textColor", e.target.value)}
                      placeholder="#1f2937"
                      className="flex-1"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="accentColor">Cor de Destaque</Label>
                  <div className="flex gap-2">
                    <Input
                      id="accentColor"
                      type="color"
                      value={formData.theme.accentColor}
                      onChange={(e) => handleNestedChange("theme", "accentColor", e.target.value)}
                      className="w-16 h-10 p-1"
                    />
                    <Input
                      value={formData.theme.accentColor}
                      onChange={(e) => handleNestedChange("theme", "accentColor", e.target.value)}
                      placeholder="#f59e0b"
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 border rounded-lg" style={{ backgroundColor: formData.theme.backgroundColor }}>
                <h4 className="font-semibold mb-2" style={{ color: formData.theme.textColor }}>
                  Prévia do Tema
                </h4>
                <div className="flex gap-2">
                  <div
                    className="px-4 py-2 rounded text-white"
                    style={{ backgroundColor: formData.theme.primaryColor }}
                  >
                    Botão Primário
                  </div>
                  <div
                    className="px-4 py-2 rounded text-white"
                    style={{ backgroundColor: formData.theme.secondaryColor }}
                  >
                    Botão Secundário
                  </div>
                  <div className="px-4 py-2 rounded text-white" style={{ backgroundColor: formData.theme.accentColor }}>
                    Destaque
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="login" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Configurações de Login
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="username">Nome de Usuário</Label>
                  <Input
                    id="username"
                    value={formData.loginCredentials.username}
                    onChange={(e) => handleNestedChange("loginCredentials", "username", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.loginCredentials.password}
                      onChange={(e) => handleNestedChange("loginCredentials", "password", e.target.value)}
                      className="pr-10"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Atenção:</strong> Alterar as credenciais de login afetará o acesso ao sistema. Certifique-se
                  de anotar as novas credenciais antes de salvar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clients" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Configurações de Cadastro de Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-semibold mb-4">Campos Visíveis no Cadastro</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label>Mostrar Telefone</Label>
                    <Switch
                      checked={formData.clientFields.showPhone}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "showPhone", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Mostrar E-mail</Label>
                    <Switch
                      checked={formData.clientFields.showEmail}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "showEmail", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Mostrar Data de Nascimento</Label>
                    <Switch
                      checked={formData.clientFields.showBirthDate}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "showBirthDate", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Mostrar Endereço</Label>
                    <Switch
                      checked={formData.clientFields.showAddress}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "showAddress", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Mostrar Observações</Label>
                    <Switch
                      checked={formData.clientFields.showNotes}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "showNotes", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>Mostrar Última Manutenção</Label>
                    <Switch
                      checked={formData.clientFields.showLastMaintenance}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "showLastMaintenance", checked)}
                    />
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-semibold mb-4">Campos Obrigatórios</h4>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="flex items-center justify-between">
                    <Label>Telefone Obrigatório</Label>
                    <Switch
                      checked={formData.clientFields.requirePhone}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "requirePhone", checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label>E-mail Obrigatório</Label>
                    <Switch
                      checked={formData.clientFields.requireEmail}
                      onCheckedChange={(checked) => handleNestedChange("clientFields", "requireEmail", checked)}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="appointments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Configurações de Agendamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Permitir Agendamento no Mesmo Dia</Label>
                    <p className="text-sm text-muted-foreground">Clientes podem agendar para hoje</p>
                  </div>
                  <Switch
                    checked={formData.appointmentSettings.allowSameDayBooking}
                    onCheckedChange={(checked) =>
                      handleNestedChange("appointmentSettings", "allowSameDayBooking", checked)
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Mostrar Preços</Label>
                    <p className="text-sm text-muted-foreground">Exibir valores dos serviços</p>
                  </div>
                  <Switch
                    checked={formData.appointmentSettings.showPrice}
                    onCheckedChange={(checked) => handleNestedChange("appointmentSettings", "showPrice", checked)}
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="maxAdvanceBookingDays">Máximo de Dias para Agendamento</Label>
                  <Input
                    id="maxAdvanceBookingDays"
                    type="number"
                    min="1"
                    max="365"
                    value={formData.appointmentSettings.maxAdvanceBookingDays}
                    onChange={(e) =>
                      handleNestedChange(
                        "appointmentSettings",
                        "maxAdvanceBookingDays",
                        Number.parseInt(e.target.value),
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultDuration">Duração Padrão (minutos)</Label>
                  <Input
                    id="defaultDuration"
                    type="number"
                    min="15"
                    max="480"
                    step="15"
                    value={formData.appointmentSettings.defaultDuration}
                    onChange={(e) =>
                      handleNestedChange("appointmentSettings", "defaultDuration", Number.parseInt(e.target.value))
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Alertas e Notificações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Alertas de Aniversário</Label>
                  <p className="text-sm text-muted-foreground">Receber notificações de aniversário dos clientes</p>
                </div>
                <Switch
                  checked={formData.birthdayReminders}
                  onCheckedChange={(checked) => handleChange("birthdayReminders", checked)}
                />
              </div>

              <Separator />

              <div className="space-y-4">
                <Label className="text-base font-semibold">Lembretes de Retorno</Label>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lembrete Mensal</Label>
                    <p className="text-sm text-muted-foreground">Clientes que não voltam há 1 mês</p>
                  </div>
                  <Switch
                    checked={formData.reminderSettings.monthly}
                    onCheckedChange={(checked) => handleNestedChange("reminderSettings", "monthly", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lembrete Bimestral</Label>
                    <p className="text-sm text-muted-foreground">Clientes que não voltam há 2 meses</p>
                  </div>
                  <Switch
                    checked={formData.reminderSettings.bimonthly}
                    onCheckedChange={(checked) => handleNestedChange("reminderSettings", "bimonthly", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Lembrete Trimestral</Label>
                    <p className="text-sm text-muted-foreground">Clientes que não voltam há 3 meses</p>
                  </div>
                  <Switch
                    checked={formData.reminderSettings.quarterly}
                    onCheckedChange={(checked) => handleNestedChange("reminderSettings", "quarterly", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
