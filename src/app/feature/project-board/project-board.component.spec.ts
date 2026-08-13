import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { createActivatedRouteStub } from '../../../testing/test-helpers';

import { ProjectBoardComponent } from './project-board.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('ProjectBoardComponent', () => {
  let component: ProjectBoardComponent;
  let fixture: ComponentFixture<ProjectBoardComponent>;

  beforeEach(async () => {
    const activatedRouteStub = createActivatedRouteStub({ orgId: '1', projectId: '2' });

    await TestBed.configureTestingModule({
      imports: [ProjectBoardComponent, RouterTestingModule, HttpClientTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub }
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
});
