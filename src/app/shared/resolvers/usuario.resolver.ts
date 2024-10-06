import { inject } from "@angular/core";
import { StorageService } from "@shared/services";

export function resolve() {
  const storageService = inject(StorageService);

  return storageService.getUsuario();
}

export function UsuarioResolver(): any {
  return resolve();
}
