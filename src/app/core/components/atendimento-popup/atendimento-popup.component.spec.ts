import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AtendimentoPopupComponent } from './atendimento-popup.component';

describe('AtendimentoPopupComponent', () => {
  let component: AtendimentoPopupComponent;
  let fixture: ComponentFixture<AtendimentoPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AtendimentoPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AtendimentoPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
