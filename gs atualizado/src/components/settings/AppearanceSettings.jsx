
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/components/theme-provider';
import { Palette, UploadCloud, RefreshCw } from 'lucide-react';

const AppearanceSettings = ({ studioName, setStudioName, logoPreview, handleLogoUpload, saveStudioName }) => {
  const { theme, setTheme } = useTheme();
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#7c3aed');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('#e879f9');

  const predefinedColorPairs = [
    { name: 'Padrão Roxo/Rosa', primary: '#7c3aed', secondary: '#e879f9' },
    { name: 'Oceano Azul/Ciano', primary: '#3b82f6', secondary: '#22d3ee' },
    { name: 'Floresta Verde/Lima', primary: '#10b981', secondary: '#a3e635' },
    { name: 'Pôr do Sol Laranja/Amarelo', primary: '#f97316', secondary: '#facc15' },
    { name: 'Doce Rosa/Violeta', primary: '#ec4899', secondary: '#a855f7' },
    { name: 'Neutro Cinza/Ardósia', primary: '#6b7280', secondary: '#475569' },
  ];

  useEffect(() => {
    const savedColors = localStorage.getItem('appColors');
    if (savedColors) {
      const { primary, secondary } = JSON.parse(savedColors);
      setCustomPrimaryColor(primary);
      setCustomSecondaryColor(secondary);
    }
  }, []);

  const applyColors = (primary, secondary) => {
    document.documentElement.style.setProperty('--primary', primary);
    document.documentElement.style.setProperty('--secondary', secondary);
    localStorage.setItem('appColors', JSON.stringify({ primary, secondary }));
    setCustomPrimaryColor(primary);
    setCustomSecondaryColor(secondary);
  };

  const handleCustomColorChange = () => {
    applyColors(customPrimaryColor, customSecondaryColor);
  };

  const resetToDefaultColors = () => {
    applyColors('#7c3aed', '#e879f9'); // Default Hostinger Horizons colors
  };


  return (
    <>
      <Card className="shadow-lg glassmorphism">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UploadCloud className="mr-2 h-6 w-6 text-primary" /> Logo do Aplicativo
          </CardTitle>
          <CardDescription>Faça o upload da logo que será exibida na capa e em outras áreas do aplicativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center space-y-4">
            {logoPreview ? (
              <img src={logoPreview} alt="Prévia da Logo" className="mx-auto h-32 w-auto object-contain rounded-md border p-2 bg-muted/30" />
            ) : (
              <div className="h-32 w-full border-2 border-dashed border-muted-foreground/50 rounded-md flex flex-col items-center justify-center bg-muted/30">
                <UploadCloud className="h-12 w-12 text-muted-foreground/70" />
                <p className="text-sm text-muted-foreground">Prévia da logo aparecerá aqui</p>
              </div>
            )}
            <Label htmlFor="logo-upload" className="cursor-pointer">
              <Button asChild variant="outline">
                <span><UploadCloud className="mr-2 h-4 w-4" /> Escolher Arquivo</span>
              </Button>
              <Input id="logo-upload" type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg glassmorphism mt-6">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-6 w-6 text-secondary" /> Aparência e Tema
          </CardTitle>
          <CardDescription>Personalize as cores e o tema do seu aplicativo.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="studioName">Nome do Estúdio</Label>
            <div className="flex gap-2 mt-1">
              <Input 
                id="studioName" 
                value={studioName} 
                onChange={(e) => setStudioName(e.target.value)} 
                placeholder="Nome do seu estúdio" 
              />
              <Button onClick={saveStudioName}>Salvar Nome</Button>
            </div>
          </div>

          <div>
            <Label>Tema do Aplicativo</Label>
            <div className="flex gap-2 mt-1">
              <Button 
                variant={theme === 'light' ? 'default' : 'outline'} 
                onClick={() => setTheme('light')}
              >
                Claro
              </Button>
              <Button 
                variant={theme === 'dark' ? 'default' : 'outline'} 
                onClick={() => setTheme('dark')}
              >
                Escuro
              </Button>
              <Button 
                variant={theme === 'system' ? 'default' : 'outline'} 
                onClick={() => setTheme('system')}
              >
                Sistema
              </Button>
            </div>
          </div>
          
          <div>
            <Label>Cores Personalizadas</Label>
            <div className="flex flex-col sm:flex-row gap-4 mt-1 items-center">
              <div className="flex-1">
                <Label htmlFor="customPrimaryColor" className="text-xs">Cor Primária</Label>
                <Input 
                  id="customPrimaryColor" 
                  type="color" 
                  value={customPrimaryColor} 
                  onChange={(e) => setCustomPrimaryColor(e.target.value)} 
                  className="w-full h-10 p-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="customSecondaryColor" className="text-xs">Cor Secundária</Label>
                <Input 
                  id="customSecondaryColor" 
                  type="color" 
                  value={customSecondaryColor} 
                  onChange={(e) => setCustomSecondaryColor(e.target.value)} 
                  className="w-full h-10 p-1"
                />
              </div>
              <Button onClick={handleCustomColorChange} className="w-full sm:w-auto">Aplicar Cores</Button>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <Label>Paletas de Cores Predefinidas</Label>
              <Button variant="ghost" size="sm" onClick={resetToDefaultColors} title="Restaurar cores padrão">
                <RefreshCw className="h-4 w-4 mr-1" /> Restaurar Padrão
              </Button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {predefinedColorPairs.map((colorPair) => (
                <Button
                  key={colorPair.name}
                  variant="outline"
                  className="h-20 flex flex-col gap-2 items-center justify-center"
                  onClick={() => applyColors(colorPair.primary, colorPair.secondary)}
                >
                  <div className="flex gap-2">
                    <div 
                      className="w-6 h-6 rounded-full border border-border" 
                      style={{ backgroundColor: colorPair.primary }}
                    />
                    <div 
                      className="w-6 h-6 rounded-full border border-border" 
                      style={{ backgroundColor: colorPair.secondary }}
                    />
                  </div>
                  <span className="text-xs text-center">{colorPair.name}</span>
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default AppearanceSettings;
