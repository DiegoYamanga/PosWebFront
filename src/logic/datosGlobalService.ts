import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { SessionLogic } from "./sessionLogic";
import { map, Observable } from "rxjs";
import { AppSelectors } from "../app/redux/selectors";

@Injectable({ providedIn: 'root' })
export class DatosGlobalService {
  constructor(private store: Store, private sessionLogic: SessionLogic) {}

  getStoreAndBranch(): Observable<{ storeID: string, branchID: string } | null> {
    return this.store.select(AppSelectors.selectResLoginDTO).pipe(
      map(res => {
        if (res?.store && res?.branch) {
          return {
            storeID: res.store.id.toString(),
            branchID: res.branch.id.toString()
          };
        }
        const fallback = this.sessionLogic.getStoreAndBranch();
        return fallback;
      })
    );
  }
}
 