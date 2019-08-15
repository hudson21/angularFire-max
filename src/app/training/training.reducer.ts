import { Action, createFeatureSelector, createSelector } from '@ngrx/store';

import { START_TRAINING, STOP_TRAINING } from './training.actions';
import { Exercise } from './exercise.model';
import * as rootReducer from '../app.reducer';
import { 
    TrainingActions, 
    SET_AVALILABLE_TRAININGS, 
    SET_FINISHED_TRAININGS, 
    SetFinishedTrainings, 
    SetAvailableTrainings 
} from './training.actions';

export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
}

//This is the new appState(global) if the lazy module of training is loaded
export interface State extends rootReducer.State {
    training: TrainingState;
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
    switch(action.type) {
        case SET_AVALILABLE_TRAININGS:
            return {
                ...state,
                availableExercises: action.payload
            };
        case SET_FINISHED_TRAININGS:
            return {
                ...state,
                finishedExercises: action.payload
            };
        case START_TRAINING:
            return {
                ...state,
                activeTraining: { ...state.availableExercises.find(ex => ex.id === action.payload) }
            };
        case STOP_TRAINING:
            return {
                ...state,
                activeTraining: null
            };    
        default:
            return state;
    }
};



export const getTrainingState = createFeatureSelector<TrainingState>('training');


export const getAvailableExercises = createSelector(getTrainingState, (state: TrainingState) => state.availableExercises);
export const getFinishedExercises = createSelector(getTrainingState, (state: TrainingState) => state.finishedExercises);
export const getActiveTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining);
export const getIsTraining = createSelector(getTrainingState, (state: TrainingState) => state.activeTraining != null);
