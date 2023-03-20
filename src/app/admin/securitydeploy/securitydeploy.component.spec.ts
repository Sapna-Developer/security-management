import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecuritydeployComponent } from './securitydeploy.component';

describe('SecuritydeployComponent', () => {
  let component: SecuritydeployComponent;
  let fixture: ComponentFixture<SecuritydeployComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecuritydeployComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SecuritydeployComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
