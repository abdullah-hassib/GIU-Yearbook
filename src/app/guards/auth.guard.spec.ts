
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  provideRouter
} from '@angular/router';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';

import { AuthService, User } from '../services/auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const maya: User = {
    studentId: 1,
    name: 'Maya Hassan'
  };

  // Fake AuthService: only the methods used by authGuard
  const fakeAuth = {
    isLoggedIn: vi.fn(),
    checkSession: vi.fn()
  };

  function runGuard() {
    return TestBed.runInInjectionContext(() =>
      authGuard(
        {} as ActivatedRouteSnapshot,
        {} as RouterStateSnapshot
      )
    );
  }

  beforeEach(() => {
    // Reset fake functions before every test
    fakeAuth.isLoggedIn.mockReset();
    fakeAuth.isLoggedIn.mockReturnValue(false);
    fakeAuth.checkSession.mockReset();

    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: AuthService, useValue: fakeAuth }
      ]
    });
  });

  it('lets a signed-in user in without asking the server', () => {
    // Simulate an already authenticated user
    fakeAuth.isLoggedIn.mockReturnValue(true);

    expect(runGuard()).toBe(true);
    expect(fakeAuth.checkSession).not.toHaveBeenCalled();
  });

  it('lets the user in when the cookie is still valid after a reload', async () => {
    // Not logged in to memory, but session is valid
    fakeAuth.checkSession.mockReturnValue(of(maya));

    const result = await firstValueFrom(
      runGuard() as Observable<boolean>
    );

    expect(result).toBe(true);
    expect(fakeAuth.checkSession).toHaveBeenCalledOnce();
  });

  it('sends the visitor to /login when the server says 401', async () => {
    // Simulate a failed session check
    fakeAuth.checkSession.mockReturnValue(
      throwError(() => new Error('401'))
    );

    const result = await firstValueFrom(
      runGuard() as Observable<UrlTree>
    );

    expect(result).toBeInstanceOf(UrlTree);
    expect(result.toString()).toBe('/login');
  });
});
