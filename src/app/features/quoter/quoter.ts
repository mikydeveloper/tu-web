import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router'; // <-- Importación necesaria
import { Supabase } from '../../core/services/supabase';

@Component({
  selector: 'app-quoter',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './quoter.html',
  styleUrl: './quoter.scss',
})
export class Quoter implements OnInit {
  quoterForm: FormGroup;
  servicios = signal<any[]>([]);
  totalEstimado = signal<number>(0);
  isSubmitting = signal<boolean>(false);
  mensajeExito = signal<boolean>(false);
  isLoadingCatalog = signal<boolean>(true);

  // Inyección del Router para la navegación entre módulos
  private router = inject(Router);

  constructor(
    private fb: FormBuilder,
    private supabaseService: Supabase,
  ) {
    this.quoterForm = this.fb.group({
      nombre: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', Validators.required],
      servicioId: ['', Validators.required],
    });

    this.quoterForm.get('servicioId')?.valueChanges.subscribe((id) => {
      const servicioSelec = this.servicios().find((s) => s.id_item === Number(id));
      if (servicioSelec) {
        this.totalEstimado.set(servicioSelec.precio_base);
      } else {
        this.totalEstimado.set(0);
      }
    });
  }

  async ngOnInit() {
    try {
      this.isLoadingCatalog.set(true);
      const data = await this.supabaseService.getItemsCotizables();
      this.servicios.set(data || []);
    } catch (error) {
      console.error('Error cargando catálogo:', error);
    } finally {
      this.isLoadingCatalog.set(false);
    }
  }

  async enviarCotizacion() {
    if (this.quoterForm.invalid) return;

    this.isSubmitting.set(true);
    try {
      const formValues = this.quoterForm.value;

      // 1. Guardar Prospecto (1FN)
      const { data: prospecto, error: errPros } = await this.supabaseService.supabase
        .from('prospecto')
        .insert([
          { nombre: formValues.nombre, correo: formValues.correo, telefono: formValues.telefono },
        ])
        .select()
        .single();

      if (errPros) throw errPros;

      // 2. Crear Cotización
      const { data: cotizacion, error: errCot } = await this.supabaseService.supabase
        .from('cotizacion')
        .insert([
          {
            id_prospecto: prospecto.id_prospecto,
            monto_total: this.totalEstimado(),
            estado: 'Pendiente',
          },
        ])
        .select()
        .single();

      if (errCot) throw errCot;

      // 3. Crear Detalle_Cotizacion (2FN)
      await this.supabaseService.supabase.from('detalle_cotizacion').insert([
        {
          id_cotizacion: cotizacion.id_cotizacion,
          id_item: Number(formValues.servicioId),
          subtotal: this.totalEstimado(),
        },
      ]);

      // Mostrar mensaje de éxito
      this.mensajeExito.set(true);

      // UX: Esperar 1.5 segundos para que el usuario lea el mensaje de éxito,
      // y luego redirigir automáticamente al módulo de agendamiento
      setTimeout(() => {
        this.router.navigate(['/agendar', prospecto.id_prospecto]);
      }, 10000);
    } catch (error) {
      console.error('Error en transacción:', error);
      alert('Hubo un error al conectar con la base de datos.');
      this.isSubmitting.set(false);
    }
  }
}
