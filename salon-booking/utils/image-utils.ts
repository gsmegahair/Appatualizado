// Utilitários para manipulação de imagens

export const resizeImage = (file: File, maxWidth: number, maxHeight: number): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      // Calcular novas dimensões mantendo proporção
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Desenhar imagem redimensionada
      ctx?.drawImage(img, 0, 0, width, height)

      // Converter para base64
      resolve(canvas.toDataURL("image/jpeg", 0.8))
    }

    img.src = URL.createObjectURL(file)
  })
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  // Verificar tipo de arquivo
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp"]
  if (!validTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Formato de arquivo não suportado. Use PNG, JPG, JPEG, GIF ou WebP.",
    }
  }

  // Verificar tamanho (máximo 10MB)
  if (file.size > 10 * 1024 * 1024) {
    return {
      valid: false,
      error: "Arquivo muito grande. O tamanho máximo é 10MB.",
    }
  }

  return { valid: true }
}

export const getImageDimensions = (file: File): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      resolve({ width: img.width, height: img.height })
    }
    img.src = URL.createObjectURL(file)
  })
}
