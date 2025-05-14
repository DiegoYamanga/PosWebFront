import { Injectable, NgModule } from "@angular/core";
import { Store, StoreModule } from "@ngrx/store";
import { reduxReducer } from "../app/redux/reducer";
import { HttpService } from "../app/service/HttpService";
import { ReqLogicDTO } from "../DTOs/ReqLoginDTO";
import { resLoginDTO } from "../DTOs/resLoginDTO";
import { firstValueFrom, map, Observable } from "rxjs";
import { ResClienteDTO } from "../DTOs/resClienteDTO";
import { LotsDTO } from "../DTOs/lotsDTO";


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
  const lots = await firstValueFrom(
    this.httpService.getStoreSorteos(storeID,branchID )
  );
  console.log("Sorteos recibidos:", lots);

  return lots as LotsDTO[];
}


}

