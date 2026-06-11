import { Routes } from '@angular/router';
import { Home } from './features/home/home'; // Ajusta la ruta si es necesario
import { Quoter } from './features/quoter/quoter';
import { Booking } from './features/booking/booking';

export const routes: Routes = [
  { path: '', component: Home, pathMatch: 'full' },
  { path: 'cotizador', component: Quoter },
  { path: 'agendar', component: Booking },
  { path: '**', redirectTo: '' },
];
