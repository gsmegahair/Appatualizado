
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Palette, ListChecks, Users, CalendarCheck, ShoppingBag, FileUp, FileDown } from 'lucide-react';
import AppearanceSettings from '@/components/settings/AppearanceSettings';
import DataManagementSettings from '@/components/settings/DataManagementSettings';
import ClientDataSettings from '@/components/settings/ClientDataSettings';
import AppointmentTypesSettings from '@/components/settings/AppointmentTypesSettings';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import * as XLSX from 'xlsx';

const SettingsPage = () => {
  const { toast } = useToast();
  const [logoPreview, setLogoPreview] = useState(null);
  const [studioName, setStudioName] = useState("GS Mega Hair Studio Agendamento");

  const [services, setServices] = useState([]);
  const [newServiceName, setNewServiceName] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [editingService, setEditingService] = useState(null);

  const [products, setProducts] = useState([]);
  const [newProductName, setNewProductName] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [editingProduct, setEditingProduct] = useState(null);


  const [clients, setClients] = useState([]);
  const [appointmentTypes, setAppointmentTypes] = useState([]);
  const [newAppointmentTypeName, setNewAppointmentTypeName] = useState('');
  const [editingAppointmentType, setEditingAppointmentType] = useState(null);


  useEffect(() => {
    const savedLogo = localStorage.getItem('studioLogo');
    if (savedLogo) setLogoPreview(savedLogo);
    
    const savedName = localStorage.getItem('studioName');
    if (savedName) setStudioName(savedName);
    else localStorage.setItem('studioName', studioName);

    const savedColors = localStorage.getItem('appColors');
    if (savedColors) {
      const { primary, secondary } = JSON.parse(savedColors);
      document.documentElement.style.setProperty('--primary', primary);
      document.documentElement.style.setProperty('--secondary', secondary);
    }

    const storedServices = JSON.parse(localStorage.getItem('gsServices') || '[]');
    setServices(storedServices);
    
    const storedProducts = JSON.parse(localStorage.getItem('gsProducts') || '[]');
    setProducts(storedProducts);

    const storedClients = JSON.parse(localStorage.getItem('gsClients') || '[]');
    setClients(storedClients);

    const storedAppointmentTypes = JSON.parse(localStorage.getItem('gsAppointmentTypes') || 
      '[{ "id": "APPTYPE_DEFAULT", "name": "Padrão" }]'
    );
    setAppointmentTypes(storedAppointmentTypes);
    if (!localStorage.getItem('gsAppointmentTypes')) {
      localStorage.setItem('gsAppointmentTypes', JSON.stringify(storedAppointmentTypes));
    }

  }, []);

  const saveToLocalStorage = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
        localStorage.setItem('studioLogo', reader.result);
        toast({ title: "Logo Atualizada!", description: "Sua nova logo foi carregada." });
        window.dispatchEvent(new Event('storage')); 
      };
      reader.readAsDataURL(file);
    }
  };

  const saveStudioName = () => {
    localStorage.setItem('studioName', studioName);
    toast({ title: "Nome do Estúdio Atualizado!", description: "O nome do seu estúdio foi salvo." });
    document.title = studioName;
    window.dispatchEvent(new Event('storage'));
  };

  const crudOperations = (entity, setEntity, newName, setNewName, newPrice, setNewPrice, editing, setEditing, entityNameSingular, showPrice = true) => {
    const handleAddItem = () => {
      if (!newName.trim()) {
        toast({ title: "Nome Inválido", description: `O nome do ${entityNameSingular.toLowerCase()} não pode ser vazio.`, variant: "destructive" });
        return;
      }
      if (showPrice && newPrice && isNaN(parseFloat(newPrice))) {
        toast({ title: "Preço Inválido", description: "Por favor, insira um valor numérico para o preço.", variant: "destructive" });
        return;
      }
      if (entity.find(item => item.name.toLowerCase() === newName.toLowerCase())) {
        toast({ title: `${entityNameSingular} Duplicado`, description: `Este ${entityNameSingular.toLowerCase()} já existe.`, variant: "destructive" });
        return;
      }
      const newItem = { id: `${entityNameSingular.toUpperCase()}${Date.now()}`, name: newName, price: showPrice ? (newPrice || '0') : undefined };
      const updatedEntity = [...entity, newItem];
      setEntity(updatedEntity);
      saveToLocalStorage(`gs${entityNameSingular === 'Serviço' ? 'Services' : 'Products'}`, updatedEntity);
      setNewName('');
      if (showPrice) setNewPrice('');
      toast({ title: `${entityNameSingular} Adicionado!`, description: `"${newName}" foi adicionado.` });
    };

    const handleUpdateItem = () => {
      if (!editing || !editing.name.trim()) {
        toast({ title: "Nome Inválido", description: `O nome do ${entityNameSingular.toLowerCase()} não pode ser vazio.`, variant: "destructive" });
        return;
      }
      if (showPrice && editing.price && isNaN(parseFloat(editing.price))) {
        toast({ title: "Preço Inválido", description: "Por favor, insira um valor numérico para o preço.", variant: "destructive" });
        return;
      }
      if (entity.find(item => item.name.toLowerCase() === editing.name.toLowerCase() && item.id !== editing.id)) {
        toast({ title: `${entityNameSingular} Duplicado`, description: `Este nome de ${entityNameSingular.toLowerCase()} já está em uso.`, variant: "destructive" });
        return;
      }
      const updatedEntity = entity.map(item => item.id === editing.id ? editing : item);
      setEntity(updatedEntity);
      saveToLocalStorage(`gs${entityNameSingular === 'Serviço' ? 'Services' : 'Products'}`, updatedEntity);
      setEditing(null);
      toast({ title: `${entityNameSingular} Atualizado!`, description: `O ${entityNameSingular.toLowerCase()} foi atualizado.` });
    };

    const handleDeleteItem = (itemId) => {
      if (window.confirm(`Tem certeza que deseja excluir este ${entityNameSingular.toLowerCase()}?`)) {
        const updatedEntity = entity.filter(item => item.id !== itemId);
        setEntity(updatedEntity);
        saveToLocalStorage(`gs${entityNameSingular === 'Serviço' ? 'Services' : 'Products'}`, updatedEntity);
        toast({ title: `${entityNameSingular} Excluído!`, description: `O ${entityNameSingular.toLowerCase()} foi removido.`, variant: "destructive" });
      }
    };
    return { handleAddItem, handleUpdateItem, handleDeleteItem };
  };

  const serviceOps = crudOperations(services, setServices, newServiceName, setNewServiceName, newServicePrice, setNewServicePrice, editingService, setEditingService, "Serviço");
  const productOps = crudOperations(products, setProducts, newProductName, setNewProductName, newProductPrice, setNewProductPrice, editingProduct, setEditingProduct, "Produto");


  const handleExportData = (entityType) => {
    let dataToExport;
    let fileName;
    switch(entityType) {
      case 'services':
        dataToExport = services;
        fileName = 'gs_services_export.json';
        break;
      case 'products':
        dataToExport = products;
        fileName = 'gs_products_export.json';
        break;
      case 'clients':
        dataToExport = clients;
        fileName = 'gs_clients_export.json';
        break;
      case 'appointmentTypes':
        dataToExport = appointmentTypes;
        fileName = 'gs_appointment_types_export.json';
        break;
      default:
        toast({ title: "Erro na Exportação", description: "Tipo de entidade desconhecido.", variant: "destructive" });
        return;
    }
    const dataStr = JSON.stringify(dataToExport, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', fileName);
    linkElement.click();
    toast({ title: "Exportação Concluída!", description: `Dados de ${entityType} exportados.` });
  };

  const handleImportData = (event, entityType) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        let importedData;
        const fileName = file.name.toLowerCase();

        if (fileName.endsWith('.json')) {
          importedData = JSON.parse(e.target.result);
        } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.csv')) {
          const workbook = XLSX.read(e.target.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          importedData = XLSX.utils.sheet_to_json(worksheet);
        } else if (fileName.endsWith('.vcf') && entityType === 'clients') {
          
          const vcfText = e.target.result;
          const lines = vcfText.split(/\r\n|\r|\n/);
          const contacts = [];
          let currentContact = null;
          lines.forEach(line => {
            if (line.toUpperCase() === 'BEGIN:VCARD') {
              currentContact = { id: `CLI_VCF_${Date.now()}${Math.random()}` };
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
              const [key, ...values] = line.split(':');
              const value = values.join(':');
              if (key.startsWith('FN') || key.startsWith('N;')) currentContact.name = value;
              if (key.startsWith('TEL')) currentContact.phone = value.replace(/\D/g, '');
              if (key.startsWith('BDAY')) currentContact.birthday = value;
            }
          });
          importedData = contacts;

        } else {
          toast({ title: "Formato Inválido", description: "Formato de arquivo não suportado para importação.", variant: "destructive" });
          return;
        }

        if (!Array.isArray(importedData)) {
          throw new Error("Os dados importados não são uma lista válida.");
        }

        let currentData, setDataFunction, storageKey, requiredFields, entityLabel;

        switch(entityType) {
          case 'services':
            currentData = services;
            setDataFunction = setServices;
            storageKey = 'gsServices';
            requiredFields = ['name'];
            entityLabel = 'Serviços';
            break;
          case 'products':
            currentData = products;
            setDataFunction = setProducts;
            storageKey = 'gsProducts';
            requiredFields = ['name'];
            entityLabel = 'Produtos';
            break;
          case 'clients':
            currentData = clients;
            setDataFunction = setClients;
            storageKey = 'gsClients';
            requiredFields = ['name', 'phone'];
            entityLabel = 'Clientes';
            break;
          case 'appointmentTypes':
            currentData = appointmentTypes;
            setDataFunction = setAppointmentTypes;
            storageKey = 'gsAppointmentTypes';
            requiredFields = ['name'];
            entityLabel = 'Tipos de Agendamento';
            break;
          default:
            toast({ title: "Erro na Importação", description: "Tipo de entidade desconhecido para importação.", variant: "destructive" });
            return;
        }
        
        const validatedData = importedData.map((item, index) => {
          const missingFields = requiredFields.filter(field => !item[field]);
          if (missingFields.length > 0) {
            console.warn(`Item ${index + 1} ignorado: campos obrigatórios ausentes (${missingFields.join(', ')})`);
            return null;
          }
          return {
            id: item.id || `${entityType.toUpperCase()}_${Date.now()}${index}`,
            ...item,
            price: (entityType === 'services' || entityType === 'products') ? (item.price || '0') : undefined,
            ...(entityType === 'clients' && {
              lastVisit: item.lastVisit || new Date().toISOString().split('T')[0],
              returnFrequency: item.returnFrequency || 'mensal',
              birthday: item.birthday || '',
            }),
          };
        }).filter(item => item !== null);


        const newItems = validatedData.filter(vd => !currentData.find(cd => cd.id === vd.id || (cd.name === vd.name && (entityType !== 'clients' || cd.phone === vd.phone))));
        const updatedData = [...currentData, ...newItems];
        
        setDataFunction(updatedData);
        saveToLocalStorage(storageKey, updatedData);
        toast({ title: "Importação Concluída!", description: `${newItems.length} novos ${entityLabel.toLowerCase()} importados.` });

      } catch (error) {
        console.error("Erro ao importar dados:", error);
        toast({ title: "Erro na Importação", description: `Não foi possível processar o arquivo. Detalhe: ${error.message}`, variant: "destructive" });
      }
    };
    reader.readAsText(file, 'UTF-8'); 
    if (file.name.toLowerCase().endsWith('.xlsx') || file.name.toLowerCase().endsWith('.xls')) {
      reader.readAsBinaryString(file); 
    }
    event.target.value = null; 
  };


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8 max-w-5xl mx-auto"
    >
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight flex items-center">
          <SettingsIcon className="mr-3 h-8 w-8 text-primary"/>
          Configurações Avançadas
        </h1>
      </div>

      <Tabs defaultValue="appearance" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
          <TabsTrigger value="appearance"><Palette className="mr-2 h-4 w-4 inline-block"/>Aparência</TabsTrigger>
          <TabsTrigger value="services"><ListChecks className="mr-2 h-4 w-4 inline-block"/>Serviços</TabsTrigger>
          <TabsTrigger value="products"><ShoppingBag className="mr-2 h-4 w-4 inline-block"/>Produtos</TabsTrigger>
          <TabsTrigger value="clients"><Users className="mr-2 h-4 w-4 inline-block"/>Clientes</TabsTrigger>
          <TabsTrigger value="appointmentTypes"><CalendarCheck className="mr-2 h-4 w-4 inline-block"/>Tipos Agend.</TabsTrigger>
        </TabsList>

        <TabsContent value="appearance" className="mt-6">
          <AppearanceSettings
            studioName={studioName}
            setStudioName={setStudioName}
            logoPreview={logoPreview}
            handleLogoUpload={handleLogoUpload}
            saveStudioName={saveStudioName}
          />
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <DataManagementSettings
            services={services}
            setServices={setServices}
            newServiceName={newServiceName}
            setNewServiceName={setNewServiceName}
            newServicePrice={newServicePrice}
            setNewServicePrice={setNewServicePrice}
            editingService={editingService}
            setEditingService={setEditingService}
            handleAddService={serviceOps.handleAddItem}
            handleUpdateService={serviceOps.handleUpdateItem}
            handleDeleteService={serviceOps.handleDeleteItem}
            handleExportData={() => handleExportData('services')}
            handleImportData={handleImportData}
            entityName="service"
            entityLabel="Serviços"
          />
        </TabsContent>

        <TabsContent value="products" className="mt-6">
          <DataManagementSettings
            services={products}
            setServices={setProducts}
            newServiceName={newProductName}
            setNewServiceName={setNewProductName}
            newServicePrice={newProductPrice}
            setNewServicePrice={setNewProductPrice}
            editingService={editingProduct}
            setEditingService={setEditingProduct}
            handleAddService={productOps.handleAddItem}
            handleUpdateService={productOps.handleUpdateItem}
            handleDeleteService={productOps.handleDeleteItem}
            handleExportData={() => handleExportData('products')}
            handleImportData={handleImportData}
            entityName="product"
            entityLabel="Produtos"
          />
        </TabsContent>

        <TabsContent value="clients" className="mt-6">
          <ClientDataSettings 
            clients={clients}
            setClients={setClients}
            saveClientsToLocalStorage={(updatedClients) => saveToLocalStorage('gsClients', updatedClients)}
          />
           <div className="mt-4 flex flex-col sm:flex-row gap-4 pt-4 border-t">
             <div>
              <Label htmlFor="import-clients-settings-input" className="cursor-pointer">
                <Button asChild variant="outline">
                  <span><FileUp className="mr-2 h-4 w-4" /> Importar Clientes (.json, .xlsx, .csv, .vcf)</span>
                </Button>
                <Input 
                  id="import-clients-settings-input" 
                  type="file" 
                  className="hidden" 
                  accept=".json, .xlsx, .xls, .csv, .vcf" 
                  onChange={(e) => handleImportData(e, 'clients')}
                />
              </Label>
            </div>
            <div>
              <Button variant="outline" onClick={() => handleExportData('clients')}>
                <FileDown className="mr-2 h-4 w-4" /> Exportar Clientes (.json)
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="appointmentTypes" className="mt-6">
          <AppointmentTypesSettings
            appointmentTypes={appointmentTypes}
            setAppointmentTypes={setAppointmentTypes}
            saveAppointmentTypesToLocalStorage={(updatedTypes) => saveToLocalStorage('gsAppointmentTypes', updatedTypes)}
          />
        </TabsContent>

      </Tabs>
    </motion.div>
  );
};

export default SettingsPage;
