import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GraficoSensoresComponent } from './grafico-sensores.component';

describe('GraficoSensoresComponent', () => {
  let component: GraficoSensoresComponent;
  let fixture: ComponentFixture<GraficoSensoresComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GraficoSensoresComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GraficoSensoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
