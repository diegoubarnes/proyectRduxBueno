import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState } from './../app.reducer';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import * as ingresoEgresoActions from '../ingreso-egreso/ingreso-egreso.acctions';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  userUnSuscription: Subscription;
  ingresoEgresoUnSuscription: Subscription;

  constructor(private store: Store<GlobalState>, private ingresoEgresoServices: IngresoEgresoService) { }

  ngOnInit(): void {
    this.userUnSuscription = this.store.select('user').pipe(filter(
      auth => auth.user !== null))
    .subscribe(({user}) => {
     this.ingresoEgresoUnSuscription = this.ingresoEgresoServices.initIngresosEgresosListener(user.uid).subscribe(
        ingresoEgresoFB => {
            this.store.dispatch(ingresoEgresoActions.setitems({items: ingresoEgresoFB}));
        }
      );
    });
  }
  ngOnDestroy() {
    this.userUnSuscription?.unsubscribe();
    this.ingresoEgresoUnSuscription?.unsubscribe();
  }

}
