import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { ProjectService } from './project.service';

describe('ProjectService', () => {
  let service: ProjectService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(ProjectService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('findAll should GET projects and update signal', () => {
    const projects = [{ id: 1, name: 'P' }] as any;

    service.findAll(3).subscribe(resp => expect(resp).toEqual(projects));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/3/projects`);
    expect(req.request.method).toBe('GET');
    req.flush(projects);

    expect(service.projects()).toEqual(projects);
  });

  it('findProject should GET a single project by id', () => {
    const project = { id: 7, name: 'Z' } as any;

    service.findProject(2,7).subscribe(resp => expect(resp).toEqual(project));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/2/projects/7`);
    expect(req.request.method).toBe('GET');
    req.flush(project);
  });

  it('addProject should POST and append to projects signal', () => {
    const newProj = { id: 11, name: 'NewP' } as any;

    service.addProject(4, { name: 'NewP' } as any).subscribe(resp => expect(resp).toEqual(newProj));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/4/projects`);
    expect(req.request.method).toBe('POST');
    req.flush(newProj);

    expect(service.projects().some((p: any) => p.id === 11)).toBeTrue();
  });

  it('deleteProject should DELETE and remove from signal', () => {
    (service as any)._projects.set([{ id: 99, name: 'ToDel' }]);

    service.deleteProject(5, 99).subscribe(() => {});

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/5/projects/99`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.projects().some((p: any) => p.id === 99)).toBeFalse();
  });
});
