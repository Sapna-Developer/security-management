import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitormovementComponent } from './visitormovement.component';

describe('VisitormovementComponent', () => {
  let component: VisitormovementComponent;
  let fixture: ComponentFixture<VisitormovementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitormovementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitormovementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
