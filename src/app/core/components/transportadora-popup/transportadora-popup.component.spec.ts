import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransportadoraPopupComponent } from './transportadora-popup.component';

describe('TransportadoraPopupComponent', () => {
  let component: TransportadoraPopupComponent;
  let fixture: ComponentFixture<TransportadoraPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransportadoraPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransportadoraPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
