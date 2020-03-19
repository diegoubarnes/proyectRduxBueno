import { Injectable } from '@angular/core';
import { CanActivate, Router, CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tap, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanLoad {

  constructor(private authServices: AuthService, private router: Router) {  }

  canLoad() {
    return this.authServices.isAuth()
              .pipe(
                take(1)
              );
  }
  canActivate(): Observable<boolean> {
    return this.authServices.isAuth(). pipe(
      tap(estado => {
        if (!estado) {
          this.router.navigate(['/login']);
        }
      })
    );
  }

}
