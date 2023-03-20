import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreecutComponent } from './treecut.component';

describe('TreecutComponent', () => {
  let component: TreecutComponent;
  let fixture: ComponentFixture<TreecutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TreecutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreecutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
