import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { Oportunidade } from '../models/oportunidade';

@Injectable({
    providedIn: 'root'
})
export class OportunidadeService extends BaseService {

    saveOportunidade(oportunidade: Oportunidade): Observable<Oportunidade> {
        this.url = 'Oportunidade';
        return this.post(oportunidade);
    }

    updateOportunidade(oportunidade: Oportunidade): Observable<Oportunidade> {
        this.url = 'Oportunidade/';
        return this.putParams(oportunidade, oportunidade.idoportunidade);
    }

    getAllOportunidades(clientCode: number, unidCode: number, rcaCode: number): Observable<Oportunidade[]> {
        this.url = 'Oportunidade?';
        const params = `clientCode=${clientCode}&unidCode=${unidCode}&rcaCode=${rcaCode}`;
        return this.getMultParams<Oportunidade[]>(params);
    }
}