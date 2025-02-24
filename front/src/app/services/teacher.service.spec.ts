import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { TeacherService } from './teacher.service';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';
import { Teacher } from '../interfaces/teacher.interface';

describe('TeacherService', () => {
  let service: TeacherService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TeacherService],
    });

    service = TestBed.inject(TeacherService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should retrieve all teachers', (done) => {
    const mockTeachers: Teacher[] = [
      {
        id: 1,
        firstName: 'Teacher 1',
        lastName: 'test',
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-05-01'),
      },
      {
        id: 2,
        firstName: 'Teacher 2',
        lastName: 'test',
        createdAt: new Date('2023-05-01'),
        updatedAt: new Date('2023-05-01'),
      },
    ];

    service.all().subscribe(response => {
      expect(response).toEqual(mockTeachers);
      done(); 
    });

    const req = httpMock.expectOne('api/teacher');
    expect(req.request.method).toBe('GET');

    req.flush(mockTeachers);
  });

  it('should retrieve a teacher by id', (done) => {
    const teacherId = '1';
    const mockTeacher: Teacher = {
      id: 1,
      firstName: 'Teacher 1',
      lastName: 'test',
      createdAt: new Date('2023-05-01'),
      updatedAt: new Date('2023-05-01'),
    };

    service.detail(teacherId).subscribe(response => {
      expect(response).toEqual(mockTeacher);
      done();
    });

    const req = httpMock.expectOne('api/teacher/'+teacherId);
    expect(req.request.method).toBe('GET');

    req.flush(mockTeacher);
  });
});
