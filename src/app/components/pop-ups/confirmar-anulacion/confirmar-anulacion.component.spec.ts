import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarAnulacionComponent } from './confirmar-anulacion.component';

describe('ConfirmarAnulacionComponent', () => {
  let component: ConfirmarAnulacionComponent;
  let fixture: ComponentFixture<ConfirmarAnulacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmarAnulacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarAnulacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
