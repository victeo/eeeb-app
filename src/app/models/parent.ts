export interface Parent {
  id?: string; // Campo opcional para o ID do documento no Firestore
  name: string;
  surname: string;
  email: string;
  whatsapp: string;
  password: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  gender: string;
  cpf: string;     
  renda: number;    
}
