import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { UserService } from './user.service';
import { User } from '../interfaces/user.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });

    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should retrieve a user by id', (done) => {
    const userId ="1";
    const mockUser: User = {
      id: 1,
      email: 'test@example.com',
      lastName: 'Doe',
      firstName: 'John',
      admin: false,
      password: 'securepassword',
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-01'),
    };
    service.getById(userId).subscribe((response) => {
      expect(response).toEqual(mockUser);
      done();
    });

    const req = httpMock.expectOne('api/user/'+userId);
    expect(req.request.method).toBe('GET');

    req.flush(mockUser);
  });

  it('should delete a user by id', () => {
    const userId ="1";

    service.delete(userId).subscribe();

    const req = httpMock.expectOne('api/user/'+userId);
    expect(req.request.method).toBe('DELETE');
  });
});
