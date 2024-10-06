import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidadePopupComponent } from './validade-popup.component';

describe('ValidadePopupComponent', () => {
  let component: ValidadePopupComponent;
  let fixture: ComponentFixture<ValidadePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidadePopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidadePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
