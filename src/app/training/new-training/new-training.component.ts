import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription'
import { map } from 'rxjs/operators';

import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { UIService } from 'src/app/shared/ui.service';
import * as trainingReducer from '../training.reducer';
import * as rootReducer from '../../app.reducer';


@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit {
  exercises$: Observable<Exercise[]>;
  isLoading$: Observable<boolean>;
  //exerciseSubscription: Subscription;
  
  //private loadingSubs: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<trainingReducer.State>
  ) { }

  ngOnInit() { 
    this.isLoading$ = this.store.select(rootReducer.getIsLoading);
    /*this.uiService.loadingStateChanged.subscribe(isLoading => {
      this.isLoading = isLoading;
    })*/
    /*this.exerciseSubscription = this.trainingService.exercisesChanged
    .subscribe(exercises => this.exercises = exercises);*/
    this.exercises$ = this.store.select(trainingReducer.getAvailableExercises);
    this.fetchExercises();
  }
  
  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  } 

  /*ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }*/
}
