import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { OrganizationalContextService } from './organizational-context.service';
import { OrganizationService } from './organization.service';
import { ProjectService } from './project.service';
import { OrganizationMemberService } from './organization-member.service';

describe('OrganizationalContextService', () => {
  let service: OrganizationalContextService;
  let orgServiceStub: any;
  let projServiceStub: any;
  let memberServiceStub: any;
  let currentOrgs: any[];

  beforeEach(() => {
    currentOrgs = [];
    orgServiceStub = { organizations: () => currentOrgs };
    projServiceStub = { findAll: jasmine.createSpy('findAll').and.returnValue(of([])), clear: jasmine.createSpy('clear'), projects: () => [] };
    memberServiceStub = { findAll: jasmine.createSpy('findAll').and.returnValue(of([])), clear: jasmine.createSpy('clear'), members: () => [] };

    TestBed.configureTestingModule({
      providers: [
        { provide: OrganizationService, useValue: orgServiceStub },
        { provide: ProjectService, useValue: projServiceStub },
        { provide: OrganizationMemberService, useValue: memberServiceStub }
      ]
    });

    // Inject the real service but replace internal injected services via casting
    service = TestBed.inject(OrganizationalContextService);

    // Replace private injected services (retain stubs)
    (service as any).organizationService = orgServiceStub;
    (service as any).projectService = projServiceStub;
    (service as any).organizationMemberService = memberServiceStub;
  });

  afterEach(() => localStorage.removeItem('noviq.currentOrganizationId'));

  it('returns empty result when no organizations available', (done) => {
    (service as any).organizationService.organizations = () => [];

    service.initializeContext().subscribe(res => {
      expect(res.projects).toEqual([]);
      expect(res.members).toEqual([]);
      expect(service.currentOrganization()).toBeNull();
      done();
    });
  });

  it('selects organization by id and loads data', (done) => {
    const orgs = [{ id: 3, name: 'O' }];
    currentOrgs = orgs;

    projServiceStub.findAll.and.returnValue(of([{ id: 1 }] as any));
    memberServiceStub.findAll.and.returnValue(of([{ userId: 2 }] as any));

    service.initializeContext(3).subscribe(res => {
      expect(service.currentOrganization()?.id).toBe(3);
      expect(res.projects).toEqual(jasmine.arrayContaining([jasmine.objectContaining({ id: 1 })]));
      expect(res.members).toEqual(jasmine.arrayContaining([jasmine.objectContaining({ userId: 2 })]));
      expect(service.contextLoaded()).toBeTrue();
      expect(localStorage.getItem('noviq.currentOrganizationId')).toBe('3');
      done();
    });
  });
});
