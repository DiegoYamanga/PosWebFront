import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { EndpointAdapterLogic } from '../../../logic/endpointAdapterLogic';
import { SessionLogic } from '../../../logic/sessionLogic';
import { LotsDTO } from '../../../DTOs/lotsDTO';
import { ResClienteDTO } from '../../../DTOs/resClienteDTO';
import { AppSelectors } from '../../redux/selectors';
import { StateResLotsDTOAction } from '../../redux/action';


@Component({
  standalone: true,
  selector: 'app-sorteo',
  imports: [CommonModule],
  templateUrl: './sorteo.component.html',
  styleUrls: ['./sorteo.component.css']
})
export class SorteoComponent implements OnInit {
  lots: LotsDTO[] = [];
  clienteInfo: ResClienteDTO | undefined;

  constructor(
    private store: Store,
    private endpointLogic: EndpointAdapterLogic,
  ) {}

  ngOnInit(): void {
    this.store.select(AppSelectors.selectResClienteDTO).subscribe(cliente => {
      this.clienteInfo = cliente;
       console.log("---> cliente", cliente)

      if (true) {

        const storeID = 32;
        const branchID = 43;

        this.endpointLogic.obtenerSortosStore(storeID, branchID).then(sorteos => {
          this.lots = sorteos;
          this.store.dispatch(StateResLotsDTOAction.setLotsDTO({ resLotsDTO: sorteos }));
        });
      }
    });
  }
}
