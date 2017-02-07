import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import {Placement } from '../models';

/*
  Generated class for the Placements provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class Placements {

  constructor(public http: Http) {
    console.log('Hello Placements Provider');
  }

  getBooks():Placement[]{
    return [
      {name: 'What Does the Bible Really Teach?', shortName: 'bh', type:"book"}, 
      {name: 'NWT Bible', shortName: 'nwt', type:"book"}, 

      {name: 'Was Life Created?', shortName: 'lc', type:"book"},
      {name: 'The Origin of Life—Five Questions Worth Asking', shortName: 'lf', type:"book"}, 
      {name: 'Your Family Can Be Happy', shortName: 'hf', type:"book"}, 
      {name: 'What Can the Bible Teach Us?', shortName: 'bhs', type:"book"}, 
      {name: 'Lasting Peace and Happiness', shortName: 'pc', type:"book"}, 
      {name: 'Good News From God!', shortName: 'fb', type:"book"}, 
      {name: 'Who Are Doing Jehovah’s Will Today?', shortName: 'jl', type:"book"}, 
      {name: 'Questions Young People Ask 1', shortName: 'yp1', type:"book"}, 
      {name: 'Questions Young People Ask 2', shortName: 'yp2', type:"book"}, 
      {name: 'Listen to God and Live Forever', shortName: 'll', type:"book"}, 
      {name: 'Learn From the Great Teacher', shortName: 'lr', type:"book"}, 
      {name: 'Keep Yourselves in God’s Love', shortName: 'lv', type:"book"}, 
      {name: 'Draw Close to Jehovah', shortName: 'cl', type:"book"}, 
      {name: 'My Book of Bible Stories', shortName: 'my', type:"book"}, 
    ];
  }

  getTracts(){
    
  }

  getVideos():Placement[]{
   return [
      {name: 'Why Study the Bible?', type:"video"},
      {name: 'Who Is the Author of the Bible?', type:"video"},
      {name: 'How Can We Be Sure the Bible Is True?', type:"video"},
      {name: 'What Happens at a Kingdom Hall?', type:"video"},
      {name: 'Was Life Created? Introduction', type:"video"},
      {name: 'Does God Have a Name?', type:"video"},
      {name: 'Why Did Jesus Die?', type:"video"},
      {name: 'Strength Comes From Serving Jehovah', type:"video"}, 
      {name: 'I Got Fed Up With My Lifestyle', type:"video"},
    ]
  }

}
