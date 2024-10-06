import { inject } from "@angular/core";
import { Router } from "@angular/router";
import { AuthService } from "@shared/services";
import { of } from "rxjs";

export function AuthGuard() {
  const router = inject(Router);
  const authService = inject(AuthService);

  if (authService.isLoggedIn() !== true) {

    router.navigate(['auth']);
    return of(false);

  }

  return of(true);
}


