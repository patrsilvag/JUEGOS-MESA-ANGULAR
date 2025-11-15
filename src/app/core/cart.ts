import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  imagen: string;
  cantidad: number;
}

@Injectable({ providedIn: 'root' })
export class Cart {
  private items = new BehaviorSubject<CartItem[]>([]);

  carrito$ = this.items.asObservable();

  // 🔹 Agregar al carrito
  agregar(p: CartItem) {
    const actual = [...this.items.value];
    const existe = actual.find((i) => i.id === p.id);

    if (existe) {
      existe.cantidad += p.cantidad;
    } else {
      actual.push({ ...p });
    }

    this.items.next(actual);
  }

  // 🔹 Sumar cantidad
  sumar(id: string) {
    const actual = [...this.items.value];
    const item = actual.find((i) => i.id === id);

    if (item) {
      item.cantidad++;
      this.items.next(actual);
    }
  }

  // 🔹 Restar cantidad
  restar(id: string) {
    const actual = [...this.items.value];
    const item = actual.find((i) => i.id === id);

    if (item && item.cantidad > 1) {
      item.cantidad--;
      this.items.next(actual);
    }
  }

  // 🔹 Eliminar producto
  quitarProducto(id: string) {
    const actual = this.items.value.filter((i) => i.id !== id);
    this.items.next(actual);
  }

  // 🔹 Limpiar carrito
  limpiar() {
    this.items.next([]);
  }

  // 🔹 Total general
  total() {
    return this.items.value.reduce((sum, p) => sum + p.cantidad * p.precio, 0);
  }

  // 🔹 Envío basado en subtotal
  envio() {
    const subtotal = this.total();
    return subtotal >= 50000 ? 0 : 3990;
  }

  // 🔹 Total final con envío incluido
  totalFinal() {
    return this.total() + this.envio();
  }
}