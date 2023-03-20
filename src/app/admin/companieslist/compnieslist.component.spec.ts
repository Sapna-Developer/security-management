import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompnieslistComponent } from './compnieslist.component';

describe('CompnieslistComponent', () => {
  let component: CompnieslistComponent;
  let fixture: ComponentFixture<CompnieslistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CompnieslistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompnieslistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
