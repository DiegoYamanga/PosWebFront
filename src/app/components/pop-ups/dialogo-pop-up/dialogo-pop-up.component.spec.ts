import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogoPopUpComponent } from './dialogo-pop-up.component';

describe('DialogoPopUpComponent', () => {
  let component: DialogoPopUpComponent;
  let fixture: ComponentFixture<DialogoPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DialogoPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogoPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
