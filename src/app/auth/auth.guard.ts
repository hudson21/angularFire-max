import { Injectable } from '@angular/core';
import { 
    CanActivate, 
    ActivatedRouteSnapshot, 
    RouterStateSnapshot, 
    Router, 
    CanLoad,
    Route
} from '@angular/router';
import { Store } from '@ngrx/store';
import { take } from 'rxjs/operators';


import { AuthService } from './auth.service';
import * as rootReducer from '../app.reducer';

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(
    //private authService: AuthService 
    private store: Store<rootReducer.State>, 
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    /*if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }*/
    //We want to finish the method after taking the first value
    return this.store.select(rootReducer.getIsAuthenticated).pipe(take(1));
  }

  canLoad(route: Route) {
    /*if (this.authService.isAuth()) {
      return true;
    } else {
      this.router.navigate(['/login']);
    }*/
    //We want to finish the method after taking the first value
    return this.store.select(rootReducer.getIsAuthenticated).pipe(take(1));
  }
}
