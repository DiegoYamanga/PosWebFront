import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import {QrCodeModule} from "ng-qrcode";
import { Result } from '@zxing/library';
import { NavigationService } from '../../../logic/navigationService';
import { CommonModule } from '@angular/common';
import { BarcodeFormat } from '@zxing/library';

@Component({
  selector: 'app-qr',
  imports: [
    CommonModule,
    HeaderComponent,
    QrCodeModule,
    ZXingScannerModule
  ],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent {

  scaneado: string = "";
  // availableDevices: MediaDeviceInfo[] = [];
  // selectedDevice: MediaDeviceInfo | undefined;

  constructor(private navigationService : NavigationService){  }


  // onDeviceSelect(event: Event) {
  //   const deviceId = (event.target as HTMLSelectElement).value;
  //   this.selectedDevice = this.availableDevices.find(d => d.deviceId === deviceId);
  // }

  cancelar(){
    console.log("Cancelado")
    this.navigationService.goToInicio();
  }

  handleScanSuccess(scannedString: string){
    this.scaneado=scannedString;
    if (this.isValidQR(scannedString)) {
      console.log("SCAN TRUE")
    } else{
      console.log("SCAN FALSE")
    }
  }

  isValidQR(scannedString: string): boolean {
    const stringPattern = /^\/stores\/(\d+)\/branches\/(\d+)$/;
    if(!stringPattern.test(scannedString)) return false;          //string incorrecto -> false
    const resultado = scannedString.match(stringPattern);
    if (resultado) {
      
    }
    return true;
  }

  // handleScanError(error: any) {
  //   console.error('Error al escanear:', error);
  //   if (error.name === 'NotAllowedError') {
  //     alert("No se otorgaron permisos para acceder a la cámara.");
  //   } else if (error.name === 'NotFoundError') {
  //     alert("No se encontró ninguna cámara disponible.");
  //   } else if (error.name === 'NotReadableError') {
  //     alert("No se pudo acceder a la cámara (puede estar en uso por otra app).");
  //   } else {
  //     alert("Error desconocido al acceder a la cámara.");
  //   }
  // }


}
