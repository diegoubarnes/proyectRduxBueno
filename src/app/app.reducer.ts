import { ActionReducerMap } from '@ngrx/store';
import * as ui from './shared/ui.reducer';
import * as auth from './auth/auth.reducer';


export interface GlobalState {
   ui: ui.State;
   user: auth.State;
}



export const appReducers: ActionReducerMap<GlobalState> = {
   ui: ui.uiReducer,
   user: auth.authReducer
}