import { Component, OnInit, EventEmitter, Output, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';  
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthService } from 'src/app/auth/auth.service';
import * as rootReducer from '../../app.reducer';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() sidenavToggle = new EventEmitter<void>();
  isAuth$: Observable<boolean>;
  authSubscription: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<rootReducer.State>
  ) { }

  ngOnInit() {
    this.isAuth$ = this.store.select(rootReducer.getIsAuthenticated);
    /*this.authSubscription = this.authService.authChange.subscribe(authStatus => {
      this.isAuth = authStatus;
    });*/
  }

  onToggleSidenav() {
    //Here we are emitting an event
    this.sidenavToggle.emit();
  }

  onLogout() {
    this.authService.logout();
  }

  /*ngOnDestroy() {
    this.authSubscription.unsubscribe();
  }*/
}
