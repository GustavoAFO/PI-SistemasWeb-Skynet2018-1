import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GerenciaNodesComponent } from './gerencia-nodes.component';

describe('GerenciaNodesComponent', () => {
  let component: GerenciaNodesComponent;
  let fixture: ComponentFixture<GerenciaNodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GerenciaNodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GerenciaNodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
