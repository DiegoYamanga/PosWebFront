import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EncuestaPreguntas } from '../../../DTOs/encuestaPreguntas';
import { RespuestaEncuestaDTO } from '../../../DTOs/RespuestaEncuestaDTO';
import { ServiceLogic } from '../../../logic/serviceLogic';
import { MatDialog } from '@angular/material/dialog';
import { NotificacionComponent } from '../notificacion/notificacion.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-encuesta-preguntas',
  templateUrl: './encuesta-preguntas.component.html',
  styleUrls: ['./encuesta-preguntas.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class EncuestaPreguntasComponent {
  storeID!: number;
  branchID!: number;
  pollID!: number;
  documento?: string;
  nroTarjeta?: string;

  preguntas: EncuestaPreguntas[] = [];
  preguntaActualIndex = 0;
  respuestaSeleccionada: string = '';
  cargando = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serviceLogic: ServiceLogic,
    private dialog: MatDialog
  ) {
    const nav = this.router.getCurrentNavigation();
    const state = nav?.extras.state as any;

    if (state) {
      this.storeID = state.storeID;
      this.branchID = state.branchID;
      this.pollID = state.pollID;
      this.documento = state.documento;
      this.nroTarjeta = state.nroTarjeta;
    }

    this.cargarPreguntas();
  }

  cargarPreguntas() {
    this.serviceLogic.obtenerPreguntasEncuesta(this.storeID, this.branchID, this.pollID).subscribe({
      next: (res) => {
        this.preguntas = res;
      },
      error: () => {
        this.dialog.open(NotificacionComponent, {
          data: { mensaje: 'Error al obtener preguntas de la encuesta.', tipo: 'error' }
        });
      }
    });
  }

  seleccionarValor(valor: string) {
    this.respuestaSeleccionada = valor;
  }

  enviarRespuesta() {
  const pregunta = this.preguntas?.[this.preguntaActualIndex];
  if (!pregunta) return;
    const payload: RespuestaEncuestaDTO = {
      terminal: 'MOBILE',
      card_number: this.nroTarjeta ?? null,
      identification: this.documento ?? null,
      value: this.respuestaSeleccionada
    };

    this.cargando = true;
    this.serviceLogic.responderEncuesta(this.storeID, this.branchID, this.pollID, pregunta.id, payload)
      .subscribe({
        next: () => {
          this.cargando = false;
          this.respuestaSeleccionada = '';
          this.irASiguiente();
        },
        error: () => {
          this.cargando = false;
          this.dialog.open(NotificacionComponent, {
            data: { mensaje: 'Error al enviar la respuesta.', tipo: 'error' }
          });
        }
      });
  }

  irASiguiente() {
    if (this.preguntas && this.preguntaActualIndex < this.preguntas.length - 1) {
      this.preguntaActualIndex++;
    } else {
      this.dialog.open(NotificacionComponent, {
        data: { mensaje: '¡Gracias por responder la encuesta!', tipo: 'success' }
      });
      this.router.navigate(['/fidelidad']);
    }
  }

  saltearEncuesta() {
    this.router.navigate(['/fidelidad']);
  }

  get rango(): number[] {
    const pregunta = this.preguntas[this.preguntaActualIndex];
    const min = pregunta.min_value ?? 1;
    const max = pregunta.max_value ?? 5;
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }

  esPreguntaConOpciones(pregunta: EncuestaPreguntas): boolean {
  return Array.isArray(pregunta?.values) && pregunta.values.length > 0;
  }

}
