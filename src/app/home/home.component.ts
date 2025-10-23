import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ProductoService, Producto } from '../services/producto.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule,
    MatButtonModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  categorias: string[] = [];
  productos: Producto[] = [];
  productosPopulares: Producto[] = [];
  productosRecientes: Producto[] = [];

  constructor(private productoService: ProductoService, private router: Router) {}

  ngOnInit(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (res: any) => {
        const productos = res.$values || res || [];
        this.productos = productos;

        // Categorías
        const categoriasSet = new Set<string>();
        productos.forEach((p: any) => {
          if (p.categoria?.nombre) categoriasSet.add(p.categoria.nombre);
        });
        this.categorias = Array.from(categoriasSet);

        // Productos Populares: aquí usamos stock mínimo como referencia
        this.productosPopulares = productos
          .filter((p: Producto) => p.stock > 0)
          .sort((a: any, b: any) => b.stockMinimo - a.stockMinimo) // simula popularidad
          .slice(0, 6);

        // Productos Recientes: por fecha de creación
        this.productosRecientes = productos
          .sort((a: any, b: any) => new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime())
          .slice(0, 6);

      },
      error: (err) => console.error('Error al cargar productos:', err)
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }
}