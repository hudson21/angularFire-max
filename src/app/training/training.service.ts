import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs/Subscription';

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

    constructor(private db: AngularFirestore, private uiService: UIService) {}

    fetchAvailableExercises() {
        //valueChanges, snapshotChanges 
        this.firebaseSubscriptions.push(
            this.db
            .collection('availableExercises')
            .snapshotChanges()
            .pipe(map(docArray => {
                return docArray.map(doc => {
                    return { 
                    id: doc.payload.doc.id,
                    name: doc.payload.doc.data().name,
                    duration: doc.payload.doc.data().duration,
                    calories: doc.payload.doc.data().calories
                    }
                });
            }))
            .subscribe((exercises: Exercise[]) => {
                this.uiService.loadingStateChanged.next(false);
                this.availableExercises = exercises;
                this.exercisesChanged.next([...this.availableExercises]);
            })
        );
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({ 
            ...this.runningExercise,
            date: new Date(), 
            state: 'completed' 
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({ 
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),  
            date: new Date(), 
            state: 'cancelled' 
        });
        this.runningExercise = null;
        this.exerciseChanged.next(null);
    }
    
    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.firebaseSubscriptions.push(
            this.db
            .collection('finishedExercises')
            .valueChanges()
            .subscribe((exercises: Exercise[]) => {
                this.finishedExercisesChanged.next(exercises);
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