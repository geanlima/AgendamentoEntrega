import { NgModule } from '@angular/core';
import { MensagensComponent } from './mensagens.component';
import { SharedModule } from '@shared/modules';
import { MensagensRoutingModule } from './mensagens-routing.module';
import { MessagePopupComponent, MessagesMailItemComponent } from '@core/components';
import { TruncateTextPipe } from '@shared/pipes';

@NgModule({

  imports: [
    SharedModule,
    MensagensRoutingModule,

  ],
  declarations: [
    MensagensComponent,
    MessagesMailItemComponent,
    MessagePopupComponent,
    TruncateTextPipe,]
})
export class MensagensModule { }
