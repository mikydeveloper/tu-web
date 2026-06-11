import { Component } from '@angular/core';
import { Hero } from '../hero/hero';
import { About } from '../about/about';
import { Projects } from '../projects/projects';

@Component({
  selector: 'app-home',
  standalone: true,
  // Solo importamos los 3 componentes que componen la página principal
  imports: [Hero, About, Projects],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  // Ya no necesitamos lógica de partículas aquí, la clase queda limpia
}
