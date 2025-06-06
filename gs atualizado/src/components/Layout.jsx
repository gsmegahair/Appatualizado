import React, { useState, useEffect } from 'react';
    import { Link, useLocation, useNavigate } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
    import { Menu, X, Home, Users, CalendarDays, Settings, Sun, Moon, LogOut } from 'lucide-react';
    import { useTheme } from '@/components/theme-provider';
    import {
      DropdownMenu,
      DropdownMenuContent,
      DropdownMenuItem,
      DropdownMenuTrigger,
    } from "@/components/ui/dropdown-menu";
    import { useToast } from '@/components/ui/use-toast';

    const navItems = [
      { name: 'Início', path: '/', icon: Home },
      { name: 'Clientes', path: '/clients', icon: Users },
      { name: 'Agendamentos', path: '/appointments', icon: CalendarDays },
      { name: 'Configurações', path: '/settings', icon: Settings },
    ];

    const Layout = ({ children }) => {
      const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
      const { theme, setTheme } = useTheme();
      const location = useLocation();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [studioName, setStudioName] = useState("GS Mega Hair Studio Agendamento");
      const [logoSrc, setLogoSrc] = useState(null);

      const updateLayoutData = () => {
        const savedName = localStorage.getItem('studioName');
        if (savedName) {
          setStudioName(savedName);
          document.title = savedName;
        } else {
          setStudioName("GS Mega Hair Studio Agendamento");
          document.title = "GS Mega Hair Studio Agendamento";
        }
        const savedLogo = localStorage.getItem('studioLogo');
        setLogoSrc(savedLogo);
      };

      useEffect(() => {
        updateLayoutData();
        window.addEventListener('storage', updateLayoutData);
        return () => {
          window.removeEventListener('storage', updateLayoutData);
        };
      }, []);

      const handleLogout = () => {
        localStorage.removeItem('authToken');
        toast({ title: "Logout Realizado", description: "Você foi desconectado com sucesso." });
        navigate('/login');
      };

      const SidebarContent = () => (
        <div className="flex flex-col h-full bg-card text-card-foreground">
          <div className="p-6 flex flex-col items-center border-b border-border">
            <Link to="/" className="flex flex-col items-center space-y-2 mb-4" onClick={() => setMobileMenuOpen(false)}>
              {logoSrc ? (
                <img src={logoSrc} alt={`${studioName} Logo`} className="h-20 w-auto object-contain rounded-md p-1 bg-muted/20 shadow-sm" />
              ) : (
                <div className="h-20 w-20 bg-gradient-to-br from-primary to-pink-500 rounded-lg flex items-center justify-center text-primary-foreground shadow-lg">
                  <span className="text-3xl font-bold">{studioName.substring(0, 2).toUpperCase()}</span>
                </div>
              )}
              <span className="text-lg font-semibold text-center mt-2">{studioName}</span>
            </Link>
          </div>
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-4 py-3 rounded-lg transition-colors duration-200
                  ${location.pathname === item.path
                    ? 'bg-primary text-primary-foreground shadow-lg transform scale-105'
                    : 'hover:bg-muted hover:text-accent-foreground hover:translate-x-1'
                  }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-border mt-auto">
            <Button onClick={handleLogout} variant="ghost" className="w-full justify-start text-muted-foreground hover:text-red-500 hover:bg-red-500/10">
              <LogOut className="h-5 w-5 mr-3" />
              Sair
            </Button>
          </div>
        </div>
      );

      return (
        <div className="flex h-screen bg-background">
          <aside className="hidden lg:block w-72 border-r border-border shadow-md">
            <SidebarContent />
          </aside>

          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetContent side="left" className="p-0 w-72">
              <SidebarContent />
            </SheetContent>
          </Sheet>

          <main className="flex-1 flex flex-col overflow-hidden">
            <header className="h-16 flex items-center justify-between lg:justify-end px-6 border-b border-border bg-card shadow-sm">
              <div className="lg:hidden flex items-center">
                 {logoSrc && (
                  <Link to="/">
                    <img src={logoSrc} alt={`${studioName} Logo Cabeçalho`} className="h-8 w-auto object-contain rounded-sm mr-3" />
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground"
                  onClick={() => setMobileMenuOpen(true)}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className="text-muted-foreground hover:text-foreground">
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                  <span className="sr-only">Alternar tema</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                       <img className="h-10 w-10 rounded-full object-cover" alt="Avatar do usuário" src="https://images.unsplash.com/photo-1700909623321-3a73419d3047?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=80&q=80" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem disabled>Perfil (Em breve)</DropdownMenuItem>
                    <DropdownMenuItem onClick={handleLogout} className="text-red-500 hover:!text-red-500 hover:!bg-red-500/10">Sair <LogOut className="ml-auto h-4 w-4" /></DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </header>
            
            <div className="flex-1 overflow-y-auto p-6 lg:p-10 bg-gradient-to-br from-background via-muted/10 to-background">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {children}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      );
    };

    export default Layout;