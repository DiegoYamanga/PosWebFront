// ✅ 1. MODIFICACIÓN COMPLETA PARA SERVICELOGIC

import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { HttpService } from "../app/service/HttpService";
import { EndpointAdapterLogic } from "./endpointAdapterLogic";
import { ResClienteDTO } from "../DTOs/resClienteDTO";
import { GiftcardDTO } from "../DTOs/giftCardsDTO";
import { Observable } from "rxjs";
import { EncuestaDTO } from "../DTOs/encuestaDTO";
import { RespuestaEncuestaDTO } from "../DTOs/RespuestaEncuestaDTO";
import { ResEncuestaRespuesta } from "../DTOs/resEncuestaRespuesta";
import { EncuestaPreguntas } from "../DTOs/encuestaPreguntas";

@Injectable({
  providedIn: 'root'
})
export class ServiceLogic {

  private cliente: ResClienteDTO | null = null;
  private giftCardInfo: GiftcardDTO | null = null;
  private ultimaOperacion: any = null;
  private cardNumberCompra!: string | null;
  private documetoUsuario!: string | undefined;
  private origenOperacionTarjeta: 'COMPRA' | 'GIFTCARD' | null = null;



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

  public getEncuestas(storeID: number, branchID: number): Observable<EncuestaDTO[]> {
    return this.endPointAdapterLogic.getEncuestasSucursal(storeID, branchID);
  }

public obtenerPreguntasEncuesta(
  storeID: number | undefined,
  branchID: number | undefined,
  pollID: number | undefined
): Observable<EncuestaPreguntas[]> {
  if (storeID == null || branchID == null || pollID == null) {
    throw new Error('Parámetros inválidos para obtener preguntas');
  }

  return this.endPointAdapterLogic.obtenerPreguntasEncuesta(
    storeID.toString(),
    branchID.toString(),
    pollID.toString()
    );
  }

  public responderEncuesta(
  storeID: number,
  branchID: number,
  pollID: number,
  preguntaID: number,
  respuesta: RespuestaEncuestaDTO
    ): Observable<ResEncuestaRespuesta> {
      console.log("respuesta para la encuesta:",respuesta)
  return this.endPointAdapterLogic.responderEncuesta(storeID, branchID, pollID, preguntaID, respuesta);
  }

    public setCardNumberCompraInfo(cardNumberCompra: String) {
    cardNumberCompra = cardNumberCompra;
  }

  public setDocumentoUsuario(documentoUsuario: string | undefined) {
    this.documetoUsuario = documentoUsuario;
    if (documentoUsuario) {
      localStorage.setItem('documentoUsuario', documentoUsuario);
    } else {
      localStorage.removeItem('documentoUsuario');
    }
  }

  public getDocumentoUsuario(): string | undefined {
    if (!this.documetoUsuario) {
      const almacenado = localStorage.getItem('documentoUsuario');
      if (almacenado) {
        this.documetoUsuario = almacenado;
      }
    }
    return this.documetoUsuario;
  }

  setOrigenOperacionTarjeta(origen: 'COMPRA' | 'GIFTCARD') {
  this.origenOperacionTarjeta = origen;
  }

  getOrigenOperacionTarjeta(): 'COMPRA' | 'GIFTCARD' | null {
    return this.origenOperacionTarjeta;
  }

}
