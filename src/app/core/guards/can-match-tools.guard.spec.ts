import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { canMatchToolsGuard } from './can-match-tools.guard';

describe('canMatchToolsGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => canMatchToolsGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
