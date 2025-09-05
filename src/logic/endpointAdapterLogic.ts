import { Injectable, NgModule } from "@angular/core";
import { Store, StoreModule } from "@ngrx/store";
import { reduxReducer } from "../app/redux/reducer";
import { HttpService } from "../app/service/HttpService";
import { ReqLogicDTO } from "../DTOs/ReqLoginDTO";
import { resLoginDTO } from "../DTOs/resLoginDTO";
import { firstValueFrom, map, Observable, switchMap } from "rxjs";
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
import { EncuestaDTO } from "../DTOs/encuestaDTO";
import { RespuestaEncuestaDTO } from "../DTOs/RespuestaEncuestaDTO";
import { ResEncuestaRespuesta } from "../DTOs/resEncuestaRespuesta";
import { EncuestaPreguntas } from "../DTOs/encuestaPreguntas";
import { SessionLogic } from "./sessionLogic";
import { HttpClient } from "@angular/common/http";


// @NgModule({
//   imports: [StoreModule.forRoot({ _STATE_: reduxReducer })],
// })
@Injectable({
  providedIn: 'root'
})
export class EndpointAdapterLogic {

  private SESSION_KEY = "FIDELY_SESSION_DATA_ID:"
  private SESSION_DURATION = 30 * 24 * 60 * 60 * 1000

  constructor(private httpService: HttpService,
    private store: Store,
    private sesionLogic : SessionLogic,
    private http :  HttpClient
    ) {
  }

// DESCOMENTAR CUANDO SE HAGA EL CAMBIO DESDE FIDELI DEL ENDPOINT
public loginFinal(reqLoginDTO: ReqLogicDTO): Observable<resLoginDTO> {
    let isStore = false;
  return this.httpService.login(reqLoginDTO).pipe(
    switchMap((response) => {

      if (response.status === 200) {
        const storeID = response.store.id;
        if(response.branch == null){
          isStore = true;
        }

        return this.httpService.getBranches(storeID).pipe(
          map((datoFaltante) => {

            let responseFinal: resLoginDTO = {
              ...response
            };
            //Agrego el array de branches al resLoginDTO para seleccionar la que quiera en caso de traer branch = null
            responseFinal.branches = datoFaltante;
            responseFinal.isStore = isStore;

            this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: responseFinal }));

            return responseFinal;
          })
        );
      } else {
        throw new Error('Login incorrecto');
      }
    })
  );
}


//   public loginFinal(reqLoginDTO: ReqLogicDTO): Observable<resLoginDTO> {
//     const usuario = reqLoginDTO.user?.toLowerCase() ?? '';
//     //Eliminar una vez que este la logica real
//     if (usuario === 'preta') {
//         return this.http.get<resLoginDTO>('assets/mocks/preta.json').pipe(
//             map((response) => {
//                 console.log("Mock Response PRETA --->", response);
//                 if (response.status === 200) {
//                     this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: response }));
//                     return response as resLoginDTO;
//                 } else {
//                     throw new Error('Login incorrecto');
//                 }
//             })
//         );
//     }

//     if (usuario === 'mardelplata') {
//         return this.http.get<resLoginDTO>('assets/mocks/mardelplata.json').pipe(
//             map((response) => {
//                 console.log("Mock Response MARDELPLATA --->", response);
//                 if (response.status === 200) {
//                     this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: response }));
//                     return response as resLoginDTO;
//                 } else {
//                     throw new Error('Login incorrecto');
//                 }
//             })
//         );
//     }

//     //Backend real
//     return this.httpService.login(reqLoginDTO).pipe(
//         map((response) => {
//             console.log("Response (real backend) --->", response);
//             if (response.status === 200) {
//                 this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: response }));
//                 return response as resLoginDTO;
//             } else {
//                 throw new Error('Login incorrecto');
//             }
//         })
//     );
// }


  async buscarCliente(storeID: string, branchID: string, documento: string): Promise<ResClienteDTO> {
    const response = await firstValueFrom(
      this.httpService.getClientInfo(storeID, branchID, documento)
    );
    return {
      datosCliente: response.client,
      tipoCliente: response.client_type
    } as ResClienteDTO;
  }

  async obtenerSortosStore(storeID: number, branchID: number): Promise<LotsDTO[]> {
    const lots = await firstValueFrom(
      this.httpService.getStoreSorteos(storeID, branchID)
    );
    return lots as LotsDTO[];
  }


  async cargarSaldoGiftCard(storeID: string, branchID: string, cardNumber: string, amount: number): Promise<any> {
    const payload: ReqGiftCardDatosDTO = {
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
  try {
    const response = await firstValueFrom(
      this.httpService.getParcipante(storeID, branchID, lotID, lookup)
    );
    return !!response?.can_participate;  // asumimos que el back devuelve algo así
  } catch (error) {
    console.error("Error en verificarParticipacion:", error);
    return false;
  }
}

  // Generar la participación
  async generarParticipacion(storeID: number, branchID: number, lotID: number, lookup: string, body: ReqParticipacionSorteoDTO): Promise<any> {
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
    return await firstValueFrom(this.httpService.nuevaTransaccionFidelidad(storeID, body));
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

  public getEncuestasSucursal(storeID: number, branchID: number): Observable<EncuestaDTO[]> {
    return this.httpService.getEncuestasSucursal(storeID, branchID);
  }



  public obtenerPreguntasEncuesta(
    storeID: string,
    branchID: string,
    pollID: string
  ): Observable<EncuestaPreguntas[]> {
    return this.httpService.obtenerPreguntasEncuesta(storeID, branchID, pollID);
  }



  public responderEncuesta(
    storeID: number,
    branchID: number,
    pollID: number,
    preguntaID: number,
    respuesta: RespuestaEncuestaDTO
  ): Observable<ResEncuestaRespuesta> {
    return this.httpService.responderPreguntaEncuesta(
      storeID.toString(),
      branchID.toString(),
      pollID.toString(),
      preguntaID.toString(),
      respuesta
    );
  }

  buscarTransacciones(storeID: string, id: string): Observable<ResTransactionCanheDTO[]> {
  return this.httpService.buscarTransaccionByDNIoTarjeta(storeID, id);
  }



}

