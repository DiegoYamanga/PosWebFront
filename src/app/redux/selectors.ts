import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from './state';

export const selectStateModule = createFeatureSelector<AppState>('_STATE_');

const selectState = createSelector(
  selectStateModule, (state) => state
)

const selectComercio = createSelector(
  selectStateModule,
  (state) => state.comercio
)


export const AppSelectors = {
  selectState,
  selectComercio
}