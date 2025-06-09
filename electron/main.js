const { app, BrowserWindow, ipcMain, dialog } = require("electron")
const serve = require("electron-serve")
const path = require("path")
const fs = require("fs")
const Store = require("electron-store")

// Inicializa o armazenamento local
const store = new Store()

// Carrega o aplicativo Next.js em produção
const loadURL = serve({ directory: "out" })

// Variável para armazenar a janela principal
let mainWindow

// Diretório para armazenar imagens
const imagesDir = path.join(app.getPath("userData"), "images")

// Criar diretório de imagens se não existir
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true })
}

function createWindow() {
  // Cria a janela do navegador
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    icon: path.join(__dirname, "../public/icon.ico"),
  })

  // Em desenvolvimento, carrega o servidor local
  if (process.env.NODE_ENV === "development") {
    mainWindow.loadURL("http://localhost:3000")
    mainWindow.webContents.openDevTools()
  } else {
    // Em produção, carrega o aplicativo compilado
    loadURL(mainWindow)
  }

  // Evento quando a janela é fechada
  mainWindow.on("closed", () => {
    mainWindow = null
  })
}

// Cria a janela quando o Electron estiver pronto
app.whenReady().then(createWindow)

// Sai quando todas as janelas estiverem fechadas (exceto no macOS)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow()
  }
})

// Manipuladores de IPC para comunicação entre o renderer e o main process
ipcMain.handle("get-store-value", (event, key) => {
  return store.get(key)
})

ipcMain.handle("set-store-value", (event, key, value) => {
  store.set(key, value)
  return true
})

ipcMain.handle("delete-store-value", (event, key) => {
  store.delete(key)
  return true
})

// Manipuladores para imagens
ipcMain.handle("save-image", async (event, imageData, fileName) => {
  try {
    // Remover o prefixo data:image/...;base64,
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "")
    const imagePath = path.join(imagesDir, fileName)

    // Salvar arquivo
    fs.writeFileSync(imagePath, base64Data, "base64")

    return imagePath
  } catch (error) {
    console.error("Erro ao salvar imagem:", error)
    throw error
  }
})

ipcMain.handle("load-image", async (event, fileName) => {
  try {
    const imagePath = path.join(imagesDir, fileName)

    if (fs.existsSync(imagePath)) {
      const imageData = fs.readFileSync(imagePath, "base64")
      // Detectar tipo de imagem baseado na extensão
      const ext = path.extname(fileName).toLowerCase()
      let mimeType = "image/jpeg"

      if (ext === ".png") mimeType = "image/png"
      else if (ext === ".gif") mimeType = "image/gif"
      else if (ext === ".webp") mimeType = "image/webp"

      return `data:${mimeType};base64,${imageData}`
    }

    return null
  } catch (error) {
    console.error("Erro ao carregar imagem:", error)
    return null
  }
})

ipcMain.handle("delete-image", async (event, fileName) => {
  try {
    const imagePath = path.join(imagesDir, fileName)

    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath)
      return true
    }

    return false
  } catch (error) {
    console.error("Erro ao deletar imagem:", error)
    return false
  }
})

ipcMain.handle("select-image-file", async () => {
  try {
    const result = await dialog.showOpenDialog(mainWindow, {
      title: "Selecionar Imagem",
      filters: [
        { name: "Imagens", extensions: ["jpg", "jpeg", "png", "gif", "webp"] },
        { name: "Todos os arquivos", extensions: ["*"] },
      ],
      properties: ["openFile"],
    })

    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0]
      const imageData = fs.readFileSync(filePath, "base64")
      const ext = path.extname(filePath).toLowerCase()

      let mimeType = "image/jpeg"
      if (ext === ".png") mimeType = "image/png"
      else if (ext === ".gif") mimeType = "image/gif"
      else if (ext === ".webp") mimeType = "image/webp"

      return `data:${mimeType};base64,${imageData}`
    }

    return null
  } catch (error) {
    console.error("Erro ao selecionar arquivo:", error)
    return null
  }
})
