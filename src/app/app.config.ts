import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';
import { routes } from './app.routes';
import { Supabase } from './core/services/supabase';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      // Esto activa el salto suave cuando haces clic en "/#experiencia"
      withInMemoryScrolling({ anchorScrolling: 'enabled' }),
    ),
  ],
};
