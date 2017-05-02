import { Component, ChangeDetectionStrategy, ChangeDetectorRef  } from '@angular/core';
import { NavController, NavParams, AlertController, ActionSheetController  } from 'ionic-angular';
import { TimeProvider, DataProvider} from '../../providers';
import { Day, Student, Month, } from '../../models';
import { TimeDayPage } from '../';
import * as moment from 'moment';

@Component({
  selector: 'page-time-month',
  templateUrl: 'time-month.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TimeMonthPage {

  public days:Day[];
  public date:string;
  public month: Month = new Month;
  public subscription:any;
  public selectedMonth:Date;




  constructor(public navCtrl: NavController,
              public actionSheetCtrl: ActionSheetController, 
              public navParams: NavParams,
              public alertCtrl: AlertController,
              private ref: ChangeDetectorRef,
              public dataProvider: DataProvider,
              public timeProvider: TimeProvider) {}

  ionViewDidLoad() {
    this.selectedMonth = new Date();
    this.loadMonth(this.selectedMonth);
  }

  printMonth():string{
    return moment(this.selectedMonth).format('MMM/YYYY');
  }

  loadMonth(date:Date = new Date(), refresh:boolean= false){
    console.log('TimeMonthPage -> ionViewDidLoad');

    let y = moment(date).get('year');
    let m = moment(date).get('month')+1;
    console.log("Month: "+ m+" year: "+y);
    if(m < 11 )
      this.date = y+'0'+m;
    else
      this.date = y+''+m;
    
    //lets make sure that it exists
    if(!this.timeProvider.getDoc(this.date))
      this.timeProvider.save(new Month({_id:this.date})).then(()=>{
        if(refresh)
          this.monthSubscribe();
      });
    else
      if(refresh) this.monthSubscribe();

    console.log('Month: '+ this.date);
  }

  monthSelectChange(){
    console.log("Chaning Month", this.selectedMonth);
    this.loadMonth(this.selectedMonth, true);
  }


  ionViewWillEnter(){
    console.log('TimeMonthPage-> ionViewWillEnter');
    this.monthSubscribe();
  }



  monthSubscribe(){
    if(this.subscription)
      this.subscription.unsubscribe();

    this.subscription = this.timeProvider.getDocObservable(this.date).subscribe(
      doc =>{
        this.month = Object.assign({}, doc);

        if(this.month.days == null)
          this.month.days = new Array<Day>();

        if(this.month.students == null)
          this.month.students = new Array<Student>();

        this.selectedMonth = moment(this.month._id,'YYYYMM').toDate();

        this.ref.markForCheck();
      }
    );
    
  }

  printDate(date:number):string{
    return Month.printDate(date, this.month);
  }

  printTotals():string{
    return Month.printTotalsShort(this.month);
  }

  ionViewWillLeave(){
    this.subscription.unsubscribe();
  }

  add(){
    let d:number = 1;

    if(this.month._id == moment().format('YYYYMM'))
      d= moment().date();

    this.view(d);

  }

  view(date){
    console.log("View Day: ", date);
    this.navCtrl.push(TimeDayPage,{date:date, month:this.month});
  }

  changeMonth(){
    console.log('Change Month');
    //lets show popup of all the months

  }


  remove(day, index){
    let prompt = this.alertCtrl.create({
      title: 'Remove Day Record:' + day.day,
      message: "Are you sure you want to remove this record?",
      buttons: [
        {
          text: 'Cancel',
          handler: data=>{}//do nothing, just leave
        },
        {
          text: 'Remove',
          handler: data => {
            this.month.days.splice( index, 1 );
            this.timeProvider.save(this.month);
            this.ref.markForCheck();
          }
        }
      ]
    });
    prompt.present();
  
  }

}
