import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeploymentdashboardComponent } from './deploymentdashboard.component';

describe('DeploymentdashboardComponent', () => {
  let component: DeploymentdashboardComponent;
  let fixture: ComponentFixture<DeploymentdashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeploymentdashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeploymentdashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
