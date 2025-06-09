"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, User } from "lucide-react"
import { useAuth } from "../contexts/auth-context"
import { useConfig } from "../contexts/config-context"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { login } = useAuth()
  const { config } = useConfig()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (login(username, password)) {
      // Login bem-sucedido
    } else {
      setError("Usuário ou senha incorretos")
    }
  }

  return (
    <div className="main-container bg-gradient-theme min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md glass-card">
        <CardHeader className="text-center">
          <img
            src={config.logoUrl || "/placeholder.svg"}
            alt={config.appName}
            className="h-20 mx-auto mb-4 glow-effect rounded-lg"
          />
          <CardTitle className="text-2xl bg-gradient-header bg-clip-text text-transparent">{config.appName}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 glass-card"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 glass-card"
                  required
                />
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="glass-card">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button type="submit" className="w-full btn-gradient-primary">
              Entrar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
