import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoreportingComponent } from './soreporting.component';

describe('SoreportingComponent', () => {
  let component: SoreportingComponent;
  let fixture: ComponentFixture<SoreportingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoreportingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoreportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
