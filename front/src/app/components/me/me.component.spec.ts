import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { SessionService } from 'src/app/services/session.service';
import { expect } from '@jest/globals';
import { MeComponent } from './me.component';
import { By } from '@angular/platform-browser';
import { UserService } from 'src/app/services/user.service';
import { of } from 'rxjs';
import { User } from 'src/app/interfaces/user.interface';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('MeComponent', () => {
  let component: MeComponent;
  let fixture: ComponentFixture<MeComponent>;
  let userService: UserService;
  let sessionService: SessionService;
  let matSnackBar: MatSnackBar;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MeComponent],
      imports: [
        MatSnackBarModule,
        HttpClientTestingModule,
        MatCardModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
      ],
      providers: [
        { provide: MatSnackBar, useValue: { open: jest.fn() } },

        {
          provide: Router,
          useValue: { navigate: jest.fn() },
        },
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(MeComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
    sessionService = TestBed.inject(SessionService);
    matSnackBar = TestBed.inject(MatSnackBar);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display an h1 with "User information"', () => {
    const h1Element = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(h1Element.textContent.trim()).toBe('User information');
  });

  describe('Back arrow', () => {
    it('should display the mat-icon "arrow_back"', () => {
      const iconElement = fixture.debugElement.query(By.css('mat-icon'));
      expect(iconElement).toBeTruthy();
      expect(iconElement.nativeElement.textContent.trim()).toBe('arrow_back');
    });

    it('should call back() when clicking the back button', () => {
      jest.spyOn(component, 'back');

      const backButton = fixture.debugElement.query(
        By.css('button[mat-icon-button]')
      );
      backButton.nativeElement.click();

      expect(component.back).toHaveBeenCalled();
    });
  });

  describe('When user is defined', () => {
    it('should display the correct user name and email', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        lastName: 'test',
        firstName: 'test',
        admin: false,
        password: 'securepassword',
        createdAt: new Date(),
      };
      sessionService.sessionInformation = { id: 1 } as any;
      jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));

      fixture.detectChanges();

      const nameElement = fixture.debugElement.query(
        By.css('[data-test-id="user-name"]')
      ).nativeElement;
      const emailElement = fixture.debugElement.query(
        By.css('[data-test-id="user-email"]')
      ).nativeElement;

      expect(component.user).toBe(mockUser);
      expect(nameElement.textContent).toEqual(
        `Name: ${mockUser.firstName} ${mockUser.lastName.toUpperCase()}`
      );
      expect(emailElement.textContent).toEqual(`Email: ${mockUser.email}`);
    });
  });

  describe('When user is not defined', () => {
    it('should not display user information section', () => {
      sessionService.sessionInformation = { id: 1 } as any;
      jest.spyOn(userService, 'getById').mockReturnValue(of(undefined as any));

      fixture.detectChanges();

      const userInformationsElement = fixture.debugElement.query(
        By.css('[data-test-id="user-informations"]')
      );

      expect(component.user).toBeUndefined();
      expect(userInformationsElement).toBeNull();
    });
  });

  describe('User role display', () => {
    it('should display "You are admin" message if user is an admin', () => {
      const mockAdminUser: User = {
        id: 1,
        email: 'test@test.com',
        lastName: 'test',
        firstName: 'test',
        admin: true,
        password: 'securepassword',
        createdAt: new Date(),
      };
      sessionService.sessionInformation = { id: 1 } as any;
      jest.spyOn(userService, 'getById').mockReturnValue(of(mockAdminUser));

      fixture.detectChanges();

      const adminText = fixture.debugElement.query(
        By.css('[data-test-id="admin-text"]')
      );

      expect(adminText).toBeTruthy();
      expect(adminText.nativeElement.textContent).toEqual('You are admin');
    });

    it('should display delete account section if user is not an admin', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        lastName: 'test',
        firstName: 'test',
        admin: false,
        password: 'securepassword',
        createdAt: new Date(),
      };
      sessionService.sessionInformation = { id: 1 } as any;
      jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));

      fixture.detectChanges();

      const deleteSection = fixture.debugElement.query(
        By.css('[data-test-id="delete-section"]')
      );
      const deleteButton = fixture.debugElement.query(
        By.css('[data-test-id="delete-button"]')
      );

      expect(deleteSection).toBeTruthy();
      expect(deleteButton).toBeTruthy();
    });
  });

  describe('Delete account interaction', () => {
    it('should call delete() when clicking the delete button', () => {
      const mockUser: User = {
        id: 1,
        email: 'test@test.com',
        lastName: 'test',
        firstName: 'test',
        admin: false,
        password: 'securepassword',
        createdAt: new Date(),
      };

      sessionService.sessionInformation = { id: 1 } as any;
      jest.spyOn(userService, 'getById').mockReturnValue(of(mockUser));
      jest.spyOn(component, 'delete');

      fixture.detectChanges();

      const deleteButton = fixture.debugElement.query(
        By.css('[data-test-id="delete-button"]')
      );
      deleteButton.nativeElement.click();

      expect(component.delete).toHaveBeenCalled();
    });

    it('should call delete user and logout when delete() is executed', () => {
      sessionService.sessionInformation = { id: 1 } as any;
      jest.spyOn(userService, 'delete').mockReturnValue(of({ id: 1 }));
      jest.spyOn(sessionService, 'logOut');
      jest.spyOn(matSnackBar, 'open');
      jest.spyOn(router, 'navigate');

      component.delete();

      expect(userService.delete).toHaveBeenCalledWith('1');
      expect(matSnackBar.open).toHaveBeenCalledWith(
        'Your account has been deleted !',
        'Close',
        { duration: 3000 }
      );
      expect(sessionService.logOut).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
