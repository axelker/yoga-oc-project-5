import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionApiService } from './session-api.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
  TestRequest,
} from '@angular/common/http/testing';
import { Session } from '../interfaces/session.interface';

describe('SessionsService', () => {
  let service: SessionApiService;
  let httpMock: HttpTestingController;
  const mockSessionRequest: Session = {
    id: 1,
    name: 'session1',
    description: 'description',
    date: new Date('2023-05-12'),
    teacher_id: 1,
    users: [],
  };
  const mockSessionResponse: Session = {
    id: 1,
    name: 'session1',
    description: 'description',
    date: new Date('2023-05-12'),
    teacher_id: 1,
    users: [],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(SessionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Get', () => {
    it('should get all sessions', (done) => {
      const mockSessionsResponse: Session[] = [
        {
          id: 1,
          name: 'session1',
          description: 'description',
          date: new Date('2023-05-12'),
          teacher_id: 1,
          users: [],
        },
        {
          id: 2,
          name: 'session2',
          description: 'description',
          date: new Date('2023-05-12'),
          teacher_id: 1,
          users: [],
        },
      ];
      service.all().subscribe((response) => {
        expect(response).toEqual(mockSessionsResponse);
        done();
      });

      const req: TestRequest = httpMock.expectOne('api/session');
      expect(req.request.method).toBe('GET');
      req.flush(mockSessionsResponse);
    });

    it('should get session detail', (done) => {
      const sessionId = '1';
      service.detail(sessionId).subscribe((response) => {
        expect(response).toEqual(mockSessionResponse);
        done();
      });

      const req: TestRequest = httpMock.expectOne('api/session/' + sessionId);
      expect(req.request.method).toBe('GET');
      req.flush(mockSessionResponse);
    });
  });

  it('Should create a session', (done) => {
    service.create(mockSessionRequest).subscribe((response) => {
      expect(response).toEqual(mockSessionResponse);
      done();
    });

    const req: TestRequest = httpMock.expectOne('api/session');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockSessionRequest);
    req.flush(mockSessionResponse);
  });

  it('Should delete a session', (done) => {
    const request: string = '1';
    service.delete(request).subscribe((response) => {
      expect(response).toEqual(mockSessionResponse);
      done();
    });

    const req: TestRequest = httpMock.expectOne('api/session/' + request);
    expect(req.request.method).toBe('DELETE');
    req.flush(mockSessionResponse);
  });

  it('Should update a session', (done) => {
    const sessionId: string = '1';
    service.update(sessionId, mockSessionRequest).subscribe((response) => {
      expect(response).toEqual(mockSessionResponse);
      done();
    });

    const req: TestRequest = httpMock.expectOne('api/session/' + sessionId);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(mockSessionRequest);
    req.flush(mockSessionResponse);
  });

  it('Should particiapte user to a session', () => {
    const sessionId: string = '1';
    const userId: string = '2';

    service.participate(sessionId, userId).subscribe();

    const expectedPath = `api/session/${sessionId}/participate/${userId}`;
    const req: TestRequest = httpMock.expectOne(expectedPath);
    expect(req.request.method).toBe('POST');
  });

  it('Should unParticiapte user to a session', () => {
    const sessionId: string = '1';
    const userId: string = '2';

    service.unParticipate(sessionId, userId).subscribe();

    const expectedPath = `api/session/${sessionId}/participate/${userId}`;
    const req: TestRequest = httpMock.expectOne(expectedPath);
    expect(req.request.method).toBe('DELETE');
  });
});
