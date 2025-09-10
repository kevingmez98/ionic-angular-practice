import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Singleton del servicio de supabase
@Injectable({ 
  providedIn: 'root' //servicio disponible globalmente en toda la aplicación
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = 'https://vywhdojdjendvcurbyzm.supabase.co'; // Cambia esto
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5d2hkb2pkamVuZHZjdXJieXptIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTczNjI3OTAsImV4cCI6MjA3MjkzODc5MH0.Ym_J2eJWS4u-t5ioWPgooZvPI4hxtwQatBcYeeIPuZE'; // Cambia esto
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  getSupabase() {
    return this.supabase;
  }
}
