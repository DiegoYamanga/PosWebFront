import { createReducer, on, State } from '@ngrx/store';
import { StateGiftCardOperacionAction, StateMontoGiftCardAction, StateOrigenOperacionAction, StateResClienteDTOAction, StateResLoginDTOAction, StateResLotsDTOAction, StateTipoCanjeAction } from './action';

import { AppState } from './state';


export const initialState: AppState = {
  resLoginDTO: undefined,
  resClienteDTO : undefined,
  tipoCanje: null,
  origenOperacion: null,
  giftCardOperacion: null,
  montoGiftCard: null,
  reslotsDTO: undefined,




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
  on(StateTipoCanjeAction.setTipoCanje, (state, { tipoCanje }) => ({
  ...state,
  tipoCanje: tipoCanje
  })),
  on(StateOrigenOperacionAction.setOrigenOperacion, (state, { origen }) => ({
  ...state,
  origenOperacion: origen
  })),
  on(StateGiftCardOperacionAction.setGiftCardOperacion, (state, { operacion }) => ({
  ...state,
  giftCardOperacion: operacion
  })),
  on(StateMontoGiftCardAction.setMontoGiftCard, (state, { monto }) => ({
  ...state,
  montoGiftCard: monto
  })),
  on(StateResLotsDTOAction.setLotsDTO, (state, { reslotsDTO }) => ({
  ...state,
  reslotsDTO: reslotsDTO
  }))



);
