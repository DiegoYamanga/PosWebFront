import { Injectable, NgModule } from "@angular/core";
import { Store, StoreModule } from "@ngrx/store";
import { reduxReducer } from "../app/redux/reducer";
import { HttpService } from "../app/service/HttpService";
import { ReqLogicDTO } from "../DTOs/ReqLoginDTO";
import { resLoginDTO } from "../DTOs/resLoginDTO";
import { firstValueFrom, map, Observable } from "rxjs";
import { ResClienteDTO } from "../DTOs/resClienteDTO";
import { LotsDTO } from "../DTOs/lotsDTO";
import { ReqGiftCardDatosDTO } from "../DTOs/reqGiftCardDatosDTO";
import { ReqParticipacionSorteoDTO } from "../DTOs/reqParticipacionSorteo";
import { ReqCancelarTransaccionByID } from "../DTOs/reqCancelarTransaccionByID";
import { GiftcardDTO } from "../DTOs/giftCardsDTO";
import { StateResLoginDTOAction } from "../app/redux/action";
import { reqTransactionsFidelidad } from "../DTOs/reqTransactionsFidelidad";
import { ResTransactionCanheDTO } from "../DTOs/resTransactionCanjeDTO";
import { ReqSwapDTO } from "../DTOs/reqSwapDTO";


// @NgModule({
//   imports: [StoreModule.forRoot({ _STATE_: reduxReducer })],
// })
@Injectable({
  providedIn: 'root'
})
export class EndpointAdapterLogic {

  private SESSION_KEY = "FIDELY_SESSION_DATA_ID:"
  private SESSION_DURATION = 30 * 24 * 60 * 60 * 1000  //Miliseconds (30 days)

  constructor(private httpService: HttpService,
    private store: Store
    ) {
  }


  public loginFinal(reqLoginDTO: ReqLogicDTO): Observable<resLoginDTO> {
    return this.httpService.login(reqLoginDTO).pipe(
      map((response) => {
        console.log("Response--->",response)
        if (response.status === 200) {
          console.log("RESPONSEEE-->",response)
          this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO : response }));
          return response as resLoginDTO;
        } else {
          throw new Error('Login incorrecto');
        }
      })
    );
  }

  async buscarCliente(storeID: string, branchID: string, documento: string): Promise<ResClienteDTO> {
    const response = await firstValueFrom(
      this.httpService.getClientInfo(storeID, branchID, documento)
    );
    console.log("response----->",response)
    return {
      datosCliente: response.client,
      tipoCliente: response.client_type
    } as ResClienteDTO;
  }

  async obtenerSortosStore(storeID: number, branchID: number): Promise<LotsDTO[]> {
    console.log("store: ",storeID,"branchid: ",branchID);
    const lots = await firstValueFrom(
      this.httpService.getStoreSorteos(storeID, branchID)
    );
    console.log("Sorteos recibidos:", lots);

    return lots as LotsDTO[];
  }


  async cargarSaldoGiftCard(storeID: string, branchID: string, cardNumber: string, amount: number): Promise<any> {
    const payload: ReqGiftCardDatosDTO = {
      serial_number: "MOBILE",
      card_number: cardNumber,
      identification: "",
      amount: amount,
      local_datetime: new Date().toISOString(),
      branch_id: branchID
    };

    try {
      return await firstValueFrom(this.httpService.cargarGiftCards(storeID, payload));
    } catch (error: any) {
      throw new Error(this.procesarError(error));
    }
  }

  // Verificar si puede participar
  async verificarParticipacion(storeID: number, branchID: number, lotID: number, lookup: string): Promise<boolean> {    
  console.log("store: ",storeID,"branchid: ",branchID, "idLots",lotID, "DNI:",lookup);

  
  try {
    const response = await firstValueFrom(
      this.httpService.getParcipante(storeID, branchID, lotID, lookup)
    );
    console.log("a ver como llega",response)
    return !!response?.can_participate;  // asumimos que el back devuelve algo así
  } catch (error) {
    console.error("Error en verificarParticipacion:", error);
    return false;
  }
}

  // Generar la participación
  async generarParticipacion(storeID: number, branchID: number, lotID: number, lookup: string, body: ReqParticipacionSorteoDTO): Promise<any> {
    console.log("store: ",storeID,"branchid: ",branchID, "idLots",lotID, "DNI:",lookup);
    console.log("reqParcipante-->",body)
    try {
      const response = await firstValueFrom(
        this.httpService.generarParticipante(storeID, branchID, lotID, lookup, body)
      );
      return response;
    } catch (error) {
      console.error("Error en generarParticipacion:", error);
      throw error;
    }
  }

  async anularTransaccion(storeID: string, transactionID: string, body: ReqCancelarTransaccionByID): Promise<any> {
    try {
      return await firstValueFrom(this.httpService.cancelarTransaccionByIdRequest(storeID, transactionID, body));
    } catch (error: any) {
      throw new Error(this.procesarError(error));
    }
  }

  public async consultarSaldoGiftCard(storeID: string, cardNumber: string): Promise<GiftcardDTO> {
    try {
      const response = await firstValueFrom(
        this.httpService.getGiftCard(storeID, cardNumber)
      );

      // Validamos que la respuesta tenga los campos esperados
      if (!response || !response.card_number) {
        throw { status: 404, error: 'Giftcard no encontrada' };
      }

      return response;
    } catch (error: any) {
      if (error?.status === 0) {
        throw { status: 0, error: 'Error de conexión con el servidor' };
      }

      if (typeof error?.error === 'string') {
        throw { status: error.status, error: error.error };
      }

      if (error?.error?.message) {
        throw { status: error.status, error: error.error.message };
      }

      throw { status: 500, error: 'Error inesperado al consultar la giftcard' };
    }
  }


  async descargarSaldoGiftCard(storeID: string, body: ReqGiftCardDatosDTO): Promise<any> {
    try {
      return await firstValueFrom(this.httpService.descargarGiftCards(storeID, body));
    } catch (error: any) {
      throw new Error(this.procesarError(error));
    }
  }

  async crearTransaccionFidelidad(storeID: string, body: reqTransactionsFidelidad): Promise<any> {
    try {
      return await firstValueFrom(this.httpService.nuevaTransaccionFidelidad(storeID, body));
    } catch (error: any) {
      throw new Error(this.procesarError(error));
    }
  }

  private procesarError(error: any): string {
    if (error?.status === 0 || error?.status >= 500) {
      return "Error de conectividad. Intente nuevamente más tarde.";
    }
    if (typeof error?.error === 'string') {
      return error.error;
    }
    return "Ocurrió un error inesperado.";
  }

async crearTransaccionSwap(storeID: string, body: ReqSwapDTO): Promise<ResTransactionCanheDTO> {
  try {
    const response = await firstValueFrom(this.httpService.transaccionConCanjeDePuntos(storeID, body));
    return response as ResTransactionCanheDTO;
  } catch (error: any) {
    console.error("❌ Error en crearTransaccionSwap:", error);
    throw new Error(this.procesarError(error));
  }
}





}

