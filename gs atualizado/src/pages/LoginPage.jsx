import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Lock, User } from 'lucide-react';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { toast } = useToast();
  const [logoSrc, setLogoSrc] = useState(localStorage.getItem('studioLogo') || null);
  const studioName = localStorage.getItem('studioName') || "GS Mega Hair Studio Agendamento";

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'GSmega' && password === '4846') {
      localStorage.setItem('authToken', 'GSMEGA_AUTH_TOKEN_4846');
      toast({ title: "Login Bem-Sucedido!", description: `Bem-vindo(a) de volta, ${username}!` });
      navigate('/');
    } else {
      toast({
        title: "Falha no Login",
        description: "Nome de usuário ou senha incorretos. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/30 via-background to-secondary/30 p-4"
    >
      <Card className="w-full max-w-md shadow-2xl glassmorphism border-primary/50">
        <CardHeader className="text-center space-y-2">
           {logoSrc ? (
            <img src={logoSrc} alt={`${studioName} Logo`} className="mx-auto h-24 w-auto object-contain rounded-md p-1 bg-muted/20 shadow-sm" />
          ) : (
             <div className="mx-auto h-24 w-24 bg-gradient-to-br from-primary to-pink-500 rounded-full flex items-center justify-center text-primary-foreground shadow-lg">
                <span className="text-4xl font-bold">{studioName.substring(0,2).toUpperCase()}</span>
            </div>
          )}
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary via-pink-500 to-accent text-transparent bg-clip-text">
            {studioName}
          </CardTitle>
          <CardDescription className="text-muted-foreground">Faça login para acessar o painel de agendamentos.</CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Nome de Usuário</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="username"
                  type="text"
                  placeholder="Seu usuário"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Sua senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white text-lg py-6 shadow-lg">
              Entrar
            </Button>
          </CardFooter>
        </form>
      </Card>
    </motion.div>
  );
};

export default LoginPage;