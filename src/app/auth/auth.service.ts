import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

import { User } from './user.model';
import { AuthData } from './auth-data.model';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

//Inject a service into another service
@Injectable()
export class AuthService {
    authChange = new Subject<boolean>();
    private isAuthenticated = false;

    constructor(
        private router: Router, 
        private angularFireAuth: AngularFireAuth,
        private trainingService: TrainingService,
        private uiService: UIService
    ) {}

    initAuthListener() {
        //This method will be triggered if there is a change from authenticated to no authenticated and viceversa
        this.angularFireAuth.authState.subscribe(user => {
            if (user) {
                this.isAuthenticated = true;
                this.authChange.next(true);
                this.router.navigate(['/training']);
            } else {
                this.isAuthenticated = false;
                this.authChange.next(false);
                this.router.navigate(['/login']);
                this.trainingService.cancelSubscriptions();
            }
        });
    }

    registerUser(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.angularFireAuth.auth.createUserWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uiService.loadingStateChanged.next(false);
            console.log(result);
        })
        .catch(err => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar(err.message, null, 5000);
        });
    }

    login(authData: AuthData) {
        this.uiService.loadingStateChanged.next(true);
        this.angularFireAuth.auth.signInWithEmailAndPassword(authData.email, authData.password)
        .then(result => {
            this.uiService.loadingStateChanged.next(false);
        })
        .catch(err => {
            this.uiService.loadingStateChanged.next(false);
            this.uiService.showSnackBar(err.message, null, 5000);
        });
    }

    logout() {
        this.angularFireAuth.auth.signOut();
    }

    isAuth() {
        return this.isAuthenticated;
    }
}