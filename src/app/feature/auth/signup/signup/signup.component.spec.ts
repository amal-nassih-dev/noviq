import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SignupComponent } from './signup.component';
import { AuthenticationService } from '../../../../core/services/authentication.service';
import { AuthStateService } from '../../../../core/services/auth-state.service';
import { of } from 'rxjs';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;

  beforeEach(async () => {
    const authStub = {
      login: () => of({ token: '', user: {} }),
      signup: () => of({ token: '', user: {} }),
      getToken: () => null
    } as any;

    const authStateStub = {
      login: () => {},
      getToken: () => null
    } as any;

    await TestBed.configureTestingModule({
      imports: [SignupComponent, HttpClientTestingModule, RouterTestingModule],
      providers: [
        { provide: AuthenticationService, useValue: authStub },
        { provide: AuthStateService, useValue: authStateStub }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
