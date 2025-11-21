import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cart, CartItem } from '../../core/cart';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './carrito.html',
  styleUrl: './carrito.scss',
})
export class CarritoComponent implements OnInit {
  carritoLista: CartItem[] = [];

  cuponForm!: FormGroup;
  mensajeCupon: string | null = null;

  constructor(public cart: Cart, private fb: FormBuilder) {}

  ngOnInit() {
    // Formulario reactivo
    this.cuponForm = this.fb.group({
      codigoDescuento: ['', [Validators.required, Validators.minLength(4)]],
    });

    // Subscribirse al carrito
    this.cart.carrito$.subscribe((items: CartItem[]) => {
      this.carritoLista = items ?? [];
    });
  }

  aplicarCupon() {
    if (this.cuponForm.invalid) {
      this.mensajeCupon = 'Código inválido o demasiado corto.';
      return;
    }

    const codigo = this.cuponForm.value.codigoDescuento.trim().toUpperCase();

    if (codigo === 'DESCUENTO10') {
      this.cart.aplicarDescuento(10);
      this.mensajeCupon = 'Cupón aplicado correctamente (10% OFF).';
    } else {
      this.mensajeCupon = 'Cupón no válido.';
    }
  }

  subtotalOriginal() {
    return this.carritoLista.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  }

  limpiarCupon() {
    this.cuponForm.reset();
    this.mensajeCupon = null;
  }

  sumar(id: string) {
    this.cart.sumar(id);
  }

  restar(id: string) {
    this.cart.restar(id);
  }

  quitar(id: string) {
    this.cart.quitarProducto(id);
  }

  limpiarCarrito() {
    this.cart.limpiar();
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
