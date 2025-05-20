import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipoCanjeDialogoComponent } from './tipo-canje-dialogo.component';

describe('TipoCanjeDialogoComponent', () => {
  let component: TipoCanjeDialogoComponent;
  let fixture: ComponentFixture<TipoCanjeDialogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TipoCanjeDialogoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TipoCanjeDialogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
