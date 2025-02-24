import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let sessionService: SessionService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      providers: [{ provide: Router, useValue: { navigate: jest.fn() } }],
      imports: [
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientModule,
        MatCardModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule]
    })
      .compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    sessionService = TestBed.inject(SessionService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the login title', () => {
    const titleElement = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Login');
  });

  it('should disable submit button if form is invalid', () => {
    component.form.patchValue({ email: 'tesest.com', password: '' });
    component.form.updateValueAndValidity();
    fixture.detectChanges();
    const submitButton = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement;
    expect(submitButton.disabled).toBeTruthy();

    component.form.patchValue({ email: 'test@test.com', password: 'pass' });
    component.form.updateValueAndValidity();
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();
  });

  it('should set session info and navigate to sessions on submit login success', () => {
    const mockSession: SessionInformation = {
        id: 1,
        username: 'testUser',
        token: 'bearer',
        type: 'test',
        firstName: 'firstname',
        lastName: 'lastname',
        admin: true,
      };
    jest.spyOn(authService, 'login').mockReturnValue(of(mockSession));
    jest.spyOn(sessionService, 'logIn');
    jest.spyOn(router, 'navigate');


    component.submit();

    fixture.detectChanges();

    expect(sessionService.logIn).toHaveBeenCalledWith(mockSession);
    expect(router.navigate).toHaveBeenCalledWith(['/sessions']);

  });

  it('should display error message on submit login failure', () => {
    jest.spyOn(authService, 'login').mockReturnValue(throwError(() => new Error('Login failed')));
    jest.spyOn(sessionService, 'logIn');

    component.submit();

    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('.error')).nativeElement;
    expect(component.onError).toBeTruthy();
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent.trim()).toBe('An error occurred');
    expect(sessionService.logIn).not.toHaveBeenCalled();
  });
});
