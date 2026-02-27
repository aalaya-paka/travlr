import { TestBed } from '@angular/core/testing';

import { JwtInterceptor } from './jwt.interceptor';

describe('JwtInterceptor', () => {
  it('should create an instance', () => {
    const interceptor = new JwtInterceptor(null as any);
    expect(interceptor).toBeTruthy();
  });
});
