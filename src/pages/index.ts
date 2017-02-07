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
import { VisitBooksPage } from './calls/visit-books';
import { VisitMagsPage } from './calls/visit-mags';
import { VisitTractsPage } from './calls/visit-tracts';
import { VisitVideosPage } from './calls/visit-videos';


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
  VisitBooksPage,
  VisitMagsPage,
  VisitTractsPage,
  VisitVideosPage,

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
    VisitBooksPage,
    VisitMagsPage,
    VisitTractsPage,
    VisitVideosPage,

    //Notes
    NoteListPage,
    NoteDetailPage,


  ];
}