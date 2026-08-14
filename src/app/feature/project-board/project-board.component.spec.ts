import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createActivatedRouteStub } from '../../../testing/test-helpers';
import { of } from 'rxjs';
import { ProjectService } from '../../core/services/project.service';
import { TaskService } from '../../core/services/task.service';
import { signal } from '@angular/core';

import { ProjectBoardComponent } from './project-board.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectBoardComponent', () => {
  let component: ProjectBoardComponent;
  let fixture: ComponentFixture<ProjectBoardComponent>;

  beforeEach(async () => {
    const activatedRouteStub = createActivatedRouteStub({ orgId: '1', projectId: '2' });
    const projectServiceStub = { findProject: jasmine.createSpy('findProject').and.returnValue(of({ id: 2 })) };
    const taskServiceStub = { findAll: jasmine.createSpy('findAll').and.returnValue(of([])), tasks: signal([] as any[]) } as any;

    await TestBed.configureTestingModule({
      imports: [ProjectBoardComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
        ,{ provide: ProjectService, useValue: projectServiceStub }
        ,{ provide: TaskService, useValue: taskServiceStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call findProject and findAll on init with route params', () => {
    const projectService = TestBed.inject(ProjectService) as any;
    const taskService = TestBed.inject(TaskService) as any;

    expect(projectService.findProject).toHaveBeenCalledWith(1, 2);
    expect(taskService.findAll).toHaveBeenCalledWith(1, 2);
  });
});
