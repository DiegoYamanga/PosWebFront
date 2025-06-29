import { Injectable } from '@angular/core';
import { StoreDTO } from '../DTOs/storeDTO';
import { BranchDTO } from '../DTOs/brachDTO';
import { StateResLoginDTOAction } from '../app/redux/action';
import { NavigationService } from './navigationService';
import { Store } from '@ngrx/store';
import { EndpointAdapterLogic } from './endpointAdapterLogic';
import { ServiceLogic } from './serviceLogic';

@Injectable({
  providedIn: 'root',
})
export class SessionLogic {
  private token: string | null = null;
  private userData: any = null;
  private allowNumberTicket: boolean | null = false;


  constructor(
      private navigation: NavigationService,
      private store: Store
  ) {
      const userData = this.getUserData();
      const token = this.getToken();

      if (userData && token) {
          this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: userData }));
      }
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }


  setLoginData(token: string, userData: any): void {
    this.token = token;
    this.userData = userData;
    console.log("Como viene del back el dato user ticket--->",userData.allow_ticket_number)
    this.allowNumberTicket = userData.allow_ticket_number ?? null;
    if(this.isBrowser()){
    localStorage.setItem("TOKEN", token);
    localStorage.setItem("USER_DATA", JSON.stringify(userData));
    localStorage.setItem("ALLOW_NUMBER_TICKET", JSON.stringify(this.allowNumberTicket));
    }
  }

  getToken(): string | null {
    if(this.isBrowser()){
      return this.token ?? localStorage.getItem("TOKEN");
    }
    return null;  
  }


  getUserData(): any {
    if(this.isBrowser()){
      return this.userData ?? JSON.parse(localStorage.getItem("USER_DATA") || 'null');
    }
    return null;
  }

  getStoreDTO(): StoreDTO | undefined {
    return this.getUserData()?.store;
  }

  getBranch(): BranchDTO | undefined {
    return this.getUserData()?.branch;
  }

  getPedirNumeroTicket(): number {
      console.log("APEEEEEER------->", this.getUserData()?.store.allow_ticket_number);
      return this.getUserData()?.store.allow_ticket_number ?? 0;
  }


  getStoreId(): number {
    return this.getUserData()?.store?.id ?? 0;
  }

  getBranchId(): number {
    return this.getUserData()?.branch?.id ?? 0;
  }

  clear(): void {
      this.token = null;
      this.userData = null;
      this.allowNumberTicket = null;
      if (this.isBrowser()) {
          localStorage.removeItem("TOKEN");
          localStorage.removeItem("USER_DATA");
          localStorage.removeItem("ALLOW_TICKET_NUMBER");
      }
  }


  getStoreAndBranch(): { storeID: string, branchID: string } | null {
  const store = this.getStoreDTO();
  const branch = this.getBranch();
  if (store && branch) {
    return {
      storeID: store.id.toString(),
      branchID: branch.id.toString()
      };
    }
    return null;
  }


}
