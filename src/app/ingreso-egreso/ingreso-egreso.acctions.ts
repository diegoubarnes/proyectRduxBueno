import { createAction, props } from '@ngrx/store';
import { IngresoEgreso } from './../models/ingreso-egreso.model';

export const unSetitems = createAction('[Ingreso-Egreso] unSet items');
export const setitems = createAction(
    '[Ingreso-Egreso] Set items',
    props<{items: IngresoEgreso[]  }>()
    );
