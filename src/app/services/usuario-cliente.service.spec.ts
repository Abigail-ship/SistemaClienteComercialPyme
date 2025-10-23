import { TestBed } from '@angular/core/testing';

import { UsuarioClienteService } from './usuario-cliente.service';

describe('UsuarioClienteService', () => {
  let service: UsuarioClienteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuarioClienteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
