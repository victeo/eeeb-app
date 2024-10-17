export class Links {
    constructor(
      public id: string, // O Firebase irá gerar IDs únicos
      public titulo: string,
      public url: string,
      public descricao?: string // A descrição é opcional
    ) {}
  }