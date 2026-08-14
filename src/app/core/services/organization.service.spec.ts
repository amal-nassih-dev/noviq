import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { OrganizationService } from './organization.service';
import { environment } from '../../../environments/environment';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('getAll should fetch organizations and update signal', () => {
    const orgs = [{ id: 1, name: 'Org' }] as any;

    service.getAll().subscribe(resp => {
      expect(resp).toEqual(orgs);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations`);
    expect(req.request.method).toBe('GET');
    req.flush(orgs);

    expect(service.organizations()).toEqual(orgs);
  });

  it('getById should call the correct URL', () => {
    const org = { id: 5, name: 'X' } as any;

    service.getById(5).subscribe(resp => expect(resp).toEqual(org));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/5`);
    expect(req.request.method).toBe('GET');
    req.flush(org);
  });

  it('create should POST and append to organizations signal', () => {
    const newOrg = { id: 10, name: 'New' } as any;

    service.create({ name: 'New' } as any).subscribe(resp => expect(resp).toEqual(newOrg));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations`);
    expect(req.request.method).toBe('POST');
    req.flush(newOrg);

    expect(service.organizations().some((o: any) => o.id === 10)).toBeTrue();
  });

  it('delete should call delete and remove from signal', () => {
    // seed with an organization
    (service as any)._organizations.set([{ id: 20, name: 'T' }]);

    service.delete(20).subscribe(() => {});

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/20`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.organizations().some((o: any) => o.id === 20)).toBeFalse();
  });
});
