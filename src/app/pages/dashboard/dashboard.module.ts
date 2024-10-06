import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '@shared/modules';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardCardComponent } from '@shared/components';
import { DashboardMailItemComponent, DefinirMetaPopupComponent } from '@core/components';


@NgModule({
  declarations: [
    DashboardComponent,
    DashboardCardComponent,
    DashboardMailItemComponent,
    DefinirMetaPopupComponent,
  ],
  imports: [
    SharedModule,
    DashboardRoutingModule,
  ],
})
export class DashboardModule { }
