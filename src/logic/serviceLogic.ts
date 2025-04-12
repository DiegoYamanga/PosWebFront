import { Store, StoreModule } from "@ngrx/store";
import { HttpService } from "../app/service/HttpService";
import { NgModule } from "@angular/core";
import { reduxReducer } from "../app/redux/reducer";

@NgModule({
    declarations: [],
    imports: [StoreModule.forRoot({ _STATE_: reduxReducer })],
    providers: [],
    bootstrap: [],
    exports: []
  })
  export class ServiceLogic {
  
    constructor(private store: Store,
      private httpService: HttpService,
    ) { }

}