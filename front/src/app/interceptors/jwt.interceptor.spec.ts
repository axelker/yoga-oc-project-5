import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { SessionService } from '../services/session.service';
import { JwtInterceptor } from './jwt.interceptor';
import { HttpHandler, HttpRequest, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';

describe('JwtInterceptor', () => {
    let service: JwtInterceptor;
    let sessionService: jest.Mocked<SessionService>;
    let httpHandlerMock: jest.Mocked<HttpHandler>;

    beforeEach(() => {
        sessionService = {
        isLogged: false,
        } as jest.Mocked<SessionService>;

        httpHandlerMock = {
            handle: jest.fn().mockImplementation((req: HttpRequest<any>) => of(new HttpResponse({ status: 200 }))),
          } as jest.Mocked<HttpHandler>;
    
        TestBed.configureTestingModule({
        providers: [
            { provide: SessionService, useValue: sessionService },
        ],
        });

        service = TestBed.inject(JwtInterceptor);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should add the Authorization header when user is logged in', () => {
        let interceptedRequest!: HttpRequest<any>;
        sessionService.isLogged = true;
        sessionService.sessionInformation = {
            id: 1,
            username: 'testUser',
            token: 'bearer_token',
            type: 'test',
            firstName: 'firstname',
            lastName: 'lastname',
            admin: true,
        };
        httpHandlerMock.handle.mockImplementation((req) => {
            interceptedRequest = req;
            return of(new HttpResponse({ status: 200 }));
        });
        const request = new HttpRequest('GET', '/api/test');
    
        service.intercept(request, httpHandlerMock);

        expect(interceptedRequest.headers.get('Authorization')).toBe(`Bearer ${sessionService.sessionInformation.token}`);

    });

    it('should not add the Authorization header when user is not logged in', () => {
        let interceptedRequest!: HttpRequest<any>;
        sessionService.isLogged = false;
        sessionService.sessionInformation = undefined;
        httpHandlerMock.handle.mockImplementation((req) => {
            interceptedRequest = req;
            return of(new HttpResponse({ status: 200 }));
        });
        const request = new HttpRequest('GET', '/api/test');
    
        service.intercept(request, httpHandlerMock);

        expect(interceptedRequest.headers.get('Authorization')).toBeNull();

    });
});
