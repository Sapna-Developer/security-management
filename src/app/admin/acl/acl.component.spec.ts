import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ACLComponent } from './acl.component';

describe('ACLComponent', () => {
  let component: ACLComponent;
  let fixture: ComponentFixture<ACLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ACLComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ACLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
