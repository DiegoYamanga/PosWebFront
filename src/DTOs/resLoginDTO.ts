import { BranchDTO } from "./brachDTO";

export interface resLoginDTO {

    branch: BranchDTO,
    status: number,
    store: Store,
    token: string

  }