import {ApplicationConfig, provideZoneChangeDetection, provideZonelessChangeDetection,} from '@angular/core';
import {provideRouter, withComponentInputBinding} from '@angular/router';

import { routes } from './app.routes';
import {GoogleLoginProvider, SocialAuthServiceConfig} from '@abacritt/angularx-social-login';
import {environment} from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [provideZonelessChangeDetection(), provideRouter(routes, withComponentInputBinding()), {
    provide: "SocialAuthServiceConfig",
    useValue: {
      autoLogin: false,
      lang: 'en',
      providers: [
        {
          id: GoogleLoginProvider.PROVIDER_ID,
          provider: new GoogleLoginProvider(environment.googleClientId)
        }
      ],
      onError: (err) => console.error(err)
    } as SocialAuthServiceConfig
  }]
};
