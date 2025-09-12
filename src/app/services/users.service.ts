import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewProfile, Profile } from '../interfaces/Profile.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de autenticación
export class UserService {

    constructor(private supabaseService: SupabaseService) { }

    // Metodo para leer la vista de profiles con correo en users
    async getExtendedUserInfo(page: number = 1, pageSize: number = 10, filters?: { [key: string]: any }): Promise<{data:Profile[], total:number}> {
        const from = (page - 1) * pageSize; // Calcular el registro desde donde empieza
        const to = from + pageSize - 1; // Calcular el registro hasta donde llega

        // Generar query basica de la vista
        let query = this.supabaseService.getSupabase()
            .from("extended_user_info")
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                // Validar que cada filtro no esté vacío
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "name" || key === "email" || key === "role") {
                        // Para búsqueda de nombre, correo o rol
                        query = query.ilike(key, `%${value}%`);
                    }
                }
            }
        }

        // Enviar petición
        const { data, error, count } = await query.range(from, to);
        if (error) {
            throw error;
        }
        return {
            data: (data ?? []).map(this.mapProfile),
            total: count ?? 0
        };
    }

    // Metodo de registro a profiles
    async saveUserData(userId: string, userData: any): Promise<Profile[]> {
        const { data, error } = await this.supabaseService.getSupabase()
            .from('profiles')
            .insert([{ user_id: userId, ...userData }]);

        if (error) {
            throw error;
        }

        return (data ?? []).map(this.mapProfile);
    }

    // Metodo de registro a advisors
    async saveAdvisorData(profileId: string, userData: any) {
        const { data, error } = await this.supabaseService.getSupabase()
            .from('profiles')
            .insert([{ id: profileId, ...userData }]);
        return { data, error };
    }

    // Mapeo a profile
    mapProfile(raw: any): Profile {
        const profile: Profile = {
            profileId: raw.id,
            userId: raw.user_id,
            fullName: `${raw.first_name} ${raw.last_name}`,
            displayName: raw.display_name,
            role: raw.role,
            status: raw.status,
            createdAt: new Date(raw.created_at),
        };

        if (raw.email) {
            profile.user = {
                email: raw.email
            };
        }

        return profile;
    }
}
