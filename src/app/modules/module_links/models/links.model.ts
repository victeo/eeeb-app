export interface Links {
   id?: string; // Identificador opcional
   title: string; // Título do Linktree
   url_slug: string; // URL da página
   buttons?: { // Array de botões
     titulo: string;
     url: string;
   }[];
 }
 