import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { expect } from '@jest/globals';

import { RegisterComponent } from './register.component';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { By } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authService: AuthService;
  let router: Router;

  const validFormValue = {
    email: 'test@example.com',
    firstName: 'test',
    lastName: 'test',
    password: 'securepassword',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      providers: [{ provide: Router, useValue: { navigate: jest.fn() } }],
      imports: [
        BrowserAnimationsModule,
        HttpClientModule,
        ReactiveFormsModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the register title', () => {
    const titleElement = fixture.debugElement.query(
      By.css('mat-card-title')
    ).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Register');
  });

  describe('Form Validation - Submit Button State', () => {
    describe('Invalid', () => {
      it('should disable submit button if email is invalid', () => {
        const invalidEmailFormValue = {
          ...validFormValue,
          email: 'tesest.com',
        };

        component.form.patchValue(invalidEmailFormValue);
        component.form.updateValueAndValidity();
        fixture.detectChanges();
  
        const submitButton = fixture.debugElement.query(
          By.css('button[type="submit"]')
        ).nativeElement;
        expect(submitButton.disabled).toBeTruthy();
      });

      it('should disable submit button if firstname is invalid', () => {
        const invalidFirstnameFormValue = {
          ...validFormValue,
          firstName: '',
        };
  
        component.form.patchValue(invalidFirstnameFormValue);
        component.form.updateValueAndValidity();
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(
          By.css('button[type="submit"]')
        ).nativeElement;
        expect(submitButton.disabled).toBeTruthy();
      });

      it('should disable submit button if lastname is invalid', () => {
        const invalidLastnameFormValue = {
          ...validFormValue,
          lastName: '',
        };

        component.form.patchValue(invalidLastnameFormValue);
        component.form.updateValueAndValidity();
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(
          By.css('button[type="submit"]')
        ).nativeElement;
        expect(submitButton.disabled).toBeTruthy();
      });

      it('should disable submit button if password is invalid', () => {
        const invalidPasswordFormValue = {
          ...validFormValue,
          password: '123',
        };

        component.form.patchValue(invalidPasswordFormValue);
        component.form.updateValueAndValidity();
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(
          By.css('button[type="submit"]')
        ).nativeElement;
        expect(submitButton.disabled).toBeTruthy();
      });
    });

    describe('Valid', () => {
      it('should enable submit button', () => {
        component.form.patchValue(validFormValue);
        component.form.updateValueAndValidity();
        fixture.detectChanges();

        const submitButton = fixture.debugElement.query(
          By.css('button[type="submit"]')
        ).nativeElement;
        expect(submitButton.disabled).toBeFalsy();
      });
    });
  });

  describe('Submit form', () => {
    it('should navigate to login on register success', () => {
      jest.spyOn(authService, 'register').mockReturnValue(of({} as any));
      jest.spyOn(router, 'navigate');
      component.submit();

      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should display error message on register failure', () => {
      jest
        .spyOn(authService, 'register')
        .mockReturnValue(throwError(() => new Error('Register failed')));
      jest.spyOn(router, 'navigate');
      component.submit();

      fixture.detectChanges();

      const errorElement = fixture.debugElement.query(
        By.css('.error')
      ).nativeElement;
      expect(component.onError).toBeTruthy();
      expect(errorElement).toBeTruthy();
      expect(errorElement.textContent.trim()).toBe('An error occurred');
      expect(router.navigate).not.toHaveBeenCalled();
    });
  });
});
