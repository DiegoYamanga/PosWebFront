// import { Component, Input, Output, EventEmitter } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { SessionLogic } from '../../../../logic/sessionLogic';
// import { StoreDTO } from '../../../../DTOs/storeDTO';
// import { BranchDTO } from '../../../../DTOs/brachDTO';
// import { Store } from '@ngrx/store';

// @Component({
//   selector: 'app-dialogo-pop-up',
//   standalone: true,
//   templateUrl: './dialogo-pop-up.component.html',
//   styleUrls: ['./dialogo-pop-up.component.css'],
//   imports: [CommonModule, FormsModule]
// })
// export class DialogoPopUpComponent {


//   constructor(private sessionLogic : SessionLogic){
//   const storeDTO = this.sessionLogic.getStoreDTO;
//   const branchDTO = this.sessionLogic.getBranch();

//   }
//   @Input() tipo: 'qr' | 'tarjeta' | 'documento' | null = null;
//   @Output() cerrar = new EventEmitter<void>();

//   documento: string = '';


//   async aceptar() {
//     if (this.tipo === 'documento' && this.documento) {
//       const storeID = StoreDTO.
//       const branchID = this.session.getBranchID();
  
//       if (!storeID || !branchID) {
//         console.error("Store o Branch no disponibles en sesión.");
//         return;
//       }
  
//       try {
//         const cliente = await this.endpointLogic.obtenerCliente(storeID, branchID, this.documento);
//         this.navigation.goToMontoCompra(cliente);
//       } catch (error) {
//         console.error('Error al obtener cliente:', error);
//       }
//     }
  
//     this.cerrar.emit();
//   }
// }
