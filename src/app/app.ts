import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NgParticlesModule } from 'ng-particles';
import { loadSlim } from 'tsparticles-slim';
import { ISourceOptions } from 'tsparticles-engine';
import { Navbar } from './shared/components/navbar/navbar';
import { Footer } from './shared/components/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, NgParticlesModule, Navbar, Footer, RouterOutlet],
  template: `
    <div
      class="relative min-h-screen bg-[#0d0714] text-white font-sans overflow-hidden transition-colors duration-300"
    >
      <ng-particles
        [id]="id"
        [options]="particlesOptions()"
        [particlesInit]="particlesInit"
        class="absolute inset-0 z-0 block w-full h-full pointer-events-none"
      >
      </ng-particles>
      <div class="relative z-10 flex flex-col min-h-screen">
        <app-navbar />

        <router-outlet></router-outlet>

        <app-footer />
      </div>
    </div>
  `,
})
export class App {
  id = 'tsparticles';

  // Configuración de las partículas
  particlesOptions = signal<ISourceOptions>({
    fullScreen: { enable: false },
    background: { color: 'transparent' },
    fpsLimit: 120,
    particles: {
      color: { value: '#a855f7' },
      links: {
        color: '#6b21a8',
        distance: 120, // Lo bajamos un poquito para que las líneas se conecten más rápido
        enable: true,
        opacity: 0.6, // Subimos la opacidad de las líneas (antes 0.4)
        width: 1.5, // Líneas un pelín más gruesas
      },
      move: {
        enable: true,
        speed: 1.2, // Un toque extra de velocidad para que se vea más fluido
        direction: 'none',
        random: false,
        straight: false,
        outModes: { default: 'bounce' },
      },
      number: {
        density: { enable: true, area: 800 },
        value: 180, // ¡AQUÍ ESTÁ LA MAGIA! Subimos de 60 a 180 partículas
      },
      opacity: { value: 0.7 }, // Partículas más brillantes (antes 0.5)
      size: { value: { min: 1.5, max: 4 } }, // Partículas ligeramente más grandes
    },
    detectRetina: true,
  });
  // Convertido a función flecha para que no se rompa el fondo
  particlesInit = async (engine: any): Promise<void> => {
    await loadSlim(engine);
  };
}
