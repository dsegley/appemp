import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatosEmpenoComponent } from './datos-empeno.component';

describe('DatosEmpenoComponent', () => {
  let component: DatosEmpenoComponent;
  let fixture: ComponentFixture<DatosEmpenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatosEmpenoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatosEmpenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
