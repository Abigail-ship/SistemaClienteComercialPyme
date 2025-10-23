import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginUsuarioClienteComponent } from './login-usuario-cliente.component';

describe('LoginUsuarioClienteComponent', () => {
  let component: LoginUsuarioClienteComponent;
  let fixture: ComponentFixture<LoginUsuarioClienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginUsuarioClienteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginUsuarioClienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
