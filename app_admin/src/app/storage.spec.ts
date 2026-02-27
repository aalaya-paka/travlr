import { TestBed } from '@angular/core/testing';

import { BROWSER_STORAGE } from './storage';

describe('Storage', () => {
  it('should provide localStorage', () => {
    TestBed.configureTestingModule({
      providers: [
        { provide: BROWSER_STORAGE, useFactory: () => localStorage }
      ]
    });
    const storage = TestBed.inject(BROWSER_STORAGE);
    expect(storage).toBeTruthy();
  });
});
