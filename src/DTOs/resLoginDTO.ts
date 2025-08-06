import { BranchDTO } from "./brachDTO";
import { StoreDTO } from "./storeDTO";

export interface resLoginDTO {

    branch: BranchDTO,
    branches: BranchDTO[],
    status: number,
    store: StoreDTO,
    token: string

  }