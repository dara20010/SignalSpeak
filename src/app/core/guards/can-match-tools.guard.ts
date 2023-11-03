import { CanActivateFn } from '@angular/router';

export const canMatchToolsGuard: CanActivateFn = (route, state) => {
  return true;
};
