import { BranchDTO } from "./brachDTO";
import { StoreDTO } from "./storeDTO";

export interface resLoginDTO {

    branch: BranchDTO,
    branches: any,
    status: number,
    store: StoreDTO,
    token: string,
    isStore: boolean

  }