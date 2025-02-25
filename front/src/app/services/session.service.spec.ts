import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';

import { SessionService } from './session.service';
import { SessionInformation } from '../interfaces/sessionInformation.interface';
import { take, toArray } from 'rxjs';

describe('SessionService', () => {
  let service: SessionService;
  const sessionInfo: SessionInformation = {
    id: 1,
    username: 'testUser',
    token: 'bearer',
    type: 'test',
    firstName: 'firstname',
    lastName: 'lastname',
    admin: true,
  };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with isLogged as false and sessionInformation as undefined', () => {
    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should set isLogged to true and store session information on logIn', () => {
    service.logIn(sessionInfo);

    expect(service.isLogged).toBe(true);
    expect(service.sessionInformation).toEqual(sessionInfo);
  });

  it('should set isLogged to false and clear session information on logOut', () => {
    service.logIn(sessionInfo);
    service.logOut();

    expect(service.isLogged).toBe(false);
    expect(service.sessionInformation).toBeUndefined();
  });

  it('should emit the correct values in $isLogged()', (done) => {
    service.$isLogged().pipe(
      take(3),
      toArray()
    ).subscribe((values: boolean[]) => {
      expect(values).toEqual([false, true, false]);
      done();
    });

    service.logIn(sessionInfo);
    service.logOut();
  });
});
