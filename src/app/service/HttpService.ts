import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ReqLogicDTO } from '../../DTOs/ReqLoginDTO';
import { resLoginDTO } from '../../DTOs/resLoginDTO';
import { ReqParticipacionSorteoDTO } from '../../DTOs/reqParticipacionSorteo';
import { ReqDescargarGiftCardDTO } from '../../DTOs/reqDescargarGiftCardDTO';
import { ReqSwapDTO } from '../../DTOs/reqSwapDTO';
import { reqTransactionsFidelidad } from '../../DTOs/reqTransactionsFidelidad';
import { ReqRegisterDTO } from '../../DTOs/reqRegisterDTO';

@Injectable({
  providedIn: 'root'
}
)

export class HttpService {
  
  private BASE_URL = 'https://fidely20backend.azurewebsites.net'; 

  constructor(private http: HttpClient) {

  }

  public login(body: ReqLogicDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/mobileLogin", body);
  }

  public register(body: ReqRegisterDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/register", body);
  }

    public getClientInfo(storeID : String, branchesID: String, lookup : String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/clients/" + lookup + "/full",{});
  }

  public getSorteosInfo(storeID : String, branchesID: String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/lots/",{});
  }

  public getParcipante(storeID : String, branchesID: String, lotsID : String, lookup : String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/lots/" + lotsID + "/participate/" + lookup,{});
  }


  //TODO CUESTIONAR ENDPOINT
  public generarParticipante(storeID : String, branchesID: String, lotsID : String, lookup : String , ReqParticipacionSorteoDTO : ReqParticipacionSorteoDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/branches/" + branchesID + "/lots/" + lotsID + "/participate/" + lookup,ReqParticipacionSorteoDTO);
  }

  public getGiftCard(storeID : String, lookup : String) : Observable<any> {
    return this.http.get(this.BASE_URL + "/stores/" + storeID + "/giftcards/" + lookup ,{});
  }

  public descargarGiftCards(storeID : String, reqDescargarGiftCardDTO : ReqDescargarGiftCardDTO) : Observable<any> {
    return this.http.post(this.BASE_URL + "/stores/" + storeID + "/giftcards/" + "/giftcards/" + "/discharge",reqDescargarGiftCardDTO);
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





}