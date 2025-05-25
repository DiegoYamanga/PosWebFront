// ✅ 1. MODIFICACIÓN COMPLETA PARA SERVICELOGIC

import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpService } from "../app/service/HttpService";
import { EndpointAdapterLogic } from "./endpointAdapterLogic";
import { ResClienteDTO } from "../DTOs/resClienteDTO";
import { GiftcardDTO } from "../DTOs/giftCardsDTO";

@Injectable({
  providedIn: 'root'
})
export class ServiceLogic {

  private cliente: ResClienteDTO | null = null;
  private giftCardInfo: GiftcardDTO | null = null;
  private ultimaOperacion: any = null;

  constructor(private store: Store,
              private httpService: HttpService,
              private endPointAdapterLogic : EndpointAdapterLogic
  ) {}

  public setCliente(cliente: ResClienteDTO) {
    this.cliente = cliente;
  }

  public getCliente(): ResClienteDTO | null {
    return this.cliente;
  }

  public setGiftCardInfo(giftCard: GiftcardDTO) {
    this.giftCardInfo = giftCard;
  }

  public getGiftCardInfo(): GiftcardDTO | null {
    return this.giftCardInfo;
  }

  public clear(): void {
    this.cliente = null;
    this.giftCardInfo = null;
  }

  private giftcardInfo: GiftcardDTO | null = null;

  public setGiftcardInfo(info: GiftcardDTO) {
    this.giftcardInfo = info;
  }

  public getGiftcardInfo(): GiftcardDTO | null {
    return this.giftcardInfo;
  }

  public setUltimaOperacionGiftCard(respuesta: any) {
  this.ultimaOperacion = respuesta;
}

public getUltimaOperacionGiftCard(): any {
  return this.ultimaOperacion;
}

}
