import { TestBed } from '@angular/core/testing';

import { MisPedidosService } from './mis-pedidos.service';

describe('MisPedidosService', () => {
  let service: MisPedidosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MisPedidosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
