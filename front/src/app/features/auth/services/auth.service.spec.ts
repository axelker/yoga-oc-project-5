import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { RegisterRequest } from '../interfaces/registerRequest.interface';
import { LoginRequest } from '../interfaces/loginRequest.interface';
import { SessionInformation } from 'src/app/interfaces/sessionInformation.interface';

describe('AuthService', () => {
    let service: AuthService;
    let httpMock: HttpTestingController;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
      });
  
      service = TestBed.inject(AuthService);
      httpMock = TestBed.inject(HttpTestingController);
    });
  
    afterEach(() => {
      httpMock.verify();
    });
    
    describe('Register', () => {
        it('should register a user', () => {
            const mockRequest: RegisterRequest = {
                firstName: 'testUser',
                lastName:'test',
                password: 'securepassword',
                email: 'test@test.com',
            };
        
            service.register(mockRequest).subscribe();
        
            const req:TestRequest = httpMock.expectOne('api/auth/register');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockRequest);
        });
    });
    
    describe('Login', () => {
        it('should login a user and return session information', (done) => {
            const mockRequest: LoginRequest = {
                email: 'test@test.com',
                password: 'securepassword',
            };
        
            const mockResponse: SessionInformation = {
                id: 1,
                username: 'testUser',
                token: 'bearer',
                type: 'test',
                firstName: 'firstname',
                lastName: 'lastname',
                admin: true,
            };
        
            service.login(mockRequest).subscribe(response => {
                expect(response).toEqual(mockResponse);
                done()
            });
        
            const req: TestRequest = httpMock.expectOne('api/auth/login');
            expect(req.request.method).toBe('POST');
            expect(req.request.body).toEqual(mockRequest);
            req.flush(mockResponse);
        });
    });
});