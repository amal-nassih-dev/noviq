import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('search should GET with query param and update signal', () => {
    const users = [{ id: 1, name: 'U' }] as any;

    service.search('foo').subscribe(resp => expect(resp).toEqual(users));

    const req = httpMock.expectOne(req => req.url === `${environment.apiUrl}/users/search` && req.params.get('q') === 'foo');
    expect(req.request.method).toBe('GET');
    req.flush(users);

    expect(service.users()).toEqual(users);
  });
});
