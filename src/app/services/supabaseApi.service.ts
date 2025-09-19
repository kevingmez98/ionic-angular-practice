import * as CryptoJS from 'crypto-js';
import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';  // Asumiendo que tienes un servicio para Supabase
import { AuthService } from './authservice.service';  // Tu servicio para autenticación

@Injectable({
  providedIn: 'root',
})
export class SupabaseApiService {
  constructor(
    private supabaseService: SupabaseService,
    private authService: AuthService
  ) {}

  // Método para obtener el token descifrado
  private getAuthToken() {
    const encryptedToken = sessionStorage.getItem('token');
    let token = null;
    
    if (encryptedToken) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, 'your-secret-key');
        token = bytes.toString(CryptoJS.enc.Utf8); // Si no se puede descifrar, retorna vacío
      } catch (e) {
        console.error('Error al descifrar el token', e);
      }
    }
    
    return token;
  }

  // Método para hacer una consulta (get) a Supabase
  async getFromSupabase(table: string, filters?: { [key: string]: any }, range?: [number, number]) {
    const token = this.getAuthToken();
    
    let query = this.supabaseService.getSupabase().from(table).select('*');
    
    // Aplicar los filtros si existen
    if (filters) {
      for (const [key, value] of Object.entries(filters)) {
        if (value) {
          query = query.ilike(key, `%${value}%`);
        }
      }
    }

    // Agregar rango si es necesario
    if (range) {
      query = query.range(range[0], range[1]);
    }

    // Si hay token, agregarlo al header Authorization
  /*  if (token) {
      query = query.headers({
        Authorization: `Bearer ${token}`,
      });
    }
*/
    // Realizar la solicitud
    const { data, error, count } = await query;

    if (error) {
      throw error;
    }

    return { data, total: count ?? 0 };
  }

}
