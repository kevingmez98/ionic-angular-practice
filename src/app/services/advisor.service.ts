import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Advisor, NewAdvisor } from '../interfaces/Advisor.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de advisors
export class AdvisorService {

    constructor(private supabaseService: SupabaseService) { }

    // Petición directa a advisors
    async getAdvisors(page: number = 1, pageSize: number = 10, filters?: { [key: string]: any }): Promise<{ data: Advisor[], total: number }> {
        const from = (page - 1) * pageSize; // Calcular el registro desde donde empieza
        const to = from + pageSize - 1; // Calcular el registro hasta donde llega

        // Generar query basica de la vista
        let query = this.supabaseService.getSupabase()
            .from("advisors")
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                // Validar que cada filtro no esté vacío
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "full_name" || key === "email" || key === "role") {
                        // Para búsqueda de nombre, correo o rol
                        query = query.ilike(key, `%${value}%`);
                    } else if (key === "id" || key === "profile_id") {
                        // Búsquedas exactas
                        query = query.eq(key, value);
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
            data: (data ?? []).map(this.mapAdvisor),
            total: count ?? 0
        };

    }

    // Metodo de registro a advisors
    async saveAdvisorData(advisorData: any) {
        const advisorDB = this.mapToDbAdvisor(advisorData);
        console.log(advisorDB);
        const { data, error } = await this.supabaseService.getSupabase()
            .from('advisors')
            .insert([advisorDB]);

        if (error) {
            throw error;
        }
        return (data ?? []).map(this.mapAdvisor);
    }


    // Método para actualizar datos del advisor usando id o profile_id
    async updateAdvisorData(advisorId: string | null, profileId: string | null, advisorData: any) {
        if (!advisorId && !profileId) {
            throw new Error('Debe proporcionar advisorId o profileId para actualizar');
        }
        const advisorDB = this.mapToDbAdvisor(advisorData);

        // Construir consulta base
        let query = this.supabaseService.getSupabase().from('advisors').update(advisorDB);

        // Añadir filtro adecuado
        if (advisorId) {
            query = query.eq('id', advisorId);
        } else if (profileId) {
            query = query.eq('profile_id', profileId);
        }

        const { data, error } = await query;
    }


    /* Mapeo de advisors */
    // Mapeo a advisor
    mapAdvisor(raw: any): Advisor {
        const profile: Advisor = {
            id: raw.id,
            departmentId: raw.department_id,
            profileId: raw.profile_id,
            specialty: raw.specialty,
            createdAt: new Date(raw.created_at),
        };
        return profile;
    }

    // Mapeo de advisors a campos de la BD
    mapToDbAdvisor(advisor: NewAdvisor) {
        return {
            department_id: advisor.departmentId,
            profile_id: advisor.profileId,
            specialty: advisor.specialty
        };
    }

}
