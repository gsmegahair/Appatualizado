import React, { useState, useEffect, useRef } from 'react';
    import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
    import { BellRing, AlertTriangle } from 'lucide-react';
    import { useToast } from '@/components/ui/use-toast';
    import { format, parseISO, addMonths, differenceInDays, isWithinInterval, addDays } from 'date-fns';
    import { ptBR } from 'date-fns/locale';

    const MaintenanceAlerts = () => {
      const [upcomingMaintenances, setUpcomingMaintenances] = useState([]);
      const { toast } = useToast();
      const audioRef = useRef(null);

      useEffect(() => {
        const storedClients = JSON.parse(localStorage.getItem('gsClients') || '[]');
        const today = new Date();
        const fifteenDaysFromNow = addDays(today, 15);

        const maintenances = storedClients.map(client => {
          if (!client.lastVisit || client.returnFrequency === 'nao_definido') {
            return null;
          }

          const lastVisitDate = parseISO(client.lastVisit);
          let nextMaintenanceDate;
          let expectedReturnMonths;

          switch (client.returnFrequency) {
            case 'mensal': expectedReturnMonths = 1; break;
            case 'bimestral': expectedReturnMonths = 2; break;
            case 'trimestral': expectedReturnMonths = 3; break;
            case 'semestral': expectedReturnMonths = 6; break;
            case 'anual': expectedReturnMonths = 12; break;
            default: return null;
          }
          
          nextMaintenanceDate = addMonths(lastVisitDate, expectedReturnMonths);
          const daysUntilMaintenance = differenceInDays(nextMaintenanceDate, today);

          return {
            ...client,
            nextMaintenanceDate,
            daysUntilMaintenance,
          };
        }).filter(m => m !== null && m.daysUntilMaintenance <= 15 && m.daysUntilMaintenance >= 0);
        
        setUpcomingMaintenances(maintenances.sort((a,b) => a.daysUntilMaintenance - b.daysUntilMaintenance));

        if (maintenances.some(m => m.daysUntilMaintenance <= 15 && m.daysUntilMaintenance >=0)) {
          playAlertSound();
          toast({
            title: (
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-yellow-500" />
                <span>Alerta de Manutenção Próxima!</span>
              </div>
            ),
            description: `Há clientes com manutenção programada para os próximos 15 dias.`,
            duration: 10000, 
          });
        }

      }, [toast]);

      const playAlertSound = () => {
        if (audioRef.current) {
          audioRef.current.play().catch(error => console.error("Erro ao tocar som de alerta:", error));
        }
      };
      
      return (
        <Card className="shadow-xl glassmorphism col-span-1 md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-2xl font-bold">Próximas Manutenções (15 dias)</CardTitle>
            <BellRing className="h-6 w-6 text-accent" />
          </CardHeader>
          <CardContent>
            {upcomingMaintenances.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Telefone</TableHead>
                    <TableHead>Próxima Manutenção</TableHead>
                    <TableHead className="text-center">Dias Restantes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingMaintenances.map((client) => (
                    <TableRow key={client.id} className={client.daysUntilMaintenance <= 7 ? "bg-yellow-500/10 hover:bg-yellow-500/20" : "hover:bg-muted/50"}>
                      <TableCell className="font-medium">{client.name}</TableCell>
                      <TableCell>{client.phone}</TableCell>
                      <TableCell>{format(client.nextMaintenanceDate, "dd/MM/yyyy", { locale: ptBR })}</TableCell>
                      <TableCell className="text-center">
                        <span className={`font-semibold px-2 py-1 rounded-md ${
                          client.daysUntilMaintenance <= 7 ? 'text-red-500 animate-pulse' : 
                          client.daysUntilMaintenance <= 15 ? 'text-yellow-600' : 'text-green-500'
                        }`}>
                          {client.daysUntilMaintenance}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center text-muted-foreground py-4">Nenhuma manutenção próxima nos próximos 15 dias.</p>
            )}
          </CardContent>
          <audio ref={audioRef} src="/alert-sound.mp3" preload="auto"></audio>
        </Card>
      );
    };

    export default MaintenanceAlerts;