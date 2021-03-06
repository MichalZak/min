import { ErrorHandler } from '@angular/core';
import { IonicErrorHandler } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { DataProvider } from './data-provider';
import { Settings } from './settings';
import { Api } from './api';
import { Auth } from './auth';
import { Placements } from './placements';
import { getConfig } from '../config';
import { TimeProvider } from './time-provider';



export {
  Api,
  Auth,
  DataProvider,
  Settings,
  Placements,
  TimeProvider,

}

export function provideSettings(storage: Storage) {
  return new Settings(storage, getConfig());
}


export function GetProviders() {
  return [
    Api,
    Auth,
    Storage,    
    DataProvider,
    Placements,
    TimeProvider,
    { provide: Settings, useFactory: provideSettings, deps: [ Storage ] },
    // Keep this to enable Ionic's runtime error handling during development
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}
