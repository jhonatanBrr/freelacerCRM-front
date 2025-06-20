import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabsSectionsComponent } from './tabs-sections.component';

describe('TabsSectionsComponent', () => {
  let component: TabsSectionsComponent;
  let fixture: ComponentFixture<TabsSectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TabsSectionsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TabsSectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
