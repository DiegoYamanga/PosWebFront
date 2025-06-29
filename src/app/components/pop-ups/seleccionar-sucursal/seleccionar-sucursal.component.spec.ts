import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionarSucursalComponent } from './seleccionar-sucursal.component';

describe('SeleccionarSucursalComponent', () => {
  let component: SeleccionarSucursalComponent;
  let fixture: ComponentFixture<SeleccionarSucursalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionarSucursalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionarSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
