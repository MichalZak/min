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
      new Placement({_id: 'pub/book/bh', name: 'Bible Teach', fullName: 'What Does the Bible Really Teach?', shortName: 'bh', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/nwt', name: 'NWT Bible', shortName: 'nwt', type:"book", category: "study"}), 

      new Placement({_id: 'pub/book/lc', name: 'Was Life Created?', shortName: 'lc', type:"book"}),
      new Placement({_id: 'pub/book/lf', name: 'The Origin of Life—Five Questions Worth Asking', shortName: 'lf', type:"book"}), 
      new Placement({_id: 'pub/book/hf', name: 'Your Family Can Be Happy', shortName: 'hf', type:"book"}), 
      new Placement({_id: 'pub/book/bhs', name: 'Teach Us?', shortName: 'bhs', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/pc', name: 'Peace&Happiness', shortName: 'pc', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/fb', name: 'Good News From God!', shortName: 'fb', type:"book"}), 
      new Placement({_id: 'pub/book/jl', name: 'Jehovah’s Will?', shortName: 'jl', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/yp1', name: 'Questions Young People Ask 1', shortName: 'yp1', type:"book"}), 
      new Placement({_id: 'pub/book/yp2', name: 'Questions Young People Ask 2', shortName: 'yp2', type:"book"}), 
      new Placement({_id: 'pub/book/ll', name: 'Listen to God and Live Forever', shortName: 'll', type:"book"}), 
      new Placement({_id: 'pub/book/lr', name: 'Learn From the Great Teacher', shortName: 'lr', type:"book"}), 
      new Placement({_id: 'pub/book/lv', name: 'God’s Love', shortName: 'lv', type:"book", category: "study"}), 
      new Placement({_id: 'pub/book/cl', name: 'Draw Close to Jehovah', shortName: 'cl', type:"book"}), 
      new Placement({_id: 'pub/book/my', name: 'My Book of Bible Stories', shortName: 'my', type:"book"}), 
    ];
  }

  getTracts(){
    
  }

  getVideos():Placement[]{
   return [
      new Placement({_id: 'pub/video/', name: 'Why Study the Bible?', type:"video"}),
      new Placement({_id: 'pub/video/', name: 'Who Is the Author of the Bible?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'How Can We Be Sure the Bible Is True?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'What Happens at a Kingdom Hall?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Was Life Created? Introduction', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Does God Have a Name?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Why Did Jesus Die?', type:"video"}),
      new Placement({_id: 'pub/video/',name: 'Strength Comes From Serving Jehovah', type:"video"}), 
      new Placement({_id: 'pub/video/', name: 'I Got Fed Up With My Lifestyle', type:"video"}),
    ]
  }

}
