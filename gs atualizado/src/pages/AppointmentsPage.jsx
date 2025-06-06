import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, Edit, Trash2, MoreHorizontal, Search, MessageSquare, FileUp, FileDown, DollarSign, CreditCard, Landmark, Coins, UserPlus, CheckSquare, FileText, FileSpreadsheet, Printer, CalendarClock, CalendarDays as CalendarDaysIcon, CalendarRange } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO, isValid, startOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, addDays, eachDayOfInterval } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useLocation, useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const paymentMethods = [
  { value: 'dinheiro', label: 'Dinheiro', icon: <Coins className="mr-2 h-4 w-4" /> },
  { value: 'pix', label: 'PIX', icon: <Landmark className="mr-2 h-4 w-4" /> },
  { value: 'credito', label: 'Cartão de Crédito', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'debito', label: 'Cartão de Débito', icon: <CreditCard className="mr-2 h-4 w-4" /> },
  { value: 'fiado', label: 'Fiado', icon: <DollarSign className="mr-2 h-4 w-4" /> },
];

const statusList = ['Agendado', 'Confirmado', 'Cancelado', 'Concluído', 'Não Compareceu'];

const initialFormData = { 
  clientId: '', 
  service: '', 
  date: format(new Date(), 'yyyy-MM-dd'), 
  time: '', 
  status: 'Agendado', 
  paymentMethod: '',
  serviceValue: '',
  appointmentType: '', 
};

const initialNewClientFormData = { name: '', phone: '' };

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [clients, setClients] = useState([]);
  const [servicesList, setServicesList] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [selectedDate, setSelectedDate] = useState(startOfDay(new Date()));
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isNewClientModalOpen, setIsNewClientModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const [newClientFormData, setNewClientFormData] = useState(initialNewClientFormData);
  const { toast } = useToast();
  const location = useLocation();
  const navigate = useNavigate();

  const loadData = useCallback(() => {
    const storedAppointments = JSON.parse(localStorage.getItem('gsAppointments') || '[]');
    setAppointments(storedAppointments);

    const storedClients = JSON.parse(localStorage.getItem('gsClients') || '[]');
    setClients(storedClients);
    
    const storedServices = JSON.parse(localStorage.getItem('gsServices') || '[]');
    setServicesList(storedServices);
    
    const defaultApptTypes = [{ id: 'APPTYPE_DEFAULT_PADRAO', name: 'Padrão', category: 'padrao' }, { id: 'APPTYPE_DEFAULT_RETORNO', name: 'Retorno', category: 'retorno' }];
    const storedAppointmentTypes = JSON.parse(localStorage.getItem('gsAppointmentTypes') || JSON.stringify(defaultApptTypes));
    
    if (!localStorage.getItem('gsAppointmentTypes')) {
        localStorage.setItem('gsAppointmentTypes', JSON.stringify(defaultApptTypes));
    }
    setAppointmentTypes(storedAppointmentTypes);

  }, []);

  useEffect(() => {
    loadData();
    if (location.hash === '#new') {
      handleOpenForm();
      navigate(location.pathname, { replace: true }); 
    }
  }, [loadData, location, navigate]);

  const saveAppointmentsToLocalStorage = (updatedAppointments) => {
    localStorage.setItem('gsAppointments', JSON.stringify(updatedAppointments));
  };
  
  const saveClientsToLocalStorage = (updatedClients) => {
    localStorage.setItem('gsClients', JSON.stringify(updatedClients));
  };

  const handleInputChange = (e, formSetter = setFormData) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value, formSetter = setFormData) => {
    formSetter(prev => ({ ...prev, [name]: value }));
    if (name === 'service' && formSetter === setFormData) {
      const selectedServiceObj = servicesList.find(s => s.name === value);
      if (selectedServiceObj && selectedServiceObj.price) {
        formSetter(prev => ({ ...prev, serviceValue: selectedServiceObj.price }));
      } else {
        formSetter(prev => ({...prev, serviceValue: ''}));
      }
    }
  };
  
  const handleDateChange = (date) => {
    if (date && isValid(date)) {
      const normalizedDate = startOfDay(date);
      setSelectedDate(normalizedDate);
      setFormData(prev => ({ ...prev, date: format(normalizedDate, 'yyyy-MM-dd') }));
    }
  };

  const handleAddNewClient = () => {
    if (!newClientFormData.name || !newClientFormData.phone) {
      toast({ title: "Campos Obrigatórios", description: "Nome e telefone são obrigatórios para o novo cliente.", variant: "destructive" });
      return;
    }
    const newClient = { 
      id: `CLI${Date.now()}`, 
      name: newClientFormData.name, 
      phone: newClientFormData.phone,
      birthday: '',
      lastVisit: new Date().toISOString().split('T')[0],
      returnFrequency: 'mensal'
    };
    const updatedClients = [...clients, newClient];
    setClients(updatedClients);
    saveClientsToLocalStorage(updatedClients);
    
    setFormData(prev => ({ ...prev, clientId: newClient.id }));
    toast({ title: "Cliente Adicionado!", description: `${newClient.name} cadastrado e selecionado.` });
    setIsNewClientModalOpen(false);
    setNewClientFormData(initialNewClientFormData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.clientId || !formData.service || !formData.date || !formData.time || !formData.appointmentType) {
        toast({ title: "Campos Obrigatórios", description: "Cliente, Serviço, Data, Horário e Tipo de Agendamento são obrigatórios.", variant: "destructive" });
        return;
    }

    const client = clients.find(c => c.id === formData.clientId);
    const appointmentData = { 
      ...formData, 
      clientName: client ? client.name : 'Cliente Desconhecido',
      date: format(parseISO(formData.date), 'yyyy-MM-dd') 
    };
    let appointmentIdToPrint;

    if (currentAppointment) {
      const updatedAppointments = appointments.map(appt => appt.id === currentAppointment.id ? { ...appt, ...appointmentData } : appt);
      setAppointments(updatedAppointments);
      saveAppointmentsToLocalStorage(updatedAppointments);
      toast({ title: "Agendamento Atualizado!", description: "O agendamento foi atualizado com sucesso." });
      appointmentIdToPrint = currentAppointment.id;
    } else {
      const newAppointment = { id: `APT${Date.now()}`, ...appointmentData };
      appointmentIdToPrint = newAppointment.id;
      const updatedAppointments = [...appointments, newAppointment];
      setAppointments(updatedAppointments);
      saveAppointmentsToLocalStorage(updatedAppointments);
      toast({ title: "Agendamento Criado!", description: "Novo agendamento criado com sucesso." });
    }
    
    setIsFormOpen(false);
    setCurrentAppointment(null);
    setFormData({...initialFormData, date: format(selectedDate, 'yyyy-MM-dd'), appointmentType: appointmentTypes.length > 0 ? appointmentTypes[0].id : ''});
    
    if(appointmentIdToPrint && window.confirm("Deseja imprimir o cartão deste agendamento?")){
        handlePrintAppointmentCard(appointmentIdToPrint);
    }
  };

  const handleEdit = (appointment) => {
    setCurrentAppointment(appointment);
    const appointmentDate = parseISO(appointment.date);

    setFormData({ 
      clientId: appointment.clientId || '', 
      service: appointment.service || '', 
      date: isValid(appointmentDate) ? format(appointmentDate, 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'), 
      time: appointment.time || '', 
      status: appointment.status || 'Agendado',
      paymentMethod: appointment.paymentMethod || '',
      serviceValue: appointment.serviceValue || '',
      appointmentType: appointment.appointmentType || (appointmentTypes.length > 0 ? appointmentTypes[0].id : '')
    });
    
    if (isValid(appointmentDate)) {
        setSelectedDate(startOfDay(appointmentDate));
    } else {
        setSelectedDate(startOfDay(new Date()));
        toast({title: "Data Inválida", description: "A data do agendamento original era inválida, usando data atual.", variant: "destructive"});
    }
    setIsFormOpen(true);
  };

  const handleDelete = (appointmentId) => {
    const appointmentToDelete = appointments.find(a => a.id === appointmentId);
    if (window.confirm(`Tem certeza que deseja excluir o agendamento de ${appointmentToDelete?.clientName}?`)) {
      const updatedAppointments = appointments.filter(appt => appt.id !== appointmentId);
      setAppointments(updatedAppointments);
      saveAppointmentsToLocalStorage(updatedAppointments);
      toast({ title: "Agendamento Excluído!", description: "O agendamento foi excluído.", variant: "destructive" });
    }
  };

  const handleOpenForm = () => {
    setCurrentAppointment(null);
    setFormData({...initialFormData, date: format(selectedDate, 'yyyy-MM-dd'), appointmentType: appointmentTypes.length > 0 ? appointmentTypes[0].id : ''});
    setIsFormOpen(true);
  };

  const sendWhatsAppMessage = (appointment, type = 'reminder') => {
    const client = clients.find(c => c.id === appointment.clientId);
    if (!client || !client.phone) {
      toast({ title: "Erro", description: "Cliente ou telefone não encontrado para este agendamento.", variant: "destructive" });
      return;
    }
    const studioName = localStorage.getItem('studioName') || "GS Mega Hair Studio";
    const appointmentDate = parseISO(appointment.date);
    const formattedDate = isValid(appointmentDate) ? format(appointmentDate, 'dd/MM/yyyy', { locale: ptBR }) : 'data inválida';
    
    let message;
    if (type === 'reminder') {
      message = `Olá ${client.name}, lembrando do seu agendamento no ${studioName} para ${appointment.service} no dia ${formattedDate} às ${appointment.time}. Até breve!`;
    } else if (type === 'confirmation') {
      message = `Olá ${client.name}! Gostaria de confirmar seu agendamento no ${studioName} para ${appointment.service} no dia ${formattedDate} às ${appointment.time}. Por favor, responda SIM para confirmar. Obrigado!`;
    }
    
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    toast({ title: "WhatsApp", description: `${type === 'reminder' ? 'Lembrete' : 'Confirmação'} para ${client.name} aberto no WhatsApp.` });
  };
  
  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedAppointments = JSON.parse(e.target.result);
          if (Array.isArray(importedAppointments) && importedAppointments.every(a => a.id && a.clientId && a.date)) {
            const newAppointments = importedAppointments.filter(ia => !appointments.find(ea => ea.id === ia.id));
            const updatedAppointments = [...appointments, ...newAppointments];
            setAppointments(updatedAppointments);
            saveAppointmentsToLocalStorage(updatedAppointments);
            toast({ title: "Importação Concluída!", description: `${newAppointments.length} novos agendamentos importados.` });
          } else {
            toast({ title: "Erro na Importação", description: "Arquivo inválido ou formato incorreto.", variant: "destructive" });
          }
        } catch (error) {
          toast({ title: "Erro na Importação", description: "Não foi possível ler o arquivo.", variant: "destructive" });
        }
      };
      reader.readAsText(file);
    }
    event.target.value = null; 
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Horário", "Cliente", "Serviço", "Tipo", "Valor (R$)", "Pagamento", "Status"];
    const tableRows = [];

    filteredAppointments.forEach(appt => {
      const appointmentType = appointmentTypes.find(at => at.id === appt.appointmentType)?.name || 'Padrão';
      const paymentMethod = paymentMethods.find(pm => pm.value === appt.paymentMethod)?.label || appt.paymentMethod || '-';
      const apptData = [
        appt.time,
        appt.clientName,
        appt.service,
        appointmentType,
        parseFloat(appt.serviceValue || 0).toFixed(2),
        paymentMethod,
        appt.status,
      ];
      tableRows.push(apptData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237] }, 
      styles: { font: "helvetica", fontSize: 8 },
    });
    doc.text(`Agendamentos para ${format(selectedDate, "dd/MM/yyyy", { locale: ptBR })}`, 14, 15);
    doc.save(`agendamentos_${format(selectedDate, "yyyy-MM-dd")}.pdf`);
    toast({ title: "Exportar PDF", description: "Agendamentos exportados para PDF!" });
  };

  const exportToXLSX = () => {
    const worksheetData = filteredAppointments.map(appt => ({
      'Horário': appt.time,
      'Cliente': appt.clientName,
      'Serviço': appt.service,
      'Tipo Agend.': appointmentTypes.find(at => at.id === appt.appointmentType)?.name || 'Padrão',
      'Valor (R$)': parseFloat(appt.serviceValue || 0).toFixed(2),
      'Pagamento': paymentMethods.find(pm => pm.value === appt.paymentMethod)?.label || appt.paymentMethod || '-',
      'Status': appt.status,
      'Data': format(parseISO(appt.date), 'dd/MM/yyyy')
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agendamentos");
    XLSX.writeFile(workbook, `agendamentos_${format(selectedDate, "yyyy-MM-dd")}.xlsx`);
    toast({ title: "Exportar XLSX", description: "Agendamentos exportados para Excel!" });
  };

  const handlePrintAppointmentCard = (appointmentId) => {
    const appointment = appointments.find(a => a.id === appointmentId);
    if(appointment) {
        navigate(`/print/appointment/${appointmentId}`);
    } else {
        toast({ title: "Erro", description: "Agendamento não encontrado para impressão.", variant: "destructive"});
    }
  };

  const handlePrintAgenda = (period) => {
    navigate(`/print/agenda?period=${period}&date=${format(selectedDate, 'yyyy-MM-dd')}`);
  };


  const filteredAppointments = appointments.filter(appt => {
    const searchLower = searchTerm.toLowerCase();
    const client = clients.find(c => c.id === appt.clientId);
    const appointmentDate = parseISO(appt.date);
    return (
      (client?.name.toLowerCase().includes(searchLower) ||
      (appt.service && appt.service.toLowerCase().includes(searchLower))) &&
      isValid(appointmentDate) && format(startOfDay(appointmentDate), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    );
  }).sort((a, b) => (a.time || "00:00").localeCompare(b.time || "00:00"));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Agendamentos</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button onClick={handleOpenForm} className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Agendamento
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Ações <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Importar/Exportar</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => document.getElementById('import-appointments-input')?.click()}>
                <FileUp className="mr-2 h-4 w-4" /> Importar JSON
              </DropdownMenuItem>
              <Input type="file" id="import-appointments-input" className="hidden" accept=".json" onChange={handleImportData} />
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" /> Exportar para PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToXLSX}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar para XLSX
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Imprimir Agenda</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handlePrintAgenda('day')}>
                <CalendarClock className="mr-2 h-4 w-4" /> Agenda do Dia
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintAgenda('week')}>
                <CalendarDaysIcon className="mr-2 h-4 w-4" /> Agenda da Semana
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handlePrintAgenda('month')}>
                <CalendarRange className="mr-2 h-4 w-4" /> Agenda do Mês
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="md:col-span-1 flex justify-center"
        >
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={handleDateChange}
            className="rounded-md border shadow-lg p-4 bg-card glassmorphism w-full max-w-md"
            locale={ptBR}
            disabled={(date) => date < startOfDay(new Date(new Date().setDate(new Date().getDate() - 365*2))) || date > startOfDay(new Date(new Date().setDate(new Date().getDate() + 365*2)))}
          />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="md:col-span-2 space-y-4"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar por cliente ou serviço..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full shadow-sm"
            />
          </div>
          <Card className="shadow-lg overflow-hidden glassmorphism">
            <TableHeader>
              <TableRow>
                <TableHead colSpan={8} className="p-4">
                  <h2 className="text-xl font-semibold">
                    Agendamentos para {format(selectedDate, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </h2>
                </TableHead>
              </TableRow>
            </TableHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-card z-10">
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Serviço</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Valor (R$)</TableHead>
                    <TableHead>Pagamento</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAppointments.length > 0 ? filteredAppointments.map((appt) => (
                    <TableRow key={appt.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="font-medium">{appt.time}</TableCell>
                      <TableCell>{appt.clientName}</TableCell>
                      <TableCell>{appt.service}</TableCell>
                      <TableCell>{appointmentTypes.find(at => at.id === appt.appointmentType)?.name || 'Padrão'}</TableCell>
                      <TableCell>{parseFloat(appt.serviceValue || 0).toFixed(2)}</TableCell>
                      <TableCell>{paymentMethods.find(pm => pm.value === appt.paymentMethod)?.label || appt.paymentMethod || '-'}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                          ${appt.status === 'Agendado' ? 'bg-blue-100 text-blue-700 dark:bg-blue-700 dark:text-blue-100' :
                          appt.status === 'Confirmado' ? 'bg-green-100 text-green-700 dark:bg-green-700 dark:text-green-100' :
                          appt.status === 'Cancelado' ? 'bg-red-100 text-red-700 dark:bg-red-700 dark:text-red-100' :
                          appt.status === 'Concluído' ? 'bg-purple-100 text-purple-700 dark:bg-purple-700 dark:text-purple-100' :
                          'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-100'}`}>
                          {appt.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Abrir menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEdit(appt)}>
                              <Edit className="mr-2 h-4 w-4" /> Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => sendWhatsAppMessage(appt, 'reminder')}>
                              <MessageSquare className="mr-2 h-4 w-4" /> Enviar Lembrete
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => sendWhatsAppMessage(appt, 'confirmation')}>
                              <CheckSquare className="mr-2 h-4 w-4" /> Pedir Confirmação
                            </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handlePrintAppointmentCard(appt.id)}>
                              <Printer className="mr-2 h-4 w-4" /> Imprimir Cartão
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleDelete(appt.id)} className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-900/50">
                              <Trash2 className="mr-2 h-4 w-4" /> Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-24 text-center">
                        Nenhum agendamento para esta data ou filtro.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </motion.div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-lg glassmorphism">
          <DialogHeader>
            <DialogTitle>{currentAppointment ? 'Editar Agendamento' : 'Novo Agendamento'}</DialogTitle>
            <DialogDescription>
              {currentAppointment ? 'Atualize os dados do agendamento.' : 'Preencha os dados para um novo agendamento.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="clientId" className="text-right">Cliente*</Label>
              <div className="col-span-3 flex gap-2">
                <Select name="clientId" value={formData.clientId} onValueChange={(value) => handleSelectChange('clientId', value)}>
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="Selecione um cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.map(client => (
                      <SelectItem key={client.id} value={client.id}>{client.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" variant="outline" size="icon" onClick={() => setIsNewClientModalOpen(true)} title="Adicionar Novo Cliente">
                  <UserPlus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="service" className="text-right">Serviço*</Label>
              <Select name="service" value={formData.service} onValueChange={(value) => handleSelectChange('service', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione um serviço" />
                </SelectTrigger>
                <SelectContent>
                  {servicesList.map(service => (
                    <SelectItem key={service.id} value={service.name}>{service.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="appointmentType" className="text-right">Tipo Agend.*</Label>
              <Select name="appointmentType" value={formData.appointmentType} onValueChange={(value) => handleSelectChange('appointmentType', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentTypes.map(type => (
                    <SelectItem key={type.id} value={type.id}>{type.name} ({type.category === 'retorno' ? 'Retorno' : 'Padrão'})</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serviceValue" className="text-right">Valor (R$)</Label>
              <Input id="serviceValue" name="serviceValue" type="number" step="0.01" value={formData.serviceValue} onChange={handleInputChange} className="col-span-3" placeholder="Ex: 120.50" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">Data*</Label>
              <Input id="date" name="date" type="date" value={formData.date} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">Horário*</Label>
              <Input id="time" name="time" type="time" value={formData.time} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="paymentMethod" className="text-right">Pagamento</Label>
              <Select name="paymentMethod" value={formData.paymentMethod} onValueChange={(value) => handleSelectChange('paymentMethod', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map(pm => (
                    <SelectItem key={pm.value} value={pm.value}>
                      <div className="flex items-center">{pm.icon} {pm.label}</div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="status" className="text-right">Status</Label>
              <Select name="status" value={formData.status} onValueChange={(value) => handleSelectChange('status', value)}>
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  {statusList.map(status => (
                    <SelectItem key={status} value={status}>{status}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button type="submit">{currentAppointment ? 'Salvar Alterações' : 'Criar Agendamento'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isNewClientModalOpen} onOpenChange={setIsNewClientModalOpen}>
        <DialogContent className="sm:max-w-md glassmorphism">
          <DialogHeader>
            <DialogTitle>Adicionar Novo Cliente</DialogTitle>
            <DialogDescription>Cadastre um novo cliente rapidamente.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-client-name" className="text-right">Nome*</Label>
              <Input id="new-client-name" name="name" value={newClientFormData.name} onChange={(e) => handleInputChange(e, setNewClientFormData)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="new-client-phone" className="text-right">Telefone*</Label>
              <Input id="new-client-phone" name="phone" value={newClientFormData.phone} onChange={(e) => handleInputChange(e, setNewClientFormData)} className="col-span-3" placeholder="(XX) XXXXX-XXXX" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsNewClientModalOpen(false)}>Cancelar</Button>
            <Button type="button" onClick={handleAddNewClient}>Salvar Cliente</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </motion.div>
  );
};

export default AppointmentsPage;