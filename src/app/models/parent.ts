export interface Parent {
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
  