import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { OrganizationMemberService } from './organization-member.service';

describe('OrganizationMemberService', () => {
  let service: OrganizationMemberService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationMemberService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('findAll should GET members and update signal', () => {
    const members = [{ userId: 1, name: 'M' }] as any;

    service.findAll(2).subscribe(resp => expect(resp).toEqual(members));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/2/members`);
    expect(req.request.method).toBe('GET');
    req.flush(members);

    expect(service.members()).toEqual(members);
  });

  it('addMember should POST and append to members signal', () => {
    const newMember = { userId: 5, name: 'New' } as any;

    service.addMember(2, { userId: 5 } as any).subscribe(resp => expect(resp).toEqual(newMember));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/2/members`);
    expect(req.request.method).toBe('POST');
    req.flush(newMember);

    expect(service.members().some((m: any) => m.userId === 5)).toBeTrue();
  });

  it('deleteMember should DELETE and remove from signal', () => {
    (service as any)._members.set([{ userId: 20, name: 'T' }]);

    service.deleteMember(2, 20).subscribe(() => {});

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/2/members/20`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.members().some((m: any) => m.userId === 20)).toBeFalse();
  });
});
