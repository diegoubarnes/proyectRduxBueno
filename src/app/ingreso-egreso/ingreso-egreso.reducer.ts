import { createReducer, on } from '@ngrx/store';
import { setitems, unSetitems } from './ingreso-egreso.acctions';
import { IngresoEgreso } from './../models/ingreso-egreso.model';
import { GlobalState } from '../app.reducer';

export interface State {
    items: IngresoEgreso[];
}

export interface AppStateWithIngreso extends GlobalState {
    ingresoEgreso: State;
}
export const initialState: State = {
   items: [],
}

const _ingresoEgresoReducer = createReducer(initialState,

    on(setitems, (state, {items}) => ({ ...state, items: [...items]})),
    on(unSetitems, state => ({ ...state, items: []})),

);

export function ingresoEgresoReducer(state, action) {
    return _ingresoEgresoReducer(state, action);
}