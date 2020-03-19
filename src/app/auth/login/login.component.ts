import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Store } from '@ngrx/store';
import {GlobalState } from './../../app.reducer';
import * as ui from './../../shared/ui.actions';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  cargando = false;
  uiDesuscription: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store<GlobalState>,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.uiDesuscription = this.store.select('ui').subscribe(uis => {
      this.cargando = uis.isLoading;
    });
  }
  ngOnDestroy() {
    this.uiDesuscription.unsubscribe();
  }
  loginUser() {
    if (this.loginForm.invalid) {
      return;
    }
    this.store.dispatch(ui.isLoading());

    const { email, password } = this.loginForm.value;
    this.authService
      .loginUsuario(email, password)
      .then(datosLogin => {
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
