import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Cart, CartItem } from '../../core/cart';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class CarritoComponent {
  carritoLista: CartItem[] = []; // ✔ TIPADO CORRECTO

  constructor(public cart: Cart) {
    this.cart.carrito$.subscribe((items: CartItem[]) => {
      this.carritoLista = items ?? [];
    });
  }

  total() {
    return this.cart.total();
  }
  envio() {
    return this.cart.envio();
  }
  totalFinal() {
    return this.cart.totalFinal();
  }
}
