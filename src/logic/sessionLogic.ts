import { Injectable } from '@angular/core';
import { StoreDTO } from '../DTOs/storeDTO';
import { BranchDTO } from '../DTOs/brachDTO';

@Injectable({
  providedIn: 'root',
})
export class SessionLogic {
  private token: string | null = null;
  private userData: any = null;
  private resLoginDTO: any;

  setLoginData(token: string, userData: any): void {
    this.token = token;
    this.userData = userData;
  }

  getToken(): string | null {
    return this.token;
  }

  getUserData(): any {
    return this.userData;
  }
  getStoreDTO(): StoreDTO | undefined {
    return this.userData?.store
  }

  getBranch(): BranchDTO | undefined {
    return this.userData?.branch
  }

  getStoreId(): number {
  return this.resLoginDTO?.store?.id ?? 0;
}

  getBranchId(): number {
    return this.resLoginDTO?.branch?.id ?? 0;
  }


  clear(): void {
    this.token = null;
    this.userData = null;
  }
}
