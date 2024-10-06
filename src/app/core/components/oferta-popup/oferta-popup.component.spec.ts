import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OfertaPopUpComponent } from './oferta-popup.component';

describe('OfertaPopUpComponent', () => {
  let component: OfertaPopUpComponent;
  let fixture: ComponentFixture<OfertaPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OfertaPopUpComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OfertaPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
