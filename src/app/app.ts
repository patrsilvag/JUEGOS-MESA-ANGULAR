import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// IMPORTA TUS COMPONENTES
import { Navbar } from './shared/navbar/navbar';
import { Footer } from './shared/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Navbar, // 👈 agregado
    Footer, // 👈 agregado
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
