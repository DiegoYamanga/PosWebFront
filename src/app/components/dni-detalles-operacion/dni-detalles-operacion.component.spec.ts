import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DniDetallesOperacionComponent } from './dni-detalles-operacion.component';

describe('DniDetallesOperacionComponent', () => {
  let component: DniDetallesOperacionComponent;
  let fixture: ComponentFixture<DniDetallesOperacionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DniDetallesOperacionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DniDetallesOperacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
