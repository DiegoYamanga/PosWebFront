import { createAction, createActionGroup, props } from '@ngrx/store';
import { resLoginDTO } from '../../DTOs/resLoginDTO';
import { ResClienteDTO } from '../../DTOs/resClienteDTO';
import { LotsDTO } from '../../DTOs/lotsDTO';


export const StateResLoginDTOAction = createActionGroup({
  source: 'ResLoginDTOState',
  events: {
    'setResLoginDTO': props<{ resLoginDTO: resLoginDTO }>(),
  },
});

export const StateResClienteDTOAction = createActionGroup({
  source: 'ResClienteDTOState',
  events: {
    'setClienteDTO': props<{ resClienteDTO : ResClienteDTO }>(),
  },
});


export const StateTipoCanjeAction = createActionGroup({
  source: 'TipoCanjeState',
  events: {
    'setTipoCanje': props<{ tipoCanje: 'IMPORTE' | 'PUNTOS' }>(),
  },
});

export const StateOrigenOperacionAction = createActionGroup({
  source: 'OrigenOperacionState',
  events: {
    'setOrigenOperacion': props<{ origen: 'CANJE' | 'COMPRA' }>()
  }
});

export const StateGiftCardOperacionAction = createActionGroup({
  source: 'GiftCardOperacionState',
  events: {
    'setGiftCardOperacion': props<{ operacion: 'COMPRA' | 'CARGAR_SALDO' | 'ANULACION' | 'CONSULTAR_SALDO' }>()
  }
});

export const StateMontoGiftCardAction = createActionGroup({
  source: 'MontoGiftCardState',
  events: {
    'setMontoGiftCard': props<{ monto: number | null}>()
  }
});

export const StateResLotsDTOAction = createActionGroup({
  source: 'ResLotsDTOState',
  events: {
    'setLotsDTO': props<{ reslotsDTO: LotsDTO[] | undefined }>(),
  },
});






