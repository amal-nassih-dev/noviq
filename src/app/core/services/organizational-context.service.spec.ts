import { TestBed } from '@angular/core/testing';

import { OrganizationalContextService } from './organizational-context.service';

describe('OrganizationalContextService', () => {
  let service: OrganizationalContextService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrganizationalContextService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
