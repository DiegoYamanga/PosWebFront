import { Store, StoreModule } from "@ngrx/store";
import { HttpService } from "../app/service/HttpService";
import { Injectable, NgModule } from "@angular/core";
import { reduxReducer } from "../app/redux/reducer";
import { ReqLogicDTO } from "../DTOs/ReqLoginDTO";
import { EndpointAdapterLogic } from "./endpointAdapterLogic";
import { ResClienteDTO } from "../DTOs/resClienteDTO";

@NgModule({
    declarations: [],
    imports: [StoreModule.forRoot({ _STATE_: reduxReducer })],
    providers: [],
    bootstrap: [],
    exports: []
  })
  export class ServiceLogic {


    private cliente: ResClienteDTO | null = null;
  
    constructor(private store: Store,
      private httpService: HttpService,
      private endPointAdapterLogic : EndpointAdapterLogic
    ) { }


    public async buttonLogin(reqLogin : ReqLogicDTO): Promise<any> {
      // Login
      let loginSucces = await this.endPointAdapterLogic.loginFinal(reqLogin);
      console.log("LoginSucces: ", );
      if (!loginSucces) {
        return false;
      }
    }


    public setCliente(cliente: ResClienteDTO) {
      this.cliente = cliente;
    }
  
    public getCliente(): ResClienteDTO | null {
      return this.cliente;
    }
  
    public clear() {
      this.cliente = null;
    }





}
