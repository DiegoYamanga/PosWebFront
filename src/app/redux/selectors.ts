import { createSelector, createFeatureSelector } from '@ngrx/store';
import { AppState } from './state';
import { LotsDTO } from '../../DTOs/lotsDTO';

export const selectStateModule = createFeatureSelector<AppState>('_STATE_');

const selectState = createSelector(
  selectStateModule, (state) => state
)

const selectResLoginDTO = createSelector(
  selectStateModule,
  (state) => state.resLoginDTO
)

const selectResClienteDTO = createSelector(
  selectStateModule,
  (state) => state.resClienteDTO
)

const selectResLotsDTO = createSelector(
  selectStateModule,
  (state) => state.reslotsDTO
);

export const AppSelectors = {
  selectState,
  selectResLoginDTO,
  selectResClienteDTO,
  selectResLotsDTO
}