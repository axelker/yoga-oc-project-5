import { TestBed } from '@angular/core/testing';
import { expect } from '@jest/globals';
import { Router } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { SessionService } from '../services/session.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
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
        AuthGuard,
        { provide: SessionService, useValue: sessionService },
        { provide: Router, useValue: router },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when the user is logged in', () => {
    sessionService.isLogged = true;

    const result = guard.canActivate();

    expect(result).toBe(true);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should prevent activation and redirect to login when the user is not logged in', () => {
    sessionService.isLogged = false;

    const result = guard.canActivate();

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['login']);
  });
});
