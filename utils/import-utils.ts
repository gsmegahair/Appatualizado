import type { Client, ImportedData, Product } from "../types"

// Métodos de mega hair disponíveis
export const megaHairMethods = [
  "Fita Adesiva",
  "Queratina",
  "Microlink",
  "Costurado",
  "Clip-in",
  "Nano Ring",
  "Fusion",
  "Weaving",
  "Tape-in",
  "I-Tip",
  "U-Tip",
  "Halo",
  "Ponto Americano",
  "Nano Pele",
  "Nó Italiano (Amarradinho)",
  "Link Tape",
  "Nano Cápsula de Queratina",
  "Micro Cápsula de Queratina",
  "Outro",
]

// Categorias de serviços
export const serviceCategories = [
  "Mega Hair",
  "Corte",
  "Coloração",
  "Tratamento",
  "Sobrancelha",
  "Escova",
  "Penteado",
  "Manicure",
  "Pedicure",
  "Maquiagem",
  "Depilação",
  "Outro",
]

// Serviços padrão
export const defaultServices = [
  {
    id: "1",
    name: "Mega Hair Ponto Americano",
    duration: 240,
    price: 1200,
    description: "Aplicação de mega hair com técnica de ponto americano",
    category: "Mega Hair",
  },
  {
    id: "2",
    name: "Mega Hair Nano Pele",
    duration: 180,
    price: 1500,
    description: "Aplicação de mega hair com técnica nano pele",
    category: "Mega Hair",
  },
  {
    id: "3",
    name: "Mega Hair Nó Italiano (Amarradinho)",
    duration: 210,
    price: 1300,
    description: "Aplicação de mega hair com técnica de nó italiano",
    category: "Mega Hair",
  },
  {
    id: "4",
    name: "Mega Hair Link Tape",
    duration: 150,
    price: 900,
    description: "Aplicação de mega hair com técnica link tape",
    category: "Mega Hair",
  },
  {
    id: "5",
    name: "Mega Hair Nano Cápsula de Queratina",
    duration: 240,
    price: 1400,
    description: "Aplicação de mega hair com nano cápsulas de queratina",
    category: "Mega Hair",
  },
  {
    id: "6",
    name: "Mega Hair Micro Cápsula de Queratina",
    duration: 210,
    price: 1200,
    description: "Aplicação de mega hair com micro cápsulas de queratina",
    category: "Mega Hair",
  },
  {
    id: "7",
    name: "Corte",
    duration: 60,
    price: 80,
    description: "Corte personalizado",
    category: "Corte",
  },
  {
    id: "8",
    name: "Sobrancelha Navalha",
    duration: 30,
    price: 40,
    description: "Design de sobrancelha com navalha",
    category: "Sobrancelha",
  },
  {
    id: "9",
    name: "Sobrancelha Pinça",
    duration: 30,
    price: 35,
    description: "Design de sobrancelha com pinça",
    category: "Sobrancelha",
  },
  {
    id: "10",
    name: "Sobrancelha Henna",
    duration: 45,
    price: 60,
    description: "Design e aplicação de henna na sobrancelha",
    category: "Sobrancelha",
  },
  {
    id: "11",
    name: "Escova e Prancha",
    duration: 60,
    price: 80,
    description: "Escova modeladora e finalização com prancha",
    category: "Escova",
  },
  {
    id: "12",
    name: "Prancha",
    duration: 30,
    price: 50,
    description: "Finalização com prancha",
    category: "Escova",
  },
  {
    id: "13",
    name: "Escova",
    duration: 45,
    price: 60,
    description: "Escova modeladora",
    category: "Escova",
  },
  {
    id: "14",
    name: "Luzes Touca",
    duration: 120,
    price: 180,
    description: "Mechas com touca",
    category: "Coloração",
  },
  {
    id: "15",
    name: "Luzes Papel",
    duration: 150,
    price: 200,
    description: "Mechas com papel",
    category: "Coloração",
  },
  {
    id: "16",
    name: "Ombre Hair",
    duration: 180,
    price: 250,
    description: "Técnica de coloração degradê",
    category: "Coloração",
  },
  {
    id: "17",
    name: "Topos",
    duration: 120,
    price: 800,
    description: "Aplicação de topos capilares",
    category: "Mega Hair",
  },
  {
    id: "18",
    name: "Próteses",
    duration: 150,
    price: 1200,
    description: "Aplicação de próteses capilares",
    category: "Mega Hair",
  },
  {
    id: "19",
    name: "Cabelo Humano",
    duration: 30,
    price: 1500,
    description: "Venda de cabelo humano para aplicação",
    category: "Mega Hair",
  },
]

// Função para processar arquivo Excel/CSV
export const processExcelFile = async (file: File): Promise<ImportedData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const text = e.target?.result as string
        const lines = text.split("\n")
        const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())

        const clients: Partial<Client>[] = []
        const products: Partial<Product>[] = []

        // Detectar se é um arquivo de produtos ou clientes
        const isProductFile = headers.some(
          (h) =>
            h === "produto" ||
            h === "product" ||
            h === "sku" ||
            h === "barcode" ||
            h === "código de barras" ||
            h === "estoque" ||
            h === "quantidade",
        )

        if (isProductFile) {
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",")
            if (values.length >= headers.length && values[0].trim()) {
              const product: Partial<Product> = {}

              headers.forEach((header, index) => {
                const value = values[index]?.trim()
                if (!value) return

                switch (header) {
                  case "nome":
                  case "name":
                  case "produto":
                  case "product":
                    product.name = value
                    break
                  case "descrição":
                  case "description":
                    product.description = value
                    break
                  case "preço":
                  case "price":
                    product.price = Number.parseFloat(value.replace(/[^\d.,]/g, "").replace(",", "."))
                    break
                  case "custo":
                  case "cost":
                    product.cost = Number.parseFloat(value.replace(/[^\d.,]/g, "").replace(",", "."))
                    break
                  case "código de barras":
                  case "barcode":
                    product.barcode = value
                    break
                  case "sku":
                  case "código":
                  case "code":
                    product.sku = value
                    break
                  case "categoria":
                  case "category":
                    product.category = value
                    break
                  case "marca":
                  case "brand":
                    product.brand = value
                    break
                  case "fornecedor":
                  case "supplier":
                    product.supplier = value
                    break
                  case "quantidade":
                  case "quantity":
                  case "estoque":
                  case "stock":
                    product.quantity = Number.parseInt(value, 10) || 0
                    break
                  case "quantidade mínima":
                  case "min quantity":
                  case "estoque mínimo":
                    product.minQuantity = Number.parseInt(value, 10) || 0
                    break
                }
              })

              if (product.name && product.price !== undefined) {
                products.push(product)
              }
            }
          }
        } else {
          // Processamento de clientes
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",")
            if (values.length >= headers.length && values[0].trim()) {
              const client: Partial<Client> = {}

              headers.forEach((header, index) => {
                const value = values[index]?.trim()
                if (!value) return

                switch (header) {
                  case "nome":
                  case "name":
                    client.name = value
                    break
                  case "telefone":
                  case "phone":
                    client.phone = value
                    break
                  case "email":
                  case "e-mail":
                    client.email = value
                    break
                  case "aniversario":
                  case "aniversário":
                  case "birthday":
                  case "nascimento":
                    // Converter para formato DD/MM
                    const birthDate = formatBirthDate(value)
                    if (birthDate) client.birthDate = birthDate
                    break
                  case "endereco":
                  case "endereço":
                  case "address":
                    client.address = value
                    break
                  case "observacoes":
                  case "observações":
                  case "notes":
                    client.notes = value
                    break
                  case "mega hair":
                  case "megahair":
                  case "metodo":
                  case "método":
                    client.megaHairMethod = value
                    break
                  case "username":
                  case "usuário":
                  case "login":
                    if (!client.loginInfo)
                      client.loginInfo = {
                        username: "",
                        password: "",
                        registrationDate: new Date().toISOString(),
                        active: true,
                      }
                    client.loginInfo.username = value
                    break
                  case "senha":
                  case "password":
                    if (!client.loginInfo)
                      client.loginInfo = {
                        username: "",
                        password: "",
                        registrationDate: new Date().toISOString(),
                        active: true,
                      }
                    client.loginInfo.password = value
                    break
                }
              })

              if (client.name) {
                clients.push(client)
              }
            }
          }
        }

        resolve({ clients, products })
      } catch (error) {
        reject(new Error("Erro ao processar arquivo CSV/Excel"))
      }
    }

    reader.onerror = () => reject(new Error("Erro ao ler arquivo"))
    reader.readAsText(file)
  })
}

// Função para processar arquivo PDF (simulação - em produção usaria uma biblioteca como pdf-parse)
export const processPDFFile = async (file: File): Promise<ImportedData> => {
  return new Promise((resolve, reject) => {
    // Simulação de extração de PDF
    // Em produção, você usaria uma biblioteca como pdf-parse ou PDF.js
    setTimeout(() => {
      resolve({
        clients: [
          {
            name: "Cliente extraído do PDF",
            phone: "(11) 99999-9999",
            notes: "Dados extraídos automaticamente do PDF",
          },
        ],
        products: [
          {
            name: "Produto extraído do PDF",
            price: 99.9,
            quantity: 10,
            description: "Dados extraídos automaticamente do PDF",
          },
        ],
      })
    }, 1000)
  })
}

// Função para processar arquivo Word (simulação)
export const processWordFile = async (file: File): Promise<ImportedData> => {
  return new Promise((resolve, reject) => {
    // Simulação de extração de Word
    // Em produção, você usaria uma biblioteca como mammoth.js
    setTimeout(() => {
      resolve({
        clients: [
          {
            name: "Cliente extraído do Word",
            phone: "(11) 88888-8888",
            notes: "Dados extraídos automaticamente do documento Word",
          },
        ],
        products: [
          {
            name: "Produto extraído do Word",
            price: 129.9,
            quantity: 5,
            description: "Dados extraídos automaticamente do documento Word",
          },
        ],
      })
    }, 1000)
  })
}

// Função para processar arquivo PowerPoint (simulação)
export const processPowerPointFile = async (file: File): Promise<ImportedData> => {
  return new Promise((resolve, reject) => {
    // Simulação de extração de PowerPoint
    setTimeout(() => {
      resolve({
        clients: [
          {
            name: "Cliente extraído do PowerPoint",
            phone: "(11) 77777-7777",
            notes: "Dados extraídos automaticamente da apresentação",
          },
        ],
        products: [
          {
            name: "Produto extraído do PowerPoint",
            price: 79.9,
            quantity: 15,
            description: "Dados extraídos automaticamente da apresentação",
          },
        ],
      })
    }, 1000)
  })
}

// Função para formatar data de aniversário para DD/MM
const formatBirthDate = (dateString: string): string | null => {
  if (!dateString) return null

  // Remover espaços e caracteres especiais
  const cleaned = dateString.replace(/[^\d/\-.]/g, "")

  // Tentar diferentes formatos
  const formats = [
    /^(\d{1,2})[/\-.](\d{1,2})$/, // DD/MM ou DD-MM
    /^(\d{1,2})[/\-.](\d{1,2})[/\-.](\d{4})$/, // DD/MM/YYYY
    /^(\d{4})[/\-.](\d{1,2})[/\-.](\d{1,2})$/, // YYYY/MM/DD
  ]

  for (const format of formats) {
    const match = cleaned.match(format)
    if (match) {
      if (match.length === 3) {
        // Formato DD/MM
        const day = match[1].padStart(2, "0")
        const month = match[2].padStart(2, "0")
        return `${day}/${month}`
      } else if (match.length === 4) {
        if (match[3]) {
          // Formato DD/MM/YYYY - extrair apenas dia e mês
          const day = match[1].padStart(2, "0")
          const month = match[2].padStart(2, "0")
          return `${day}/${month}`
        } else {
          // Formato YYYY/MM/DD - extrair apenas dia e mês
          const day = match[3].padStart(2, "0")
          const month = match[2].padStart(2, "0")
          return `${day}/${month}`
        }
      }
    }
  }

  return null
}

// Função principal para processar qualquer tipo de arquivo
export const processImportFile = async (file: File): Promise<ImportedData> => {
  const extension = file.name.split(".").pop()?.toLowerCase()

  switch (extension) {
    case "csv":
    case "xlsx":
    case "xls":
      return processExcelFile(file)
    case "pdf":
      return processPDFFile(file)
    case "doc":
    case "docx":
      return processWordFile(file)
    case "ppt":
    case "pptx":
      return processPowerPointFile(file)
    default:
      throw new Error("Formato de arquivo não suportado")
  }
}

// Função para validar dados importados
export const validateImportedData = (data: ImportedData): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (data.clients) {
    data.clients.forEach((client, index) => {
      if (!client.name || client.name.trim().length < 2) {
        errors.push(`Cliente ${index + 1}: Nome é obrigatório e deve ter pelo menos 2 caracteres`)
      }

      if (client.phone && !/^$$\d{2}$$\s?\d{4,5}-?\d{4}$/.test(client.phone)) {
        errors.push(`Cliente ${index + 1}: Formato de telefone inválido`)
      }

      if (client.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email)) {
        errors.push(`Cliente ${index + 1}: Formato de e-mail inválido`)
      }

      if (client.birthDate && !/^\d{2}\/\d{2}$/.test(client.birthDate)) {
        errors.push(`Cliente ${index + 1}: Formato de aniversário deve ser DD/MM`)
      }
    })
  }

  if (data.products) {
    data.products.forEach((product, index) => {
      if (!product.name || product.name.trim().length < 2) {
        errors.push(`Produto ${index + 1}: Nome é obrigatório e deve ter pelo menos 2 caracteres`)
      }

      if (product.price === undefined || isNaN(product.price) || product.price < 0) {
        errors.push(`Produto ${index + 1}: Preço é obrigatório e deve ser um número positivo`)
      }

      if (product.quantity === undefined || isNaN(product.quantity) || product.quantity < 0) {
        errors.push(`Produto ${index + 1}: Quantidade é obrigatória e deve ser um número positivo`)
      }
    })
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

// Função para gerar código de barras aleatório
export const generateBarcode = (): string => {
  let barcode = ""
  for (let i = 0; i < 13; i++) {
    barcode += Math.floor(Math.random() * 10).toString()
  }
  return barcode
}

// Função para gerar SKU aleatório
export const generateSKU = (productName: string): string => {
  const prefix = productName.substring(0, 3).toUpperCase()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0")
  return `${prefix}-${random}`
}
