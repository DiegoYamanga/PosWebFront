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

export const StateResLotsDTOAction = createActionGroup({
  source: 'ResLotsDTOState',
  events: {
    'setLotsDTO': props<{ resLotsDTO : LotsDTO[] | undefined }>(),
  },
});


