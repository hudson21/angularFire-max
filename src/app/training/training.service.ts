import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { map, take } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';
import { Store } from '@ngrx/store';
import * as trainingReducer from './training.reducer'; 
import * as UI from '../shared/ui.actions';
import * as Training from '../training/training.actions';

import { Exercise } from './exercise.model';
import { AngularFirestore } from 'angularfire2/firestore';
import { UIService } from '../shared/ui.service';


@Injectable()
export class TrainingService {
    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();
    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private firebaseSubscriptions: Subscription[] = []; 

    constructor(
        private db: AngularFirestore, 
        private uiService: UIService, 
        private store: Store<trainingReducer.State>
    ) {}

    fetchAvailableExercises() {
        //valueChanges, snapshotChanges 
        this.firebaseSubscriptions.push(
            this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map((doc: any) => {
                    return { 
                    id: doc.payload.doc.id,
                    name: doc.payload.doc.data().name,
                    duration: doc.payload.doc.data().duration,
                    calories: doc.payload.doc.data().calories
                    }
                });
            }))
            .subscribe((exercises: Exercise[]) => {
                this.store.dispatch(new UI.StopLoading());
                this.store.dispatch(new Training.SetAvailableTrainings(exercises));
                //this.uiService.loadingStateChanged.next(false);
                //this.availableExercises = exercises;
                //this.exercisesChanged.next([...this.availableExercises]);

            }, error => {
                this.store.dispatch(new UI.StopLoading());
                //this.uiService.loadingStateChanged.next(false);
                //this.uiService.showSnackBar('Fetching Exercises failed, please try again later', null, 3000);
                //this.exercisesChanged.next(null);
            })
        );
    }

    startExercise(selectedId: string) {
        //this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        //this.exerciseChanged.next({ ...this.runningExercise });
        this.store.dispatch(new Training.StartTraining(selectedId));
      }

    completeExercise() {
        this.store.select(trainingReducer.getActiveTraining).pipe(take(1)).subscribe(exercise => {
            this.addDataToDatabase({ 
                ...exercise,
                date: new Date(), 
                state: 'completed' 
            });
            //this.runningExercise = null;
            //this.exerciseChanged.next(null);
            this.store.dispatch(new Training.StopTraining());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(trainingReducer.getActiveTraining).pipe(take(1)).subscribe(exercise => {
            this.addDataToDatabase({ 
                ...exercise,
                duration: exercise.duration * (progress / 100),
                calories: exercise.calories * (progress / 100),  
                date: new Date(), 
                state: 'cancelled' 
            });
            //this.runningExercise = null;
            //this.exerciseChanged.next(null);
            this.store.dispatch(new Training.StopTraining());
        });
    }
    
    /*getRunningExercise() {
        return { ...this.runningExercise };
    }*/

    fetchCompletedOrCancelledExercises() {
        this.firebaseSubscriptions.push(
            this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                //this.finishedExercisesChanged.next(exercises);
                this.store.dispatch(new Training.SetFinishedTrainings(exercises));
            })
        );
    }

    cancelSubscriptions() {
        this.firebaseSubscriptions.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}