const { contextBridge, ipcRenderer } = require("electron")

// Expõe APIs seguras para o processo de renderização
contextBridge.exposeInMainWorld("electronAPI", {
  // Funções para acessar o armazenamento local
  store: {
    get: (key) => ipcRenderer.invoke("get-store-value", key),
    set: (key, value) => ipcRenderer.invoke("set-store-value", key, value),
    delete: (key) => ipcRenderer.invoke("delete-store-value", key),
  },
  // Funções para manipulação de imagens
  images: {
    save: (imageData, fileName) => ipcRenderer.invoke("save-image", imageData, fileName),
    load: (fileName) => ipcRenderer.invoke("load-image", fileName),
    delete: (fileName) => ipcRenderer.invoke("delete-image", fileName),
    selectFile: () => ipcRenderer.invoke("select-image-file"),
  },
  // Informações sobre a plataforma
  platform: process.platform,
})
