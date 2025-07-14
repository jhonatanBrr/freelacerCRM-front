import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsPaginatorComponent } from './ds-paginator.component';

describe('DsPaginatorComponent', () => {
  let component: DsPaginatorComponent;
  let fixture: ComponentFixture<DsPaginatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DsPaginatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DsPaginatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
