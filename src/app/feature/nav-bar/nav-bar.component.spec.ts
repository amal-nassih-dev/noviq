import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { createAuthStub, createAuthStateStub } from '../../../testing/test-helpers';
import { Router } from '@angular/router';

import { NavBarComponent } from './nav-bar.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { of } from 'rxjs';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    const authStub = createAuthStub();
    const authStateStub = createAuthStateStub();

    await TestBed.configureTestingModule({
      imports: [NavBarComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authStub },
        { provide: AuthStateService, useValue: authStateStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NavBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should logout and navigate to /login', () => {
    const auth = TestBed.inject(AuthenticationService) as any;
    const router = TestBed.inject(Router);

    const logoutSpy = spyOn(auth, 'logout');
    const navSpy = spyOn(router, 'navigate');

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(navSpy).toHaveBeenCalledWith(['/login']);
  });
});
