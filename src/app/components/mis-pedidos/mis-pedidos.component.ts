import { Component, OnInit } from '@angular/core';
import { CommonModule} from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PedidosService } from '../../services/mis-pedidos.service';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.component.html',
  styleUrls: ['./mis-pedidos.component.scss'],
  standalone: true,  

  imports: [         
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ]
})
export class MisPedidosComponent implements OnInit {
  pedidos: any[] = [];
  cargando = true;
  error = '';

  constructor(private pedidosService: PedidosService) {}

  ngOnInit() {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  if (!usuario || !usuario.UsuarioId) {
    this.error = 'No se encontró el usuario logueado.';
    this.pedidos = [];
    this.cargando = false;
    return;
  }

  const usuarioId = usuario.UsuarioId; // ✅ Tomamos el ID del objeto completo

  this.pedidosService.obtenerPedidosUsuario(usuarioId).subscribe({
    next: (data) => {
      console.log('Pedidos recibidos:', data);
      this.pedidos = data;
      this.cargando = false;
    },
    error: () => {
      this.error = 'Error al cargar tus pedidos.';
      this.cargando = false;
    }
  });
}

}
