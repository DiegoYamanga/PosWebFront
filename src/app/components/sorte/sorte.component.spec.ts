import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorteComponent } from './sorte.component';

describe('SorteComponent', () => {
  let component: SorteComponent;
  let fixture: ComponentFixture<SorteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SorteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SorteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
