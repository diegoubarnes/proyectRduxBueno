import { Injectable } from '@angular/core';
import 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/firestore';
import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class IngresoEgresoService {
  constructor(
    private fireStore: AngularFirestore,
    private authServices: AuthService
  ) {}

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const uid = this.authServices.usuario.uid;
    delete ingresoEgreso.uid;
    return this.fireStore
      .doc(`${uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }
  initIngresosEgresosListener(uid: string) {
    return this.fireStore
      .collection(`${uid}/ingresos-egresos/items`)
      .snapshotChanges()
      .pipe(
        map(snapShot => {
            return snapShot.map( doc => {
              return {
                  uid: doc.payload.doc.id,
                  ... doc.payload.doc.data() as any
              };
            });
        })
      );
  }
  borrarIngresoEgreso(uidItems: string) {
    const uid = this.authServices.usuario.uid;
    return this.fireStore.doc(`${uid}/ingresos-egresos/items/${uidItems}`).delete();
  }
}
