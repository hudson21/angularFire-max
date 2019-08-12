import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';  
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import * as rootReducer from '../../app.reducer';

@Component({
  selector: 'app-sidenav-list',
  templateUrl: './sidenav-list.component.html',
  styleUrls: ['./sidenav-list.component.css']
})
export class SidenavListComponent {
  @Output() closeSidenav = new EventEmitter<void>();
  isAuth$: Observable<boolean>
  authSubscription: Subscription;

  constructor(private authService: AuthService, private store: Store<rootReducer.State>) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(rootReducer.getIsAuthenticated);
    /*this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });*/
  }

  onClose() {
    this.closeSidenav.emit();
  }

  onLogout() {
    this.onClose();
    this.authService.logout();
  }

  /*ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }*/
}
