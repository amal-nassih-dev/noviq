import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ProjectComponent } from './project.component';
import { OrganizationalContextService } from '../../core/services/organizational-context.service';
import { of } from 'rxjs';
import { createOrgContextStub } from '../../../testing/test-helpers';

describe('ProjectComponent', () => {
  let component: ProjectComponent;
  let fixture: ComponentFixture<ProjectComponent>;

  beforeEach(async () => {
      const orgContextStub = createOrgContextStub();

      await TestBed.configureTestingModule({
        imports: [ProjectComponent, HttpClientTestingModule, RouterTestingModule],
        providers: [
          { provide: OrganizationalContextService, useValue: orgContextStub }
        ]
      })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
