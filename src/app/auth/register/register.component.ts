import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  formGroup: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', Validators.required],
      password: ['', Validators.required]
    });
  }
  crearUser() {
    if (this.formGroup.invalid) {
      return;
    }
    Swal.fire({
      title: 'Espere por favor ',
      onBeforeOpen: () => {
        Swal.showLoading( );
      },
      }
    );
    const { nombre, correo, password } = this.formGroup.value;
    this.authService
      .crearUsuario(nombre, correo, password)
      .then(credenciales => {
        console.log(credenciales);
        Swal.close();
        this.router.navigate(['/']);
      })
      .catch(err =>
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: err.message,
        }));
  }
}
