import { Action } from '@ngrx/store';

import { START_TRAINING, STOP_TRAINING } from './training.actions';
import { Exercise } from './exercise.model';
import * as appReducer from '../app.reducer';
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
export interface State extends appReducer.State {
    training: TrainingState;
}

const initialState: TrainingState = {
    availableExercises: [],
    finishedExercises: [],
    activeTraining: null
};

export function authReducer(state = initialState, action: TrainingActions) {
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
                activeTraining: action.payload
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

export const getAvailableExercises = (state: TrainingState) => state.availableExercises;
export const finishedExercises = (state: TrainingState) => state.finishedExercises;
export const getActiveTraining = (state: TrainingState) => state.activeTraining;