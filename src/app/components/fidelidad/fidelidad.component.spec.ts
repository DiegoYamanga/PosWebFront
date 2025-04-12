import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FidelidadComponent } from './fidelidad.component';

describe('FidelidadComponent', () => {
  let component: FidelidadComponent;
  let fixture: ComponentFixture<FidelidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FidelidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FidelidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
