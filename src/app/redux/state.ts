import { EncuestaDTO } from "../../DTOs/encuestaDTO";
import { LotsDTO } from "../../DTOs/lotsDTO";
import { ResClienteDTO } from "../../DTOs/resClienteDTO";
import { resLoginDTO } from "../../DTOs/resLoginDTO";


export interface AppState {


    resLoginDTO: resLoginDTO | undefined;

    resClienteDTO : ResClienteDTO | undefined;

    tipoCanje: 'IMPORTE' | 'PUNTOS' | null;

    origenOperacion: 'CANJE' | 'COMPRA' | null;

    giftCardOperacion: 'COMPRA' | 'CARGAR_SALDO' | 'ANULACION' | 'CONSULTAR_SALDO' | null;

    montoGiftCard: number | null;

    reslotsDTO: LotsDTO[] | undefined;

    encuestasDisponibles: EncuestaDTO[] | null;

    generarNumeroTicket: boolean;

    fromComponent: string | null;

}