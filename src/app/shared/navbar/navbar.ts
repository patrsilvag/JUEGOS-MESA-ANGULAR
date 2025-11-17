import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth.service';
import { Cart } from '../../core/cart';
import { Usuario } from '../../core/auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [CommonModule, RouterModule],
})
export class NavbarComponent {
  usuario: Usuario | null = null;
  cantidadTotal = 0;

  constructor(private auth: AuthService, private cart: Cart) {
    this.usuario = this.auth.getUsuarioActual();

    this.cart.carrito$.subscribe((items) => {
      this.cantidadTotal = items.reduce((acc, i) => acc + i.cantidad, 0);
    });
  }

  logout() {
    this.auth.logout();
    this.usuario = null;
  }
}
