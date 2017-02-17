import { NgModule } from '@angular/core';
import { IonicApp, IonicModule } from 'ionic-angular';
import { MyApp } from './app.component';
import { Ionic2RatingModule } from 'ionic2-rating';
import { ElasticModule  }       from 'angular2-elastic';



import { GetPages } from '../pages';
import { GetProviders } from '../providers';




@NgModule({
  declarations: [
    MyApp,
    GetPages(),

  ],
  imports: [
    IonicModule.forRoot(MyApp),
    Ionic2RatingModule,
    ElasticModule,
    

  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    GetPages(),

  ],
 providers: GetProviders(),  
})
export class AppModule {}
