export interface ShortLinkModel {
  slug: string;         // O slug escolhido pelo usuário para encurtar a URL
  url: string;          // A URL original que está sendo encurtada
  userId: string;       // ID do usuário que criou o link encurtado
  createdAt: any;       // Timestamp da criação do link
  qrCodeUrl: string;    // URL do QR code gerado para o link encurtado
}
