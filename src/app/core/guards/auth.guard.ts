import {CanActivateFn, CanMatchFn} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../services/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanMatchFn = (
  route,
  state) => {
  const authService = inject(AuthService);
  const _snackBar = inject(MatSnackBar);

  const isLoggedIn = authService.isLoggedIn;
  for (const [key, value] of state.entries()) {
    console.log(key, value);
  }
  const url = route.path;
  if (!isLoggedIn) {
    _snackBar.open(`Ruta no autorizada [${url}]`, 'Cerrar', {
      horizontalPosition: 'center',
      verticalPosition: 'top',
      duration: 2000
    })
  }
  return isLoggedIn;
};
