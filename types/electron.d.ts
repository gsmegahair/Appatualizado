interface ElectronAPI {
  store: {
    get: (key: string) => Promise<any>
    set: (key: string, value: any) => Promise<boolean>
    delete: (key: string) => Promise<boolean>
  }
  images: {
    save: (imageData: string, fileName: string) => Promise<string>
    load: (fileName: string) => Promise<string | null>
    delete: (fileName: string) => Promise<boolean>
    selectFile: () => Promise<string | null>
  }
  platform: string
}

interface Window {
  electronAPI?: ElectronAPI
}
