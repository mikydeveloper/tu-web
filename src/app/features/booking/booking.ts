import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Supabase, ReservaCita, Prospecto } from '../../core/services/supabase';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './booking.html',
})
export class Booking implements OnInit {
  private route = inject(ActivatedRoute);
  private supabaseService = inject(Supabase);
  private fb = inject(FormBuilder);

  public enlaceMeetGenerado = signal<string>('');
  public idProspecto = signal<string>('');

  // UX: Estados reactivos para manejar la carga y los errores
  public isSubmitting = signal<boolean>(false);
  public mensajeError = signal<string>('');

  // Formulario unificado
  public bookingForm = this.fb.group({
    nombre: [''],
    correo: [''],
    fechaCita: ['', Validators.required],
  });

  ngOnInit(): void {
    const idUrl = this.route.snapshot.paramMap.get('id');
    if (idUrl) {
      // Si viene del cotizador, ya tenemos su ID
      this.idProspecto.set(idUrl);
    } else {
      // Si entra directo, hacemos obligatorios los campos de contacto
      this.bookingForm.controls.nombre.setValidators([Validators.required]);
      this.bookingForm.controls.correo.setValidators([Validators.required, Validators.email]);
      this.bookingForm.controls.nombre.updateValueAndValidity();
      this.bookingForm.controls.correo.updateValueAndValidity();
    }
  }

  async confirmarAgendamiento(): Promise<void> {
    if (this.bookingForm.invalid) return;

    // Iniciamos la carga y limpiamos errores previos
    this.isSubmitting.set(true);
    this.mensajeError.set('');

    try {
      let idFinal = this.idProspecto();

      // Si entra directo desde el menú (sin ID previo), lo registramos
      if (!idFinal) {
        const nuevoProspecto: Prospecto = {
          nombre: this.bookingForm.value.nombre!,
          correo: this.bookingForm.value.correo!,
          telefono: 'No especificado (Agendamiento Directo)',
        };

        const resProspecto = await this.supabaseService.registrarProspecto(nuevoProspecto);

        if (resProspecto && resProspecto.id_prospecto) {
          // Aseguramos que se convierta a string
          idFinal = resProspecto.id_prospecto.toString();
        } else {
          throw new Error('Fallo al registrar el prospecto en la base de datos.');
        }
      }

      // Generamos el enlace simulado de Google Meet
      const randomHash = Math.random().toString(36).substring(2, 11);
      const linkMeet = `https://meet.google.com/${randomHash.match(/.{1,3}/g)?.join('-')}`;

      const nuevaReserva: ReservaCita = {
        id_prospecto: idFinal,
        fecha_hora_cita: this.bookingForm.value.fechaCita!,
        enlace_meet: linkMeet,
        estado_cita: 'Pendiente',
      };

      // Guardamos la reserva usando tu método
      const exito = await this.supabaseService.book(nuevaReserva);

      if (exito) {
        this.enlaceMeetGenerado.set(linkMeet);
      } else {
        throw new Error('Fallo al guardar la cita en Supabase.');
      }
    } catch (error) {
      console.error('Error en el flujo de agendamiento:', error);
      this.mensajeError.set('Hubo un problema al procesar tu reserva. Intenta de nuevo.');
    } finally {
      // Siempre apagamos el estado de carga al terminar (sea éxito o error)
      this.isSubmitting.set(false);
    }
  }
}
