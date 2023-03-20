import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitordashboardComponent } from './visitordashboard.component';

describe('VisitordashboardComponent', () => {
  let component: VisitordashboardComponent;
  let fixture: ComponentFixture<VisitordashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisitordashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitordashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
