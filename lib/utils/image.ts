const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_SOURCE_SIZE_BYTES = 8 * 1024 * 1024; // 8MB

export class InvalidImageError extends Error {}

/**
 * Validação básica no cliente (seção 59 — validação completa/servidor
 * fica para a Fase 8). Redimensiona para no máximo `maxWidth` de largura
 * e recodifica em JPEG para manter o dado pequeno o suficiente para
 * localStorage.
 */
export function resizeImageToDataUrl(file: File, maxWidth = 480): Promise<string> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return Promise.reject(new InvalidImageError("Formato de imagem não suportado."));
  }
  if (file.size > MAX_SOURCE_SIZE_BYTES) {
    return Promise.reject(new InvalidImageError("Imagem maior que 8MB."));
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new InvalidImageError("Falha ao ler o arquivo."));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new InvalidImageError("Arquivo de imagem inválido."));
      img.onload = () => {
        const scale = Math.min(1, maxWidth / img.width);
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new InvalidImageError("Canvas indisponível."));
          return;
        }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.85));
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}
