import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OrgMembersComponent } from './org-members.component';
import { OrganizationalContextService } from '../../core/services/organizational-context.service';
import { of } from 'rxjs';

describe('OrgMembersComponent', () => {
  let component: OrgMembersComponent;
  let fixture: ComponentFixture<OrgMembersComponent>;

  beforeEach(async () => {
    const orgContextStub = {
      members: () => [],
      currentOrganization: () => null,
      projects: () => []
    } as any;

    await TestBed.configureTestingModule({
      imports: [OrgMembersComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: OrganizationalContextService, useValue: orgContextStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrgMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
