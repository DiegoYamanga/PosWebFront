import { createReducer, on, State } from '@ngrx/store';
import { StateResClienteDTOAction, StateResLoginDTOAction, StateResLotsDTOAction } from './action';

import { AppState } from './state';


export const initialState: AppState = {
  resLoginDTO: undefined,
  resClienteDTO : undefined,
  reslotsDTO : undefined
};



export const reduxReducer = createReducer(
  initialState,
  on(StateResLoginDTOAction.setResLoginDTO, (state, { resLoginDTO }) => ({
    ...state,
    resLoginDTO: resLoginDTO
  })),
  on(StateResClienteDTOAction.setClienteDTO, (state, { resClienteDTO }) => ({
    ...state,
    resClienteDTO: resClienteDTO
  })),
  on(StateResLotsDTOAction.setLotsDTO, (state, { resLotsDTO }) => ({
    ...state,
    reslotsDTO: resLotsDTO  // ✅ nombre de la propiedad debe coincidir con el estado
  }))
);
