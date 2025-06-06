
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { PlusCircle, Edit, Trash2, MoreHorizontal, Search, FileUp, FileDown, MessageSquare, Gift, Bell, FileText, FileSpreadsheet } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO, differenceInMonths, differenceInDays, isValid, startOfDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const initialFormData = { name: '', phone: '', birthday: '', lastVisit: '', returnFrequency: 'mensal' };

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentClient, setCurrentClient] = useState(null);
  const [formData, setFormData] = useState(initialFormData);
  const { toast } = useToast();

  const loadClients = useCallback(() => {
    const storedClients = localStorage.getItem('gsClients');
    if (storedClients) {
      setClients(JSON.parse(storedClients));
    } else {
      setClients([]); 
    }
  }, []);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const saveClientsToLocalStorage = (updatedClients) => {
    localStorage.setItem('gsClients', JSON.stringify(updatedClients));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.phone) {
        toast({ title: "Campos Obrigatórios", description: "Nome e Telefone são obrigatórios.", variant: "destructive" });
        return;
    }
    
    const clientData = {
      ...formData,
      lastVisit: formData.lastVisit || new Date().toISOString().split('T')[0] 
    };

    if (currentClient) {
      const updatedClients = clients.map(client => client.id === currentClient.id ? { ...client, ...clientData } : client);
      setClients(updatedClients);
      saveClientsToLocalStorage(updatedClients);
      toast({ title: "Cliente Atualizado!", description: `${formData.name} foi atualizado com sucesso.` });
    } else {
      const newClient = { 
        id: `CLI${Date.now()}`, 
        ...clientData
      };
      const updatedClients = [...clients, newClient];
      setClients(updatedClients);
      saveClientsToLocalStorage(updatedClients);
      toast({ title: "Cliente Adicionado!", description: `${formData.name} foi cadastrado com sucesso.` });
    }
    setIsFormOpen(false);
    setCurrentClient(null);
    setFormData(initialFormData);
  };

  const handleEdit = (client) => {
    setCurrentClient(client);
    setFormData({ 
      name: client.name || '', 
      phone: client.phone || '', 
      birthday: client.birthday || '', 
      lastVisit: client.lastVisit || '', 
      returnFrequency: client.returnFrequency || 'mensal'
    });
    setIsFormOpen(true);
  };

  const handleDelete = (clientId) => {
    const clientToDelete = clients.find(c => c.id === clientId);
    if (window.confirm(`Tem certeza que deseja excluir ${clientToDelete?.name}? Esta ação não pode ser desfeita.`)) {
      const updatedClients = clients.filter(client => client.id !== clientId);
      setClients(updatedClients);
      saveClientsToLocalStorage(updatedClients);
      toast({ title: "Cliente Excluído!", description: `${clientToDelete?.name} foi excluído.`, variant: "destructive" });
    }
  };
  
  const handleOpenForm = () => {
    setCurrentClient(null);
    setFormData(initialFormData);
    setIsFormOpen(true);
  };

  const parseVCF = (vcfText) => {
    const lines = vcfText.split(/\r\n|\r|\n/);
    const contacts = [];
    let currentContact = null;
    lines.forEach(line => {
      if (line.toUpperCase() === 'BEGIN:VCARD') {
        currentContact = { id: `CLI_VCF_${Date.now()}${Math.random().toString(16).slice(2)}` };
      } else if (line.toUpperCase() === 'END:VCARD') {
        if (currentContact && currentContact.name && currentContact.phone) {
          contacts.push({
            ...currentContact,
            birthday: currentContact.birthday || '',
            lastVisit: new Date().toISOString().split('T')[0],
            returnFrequency: 'mensal',
          });
        }
        currentContact = null;
      } else if (currentContact) {
        const [keyWithParams, ...values] = line.split(':');
        const value = values.join(':').trim();
        const key = keyWithParams.split(';')[0].toUpperCase();

        if (key === 'FN' || key === 'N') {
           if (key === 'N' && !currentContact.name) { 
             const parts = value.split(';');
             currentContact.name = `${parts[1] || ''} ${parts[0] || ''}`.trim();
           } else if (key === 'FN' && !currentContact.name) { 
             currentContact.name = value;
           }
        }
        if (key.startsWith('TEL')) currentContact.phone = value.replace(/\D/g, '');
        if (key === 'BDAY') currentContact.birthday = value; 
      }
    });
    return contacts;
  };


  const handleImportData = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let importedClientsRaw;
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.json')) {
          importedClientsRaw = JSON.parse(e.target.result);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
          const data = fileName.endsWith('.csv') ? e.target.result : new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: fileName.endsWith('.csv') ? 'string' : 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1, raw: false, dateNF: 'yyyy-mm-dd' });

          if (jsonData.length < 2) throw new Error("Planilha vazia ou sem cabeçalho.");
          
          const headers = jsonData[0].map(h => String(h).toLowerCase().trim());
          const nameIndex = headers.indexOf('nome');
          const phoneIndex = headers.indexOf('telefone');
          const returnFrequencyIndex = headers.findIndex(h => ['retorno', 'frequencia retorno', 'frequência retorno'].includes(h));
          const birthdayIndex = headers.indexOf('aniversario');
          const lastVisitIndex = headers.findIndex(h => ['ultima visita', 'última visita'].includes(h));

          if (nameIndex === -1 || phoneIndex === -1 ) {
             throw new Error("Cabeçalhos 'Nome' e 'Telefone' são obrigatórios na planilha.");
          }
          
          importedClientsRaw = jsonData.slice(1).map((row, idx) => {
            const name = row[nameIndex] ? String(row[nameIndex]) : null;
            const phone = row[phoneIndex] ? String(row[phoneIndex]) : null;
            if (!name || !phone) return null;

            let birthday = birthdayIndex !== -1 && row[birthdayIndex] ? String(row[birthdayIndex]) : '';
            if (birthday && !isValid(parseISO(birthday))) birthday = ''; 
            
            let lastVisit = lastVisitIndex !== -1 && row[lastVisitIndex] ? String(row[lastVisitIndex]) : '';
            if (lastVisit && !isValid(parseISO(lastVisit))) lastVisit = '';

            return {
              name,
              phone,
              birthday,
              lastVisit: lastVisit || new Date().toISOString().split('T')[0],
              returnFrequency: returnFrequencyIndex !== -1 && row[returnFrequencyIndex] ? String(row[returnFrequencyIndex]).toLowerCase() : 'mensal',
            };
          }).filter(client => client !== null);

        } else if (fileName.endsWith('.vcf')) {
          importedClientsRaw = parseVCF(e.target.result);
        } else {
          throw new Error("Formato de arquivo não suportado.");
        }

        if (!Array.isArray(importedClientsRaw)) throw new Error("Dados importados não estão no formato de lista esperado.");

        const newClients = importedClientsRaw.map(c => ({
          id: c.id || `CLI${Date.now()}${Math.random().toString(16).slice(2)}`,
          name: c.name,
          phone: c.phone ? String(c.phone).replace(/\D/g, '') : '',
          birthday: c.birthday && isValid(parseISO(c.birthday)) ? format(parseISO(c.birthday), 'yyyy-MM-dd') : (c.birthday && isValid(new Date(c.birthday)) ? format(new Date(c.birthday), 'yyyy-MM-dd') : ''),
          lastVisit: c.lastVisit && isValid(parseISO(c.lastVisit)) ? format(parseISO(c.lastVisit), 'yyyy-MM-dd') : (c.lastVisit && isValid(new Date(c.lastVisit)) ? format(new Date(c.lastVisit), 'yyyy-MM-dd') : new Date().toISOString().split('T')[0]),
          returnFrequency: c.returnFrequency || 'mensal'
        })).filter(c => c.name && c.phone); 

        const uniqueNewClients = newClients.filter(nc => !clients.find(ec => ec.phone === nc.phone && ec.name.toLowerCase() === nc.name.toLowerCase()));
        
        if (uniqueNewClients.length > 0) {
          const updatedClients = [...clients, ...uniqueNewClients];
          setClients(updatedClients);
          saveClientsToLocalStorage(updatedClients);
          toast({ title: "Importação Concluída!", description: `${uniqueNewClients.length} novos clientes importados.` });
        } else {
          toast({ title: "Importação", description: "Nenhum cliente novo para importar ou todos já existem.", variant: "default" });
        }

      } catch (error) {
        console.error("Erro ao importar dados:", error);
        toast({ title: "Erro na Importação", description: `Não foi possível ler o arquivo. Detalhe: ${error.message}`, variant: "destructive" });
      }
    };

    if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
      reader.readAsArrayBuffer(file);
    } else { 
      reader.readAsText(file);
    }
    event.target.value = null; 
  };


  const exportToJSON = () => {
    const dataStr = JSON.stringify(clients, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const exportFileDefaultName = 'gs_clients_export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    toast({ title: "Exportar JSON", description: "Dados dos clientes exportados!" });
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    const tableColumn = ["Nome", "Telefone", "Aniversário", "Último Serviço", "Status Retorno"];
    const tableRows = [];

    filteredClients.forEach(client => {
      const returnStatus = getReturnStatus(client);
      const lastVisitDate = client.lastVisit && isValid(parseISO(client.lastVisit)) ? format(parseISO(client.lastVisit), 'dd/MM/yyyy', { locale: ptBR }) : '-';
      const birthdayDate = client.birthday && isValid(parseISO(client.birthday)) ? format(parseISO(client.birthday), 'dd/MM/yyyy', { locale: ptBR }) : '-';
      const clientData = [
        client.name,
        client.phone,
        birthdayDate,
        lastVisitDate,
        returnStatus.text,
      ];
      tableRows.push(clientData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 20,
      theme: 'grid',
      headStyles: { fillColor: [124, 58, 237] }, 
      styles: { font: "helvetica", fontSize: 8 },
    });
    doc.text("Lista de Clientes", 14, 15);
    doc.save("gs_clients_export.pdf");
    toast({ title: "Exportar PDF", description: "Clientes exportados para PDF!" });
  };

  const exportToXLSX = () => {
    const worksheetData = filteredClients.map(client => {
      const returnStatus = getReturnStatus(client);
      return {
        'Nome': client.name,
        'Telefone': client.phone,
        'Aniversário': client.birthday && isValid(parseISO(client.birthday)) ? format(parseISO(client.birthday), 'dd/MM/yyyy') : '-',
        'Último Serviço': client.lastVisit && isValid(parseISO(client.lastVisit)) ? format(parseISO(client.lastVisit), 'dd/MM/yyyy') : '-',
        'Status Retorno': returnStatus.text,
        'Frequência Retorno': client.returnFrequency
      };
    });
    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    XLSX.writeFile(workbook, "gs_clients_export.xlsx");
    toast({ title: "Exportar XLSX", description: "Clientes exportados para Excel!" });
  };


  const sendWhatsAppMessage = (client, type = 'general') => {
    let message;
    const studioName = localStorage.getItem('studioName') || "GS Mega Hair Studio";
    if (type === 'birthday') {
      message = `Olá ${client.name}! A equipe ${studioName} deseja a você um feliz aniversário! 🎉 Muitas felicidades!`;
    } else if (type === 'returnReminder') {
      message = `Olá ${client.name}, tudo bem? Passando para lembrar do seu retorno ao ${studioName}! Estamos com saudades. 😊`;
    } else {
      message = `Olá ${client.name}, como vai? Mensagem de ${studioName}.`;
    }
    window.open(`https://wa.me/${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
    toast({ title: "WhatsApp", description: `Mensagem para ${client.name} aberta no WhatsApp.` });
  };

  const getReturnStatus = (client) => {
    if (!client.lastVisit || !isValid(parseISO(client.lastVisit)) || client.returnFrequency === 'nao_definido') return { text: '-', color: 'text-muted-foreground' };
    
    const lastVisitDate = startOfDay(parseISO(client.lastVisit));
    const today = startOfDay(new Date());
    const monthsSinceLastVisit = differenceInMonths(today, lastVisitDate);
    
    let expectedReturnMonths;
    switch (client.returnFrequency) {
      case 'mensal': expectedReturnMonths = 1; break;
      case 'bimestral': expectedReturnMonths = 2; break;
      case 'trimestral': expectedReturnMonths = 3; break;
      case 'semestral': expectedReturnMonths = 6; break;
      case 'anual': expectedReturnMonths = 12; break;
      default: return { text: 'N/D', color: 'text-muted-foreground' };
    }

    if (monthsSinceLastVisit >= expectedReturnMonths) {
      return { text: 'Retorno Pendente', color: 'text-red-500 font-semibold animate-pulse' };
    } else if (differenceInDays(today, lastVisitDate) > (expectedReturnMonths * 30 - 15) ) { 
       return { text: 'Próximo do Retorno', color: 'text-yellow-500' };
    }
    return { text: 'Em dia', color: 'text-green-500' };
  };


  const filteredClients = clients.filter(client =>
    (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.phone && client.phone.includes(searchTerm))
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Clientes</h1>
        <div className="flex gap-2 flex-wrap justify-center">
          <Button onClick={handleOpenForm} className="bg-gradient-to-r from-primary to-pink-500 hover:from-primary/90 hover:to-pink-500/90 text-white">
            <PlusCircle className="mr-2 h-5 w-5" /> Novo Cliente
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Ações <MoreHorizontal className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Importar</DropdownMenuLabel>
              <DropdownMenuItem onSelect={() => document.getElementById('import-clients-input')?.click()}>
                <FileUp className="mr-2 h-4 w-4" /> Importar (.json, .xlsx, .csv, .vcf)
              </DropdownMenuItem>
              <Input type="file" id="import-clients-input" className="hidden" accept=".json, .xlsx, .xls, .csv, .vcf" onChange={handleImportData} />
              <DropdownMenuSeparator />
              <DropdownMenuLabel>Exportar</DropdownMenuLabel>
              <DropdownMenuItem onClick={exportToJSON}>
                <FileDown className="mr-2 h-4 w-4" /> Exportar JSON
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToPDF}>
                <FileText className="mr-2 h-4 w-4" /> Exportar para PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={exportToXLSX}>
                <FileSpreadsheet className="mr-2 h-4 w-4" /> Exportar para XLSX
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Buscar clientes por nome ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-full md:w-1/2 lg:w-1/3 shadow-sm"
        />
      </div>
      
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md glassmorphism">
          <DialogHeader>
            <DialogTitle>{currentClient ? 'Editar Cliente' : 'Novo Cliente'}</DialogTitle>
            <DialogDescription>
              {currentClient ? 'Atualize os dados do cliente.' : 'Preencha os dados para cadastrar um novo cliente.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nome*</Label>
              <Input id="name" name="name" value={formData.name} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">Telefone*</Label>
              <Input id="phone" name="phone" value={formData.phone} onChange={handleInputChange} className="col-span-3" placeholder="(XX) XXXXX-XXXX" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="birthday" className="text-right">Aniversário</Label>
              <Input id="birthday" name="birthday" type="date" value={formData.birthday} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="lastVisit" className="text-right">Último Serviço</Label>
              <Input id="lastVisit" name="lastVisit" type="date" value={formData.lastVisit} onChange={handleInputChange} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="returnFrequency" className="text-right">Retorno</Label>
              <select id="returnFrequency" name="returnFrequency" value={formData.returnFrequency} onChange={handleInputChange} className="col-span-3 p-2 border rounded-md bg-transparent dark:bg-slate-800 dark:text-white">
                <option value="mensal">Mensal</option>
                <option value="bimestral">Bimestral</option>
                <option value="trimestral">Trimestral</option>
                <option value="semestral">Semestral</option>
                <option value="anual">Anual</option>
                <option value="nao_definido">Não Definido</option>
              </select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>Cancelar</Button>
              <Button type="submit">{currentClient ? 'Salvar Alterações' : 'Cadastrar Cliente'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Card className="shadow-lg overflow-hidden glassmorphism">
        <div className="max-h-[60vh] overflow-y-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Aniversário</TableHead>
                <TableHead>Último Serviço</TableHead>
                <TableHead>Status Retorno</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.length > 0 ? filteredClients.map((client) => {
                const returnStatus = getReturnStatus(client);
                const lastVisitDate = client.lastVisit && isValid(parseISO(client.lastVisit)) ? parseISO(client.lastVisit) : null;
                const birthdayDate = client.birthday && isValid(parseISO(client.birthday)) ? parseISO(client.birthday) : null;
                return (
                <TableRow key={client.id} className="hover:bg-muted/50 transition-colors">
                  <TableCell className="font-medium">{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{birthdayDate ? format(birthdayDate, 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
                  <TableCell>{lastVisitDate ? format(lastVisitDate, 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
                  <TableCell className={returnStatus.color}>{returnStatus.text}</TableCell>
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
                        <DropdownMenuItem onClick={() => handleEdit(client)}>
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => sendWhatsAppMessage(client)}>
                          <MessageSquare className="mr-2 h-4 w-4" /> Enviar WhatsApp
                        </DropdownMenuItem>
                        {client.birthday && isValid(parseISO(client.birthday)) && (
                           <DropdownMenuItem onClick={() => sendWhatsAppMessage(client, 'birthday')}>
                            <Gift className="mr-2 h-4 w-4" /> Mensagem Aniversário
                          </DropdownMenuItem>
                        )}
                        {returnStatus.text === 'Retorno Pendente' && (
                          <DropdownMenuItem onClick={() => sendWhatsAppMessage(client, 'returnReminder')}>
                            <Bell className="mr-2 h-4 w-4" /> Lembrete de Retorno
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleDelete(client.id)} className="text-red-600 hover:!text-red-600 hover:!bg-red-100 dark:hover:!bg-red-900/50">
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )}) : (
                <TableRow>
                  <TableCell colSpan={6} className="h-24 text-center">
                    Nenhum cliente encontrado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </motion.div>
  );
};

export default ClientsPage;
