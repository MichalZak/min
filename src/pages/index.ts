import { TabsPage } from './tabs/tabs';
import { AboutPage } from './about/about';

//Auth
import { WelcomePage } from './auth/welcome';
import { LoginPage} from './auth/login';
import { SignupPage } from './auth/signup'; 


//Calls
import { CallDetailPage } from './calls/call-detail';
import { CallListPage } from './calls/call-list';
import { CallVisitPage } from './calls/call-visit';
import { VisitPlacementsPage } from './calls/visit-placements';


//Notes
import { NoteDetailPage } from './notes/note-detail';
import { NoteListPage } from './notes/note-list';




export const MainPage = TabsPage;

// The initial root pages for our tabs (remove if not using tabs)
export const Tab1Root = NoteListPage;
export const Tab2Root = CallListPage;
export const Tab3Root = AboutPage;


export {
  TabsPage,
  AboutPage,


  //Auth
  WelcomePage,
  LoginPage,
  SignupPage,

  //Calls
  CallListPage,
  CallDetailPage,
  CallVisitPage,
  VisitPlacementsPage,

  //notes
  NoteListPage,
  NoteDetailPage
  


}



export function GetPages() {
  return [
    TabsPage,
    AboutPage,

    //Auth
    WelcomePage,
    LoginPage,
    SignupPage,

    //Calls
    CallListPage,
    CallDetailPage,
    CallVisitPage,
    VisitPlacementsPage,

    //Notes
    NoteListPage,
    NoteDetailPage,


  ];
}