import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { IngresoEgresoService } from './../services/ingreso-egreso.service';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { GlobalState } from './../app.reducer';
import * as ui from '../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styleUrls: ['./ingreso-egreso.component.css']
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  ingresoForm: FormGroup;
  tipo = 'ingreso';
  cargando = false;
  uiUnsuscription: Subscription;


  constructor(
    private fb: FormBuilder,
    private ingresoEgresoServices: IngresoEgresoService,
    private store: Store<GlobalState>
  ) {}

  ngOnInit(): void {
    this.uiUnsuscription = this.store.select('ui').subscribe(({ isLoading }) => {
      this.cargando = isLoading;
    });
    this.ingresoForm = this.fb.group({
      descripcion: ['', Validators.required],
      monto: ['', Validators.required]
    });
  }
  ngOnDestroy() {
    this.uiUnsuscription.unsubscribe();
  }
  guardar() {
    if (this.ingresoForm.invalid) {
      return;
    }
    this.store.dispatch(ui.isLoading());
    const { descripcion, monto } = this.ingresoForm.value;
    const ingresoEgreso = new IngresoEgreso(descripcion, monto, this.tipo);
    this.ingresoEgresoServices
      .crearIngresoEgreso(ingresoEgreso)
      .then(() => {
        this.ingresoForm.reset();
        Swal.fire('Registro creado', descripcion, 'success');
        this.store.dispatch(ui.stopLoading());
      })
      .catch(err => {
        Swal.fire('Error', err.message, 'error'),
          this.store.dispatch(ui.isLoading());
      });
  }
}
