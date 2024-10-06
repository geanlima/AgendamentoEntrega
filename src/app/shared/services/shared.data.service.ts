// Serviço para compartilhar estado
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SharedDataService {
    private data = new BehaviorSubject<any>(null);
    shareData = this.data.asObservable();

    updateData(data: any) {
        this.data.next(data);
    }
}
