import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NuovoResocontoLavoroComponent } from './nuovo-resoconto-lavoro.component';

describe('NuovoResocontoLavoroComponent', () => {
  let component: NuovoResocontoLavoroComponent;
  let fixture: ComponentFixture<NuovoResocontoLavoroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NuovoResocontoLavoroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NuovoResocontoLavoroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
