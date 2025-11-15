import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Cart } from '../../core/cart';
import { Observable } from 'rxjs';
import { CartItem } from '../../core/cart';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
})
export class NavbarComponent {
  cantidadTotal = 0;

  constructor(private cart: Cart) {
    this.cart.carrito$.subscribe((items) => {
      this.cantidadTotal = items.reduce((s, i) => s + i.cantidad, 0);
    });
  }
}
