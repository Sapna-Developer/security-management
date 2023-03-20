import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclemovementComponent } from './vehiclemovement.component';

describe('VehiclemovementComponent', () => {
  let component: VehiclemovementComponent;
  let fixture: ComponentFixture<VehiclemovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VehiclemovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VehiclemovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
