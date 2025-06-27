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
  private allowNumberTicket: boolean | null = null;


  constructor(
  private navigation: NavigationService,
  private store: Store
) {}


  ngOnInit(): void {
    const userData = this.getUserData();
    const token = this.getToken();
    const allowNumberTicket = this.getAllowNumberTicket();

    if (userData && token) {
      this.store.dispatch(StateResLoginDTOAction.setResLoginDTO({ resLoginDTO: userData }));
  
    }
  }


  setLoginData(token: string, userData: any): void {
    this.token = token;
    this.userData = userData;
    this.allowNumberTicket = userData.allow_ticket_number ?? null;

    localStorage.setItem("TOKEN", token);
    localStorage.setItem("USER_DATA", JSON.stringify(userData));
    localStorage.setItem("ALLOW_NUMBER_TICKET", JSON.stringify(this.allowNumberTicket));

  }

  getToken(): string | null {
    return this.token ?? localStorage.getItem("TOKEN");
  }

  getUserData(): any {
    return this.userData ?? JSON.parse(localStorage.getItem("USER_DATA") || 'null');
  }

  getStoreDTO(): StoreDTO | undefined {
    return this.getUserData()?.store;
  }

  getBranch(): BranchDTO | undefined {
    return this.getUserData()?.branch;
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
      localStorage.removeItem("TOKEN");
      localStorage.removeItem("USER_DATA");
      localStorage.removeItem("ALLOW_TICKET_NUMBER");
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

  getAllowNumberTicket(): boolean {
    if (this.allowNumberTicket !== null) {
        return this.allowNumberTicket;
    }
    const storedValue = localStorage.getItem("ALLOW_TICKET_NUMBER");
    return storedValue ? JSON.parse(storedValue) : false;
  }




}
