import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RodapeProdutoComponent } from './rodape-produto.component';

describe('RodapeVendaComponent', () => {
  let component: RodapeProdutoComponent;
  let fixture: ComponentFixture<RodapeProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RodapeProdutoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RodapeProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
