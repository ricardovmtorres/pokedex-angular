import { TestBed } from '@angular/core/testing';

import { GeracaoService } from './geracao.service';

describe('GeracaoService', () => {
  let service: GeracaoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeracaoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
