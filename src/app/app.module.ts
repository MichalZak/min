import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';


import { GetPages } from '../pages';
import { GetProviders } from '../providers';




@NgModule({
  declarations: [
    MyApp,
    GetPages(),

  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetPages(),

  ],
 providers: GetProviders(), 
})
export class AppModule {}
