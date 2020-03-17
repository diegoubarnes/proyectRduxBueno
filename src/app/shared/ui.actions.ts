import { createAction } from '@ngrx/store';

export const isLoading = createAction('[UI Component] IS Loading');
export const stopLoading = createAction('[UI Component] Stop isLoading');
