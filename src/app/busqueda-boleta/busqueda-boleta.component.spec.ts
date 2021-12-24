import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BusquedaBoletaComponent } from './busqueda-boleta.component';

describe('BusquedaBoletaComponent', () => {
  let component: BusquedaBoletaComponent;
  let fixture: ComponentFixture<BusquedaBoletaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BusquedaBoletaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BusquedaBoletaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
