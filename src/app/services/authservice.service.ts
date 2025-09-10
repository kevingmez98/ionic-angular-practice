import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de autenticación
export class AuthService {

    constructor(private supabaseService: SupabaseService) { }

    // Metodo de registro
    async signUp(email: string, password: string) {
        const { data, error } = await this.supabaseService.getSupabase().auth.signUp({
            email,
            password
        });
        return { data, error };
    }

    // Metodo de inicio de sesion
    async signIn(email: string, password: string) {
        const { data, error } = await this.supabaseService.getSupabase().auth.signInWithPassword({
            email,
            password
        });

        if (data?.session) {
            sessionStorage.setItem('token', data.session.access_token);
        }
        return { data, error };
    }

    // Obtener token de inicio de sesión
    getToken(): string | null {
        return sessionStorage.getItem('token');
    }

    // Metodo de cierre de sesión
    async signOut() {
        const { error } = await this.supabaseService.getSupabase().auth.signOut();
        return { error };
    }

    // Método para obtener el usuario autenticado
    getUser() {
        return this.supabaseService.getSupabase().auth.getUser();  // Devuelve el usuario actual desde Supabase
    }
}
