import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultarSaldoComponent } from './consultar-saldo.component';

describe('ConsultarSaldoComponent', () => {
  let component: ConsultarSaldoComponent;
  let fixture: ComponentFixture<ConsultarSaldoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConsultarSaldoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConsultarSaldoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
