import { ApplicationConfig, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localePtBr from '@angular/common/locales/pt';
import { routes } from './app.routes';

// Registra os dados do locale pt-BR globalmente
// Necessário para o pipe `date` com locale 'pt-BR'
registerLocaleData(localePtBr, 'pt-BR');

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: LOCALE_ID, useValue: 'pt-BR' },
  ]
};
