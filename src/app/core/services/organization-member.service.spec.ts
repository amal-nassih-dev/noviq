import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OrganizationMemberService } from './organization-member.service';

describe('OrganizationMemberService', () => {
  let service: OrganizationMemberService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationMemberService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
