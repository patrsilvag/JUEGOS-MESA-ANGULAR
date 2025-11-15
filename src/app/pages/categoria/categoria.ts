import { Component } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-categoria',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categoria.html',
  styleUrls: ['./categoria.scss'],
})
export class CategoriaComponent {
  slug!: string;

  categoriasData: any = {
    amigos: {
      titulo: 'Juegos para Amigos',
      subtitulo: '¡Dibuja, adivina y tiembla! La diversión se apila.',
    },
    cartas: {
      titulo: 'Juegos de Cartas',
      subtitulo: 'Barajas y juegos rápidos para todos',
    },
    estrategia: {
      titulo: 'Juegos de Estrategia',
      subtitulo: 'Planifica, conquista y desafía tu mente',
    },
    infantiles: {
      titulo: 'Juegos Infantiles',
      subtitulo: 'Aprendizaje y diversión para los más pequeños',
    },
  };

  // =========================================================
  // 🔥 PRODUCTOS MIGRADOS DESDE productos.js
  // =========================================================
  productos = [
    // Estrategia
    {
      id: 'sku-catan',
      nombre: 'Catan',
      categoria: 'estrategia',
      precio: 29990,
      descuento: true,
      imagen: 'assets/img/catan.webp',
      alt: 'Tablero del juego Catan con piezas de madera y caminos',
      desc: 'Coloniza la isla y comercia recursos.',
    },
    {
      id: 'sku-risk',
      nombre: 'Risk',
      categoria: 'estrategia',
      precio: 24990,
      descuento: false,
      imagen: 'assets/img/risk.webp',
      alt: 'Tablero mundial del juego Risk con tropas distribuidas',
      desc: 'Conquista el mundo con estrategia militar.',
    },
    {
      id: 'sku-ajed',
      nombre: 'Ajedrez Clásico',
      categoria: 'estrategia',
      precio: 14990,
      descuento: true,
      imagen: 'assets/img/ajedrez.webp',
      alt: 'Tablero de ajedrez con piezas blancas y negras',
      desc: 'El clásico de estrategia por excelencia.',
    },

    // Cartas
    {
      id: 'sku-ek',
      nombre: 'Exploding Kittens',
      categoria: 'cartas',
      precio: 16990,
      descuento: true,
      imagen: 'assets/img/exploding_kittens.webp',
      alt: 'Cartas ilustradas del juego Exploding Kittens',
      desc: 'Evita explotar con cartas de defensa.',
    },
    {
      id: 'sku-dob',
      nombre: 'Dobble',
      categoria: 'cartas',
      precio: 10990,
      descuento: false,
      imagen: 'assets/img/dobble.webp',
      alt: 'Jugadores con cartas circulares del juego Dobble',
      desc: 'Encuentra el símbolo común antes que otros.',
    },
    {
      id: 'sku-poker',
      nombre: 'Set Póker Clásico',
      categoria: 'cartas',
      precio: 19990,
      descuento: true,
      imagen: 'assets/img/cartas_poker.webp',
      alt: 'Cartas y fichas de póker sobre mesa verde',
      desc: 'Baraja y fichas para clásicos de casino.',
    },

    // Amigos
    {
      id: 'sku-pict',
      nombre: 'Pictionary',
      categoria: 'amigos',
      precio: 18990,
      descuento: true,
      imagen: 'assets/img/pictionary.webp',
      alt: 'Personas dibujando y adivinando en Pictionary',
      desc: 'Dibuja y adivina, ideal en grupo.',
    },
    {
      id: 'sku-jenga',
      nombre: 'Jenga',
      categoria: 'amigos',
      precio: 13990,
      descuento: false,
      imagen: 'assets/img/jenga.webp',
      alt: 'Manos retirando bloques de una torre de Jenga',
      desc: 'Pulso firme para que no caiga la torre.',
    },
    {
      id: 'sku-uno',
      nombre: 'UNO',
      categoria: 'amigos',
      precio: 8990,
      descuento: true,
      imagen: 'assets/img/uno.webp',
      alt: 'Cartas del juego UNO extendidas en mesa',
      desc: 'Clásico de descarte ágil y divertido.',
    },

    // Infantiles
    {
      id: 'sku-candy',
      nombre: 'Candy Land',
      categoria: 'infantiles',
      precio: 12990,
      descuento: true,
      imagen: 'assets/img/candyland.webp',
      alt: 'Tablero colorido del juego Candy Land',
      desc: 'Aprenden colores y turnos.',
    },
    {
      id: 'sku-serp',
      nombre: 'Serpientes y Escaleras',
      categoria: 'infantiles',
      precio: 9990,
      descuento: false,
      imagen: 'assets/img/serpientes.webp',
      alt: 'Tablero de Serpientes y Escaleras con dados',
      desc: 'Azar y paciencia para los más pequeños.',
    },
    {
      id: 'sku-memo',
      nombre: 'Memoria Animales',
      categoria: 'infantiles',
      precio: 7990,
      descuento: true,
      imagen: 'assets/img/memoria.webp',
      alt: 'Cartas de animales de un juego de memoria',
      desc: 'Mejora la concentración y memoria visual.',
    },
  ];

  categoriaActual: any = null;
  productosFiltrados: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.params['slug'];
    this.categoriaActual = this.categoriasData[this.slug];

    // 👉 Filtrar y mostrar solo 3 productos
    this.productosFiltrados = this.productos.filter((p) => p.categoria === this.slug).slice(0, 3);
  }
}
