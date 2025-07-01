import { Component } from '@angular/core';
import { HeaderComponent } from "../header/header.component";
// import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { Html5QrcodeScanner } from "html5-qrcode";
import { NavigationService } from '../../../logic/navigationService';
import { CommonModule } from '@angular/common';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { ServiceLogic } from '../../../logic/serviceLogic';
import { Store } from '@ngrx/store';
import { StateOrigenOperacionAction, StateResClienteDTOAction } from '../../redux/action';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-qr',
  standalone :true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatDialogModule

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
  loading: boolean = false;
  error: string | null = null;

  constructor(private navigationService: NavigationService,
              private logic: EndpointAdapterLogic,
              private serviceLogic : ServiceLogic,
              private store: Store,
              private dialog : MatDialog,
  ) { 
    console.log("MatDialog instanciado?", this.dialog); // ⛔️ undefined si no está bien inyectado

    }

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
    this.loading = true;
    this.scaneado = scannedString;
    if (this.isValidQR(scannedString)) {
      console.log("SCAN TRUE");
      console.log("ESCANEADO: ", this.scaneado)
      this.html5QrCodeScanner.clear();
      this.buscarCliente()
    } else {
      console.log("SCAN FALSE");
    }
  }

  async buscarCliente() {

    this.loading = true;
    try {
      const cliente = await this.logic.buscarCliente("32", "43", this.scaneado);
      if(!cliente){
        this.error= "No existe un cliente con los datos ingresados";
        this.loading = false;
        return;
      }
      console.log("Cliente---->",cliente)
      this.serviceLogic.setCliente(cliente);
      this.store.dispatch(StateResClienteDTOAction.setClienteDTO({ resClienteDTO: cliente }));
      this.store.dispatch(StateOrigenOperacionAction.setOrigenOperacion({ origen: 'COMPRA' }));
      this.loading = false;
      this.navigationService.goToDNIDetallesOperacion();
      this.error = null;
      
      
    } catch (e) {
      console.log("Error: ",e)
      this.error = "No existe un cliente con los datos ingresados"
      this.loading = false;
      console.log("Dialog:", this.dialog);
      this.dialog.open(NotificacionComponent, {
                panelClass: 'full-screen-dialog',
                maxWidth: '100vw',
                maxHeight: '100vh',
                height: '100vh',
                width: '100vw',
                data: {
                  success: false,
                  titulo: 'Error',
                  descripcion: 'El QR escaneado no corresponde a un usuario.',
                  origen: 'FIDELIDAD'
                }
            });

    }
  }

  isValidQR(scannedString: string): boolean {
    const stringPattern = /^\/stores\/(\d+)\/branches\/(\d+)$/;
    return true;
    // return stringPattern.test(scannedString);
  }

  handleScanError(error: any) {
    // console.error('Error al escanear:', error);
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

