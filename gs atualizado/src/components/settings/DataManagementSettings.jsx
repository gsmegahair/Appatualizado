import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileUp, FileDown, PlusCircle, Edit, Trash2, ListChecks, Users, ShoppingBag } from 'lucide-react';

const DataManagementSettings = ({
  services,
  setServices,
  newServiceName,
  setNewServiceName,
  newServicePrice,
  setNewServicePrice,
  editingService,
  setEditingService,
  handleAddService,
  handleUpdateService,
  handleDeleteService,
  handleExportData,
  handleImportData,
  entityName,
  entityLabel,
  importFileAcceptType,
  showPrice = true,
}) => {
  return (
    <Card className="shadow-lg glassmorphism">
      <CardHeader>
        <CardTitle className="flex items-center">
          {entityLabel === "Serviços" && <ListChecks className="mr-2 h-6 w-6 text-primary" />}
          {entityLabel === "Clientes" && <Users className="mr-2 h-6 w-6 text-primary" />}
          {entityLabel === "Produtos" && <ShoppingBag className="mr-2 h-6 w-6 text-primary" />}
          Gerenciar {entityLabel}
        </CardTitle>
        <CardDescription>Adicione, edite ou remova {entityLabel.toLowerCase()}. Você também pode importar e exportar dados.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Formulário para adicionar/editar */}
        <div className="p-4 border rounded-lg bg-muted/20">
          <h3 className="text-lg font-semibold mb-3">{editingService ? `Editando ${entityLabel.slice(0, -1)}` : `Adicionar Novo ${entityLabel.slice(0, -1)}`}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="md:col-span-1">
              <Label htmlFor={`new-${entityName}-name`}>Nome do {entityLabel.slice(0, -1)}</Label>
              <Input
                id={`new-${entityName}-name`}
                value={editingService ? editingService.name : newServiceName}
                onChange={(e) => editingService ? setEditingService({...editingService, name: e.target.value}) : setNewServiceName(e.target.value)}
                placeholder={`Nome do ${entityLabel.slice(0, -1).toLowerCase()}`}
              />
            </div>
            {showPrice && (
              <div className="md:col-span-1">
                <Label htmlFor={`new-${entityName}-price`}>Preço (R$)</Label>
                <Input
                  id={`new-${entityName}-price`}
                  type="number"
                  step="0.01"
                  value={editingService ? editingService.price : newServicePrice}
                  onChange={(e) => editingService ? setEditingService({...editingService, price: e.target.value}) : setNewServicePrice(e.target.value)}
                  placeholder="Ex: 50.00"
                />
              </div>
            )}
            <div className="md:col-span-1 flex gap-2">
              {editingService ? (
                <>
                  <Button onClick={handleUpdateService} className="w-full">Salvar Alterações</Button>
                  <Button onClick={() => setEditingService(null)} variant="outline" className="w-full">Cancelar</Button>
                </>
              ) : (
                <Button onClick={handleAddService} className="w-full">
                  <PlusCircle className="mr-2 h-4 w-4" /> Adicionar
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabela de itens */}
        {services.length > 0 && (
          <div className="max-h-96 overflow-y-auto border rounded-lg">
            <Table>
              <TableHeader className="sticky top-0 bg-card z-10">
                <TableRow>
                  <TableHead>Nome</TableHead>
                  {showPrice && <TableHead>Preço (R$)</TableHead>}
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {services.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>{service.name}</TableCell>
                    {showPrice && <TableCell>{parseFloat(service.price || 0).toFixed(2)}</TableCell>}
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => setEditingService(service)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteService(service.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Importar/Exportar */}
        {handleImportData && handleExportData && (
          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t">
            <div>
              <Label htmlFor={`import-${entityName}-input`} className="cursor-pointer">
                <Button asChild variant="outline">
                  <span><FileUp className="mr-2 h-4 w-4" /> Importar {entityLabel} (.json, .xlsx, .csv, .vcf)</span>
                </Button>
                <Input 
                  id={`import-${entityName}-input`} 
                  type="file" 
                  className="hidden" 
                  accept={importFileAcceptType || ".json, .xlsx, .xls, .csv, .vcf"} 
                  onChange={(e) => handleImportData(e, entityName)}
                />
              </Label>
            </div>
            <div>
              <Button variant="outline" onClick={() => handleExportData(entityName)}>
                <FileDown className="mr-2 h-4 w-4" /> Exportar {entityLabel} (.json)
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DataManagementSettings;