import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../../environments/environment';

import { TaskService } from './task.service';

describe('TaskService', () => {
  let service: TaskService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(TaskService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('findAll should GET tasks and update signal', () => {
    const tasks = [{ id: 1, title: 'T1' }] as any;

    service.findAll(1,2).subscribe(resp => expect(resp).toEqual(tasks));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/1/projects/2/tasks`);
    expect(req.request.method).toBe('GET');
    req.flush(tasks);

    expect(service.tasks()).toEqual(tasks);
  });

  it('addTask should POST and append to tasks signal', () => {
    const newTask = { id: 7, title: 'New' } as any;

    service.addTask(1,3, { title: 'New' } as any).subscribe(resp => expect(resp).toEqual(newTask));

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/1/projects/3/tasks`);
    expect(req.request.method).toBe('POST');
    req.flush(newTask);

    expect(service.tasks().some((t: any) => t.id === 7)).toBeTrue();
  });

  it('deleteTask should DELETE and remove from signal', () => {
    (service as any)._tasks.set([{ id: 99, title: 'ToDel' }]);

    service.deleteTask(1,4,99).subscribe(() => {});

    const req = httpMock.expectOne(`${environment.apiUrl}/organizations/1/projects/4/tasks/99`);
    expect(req.request.method).toBe('DELETE');
    req.flush(null);

    expect(service.tasks().some((t: any) => t.id === 99)).toBeFalse();
  });
});

