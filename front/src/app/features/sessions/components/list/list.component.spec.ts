import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { expect } from '@jest/globals';
import { SessionService } from 'src/app/services/session.service';

import { ListComponent } from './list.component';
import { SessionApiService } from '../../services/session-api.service';
import { By } from '@angular/platform-browser';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';
import { Session } from '../../interfaces/session.interface';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

describe('ListComponent', () => {
  let component: ListComponent;
  let fixture: ComponentFixture<ListComponent>;
  let sessionApiService: SessionApiService;
  let sessionService: SessionService;
  const mockSessionInformation: SessionInformation = {
    id: 1,
    username: 'testUser',
    token: 'bearer',
    type: 'test',
    firstName: 'firstname',
    lastName: 'lastname',
    admin: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, MatCardModule, MatIconModule],
      providers: [
        {
          provide: SessionService,
          useValue: { sessionInformation: mockSessionInformation },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ListComponent);
    component = fixture.componentInstance;
    sessionApiService = TestBed.inject(SessionApiService);
    sessionService = TestBed.inject(SessionService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the Session title', () => {
    const titleElement = fixture.debugElement.query(By.css('mat-card-title')).nativeElement;
    expect(titleElement.textContent.trim()).toBe('Rentals available');
  });

  describe('Create button',() => {
    it('should not display on non admin user', () => {
      sessionService.sessionInformation = { admin: false } as any;
      fixture.detectChanges();
  
      const createButton = getCreateButton(fixture);
      expect(createButton).toBeNull();
    });

      it('Should display on admin user', () => {
        sessionService.sessionInformation= { admin: true } as any;
        fixture.detectChanges();
  
        const createButton = getCreateButton(fixture);
        expect(createButton).not.toBeNull();
      });
  
  });

  

  describe('Session list',() => {
    it('should display sessions from the observable', () => {
      const mockSessions: Session[] = [
        { id: 1,
          name: 'session1',
          description: 'description',
          date: new Date('2023-05-12'),
          teacher_id: 1,
          users: [],},
        {  id: 2,
          name: 'session2',
          description: 'description',
          date: new Date('2023-05-12'),
          teacher_id: 1,
          users: [],}
      ];
  
      jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));
      component.ngOnInit();
      fixture.detectChanges();
      const sessionElements = fixture.debugElement.queryAll(By.css('.item'));

      expect(sessionElements.length).toBe(2);
      expect(sessionElements[0].nativeElement.textContent).toContain('session1');
      expect(sessionElements[1].nativeElement.textContent).toContain('session2');
    });

    it('should display the Edit button on session item only for admins', () => {
      sessionService.sessionInformation = { admin: true } as any;
    
      const mockSessions: Session[] = [
        { id: 1, name: 'session1', description: 'description', date: new Date(), teacher_id: 1, users: [] }
      ];
    
      jest.spyOn(sessionApiService, 'all').mockReturnValue(of(mockSessions));
      
      component.ngOnInit();
      fixture.detectChanges();
    
      const editButton = fixture.debugElement.query(By.css('[data-test-id="edit-session-1"]'));
      
      expect(editButton).toBeTruthy();
      expect(editButton.nativeElement.textContent).toContain('Edit');
    });
    
  });
});

function getCreateButton(fixture: ComponentFixture<ListComponent>) {
  return fixture.debugElement.query(
    By.css('[data-test-id="create-session-button"]')
  );
}

function getEditButton(fixture: ComponentFixture<ListComponent>) {
  return fixture.debugElement.query(
    By.css('[data-test-id="create-session-button"]')
  );
}
