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
    branchID = 43;
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
      identification :"34058686",
      amount: amount,
      local_datetime: "",
      branch_id: branchID
    };
    console.log("A ver como qeudo el req-->",payload)

    return await firstValueFrom(this.httpService.cargarGiftCards(storeID, payload));
  }

  // Verificar si puede participar
async verificarParticipacion(storeID: number, branchID: number, lotID: number, lookup: string): Promise<boolean> {
  branchID = 43;    
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
  branchID = 43;
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




}

