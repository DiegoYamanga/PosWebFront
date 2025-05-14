import { LotsDTO } from "../../DTOs/lotsDTO";
import { ResClienteDTO } from "../../DTOs/resClienteDTO";
import { resLoginDTO } from "../../DTOs/resLoginDTO";


export interface AppState {


    resLoginDTO: resLoginDTO | undefined;

    resClienteDTO : ResClienteDTO | undefined;

    reslotsDTO: LotsDTO[] | undefined;


}