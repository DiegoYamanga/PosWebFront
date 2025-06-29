import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Html5QrcodeScanner } from "html5-qrcode";
import { NavigationService } from '../../../logic/navigationService';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-qr',
  imports: [
    CommonModule,
    HeaderComponent,
    
  ],
  templateUrl: './qr.component.html',
  styleUrl: './qr.component.css'
})
export class QrComponent {

  // scaneado: string = "";
  // availableDevices: MediaDeviceInfo[] = [];
  // selectedDevice: MediaDeviceInfo | undefined;

  // constructor(private navigationService : NavigationService){  }


  // ngOnInit() {
  //   navigator.mediaDevices.enumerateDevices().then(devices => {
  //     this.availableDevices = devices.filter(d => d.kind === 'videoinput');
  //     if (this.availableDevices.length > 0) {
  //       this.selectedDevice = this.availableDevices[0]; // por defecto la primera
  //     }
  //   });
  // }

  // onDeviceSelect(event: Event) {
  //   const deviceId = (event.target as HTMLSelectElement).value;
  //   this.selectedDevice = this.availableDevices.find(d => d.deviceId === deviceId);
  // }

  // cancelar(){
  //   console.log("Cancelado")
  //   this.navigationService.goToInicio();
  // }

  // handleScanSuccess(scannedString: string){
  //   this.scaneado=scannedString;
  //   if (this.isValidQR(scannedString)) {
  //     console.log("SCAN TRUE")
  //   } else{
  //     console.log("SCAN FALSE")
  //   }
  // }

  // isValidQR(scannedString: string): boolean {
  //   const stringPattern = /^\/stores\/(\d+)\/branches\/(\d+)$/;
  //   if(!stringPattern.test(scannedString)) return false;          //string incorrecto -> false
  //   const resultado = scannedString.match(stringPattern);
  //   if (resultado) {
  //     // this.storeFromQR = resultado[1];
  //     // this.branchFromQR = resultado[2];

  //     // if(this.storeFromQR != this.listaComercios$[0].store_id) return false   //nro de store del qr distinto del de la app

  //     // this.selectedBranch = this.listaComercios$.find((branch: { id: number }) => branch.id === Number(this.branchFromQR))  //Busco la branch del qr en mi lista por id
  //     // if(!this.selectedBranch) return false;    //No encuentro la branch del qr en el store

  //   }
  //   return true;
  // }

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

  scaneado: string = "";
  html5QrCodeScanner!: Html5QrcodeScanner;

  constructor(private navigationService: NavigationService) { }

  ngAfterViewInit() {
    this.startScanner();
  }

  startScanner() {
    this.html5QrCodeScanner = new Html5QrcodeScanner(
      "reader",
      { fps: 10, qrbox: { width: 250, height: 250 } },
      /* verbose= */ false
    );

    this.html5QrCodeScanner.render(
      (decodedText) => this.handleScanSuccess(decodedText),
      (errorMessage) => this.handleScanError(errorMessage)
    );
  }

  handleScanSuccess(scannedString: string) {
    this.scaneado = scannedString;
    if (this.isValidQR(scannedString)) {
      console.log("SCAN TRUE");
      this.html5QrCodeScanner.clear();
    } else {
      console.log("SCAN FALSE");
    }
  }

  isValidQR(scannedString: string): boolean {
    const stringPattern = /^\/stores\/(\d+)\/branches\/(\d+)$/;
    return stringPattern.test(scannedString);
  }

  handleScanError(error: any) {
    console.error('Error al escanear:', error);
  }

  cancelar() {
    console.log("Cancelado");
    this.navigationService.goToInicio();
  }

  ngOnDestroy() {
    if (this.html5QrCodeScanner) {
      this.html5QrCodeScanner.clear().catch(err => console.error("Error al limpiar QR scanner", err));
    }
  }


}

