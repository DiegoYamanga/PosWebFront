import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReqLogicDTO } from '../../DTOs/ReqLoginDTO';
import { resLoginDTO } from '../../DTOs/resLoginDTO';
import { ReqParticipacionSorteoDTO } from '../../DTOs/reqParticipacionSorteo';
import { ReqGiftCardDatosDTO } from '../../DTOs/reqGiftCardDatosDTO';
import { ReqSwapDTO } from '../../DTOs/reqSwapDTO';
import { reqTransactionsFidelidad } from '../../DTOs/reqTransactionsFidelidad';
import { ReqRegisterDTO } from '../../DTOs/reqRegisterDTO';
import {ReqCancelarTransaccionByID} from '../../DTOs/reqCancelarTransaccionByID';
import {CuponCheckDTO} from '../../DTOs/CuponCheckDTO';
import {EncuestaDTO} from '../../DTOs/encuestaDTO';
import {EncuestaPreguntas} from '../../DTOs/encuestaPreguntas';
import {RespuestaEncuestaDTO} from '../../DTOs/RespuestaEncuestaDTO';
import {ResEncuestaRespuesta} from '../../DTOs/resEncuestaRespuesta';
import {PaisDTO} from '../../DTOs/PaisDTO';
import {ProvinciaDTO} from '../../DTOs/ProvinciaDTO';
import {CiudadDTO} from '../../DTOs/CiudadDTO';

@Injectable({
  providedIn: 'root'
}
)

export class HttpService {

  private BASE_URL = 'https://fidely20backend.azurewebsites.net';

  constructor(private http: HttpClient) {

  }

  public login(body: ReqLogicDTO) : Observable<any> {
    console.log("reqLogin--->",body)
    return this.http.post(this.BASE_URL + "/mobile_login", body);
  }

  public register(body: ReqRegisterDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/register", body);
  }

    public getClientInfo(storeID : String, branchesID: String, lookup : String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/clients/" + lookup + "/full",{});
  }

  public getStoreSorteos( storeID: number , branchesID: number) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/lots",{});
  }

  public getParcipante(storeID : number, branchesID: number, lotsID : number, lookup : String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/lots/" + lotsID + "/participate/" + lookup,{});
  }


  public generarParticipante(storeID : number, branchesID: number, lotsID : number, lookup : String , ReqParticipacionSorteoDTO : ReqParticipacionSorteoDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/lots/" + lotsID + "/participants/" + lookup,ReqParticipacionSorteoDTO);
  }

  public getGiftCard(storeID : String, lookup : String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/giftcards/" + lookup ,{});
  }

  public descargarGiftCards(storeID : String, reqDescargarGiftCardDTO : ReqGiftCardDatosDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/giftcards/" + "/discharge",reqDescargarGiftCardDTO);
  }

  public cargarGiftCards(storeID : String, reqDescargarGiftCardDTO : ReqGiftCardDatosDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/giftcards" + "/charge",reqDescargarGiftCardDTO);
  }

  public cancelarTransaccionByIdRequest(storeID : String, transactionID : String , reqCancelarTransaccionByID : ReqCancelarTransaccionByID) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/transactionID/" + transactionID , reqCancelarTransaccionByID);
  }


  public transaccionConCanjeDePuntos(storeID : String  , reqSwapDTO : ReqSwapDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/swap",reqSwapDTO);
  }



  public nuevaTransaccionFidelidad(storeID : String  , reqTransactionsFidelidad : reqTransactionsFidelidad) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/transactions",reqTransactionsFidelidad);

  }

  public getEncuentaSucursal(storeID : String, branchesID: String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/polls",{});
  }

  public obtenerEncuestas(branchID: string, storeID: string): Observable<EncuestaDTO[]> {
    return this.http.get<[EncuestaDTO]>(`${this.BASE_URL}/stores/${storeID}/branches/${branchID}/polls`);
  }

  public obtenerPreguntasEncuesta(storeID: string, branchID: string, pollID: string): Observable<EncuestaPreguntas[]> {
    return this.http.get<EncuestaPreguntas[]>(`${this.BASE_URL}/stores/${storeID}/branches/${branchID}/polls/${pollID}/questions`);
  }

  public responderPreguntaEncuesta(
    storeID: string,
    branchID: string,
    pollID: string,
    questionID: string,
    answer: RespuestaEncuestaDTO
  ): Observable<ResEncuestaRespuesta> {
    return this.http.post<ResEncuestaRespuesta>(
      `${this.BASE_URL}/stores/${storeID}/branches/${branchID}/polls/${pollID}/questions/${questionID}/answers`,
      answer
    );
  }

  public obtenerCuponChecks(storeID: string, branchID: string): Observable<CuponCheckDTO[]> {
    return this.http.get<CuponCheckDTO[]>(`${this.BASE_URL}/stores/${storeID}/branches/${branchID}/cupon_checks`);
  }


  public obtenerPaises(): Observable<PaisDTO[]> {
    return this.http.get<PaisDTO[]>(`${this.BASE_URL}/countries`);
  }

  public obtenerProvincias(countryID: string): Observable<ProvinciaDTO[]> {
    return this.http.get<ProvinciaDTO[]>(`${this.BASE_URL}/countries/${countryID}/provincies`);
  }

  public obtenerCiudades(countryID: string, provinceID: string): Observable<CiudadDTO[]> {
    return this.http.get<CiudadDTO[]>(`${this.BASE_URL}/countries/${countryID}/provincies/${provinceID}/cities`);
  }


}
