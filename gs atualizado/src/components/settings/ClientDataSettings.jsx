import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Edit, Trash2, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ClientDataSettings = ({ clients, setClients, saveClientsToLocalStorage }) => {
  const { toast } = useToast();
  const [editingClient, setEditingClient] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ id: '', name: '', phone: '', birthday: '', lastVisit: '', returnFrequency: 'mensal' });

  const handleEditClient = (client) => {
    setEditingClient(client);
    setFormData({
      id: client.id,
      name: client.name,
      phone: client.phone,
      birthday: client.birthday || '',
      lastVisit: client.lastVisit || '',
      returnFrequency: client.returnFrequency || 'mensal',
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveClient = () => {
    if (!formData.name || !formData.phone) {
      toast({ title: "Campos Obrigatórios", description: "Nome e Telefone são obrigatórios.", variant: "destructive" });
      return;
    }
    const updatedClients = clients.map(c => c.id === editingClient.id ? { ...c, ...formData } : c);
    setClients(updatedClients);
    saveClientsToLocalStorage(updatedClients);
    toast({ title: "Cliente Atualizado!", description: "Dados do cliente atualizados com sucesso." });
    setEditingClient(null);
  };

  const handleDeleteClient = (clientId) => {
     if (window.confirm("Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.")) {
        const updatedClients = clients.filter(c => c.id !== clientId);
        setClients(updatedClients);
        saveClientsToLocalStorage(updatedClients);
        toast({ title: "Cliente Excluído", description: "O cliente foi removido do sistema.", variant: "destructive" });
     }
  };

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  return (
    <Card className="shadow-lg glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Users className="mr-2 h-6 w-6 text-primary" /> Gerenciar Dados dos Clientes
        </CardTitle>
        <CardDescription>Visualize, edite ou remova clientes existentes.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
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

        {editingClient && (
          <div className="p-4 border rounded-lg bg-muted/20 space-y-4">
            <h3 className="text-lg font-semibold">Editando Cliente: {editingClient.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-client-name">Nome</Label>
                <Input id="edit-client-name" name="name" value={formData.name} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="edit-client-phone">Telefone</Label>
                <Input id="edit-client-phone" name="phone" value={formData.phone} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="edit-client-birthday">Aniversário</Label>
                <Input id="edit-client-birthday" name="birthday" type="date" value={formData.birthday} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="edit-client-lastVisit">Última Visita</Label>
                <Input id="edit-client-lastVisit" name="lastVisit" type="date" value={formData.lastVisit} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="edit-client-returnFrequency">Frequência de Retorno</Label>
                <select id="edit-client-returnFrequency" name="returnFrequency" value={formData.returnFrequency} onChange={handleInputChange} className="w-full p-2 border rounded-md bg-transparent dark:bg-slate-800 dark:text-white">
                  <option value="mensal">Mensal</option>
                  <option value="bimestral">Bimestral</option>
                  <option value="trimestral">Trimestral</option>
                  <option value="semestral">Semestral</option>
                  <option value="anual">Anual</option>
                  <option value="nao_definido">Não Definido</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2 justify-end">
              <Button onClick={handleSaveClient}>Salvar Alterações</Button>
              <Button variant="outline" onClick={() => setEditingClient(null)}>Cancelar</Button>
            </div>
          </div>
        )}

        <div className="max-h-96 overflow-y-auto border rounded-lg">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Aniversário</TableHead>
                <TableHead>Última Visita</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredClients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.birthday && isValid(parseISO(client.birthday)) ? format(parseISO(client.birthday), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
                  <TableCell>{client.lastVisit && isValid(parseISO(client.lastVisit)) ? format(parseISO(client.lastVisit), 'dd/MM/yyyy', { locale: ptBR }) : '-'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleEditClient(client)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteClient(client.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredClients.length === 0 && <p className="text-center text-muted-foreground py-4">Nenhum cliente encontrado com os filtros atuais.</p>}
      </CardContent>
    </Card>
  );
};

export default ClientDataSettings;