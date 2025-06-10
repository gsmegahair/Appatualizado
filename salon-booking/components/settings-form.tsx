"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings } from "lucide-react"
import { useConfig } from "../contexts/config-context"

export function SettingsForm() {
  const { config, updateConfig } = useConfig()
  const [formData, setFormData] = useState(config)

  const handleSave = () => {
    updateConfig(formData)
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleReminderChange = (type: "monthly" | "bimonthly" | "quarterly", value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      reminderSettings: {
        ...prev.reminderSettings,
        [type]: value,
      },
    }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Configurações do Sistema
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="general" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">Geral</TabsTrigger>
            <TabsTrigger value="logos">Logos</TabsTrigger>
            <TabsTrigger value="business">Empresa</TabsTrigger>
            <TabsTrigger value="notifications">Alertas</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="appName">Nome do Aplicativo</Label>
              <Input id="appName" value={formData.appName} onChange={(e) => handleChange("appName", e.target.value)} />
            </div>
          </TabsContent>

          <TabsContent value="logos" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="logoUrl">Logo Principal</Label>
                <Input
                  id="logoUrl"
                  value={formData.logoUrl}
                  onChange={(e) => handleChange("logoUrl", e.target.value)}
                  placeholder="URL da imagem ou caminho do arquivo"
                />
                <img src={formData.logoUrl || "/placeholder.svg"} alt="Logo" className="h-20 object-contain" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="headerLogoUrl">Logo do Cabeçalho</Label>
                <Input
                  id="headerLogoUrl"
                  value={formData.headerLogoUrl}
                  onChange={(e) => handleChange("headerLogoUrl", e.target.value)}
                  placeholder="URL da imagem ou caminho do arquivo"
                />
                <img
                  src={formData.headerLogoUrl || "/placeholder.svg"}
                  alt="Logo Cabeçalho"
                  className="h-12 object-contain"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="calendarLogoUrl">Logo do Calendário</Label>
                <Input
                  id="calendarLogoUrl"
                  value={formData.calendarLogoUrl}
                  onChange={(e) => handleChange("calendarLogoUrl", e.target.value)}
                  placeholder="URL da imagem ou caminho do arquivo"
                />
                <img
                  src={formData.calendarLogoUrl || "/placeholder.svg"}
                  alt="Logo Calendário"
                  className="h-16 object-contain"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="business" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="businessName">Nome da Empresa</Label>
                <Input
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => handleChange("businessName", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone">Telefone</Label>
                <Input
                  id="businessPhone"
                  value={formData.businessPhone}
                  onChange={(e) => handleChange("businessPhone", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessEmail">E-mail</Label>
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
              <Label htmlFor="businessAddress">Endereço</Label>
              <Input
                id="businessAddress"
                value={formData.businessAddress}
                onChange={(e) => handleChange("businessAddress", e.target.value)}
              />
            </div>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-4">
            <div className="space-y-4">
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

              <div className="space-y-3">
                <Label>Lembretes de Retorno</Label>

                <div className="flex items-center justify-between">
                  <Label>Mensal</Label>
                  <Switch
                    checked={formData.reminderSettings.monthly}
                    onCheckedChange={(checked) => handleReminderChange("monthly", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Bimestral</Label>
                  <Switch
                    checked={formData.reminderSettings.bimonthly}
                    onCheckedChange={(checked) => handleReminderChange("bimonthly", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label>Trimestral</Label>
                  <Switch
                    checked={formData.reminderSettings.quarterly}
                    onCheckedChange={(checked) => handleReminderChange("quarterly", checked)}
                  />
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end pt-6">
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </CardContent>
    </Card>
  )
}
