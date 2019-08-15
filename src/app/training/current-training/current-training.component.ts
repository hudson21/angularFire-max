import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Store } from '@ngrx/store';
import { Exercise } from '../exercise.model';

import { StopTrainingComponent } from './stop-training.component';
import { TrainingService } from '../training.service';
import * as trainingReducer from '../training.reducer';


@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css']
})
export class CurrentTrainingComponent implements OnInit {
  progress = 0;
  timer: number;

  constructor(
    private dialog: MatDialog, 
    private trainingService: TrainingService,
    private store: Store<trainingReducer.State>
  ) { }

  ngOnInit() {
    this.startOrResumeTimer();
  }

  startOrResumeTimer() {
    this.store.select(trainingReducer.getActiveTraining).subscribe((exercise: Exercise) => {
      const step = exercise.duration / 100 * 1000;
      this.timer = setInterval(() => {  
        this.progress += 1;
        if (this.progress >= 100) {
          this.trainingService.completeExercise();
          clearInterval(this.timer);
        }
      }, step);
    });
  }

  onStop() {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    //Here we are using an observable
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }
}
