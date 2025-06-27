import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NumeroTicketComponent } from './numero-ticket.component';

describe('NumeroTicketComponent', () => {
  let component: NumeroTicketComponent;
  let fixture: ComponentFixture<NumeroTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NumeroTicketComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NumeroTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
