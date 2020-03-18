import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { GlobalState } from './../../app.reducer';
import { IngresoEgreso } from './../../models/ingreso-egreso.model';
import { Subscription } from 'rxjs';
import { IngresoEgresoService } from './../../services/ingreso-egreso.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit, OnDestroy {
  ingreUnsuscription: Subscription;
  ingresoEgresos: IngresoEgreso[];

  constructor(
    private store: Store<GlobalState>,
    private ingresoEgresoServices: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.ingreUnsuscription = this.store
      .select('ingresoEgreso')
      .subscribe(({ items }) => {
        this.ingresoEgresos = items;
      });
  }
  ngOnDestroy() {
    this.ingreUnsuscription.unsubscribe();
  }
  borrar(uid: string) {
    this.ingresoEgresoServices
      .borrarIngresoEgreso(uid)
      .then(() =>
        Swal.fire(
          'Borrado',
          'items borrado',
          'success'
        ).catch(err =>
          Swal.fire('Error', err.message, 'error')
        )
      );
  }
}
