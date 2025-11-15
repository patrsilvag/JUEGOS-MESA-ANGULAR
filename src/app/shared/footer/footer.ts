import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss'], // ← corregido (plural)
})
export class FooterComponent {} // ← renombrado para seguir la convención
