import { TestBed } from '@angular/core/testing';

import { GlobalRuntimeConfigService } from './global-runtime-config.service';

describe('GlobalRuntimeConfigService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GlobalRuntimeConfigService = TestBed.get(GlobalRuntimeConfigService);
    expect(service).toBeTruthy();
  });
});
