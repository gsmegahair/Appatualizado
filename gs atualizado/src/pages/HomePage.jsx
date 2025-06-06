import React from 'react';
    import { motion } from 'framer-motion';
    import { CalendarDays, Users, Settings, Scissors, BarChart3 } from 'lucide-react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import MaintenanceAlerts from '@/components/MaintenanceAlerts';

    const StatCard = ({ title, value, icon, description, color }) => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className={`shadow-xl glassmorphism border-l-4 ${color}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{value}</div>
            <p className="text-xs text-muted-foreground">{description}</p>
          </CardContent>
        </Card>
      </motion.div>
    );

    const ActionButton = ({ to, text, icon, className }) => (
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Link to={to}>
          <Button className={`w-full h-24 text-lg shadow-lg glassmorphism flex flex-col items-center justify-center ${className}`}>
            {icon}
            {text}
          </Button>
        </Link>
      </motion.div>
    );

    const HomePage = () => {
      const studioName = localStorage.getItem('studioName') || "GS Mega Hair Studio";
      const studioLogo = localStorage.getItem('studioLogo');

      // Placeholder data - in a real app, this would come from state/API
      const appointmentsToday = JSON.parse(localStorage.getItem('gsAppointments') || '[]').filter(
        (appt) => new Date(appt.date).toDateString() === new Date().toDateString() && appt.status === 'Agendado'
      ).length;
      const totalClients = JSON.parse(localStorage.getItem('gsClients') || '[]').length;
      const upcomingBirthdays = JSON.parse(localStorage.getItem('gsClients') || '[]').filter(client => {
        if (!client.birthday) return false;
        const today = new Date();
        const birthDate = new Date(client.birthday);
        birthDate.setFullYear(today.getFullYear()); // Compare with current year's birthday
        const diff = (birthDate - today) / (1000 * 60 * 60 * 24);
        return diff >= 0 && diff <= 7; // Birthdays in the next 7 days
      }).length;
      

      return (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-8 p-4 md:p-8"
        >
          <header className="text-center mb-12">
            {studioLogo && (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
                className="mb-4"
              >
                <img-replace src={studioLogo} alt="Logo do Salão" className="mx-auto h-24 w-auto rounded-lg shadow-md" />
              </motion.div>
            )}
            <motion.h1 
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 120, delay: 0.1 }}
              className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-pink-500 to-accent text-transparent bg-clip-text pb-2"
            >
              Bem-vindo ao {studioName} Agendamento!
            </motion.h1>
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-muted-foreground mt-2"
            >
              Gerencie seus clientes e agendamentos com facilidade e estilo.
            </motion.p>
          </header>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <StatCard 
              title="Agendamentos Hoje" 
              value={appointmentsToday}
              icon={<CalendarDays className="h-5 w-5 text-blue-500" />} 
              description="Compromissos agendados para hoje"
              color="border-blue-500"
            />
            <StatCard 
              title="Total de Clientes" 
              value={totalClients}
              icon={<Users className="h-5 w-5 text-green-500" />} 
              description="Clientes cadastrados no sistema"
              color="border-green-500"
            />
            <StatCard 
              title="Aniversários Próximos" 
              value={upcomingBirthdays}
              icon={<Users className="h-5 w-5 text-pink-500" />} 
              description="Nos próximos 7 dias"
              color="border-pink-500"
            />
          </div>
          
          <MaintenanceAlerts />

          <section>
            <h2 className="text-2xl font-semibold mb-6 text-center tracking-tight">Ações Rápidas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionButton 
                to="/appointments" 
                text="Ver Agenda" 
                icon={<CalendarDays className="h-8 w-8 mb-1 text-blue-400" />}
                className="bg-blue-500/20 hover:bg-blue-500/30 border-blue-500"
              />
              <ActionButton 
                to="/clients" 
                text="Gerenciar Clientes" 
                icon={<Users className="h-8 w-8 mb-1 text-green-400" />}
                className="bg-green-500/20 hover:bg-green-500/30 border-green-500"
              />
               <ActionButton 
                to="/appointments#new" 
                text="Novo Agendamento" 
                icon={<Scissors className="h-8 w-8 mb-1 text-pink-400" />}
                className="bg-pink-500/20 hover:bg-pink-500/30 border-pink-500"
              />
              {/* <ActionButton 
                to="/reports" 
                text="Relatórios" 
                icon={<BarChart3 className="h-8 w-8 mb-1 text-yellow-400" />}
                className="bg-yellow-500/20 hover:bg-yellow-500/30 border-yellow-500"
              /> */}
              <ActionButton 
                to="/settings" 
                text="Configurações" 
                icon={<Settings className="h-8 w-8 mb-1 text-purple-400" />}
                className="bg-purple-500/20 hover:bg-purple-500/30 border-purple-500 sm:col-span-2 lg:col-span-1"
              />
            </div>
          </section>

          <footer className="text-center mt-12 py-6 border-t border-border">
            <p className="text-sm text-muted-foreground">
              GS Mega Hair Studio Agendamento &copy; {new Date().getFullYear()}. Todos os direitos reservados.
            </p>
             <p className="text-xs text-muted-foreground mt-1">
              Desenvolvido com <span role="img" aria-label="heart">❤️</span> por Hostinger Horizons
            </p>
          </footer>
        </motion.div>
      );
    };

    export default HomePage;