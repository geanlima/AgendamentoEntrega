import { Injectable } from '@angular/core';
import { BaseService } from './base.service';
import { Observable } from 'rxjs';
import { ResumoMes } from '../models/dashboard';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends BaseService {

  getResumoMes(): Observable<ResumoMes> {
    this.url = 'dashboard/resumomes';
    return this.getAll<ResumoMes>();
  }

}
