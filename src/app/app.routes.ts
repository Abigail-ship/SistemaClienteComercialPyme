import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductosComponent } from './components/productos/productos.component';
import { CartComponent } from './components/cart/cart.component';
import { ProductDetailComponent } from './components/product-detail/product-detail.component';
import { CheckoutComponent } from './components/checkout/checkout.component';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'producto/:id', component: ProductDetailComponent }, // detalle
  { path: 'carrito', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'mis-pedidos', component: MisPedidosComponent }, 
  { path: '**', redirectTo: 'home' }
];
