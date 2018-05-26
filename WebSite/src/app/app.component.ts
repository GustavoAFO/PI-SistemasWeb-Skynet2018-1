import { Component } from '@angular/core';
// import { FirebaseConfig } from './../environments/firebase.config';
// import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
// import { Observable } from 'rxjs';
import { RouterModule, Routes, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  // items: Observable<any[]>;
  logged: any;

  constructor(/*private db: AngularFireDatabase*/private router: Router, private authService: AuthService) {

    /*
    Observable.of(this.authService.logged).subscribe((logged) => {
      this.logged = logged;
      console.log(this.logged);
    });*/
    this.authService.logged.subscribe((log) => {
      if (log) {
        this.logged = true;
      } else {
        this.logged = false;
      }

      console.log(this.logged);
    });
    // this.logged = authService.isLoggedIn;

    /*
    if (authService.isLoggedIn()) {
      this.logged = true;
    }*/

  }

  logoff() {
    this.authService.logout();
  }


}


