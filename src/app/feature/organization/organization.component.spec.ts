import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { OrganizationComponent } from './organization.component';
import { OrganizationalContextService } from '../../core/services/organizational-context.service';
import { of } from 'rxjs';

describe('OrganizationComponent', () => {
  let component: OrganizationComponent;
  let fixture: ComponentFixture<OrganizationComponent>;

  beforeEach(async () => {
    const orgContextStub = {
      members: () => [],
      currentOrganization: () => null,
      projects: () => []
    } as any;

    await TestBed.configureTestingModule({
      imports: [OrganizationComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: OrganizationalContextService, useValue: orgContextStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
