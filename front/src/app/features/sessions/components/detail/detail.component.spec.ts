import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterTestingModule } from '@angular/router/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../../../../services/session.service';

import { DetailComponent } from './detail.component';
import { SessionApiService } from '../../services/session-api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TeacherService } from 'src/app/services/teacher.service';
import { By } from '@angular/platform-browser';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatCardModule } from '@angular/material/card';

describe('DetailComponent', () => {
  let component: DetailComponent;
  let fixture: ComponentFixture<DetailComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  let teacherService: TeacherService;
  let router: Router;
  let matSnackBar: MatSnackBar;

  const mockSessionService = {
    sessionInformation: {
      admin: false,
      id: 1,
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatIconModule,
        MatCardModule,
        ReactiveFormsModule,
      ],
      declarations: [DetailComponent],
      providers: [
        { provide: SessionService, useValue: mockSessionService },
        { provide: Router, useValue: { navigate: jest.fn() } },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: jest.fn().mockReturnValue('1') } },
          },
        },
      ],
    }).compileComponents();
    sessionService = TestBed.inject(SessionService);
    sessionApiService = TestBed.inject(SessionApiService);
    teacherService = TestBed.inject(TeacherService);
    router = TestBed.inject(Router);
    matSnackBar = TestBed.inject(MatSnackBar);
    fixture = TestBed.createComponent(DetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the session title', () => {
    component.session = { id: 1, name: 'Yoga', description: 'test', date: new Date(), teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };
    fixture.detectChanges();

    const titleElement = fixture.debugElement.query(By.css('h1')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Yoga');
  });

  describe("Delete button", () => {
    it('should display delete button for admin users', () => {
      component.session = { id: 1, name: 'Yoga', description: 'test', date: new Date(), teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };
      component.isAdmin = true;
      fixture.detectChanges();
  
      const deleteButton = fixture.debugElement.query(By.css('[data-test-id="delete-session-button"]'));
      expect(deleteButton).toBeTruthy();
      expect(deleteButton.nativeElement.textContent).toContain('Delete');
    });
  
    it('should not display delete button for non-admin users', () => {
      component.session = { id: 1, name: 'Yoga', description: 'test', date: new Date(), teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };
      component.isAdmin = false;
      fixture.detectChanges();
  
      const deleteButton = fixture.debugElement.query(By.css('[data-test-id="delete-session-button"]'));
      expect(deleteButton).toBeNull();
    });
  })
 

  describe('Particiapte buttons', () => {
    it('should display participate button for non admin user who doest not participate', () => {
      component.session = { id: 1, name: 'Yoga', description: 'test', date: new Date(), teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };
      component.isAdmin = false;
      component.isParticipate = false;
      fixture.detectChanges();
  
      const participateButton = fixture.debugElement.query(By.css('button[color="primary"]'));
      expect(participateButton).toBeTruthy();
      expect(participateButton.nativeElement.textContent).toContain('Participate');
    });
  
    it('should display remove participate button for non admin user who already participate', () => {
      component.session = { id: 1, name: 'Yoga', description: 'test', date: new Date(), teacher_id: 1, users: [], createdAt: new Date(), updatedAt: new Date() };
      component.isAdmin = false;
      component.isParticipate = true;
      fixture.detectChanges();
  
      const noParticipateButton = fixture.debugElement.query(By.css('button[color="warn"]'));
      expect(noParticipateButton).toBeTruthy();
      expect(noParticipateButton.nativeElement.textContent).toContain('Do not participate');
    });
  })
  

});
