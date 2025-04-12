import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaldoUsuarioComponent } from './saldo-usuario.component';

describe('SaldoUsuarioComponent', () => {
  let component: SaldoUsuarioComponent;
  let fixture: ComponentFixture<SaldoUsuarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SaldoUsuarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaldoUsuarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
