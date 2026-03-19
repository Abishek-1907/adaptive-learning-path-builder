import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LeftPanelComponent } from './left-panel.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('LeftPanelComponent', () => {
  let component: LeftPanelComponent;
  let fixture: ComponentFixture<LeftPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeftPanelComponent, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LeftPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have filter set to all by default', () => {
    expect(component.filter()).toBe('all');
  });

  it('should update filter when setFilter called', () => {
    component.setFilter('unit');
    expect(component.filter()).toBe('unit');
  });

  it('should update search when onSearch called', () => {
    component.onSearch('math');
    expect(component.search()).toBe('math');
  });
});