import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GlobalState } from './../../app.reducer';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  perfil: string;

  constructor(private auth: AuthService, private router: Router, private store: Store<GlobalState>) { }

  ngOnInit(): void {
    this.store.select('user')
    .pipe(
      filter(({user}) => user != null)
    )
    .subscribe( ({user}) => {
        this.perfil = user.nombre;
    });
  }
  salir() {
      this.auth.loggout().then( ( ) => {
        this.router.navigate(['/login']);
      });
  }
}
