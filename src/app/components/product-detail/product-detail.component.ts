import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

import { ProductoService, Producto } from '../../services/producto.service';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],

  standalone: true,

  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule
  ],

  providers: [CurrencyPipe, DatePipe]
})
export class ProductDetailComponent implements OnInit {
  producto: Producto | null = null;
  cargando = true;
  error: string | null = null;
  cantidad = 1;

  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute,
    private router: Router,
     private cartService: CartService
  ) {}

  ngOnInit(): void {
    const idStr = this.route.snapshot.paramMap.get('id');
    const id = idStr ? +idStr : null;

    if (id === null) {
      this.error = 'ID de producto inválido.';
      this.cargando = false;
      return;
    }

    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (prod) => {
        this.producto = prod;
        this.cargando = false;
      },
      error: (err) => {
        this.error = 'No se pudo cargar el producto.';
        this.cargando = false;
      }
    });
  }

  decreaseCantidad() {
    this.cantidad = Math.max(1, this.cantidad - 1);
  }

  increaseCantidad() {
    if (this.producto) {
      this.cantidad = Math.min(this.producto.stock, this.cantidad + 1);
    }
  }

  addToCart() {
    if (this.producto && this.cantidad > 0 && this.cantidad <= this.producto.stock) {
      this.cartService.addItem(this.producto, this.cantidad);
      // No redireccionamos para que puedas seguir viendo el producto
      alert(`Se añadieron ${this.cantidad} unidades de ${this.producto.nombre} al carrito.`);
    }
  }
}


