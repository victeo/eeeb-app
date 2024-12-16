import { CanActivateFn } from '@angular/router';

export const coordenacaoGuard: CanActivateFn = (route, state) => {
  return true;
};
