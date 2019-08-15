import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { TrainingService } from './training.service';
import * as trainingReducer from '../training/training.reducer';


@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit {
  //ongoinTraining = false;
  ongoingTraining$: Observable<boolean>;
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService, private store: Store<trainingReducer.State>) { }

  ngOnInit() {
    /*this.exerciseSubscription = this.trainingService.exerciseChanged.subscribe(exercise => {
      if (exercise) {
        this.ongoinTraining = true;
      } else {
        this.ongoinTraining = false;
      }
    });*/
    this.ongoingTraining$ = this.store.select(trainingReducer.getIsTraining);
  }

  /*ngOnDestroy() {
    if (this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }*/

}
