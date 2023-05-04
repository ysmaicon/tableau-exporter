import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauPanelComponent } from './tableau-panel.component';

describe('TableauPanelComponent', () => {
  let component: TableauPanelComponent;
  let fixture: ComponentFixture<TableauPanelComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TableauPanelComponent]
    });
    fixture = TestBed.createComponent(TableauPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
