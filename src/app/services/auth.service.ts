import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import { User } from './../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { GlobalState } from '../app.reducer';
import * as authAtion from './../auth/auth.actions';
import { Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   userUnsuscription: Subscription;

  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore, private store: Store<GlobalState>) {}

  initAuthListener() {
     this.auth.authState.subscribe( fuser => {
       if (fuser) {
         this.userUnsuscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().subscribe( (dataUser: any) => {
           const user = User.fromFirebase(dataUser);
           this.store.dispatch(authAtion.setUser({user}));
          });
        } else {
          this.userUnsuscription.unsubscribe();
          this.store.dispatch(authAtion.unSetUser());
       }
     });
  }

  crearUsuario(nombre: string, email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password).then(({user}) => {
      const newUser = new User(user.uid, nombre, user.email);
      return  this.firestore.doc(`${user.uid}/usuario`).set({...newUser});
    });
  }
  loginUsuario(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  loggout() {
   return this.auth.signOut();
  }
  isAuth() {
    return this.auth.authState.pipe(
      map(fbuser => fbuser != null)
    );
  }
}
