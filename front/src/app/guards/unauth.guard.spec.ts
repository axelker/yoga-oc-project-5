import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { SessionService } from '../services/session.service';
import { UnauthGuard } from './unauth.guard';

describe('UnauthGuard', () => {
  let guard: UnauthGuard;
  let sessionService: jest.Mocked<SessionService>;
  let router: jest.Mocked<Partial<Router>>;

  beforeEach(() => {
    sessionService = {
      isLogged: false,
    } as jest.Mocked<SessionService>;

    router = {
      navigate: jest.fn(),
    } as jest.Mocked<Partial<Router>>;

    TestBed.configureTestingModule({
      providers: [
        UnauthGuard,
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(UnauthGuard);
  });

  afterEach(() => {
      jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should prevent activation and redirect to rentals when the user is logged in', () => {
    sessionService.isLogged = true;

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['rentals']);
  });

  it('should allow activation when the user is not logged in', () => {
    sessionService.isLogged = false;

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });
});
