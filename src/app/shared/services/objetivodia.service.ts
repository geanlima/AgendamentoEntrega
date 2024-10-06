import { Injectable } from '@angular/core';
import { BaseService } from './base.service';

import { Observable } from 'rxjs';
import { ObjetivoDia } from '../models/objetivodia';
import { environment } from '@env';
import { ObjetivoDiaRetorno } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class ObjetivoDiaService extends BaseService {
  saveObjetivoDia(ObjetivoDia: ObjetivoDia): Observable<ObjetivoDia> {
    this.url = 'TabObjetivoDia';
    return this.post(ObjetivoDia);
  }

  getObjetivoDiaById(idSupervisor: number): Observable<ObjetivoDiaRetorno> {
    this.url = `TabObjetivoDia/${environment.unidade}/`;
    return this.get<ObjetivoDiaRetorno>(idSupervisor);
  }

}
