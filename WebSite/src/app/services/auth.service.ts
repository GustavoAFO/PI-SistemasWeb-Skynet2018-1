import { Injectable } from '@angular/core';
import { RouterModule, Routes, Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Observable } from 'rxjs/Observable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: Observable<firebase.User>;
  private userDetails: firebase.User = null;

  public logged: Observable<firebase.User>;

  constructor(private _firebaseAuth: AngularFireAuth, private router: Router) {

    this.user = _firebaseAuth.authState;
    this.logged = _firebaseAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userDetails = user;
          console.log(this.userDetails);

          this.router.navigate(['home']);
        } else {
          this.userDetails = null;

        }
      }
    );
  }

  signInWithTwitter() {
    return this._firebaseAuth.auth.signInWithPopup(
      new firebase.auth.TwitterAuthProvider()
    );
  }

  signInWithGoogle() {
    return this._firebaseAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).then((res) => {
      // Check if exist in database , otherwise logoff
      this.router.navigate(['home']);
    }).catch((err) => {

      console.log(err);
    });
  }

  signInRegular(email, password) {

    const credential = firebase.auth.EmailAuthProvider.credential(email, password);

    return this._firebaseAuth.auth.signInWithEmailAndPassword(email, password);

  }

  isLoggedIn() {
    if (this.userDetails == null) {
      // this.logged = false;
      return false;
    } else {
      // this.logged = true;
      return true;

    }
  }

  logout() {
    this._firebaseAuth.auth.signOut()
      .then((res) => this.router.navigate(['/']));
  }



}
