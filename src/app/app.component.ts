import { Component } from '@angular/core';
import { environment } from '@env';
import { Parametro } from '@shared/models';
import { ParametroService, StorageService } from '@shared/services';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = environment.clienteTitle + 'By SGM';

  constructor(
    private storageService: StorageService,
    private paramService: ParametroService
  ) {
    this.paramService.getAll<Parametro[]>().subscribe((result) => {
      this.storageService.saveParametros(result);
    });
  }
}
