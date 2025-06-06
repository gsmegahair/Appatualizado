
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarCheck, PlusCircle, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

const appointmentCategories = [
  { value: 'padrao', label: 'Padrão' },
  { value: 'retorno', label: 'Retorno' },
];

const AppointmentTypesSettings = ({ appointmentTypes, setAppointmentTypes, saveAppointmentTypesToLocalStorage }) => {
  const { toast } = useToast();
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeCategory, setNewTypeCategory] = useState('padrao');
  const [editingType, setEditingType] = useState(null); // Will store { id, name, category }

  const handleAddType = () => {
    if (!newTypeName.trim()) {
      toast({ title: "Nome Inválido", description: "O nome do tipo de agendamento não pode ser vazio.", variant: "destructive" });
      return;
    }
    if (appointmentTypes.find(type => type.name.toLowerCase() === newTypeName.toLowerCase())) {
      toast({ title: "Tipo Duplicado", description: "Este tipo de agendamento já existe.", variant: "destructive" });
      return;
    }
    const newType = { id: `APPTYPE${Date.now()}`, name: newTypeName, category: newTypeCategory };
    const updatedTypes = [...appointmentTypes, newType];
    setAppointmentTypes(updatedTypes);
    saveAppointmentTypesToLocalStorage(updatedTypes);
    setNewTypeName('');
    setNewTypeCategory('padrao');
    toast({ title: "Tipo Adicionado!", description: `"${newTypeName}" (${newTypeCategory}) foi adicionado.` });
  };

  const handleUpdateType = () => {
    if (!editingType || !editingType.name.trim()) {
      toast({ title: "Nome Inválido", description: "O nome do tipo de agendamento não pode ser vazio.", variant: "destructive" });
      return;
    }
    if (appointmentTypes.find(type => type.name.toLowerCase() === editingType.name.toLowerCase() && type.id !== editingType.id)) {
      toast({ title: "Tipo Duplicado", description: "Este nome de tipo de agendamento já está em uso.", variant: "destructive" });
      return;
    }
    const updatedTypes = appointmentTypes.map(type => type.id === editingType.id ? editingType : type);
    setAppointmentTypes(updatedTypes);
    saveAppointmentTypesToLocalStorage(updatedTypes);
    setEditingType(null);
    toast({ title: "Tipo Atualizado!", description: "O tipo de agendamento foi atualizado." });
  };

  const handleDeleteType = (typeId) => {
    if (window.confirm("Tem certeza que deseja excluir este tipo de agendamento?")) {
      const updatedTypes = appointmentTypes.filter(type => type.id !== typeId);
      setAppointmentTypes(updatedTypes);
      saveAppointmentTypesToLocalStorage(updatedTypes);
      toast({ title: "Tipo Excluído!", description: "O tipo de agendamento foi removido.", variant: "destructive" });
    }
  };

  const startEditing = (type) => {
    setEditingType({ ...type }); // Ensure category is part of the editing state
    setNewTypeName(type.name); // Pre-fill for consistency, though editingType.name is used
    setNewTypeCategory(type.category || 'padrao'); // Pre-fill category
  };


  return (
    <Card className="shadow-lg glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center">
          <CalendarCheck className="mr-2 h-6 w-6 text-primary" /> Gerenciar Tipos de Agendamento
        </CardTitle>
        <CardDescription>Adicione, edite ou remova tipos de agendamento e classifique-os como Padrão ou Retorno.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-semibold mb-3">{editingType ? "Editando Tipo" : "Adicionar Novo Tipo"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-2">
              <Label htmlFor="appointment-type-name">Nome do Tipo</Label>
              <Input
                id="appointment-type-name"
                value={editingType ? editingType.name : newTypeName}
                onChange={(e) => editingType ? setEditingType({ ...editingType, name: e.target.value }) : setNewTypeName(e.target.value)}
                placeholder="Ex: Manutenção Completa"
              />
            </div>
            <div className="md:col-span-1">
              <Label htmlFor="appointment-type-category">Categoria</Label>
              <Select
                value={editingType ? editingType.category : newTypeCategory}
                onValueChange={(value) => editingType ? setEditingType({ ...editingType, category: value }) : setNewTypeCategory(value)}
              >
                <SelectTrigger id="appointment-type-category">
                  <SelectValue placeholder="Selecione Categoria" />
                </SelectTrigger>
                <SelectContent>
                  {appointmentCategories.map(cat => (
                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1 flex gap-2">
              {editingType ? (
                <>
                  <Button onClick={handleUpdateType} className="w-full">Salvar</Button>
                  <Button onClick={() => setEditingType(null)} variant="outline" className="w-full">Cancelar</Button>
                </>
              ) : (
                <Button onClick={handleAddType} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              )}
            </div>
          </div>
        </div>

        {appointmentTypes.length > 0 && (
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Nome do Tipo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointmentTypes.map((type) => (
                  <TableRow key={type.id}>
                    <TableCell>{type.name}</TableCell>
                    <TableCell>{appointmentCategories.find(cat => cat.value === type.category)?.label || 'Padrão'}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => startEditing(type)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteType(type.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AppointmentTypesSettings;
