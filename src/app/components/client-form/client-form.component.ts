import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ClienteService, Cliente } from '../../services/cliente.service';

@Component({
  selector: 'app-cliente-form',
  standalone: true,
  imports: [FormsModule, CommonModule],
  template: `
  <form (ngSubmit)="registrarCliente()">
    <input [(ngModel)]="cliente.nombres" name="nombres" placeholder="Nombres" required />
    <input [(ngModel)]="cliente.apellidos" name="apellidos" placeholder="Apellidos" required />
    <input [(ngModel)]="cliente.direccion" name="direccion" placeholder="Dirección" />
    <input [(ngModel)]="cliente.telefono" name="telefono" placeholder="Teléfono" />
    <input [(ngModel)]="cliente.email" name="email" placeholder="Email" type="email" />
    <button type="submit">Registrarme</button>
  </form>
  <p *ngIf="clienteRegistrado">Cliente registrado con ID: {{ clienteRegistrado.clienteId }}</p>
  `
})
export class ClienteFormComponent {
  cliente: Cliente = { nombres: '', apellidos: '' };
  clienteRegistrado?: Cliente;

  constructor(private clienteService: ClienteService) {}

  registrarCliente() {
    this.clienteService.crearCliente(this.cliente).subscribe(cliente => {
      this.clienteRegistrado = cliente;
    });
  }
}
