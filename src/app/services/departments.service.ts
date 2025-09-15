import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Department } from '../interfaces/department.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de autenticación
export class DepartmentService {

    constructor(private supabaseService: SupabaseService) { }

    // Metodo de recuperación de departamentos
    async getDepartments(page: number = 0, pageSize: number = 10, filters?: { [key: string]: any }): Promise<Department[]> {
        let query = this.supabaseService.getSupabase()
            .from('departments')
            .select('id, name, ionic_icon');

        // Aplicar filtros si existen
        if (filters) {
            for (const key in filters) {
                query = query.eq(key, filters[key]);
            }
        }
        // Calcular rangos
        const from = page * pageSize;
        const to = from + pageSize - 1;
        query = query.range(from, to);

        const { data, error } = await query;

        if (error) {
            throw error;
        }

        return (data ?? []).map(this.mapDepartment);
    }

    // Mapeo a departamento
    mapDepartment(raw: any): Department {
        return {
            departmentId: raw.id,
            name: raw.name,
            ionicIcon: raw.ionic_icon,
        };
    }
}
