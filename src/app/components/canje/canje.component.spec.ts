import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CanjeComponent } from './canje.component';

describe('CanjeComponent', () => {
  let component: CanjeComponent;
  let fixture: ComponentFixture<CanjeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CanjeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CanjeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
