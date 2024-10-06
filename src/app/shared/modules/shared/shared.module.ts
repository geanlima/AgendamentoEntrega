import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxMaskModule } from 'ngx-mask';
import { MaterialModule } from '../material/material.module';
import {
  YesNoPipe,
  OrderByPipe
} from '@shared/pipes';
import {
  PopupComponent,
  SearchComponent,
  AppLogoComponent,
  NavigationComponent,
  NotificationComponent,
  DialogConfirmationComponent,
  ProgressComponent,
  StatusCreditoComponent,
  CardPanelComponent,
  CardPanelSmallComponent,
} from '@shared/components';
import { NgApexchartsModule } from 'ng-apexcharts';

const components = [
  DialogConfirmationComponent,
  SearchComponent,
  AppLogoComponent,
  NavigationComponent,
  NotificationComponent,
  PopupComponent,
  ProgressComponent,
  StatusCreditoComponent,
  CardPanelComponent,
  CardPanelSmallComponent,
];

const pipes = [
  YesNoPipe,
  OrderByPipe,
];

const importModules = [
  CommonModule,
  MaterialModule,
  NgApexchartsModule,
  NgxMaskModule.forRoot()
];

const importExportModules = [
  RouterModule,
  ReactiveFormsModule,
  FormsModule
];

@NgModule({
  imports: [
    importModules,
    importExportModules
  ],
  declarations: [
    pipes,
    components,
  ],
  exports: [
    pipes,
    components,
    importModules,
    importExportModules
  ]
})
export class SharedModule { }
