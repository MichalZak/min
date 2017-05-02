import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Ionic2RatingModule } from 'ionic2-rating';
import { ElasticModule  }       from 'angular2-elastic';
import { CloudSettings, CloudModule } from '@ionic/cloud-angular';


import { GetPages } from '../pages';
import { GetProviders } from '../providers';


const cloudSettings: CloudSettings = {
  'core': {
    'app_id': '73a9055b'
  }
};



@NgModule({
  declarations: [
    MyApp,
    GetPages(),

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    ElasticModule,
    CloudModule.forRoot(cloudSettings),    

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetPages(),

  ],
 providers: GetProviders(),  
})
export class AppModule {}
