import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {map} from 'rxjs/operators';
import { User } from './../models/user.model';
import { AngularFirestore } from '@angular/fire/firestore';
import 'firebase/firestore';
import { Store } from '@ngrx/store';
import { GlobalState } from '../app.reducer';
import * as authAction from './../auth/auth.actions';
import { Subscription } from 'rxjs';
import * as ingresoEgresoAction from '../ingreso-egreso/ingreso-egreso.acctions';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
   userUnsuscription: Subscription;
   private user: User;

   get usuario() {
     return {...this.user };
   }
  constructor(public auth: AngularFireAuth, private firestore: AngularFirestore, private store: Store<GlobalState>) {}

  initAuthListener() {
     this.auth.authState.subscribe( fuser => {
       if (fuser) {
         this.userUnsuscription = this.firestore.doc(`${fuser.uid}/usuario`).valueChanges().subscribe( (dataUser: any) => {
           const user = User.fromFirebase(dataUser);
           this.user = user;
           this.store.dispatch(authAction.setUser({user}));
          });
        } else {
          this.user = null;
          this.userUnsuscription?.unsubscribe();
          this.store.dispatch(authAction.unSetUser());
          this.store.dispatch(ingresoEgresoAction.unSetitems());
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
