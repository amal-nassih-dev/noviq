import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { OrganizationalContextService } from './organizational-context.service';

describe('OrganizationalContextService', () => {
  let service: OrganizationalContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(OrganizationalContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
