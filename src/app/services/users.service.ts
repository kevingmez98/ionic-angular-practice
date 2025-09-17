import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewProfile, Profile } from '../interfaces/Profile.model';
import { Advisor, NewAdvisor } from '../interfaces/Advisor.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de users
export class UserService {

    constructor(private supabaseService: SupabaseService) { }

    // Metodo para leer la vista de profiles con correo en users
    async getExtendedUserInfo(page: number = 1, pageSize: number = 10, filters?: { [key: string]: any }): Promise<{ data: Profile[], total: number }> {
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
        const { data, error, count } = await query.range(from, to).order("created_at");
        if (error) {
            throw error;
        }
        return {
            data: (data ?? []).map(this.mapProfile),
            total: count ?? 0
        };
    }

    // Metodo de registro a profiles
    async saveUserData(userId: string|null, userData: NewProfile): Promise<Profile[]> {
        const userDB = this.mapToDbProfile(userData);
        const { data, error } = await this.supabaseService.getSupabase()
            .from('profiles')
            .insert([userDB]).select();

        if (error) {
            throw error;
        }
        return (data ?? []).map(this.mapProfile);
    }

    //Metodo de actualización profiles
    async updateUserData(profileId: string, userData: NewProfile): Promise<Profile[]> {
        const userDB = this.mapToDbProfile(userData);
        const { data, error } = await this.supabaseService.getSupabase()
            .from('profiles')
            .update([userDB]).eq('id',profileId);
        if (error) {
            throw error;
        }
        return (data ?? []).map(this.mapProfile);
    }


    /* Mapeo de profiles */

    // Mapeo a profile
    mapProfile(raw: any): Profile {
        const profile: Profile = {
            id: raw.id,
            authUserId: raw.auth_user_id,
            fullName: raw.full_name,
            phone: raw.phone,
            role: raw.role,
            isActive: raw.is_active,
            email: raw.email,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.created_at),
        };
        return profile;
    }

    // Mapeo de profiles a campos de la BD
    mapToDbProfile(user: NewProfile) {
        return {
            full_name: user.fullName,
            role: user.role,
            is_active: user.isActive,
            phone: user.phone,
            email: user.email,
            //auth_user_id: "",
        };
    }


}
