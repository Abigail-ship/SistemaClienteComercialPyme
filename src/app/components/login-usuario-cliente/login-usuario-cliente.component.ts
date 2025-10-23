import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { UsuarioClienteService, UsuarioCliente } from '../../services/usuario-cliente.service';


@Component({
  selector: 'app-login-usuario-cliente',
  templateUrl: './login-usuario-cliente.component.html',
  styleUrls: ['./login-usuario-cliente.component.scss'], 
  standalone: true,
    imports: [
      CommonModule, 
      FormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatCardModule
    ]
})
export class LoginUsuarioClienteComponent {
  email = '';
  password = '';
  nombres = '';
  apellidos = '';
  usuarioId?: number;
  pedidos: any[] = [];

  constructor(private usuarioService: UsuarioClienteService, private dialogRef: MatDialogRef<LoginUsuarioClienteComponent> ) { }

  registrar() {
    const nuevoUsuario: UsuarioCliente = {
      email: this.email,
      passwordHash: this.password,
      nombres: this.nombres,
      apellidos: this.apellidos
    };

    this.usuarioService.registrar(nuevoUsuario).subscribe({
      next: res => alert(res.mensaje),
      error: err => alert(err.error.mensaje || 'Error en el registro')
    });
  }

  login() {
    const datosLogin: UsuarioCliente = {
      email: this.email,
      passwordHash: this.password
    };

    this.usuarioService.login(datosLogin).subscribe({
      next: res => {
        alert('Inicio de sesión exitoso');

        // 🔹 Guardar usuario completo en localStorage de forma consistente
        const usuarioParaAlmacen = {
          UsuarioId: res.usuarioId || res.UsuarioId, // siempre mayúscula/minúscula
          nombres: res.nombres,
          apellidos: res.apellidos,
          email: res.email
        };

        localStorage.setItem('usuario', JSON.stringify(usuarioParaAlmacen));

        this.dialogRef.close(usuarioParaAlmacen); // Cierra el dialog y devuelve el usuario
      },
      error: err => alert(err.error.mensaje || 'Error en login')
    });
  }


  obtenerPedidos() {
    if (!this.usuarioId) return;
    this.usuarioService.obtenerPedidos(this.usuarioId).subscribe({
      next: data => this.pedidos = data,
      error: err => console.error(err)
    });
  }
}
