import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaDetallesOperacionComponent } from './tarjeta-detalles-operacion.component';

describe('TarjetaDetallesOperacionComponent', () => {
  let component: TarjetaDetallesOperacionComponent;
  let fixture: ComponentFixture<TarjetaDetallesOperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaDetallesOperacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaDetallesOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
