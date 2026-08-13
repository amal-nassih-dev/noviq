import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { NavBarComponent } from './nav-bar.component';
import { AuthenticationService } from '../../core/services/authentication.service';
import { AuthStateService } from '../../core/services/auth-state.service';
import { of } from 'rxjs';

describe('NavBarComponent', () => {
  let component: NavBarComponent;
  let fixture: ComponentFixture<NavBarComponent>;

  beforeEach(async () => {
    const authStub = {
      login: () => of({ token: '', user: {} }),
      signup: () => of({ token: '', user: {} }),
      getToken: () => null
    } as any;

    const authStateStub = {
      login: () => {},
      getToken: () => null,
      user: () => ({ fullName: 'Test User', email: 'test@example.com' })
    } as any;

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
});
