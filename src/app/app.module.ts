import { DEFAULT_CURRENCY_CODE, LOCALE_ID, NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { FormsModule } from '@angular/forms';
import { AtendimentosModule, DashboardModule } from '@pages';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { DecimalPipe, registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { AuthInterceptor } from '@core/auth';
import { MtxTooltipModule } from '@ng-matero/extensions/tooltip';
import { FilterByPipe } from './shared/pipes/filter-by.pipe';

registerLocaleData(ptBr);

@NgModule({
  declarations: [
    AppComponent,
    FilterByPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MtxTooltipModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
    FormsModule,
    DashboardModule,
    HttpClientModule,
    AtendimentosModule
  ],
  providers: [
    { provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: { appearance: 'outline' } },
    { provide: LOCALE_ID, useValue: 'pt' },
    { provide: DEFAULT_CURRENCY_CODE, useValue: 'BRL' },
    {
      multi: true,
      useClass: AuthInterceptor,
      provide: HTTP_INTERCEPTORS,
    },
    DecimalPipe
  ],
  bootstrap: [AppComponent],
  exports: []
})
export class AppModule {
  constructor() { }
}
