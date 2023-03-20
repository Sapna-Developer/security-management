import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreecutdashboardComponent } from './treecutdashboard.component';

describe('TreecutdashboardComponent', () => {
  let component: TreecutdashboardComponent;
  let fixture: ComponentFixture<TreecutdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreecutdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreecutdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
