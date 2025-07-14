import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsInputComponent } from './ds-input.component';

describe('DsInputComponent', () => {
  let component: DsInputComponent;
  let fixture: ComponentFixture<DsInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
