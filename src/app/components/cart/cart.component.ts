import { Component } from '@angular/core';
import { CartService, CartItem } from '../../services/cart.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

// Importar módulos Angular y Angular Material
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],

  standalone: true,  // marca componente como standalone

  imports: [         // importa los módulos necesarios
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule
  ],
  providers: [CurrencyPipe] // Opcional para usar el pipe Currency en TS si quieres
})
export class CartComponent {
  items$: Observable<CartItem[]>;

  constructor(public cartService: CartService, private router: Router) {
    this.items$ = this.cartService.items$;
  }

  updateQuantity(item: CartItem, cantidad: number) {
    if (cantidad > 0) {
      this.cartService.updateQuantity(item.producto.productoId, cantidad);
    }
  }

  removeItem(productoId: number) {
    this.cartService.removeItem(productoId);
  }

  clearCart() {
    this.cartService.clearCart();
  }

  agregarMasProductos() {
    this.router.navigate(['/productos']);
  }

  getTotal(): number {
    return this.cartService.getTotal();
  }

  usuarioLogueado(): boolean {
  const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
  return !!(usuario && (usuario.UsuarioId || usuario.usuarioId) && (usuario.email || usuario.Email));
}

  irCheckout() {
  if (!this.usuarioLogueado()) {
    alert('Debe iniciar sesión para continuar con la compra.');
    this.router.navigate(['/login']);
    return;
  }

  this.router.navigate(['/checkout']);
}
}

