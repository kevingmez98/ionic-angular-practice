import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewProfile, Profile } from '../interfaces/Profile.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de autenticación
export class UserService {

    constructor(private supabaseService: SupabaseService) { }

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
        return {
            profileId: raw.id,
            userId: raw.user_id,
            fullName: `${raw.first_name} ${raw.last_name}`,
            displayName: raw.display_name,
            role: raw.role,
            status: raw.status,
            createdAt: new Date(raw.created_at)
        };
    }
}
