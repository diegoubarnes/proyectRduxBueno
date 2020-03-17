import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import { GlobalState } from '../../app.reducer';
import { Subscription } from 'rxjs';
import * as ui from './../../shared/ui.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  cargando = false;
  uiDesuscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<GlobalState>
  ) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.uiDesuscription = this.store.select('ui').subscribe(uis => {
      this.cargando = uis.isLoading;
    });
  }
  ngOnDestroy() {
    this.uiDesuscription.unsubscribe();
  }
  crearUser() {
    if (this.formGroup.invalid) {
      return;
    }

    this.store.dispatch(ui.isLoading());

    // Swal.fire({
    //   title: 'Espere por favor ',
    //   onBeforeOpen: () => {
    //     Swal.showLoading( );
    //   },
    //   }
    // );
    const { nombre, correo, password } = this.formGroup.value;
    this.authService
      .crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);
        // Swal.close();
        this.store.dispatch(ui.stopLoading());
        this.router.navigate(['/']);
      })
      .catch(err => {
        this.store.dispatch(ui.stopLoading());
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message
        });
      });
  }
}
