export interface User {
  id: string;
  name: string;
  email: string;
  whatsapp?: string; // Opcional
  address?: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
}
