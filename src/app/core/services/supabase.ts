import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

export interface ReservaCita {
  id_prospecto: string;
  fecha_hora_cita: string;
  enlace_meet: string;
  estado_cita: string;
}

export interface Prospecto {
  id_prospecto?: string;
  nombre: string;
  correo: string;
  telefono: string;
}

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  public supabase: SupabaseClient;

  // ¡IMPORTANTE! Pega aquí tu URL y Key de Supabase (Project Settings -> API)
  private supabaseUrl = 'https://vylawtdkoymogfbjtvef.supabase.co';
  private supabaseKey = 'sb_publishable_nA5-xlAGqWqxTjR7U170Yg_UXxdMaIF';

  constructor() {
    this.supabase = createClient(this.supabaseUrl, this.supabaseKey);
  }

  // Método para obtener el catálogo de servicios y alimentar tu cotizador
  async getItemsCotizables() {
    const { data, error } = await this.supabase.from('item_cotizable').select('*');

    if (error) {
      console.error('Error al cargar servicios:', error);
      throw error;
    }
    return data;
  }

  // DAO: Insertar un nuevo prospecto (Lead) cuando entra directo a agendar
  async registrarProspecto(prospecto: Prospecto): Promise<Prospecto | null> {
    const { data, error } = await this.supabase
      .from('prospecto')
      .insert([prospecto])
      .select()
      .single();

    if (error) {
      console.error('Error en DAO registrarProspecto:', error.message);
      return null;
    }
    return data as Prospecto;
  }

  // DAO: Guardar la cita
  async book(reserva: ReservaCita): Promise<boolean> {
    const { error } = await this.supabase.from('reserva_cita').insert([reserva]);

    if (error) {
      console.error('Error en DAO agendarCita:', error.message);
      return false;
    }
    return true;
  }
}
