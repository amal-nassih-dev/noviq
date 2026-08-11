import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrganizationMemberDialogComponent } from './organization-member-dialog.component';

describe('OrganizationMemberDialogComponent', () => {
  let component: OrganizationMemberDialogComponent;
  let fixture: ComponentFixture<OrganizationMemberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrganizationMemberDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationMemberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
