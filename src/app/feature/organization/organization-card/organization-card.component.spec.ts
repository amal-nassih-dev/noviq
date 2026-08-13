import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OrganizationCardComponent } from './organization-card.component';

describe('OrganizationCardComponent', () => {
  let component: OrganizationCardComponent;
  let fixture: ComponentFixture<OrganizationCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationCardComponent, RouterTestingModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationCardComponent);
    component = fixture.componentInstance;
    component.organization = {
      id: 1,
      name: 'Org 1',
      description: 'desc',
      createdAt: new Date().toISOString(),
      memberCount: 0,
      projectCount: 0,
      taskCount: 0,
      doneTaskCount: 0
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
