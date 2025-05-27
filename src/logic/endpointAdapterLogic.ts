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


  async cargarSaldoGiftCard(storeID: string, branchID: string, cardNumber: string, amount: number ): Promise<any> {
    const now = new Date().toISOString();

    const payload: ReqGiftCardDatosDTO = {
      serial_number: "MOBILE",            // si no tenés serial, podés usar el card_number
      card_number: cardNumber,
      identification :"",
      amount: amount,
      local_datetime: new Date().toISOString(),
      branch_id: branchID
    };
    console.log("A ver como qeudo el req-->",payload)

    return await firstValueFrom(this.httpService.cargarGiftCards(storeID, payload));
  }

  // Verificar si puede participar
  async verificarParticipacion(storeID: number, branchID: number, lotID: number, lookup: string): Promise<boolean> {    
  console.log("store: ",storeID,"branchid: ",branchID, "idLots",lotID, "DNI:",lookup);

  
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
    return await firstValueFrom(
      this.httpService.cancelarTransaccionByIdRequest(storeID, transactionID, body)
    );
  }

  async consultarSaldoGiftCard(storeID: string, numeroTarjeta: string): Promise<GiftcardDTO> {
    const response = await firstValueFrom(
      this.httpService.getGiftCard(storeID, numeroTarjeta)
    );

    const giftCard: GiftcardDTO = {
      id: response.id,
      identification: response.identification,
      points: response.points,
      cash: response.cash,
      card_number: response.card_number,
      store_id: response.store_id
    };

    return giftCard;
  }


  async descargarSaldoGiftCard(storeID: string, body: ReqGiftCardDatosDTO): Promise<any> {
    console.log("ReqGIFTCARDDATOSDESCA-->",body)
    return await firstValueFrom(
      this.httpService.descargarGiftCards(storeID, body)
    );
  }

  async crearTransaccionFidelidad(storeID: string, body: reqTransactionsFidelidad): Promise<any> {
  return await firstValueFrom(this.httpService.nuevaTransaccionFidelidad(storeID, body));
}



}

