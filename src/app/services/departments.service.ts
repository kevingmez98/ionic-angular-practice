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
    async getDepartments(): Promise<Department[]> {
        const { data, error } = await this.supabaseService.getSupabase()
            .from('departments').select('id, name, ionic_icon')
            .range(0, 9); // Equivalente a LIMIT 10 OFFSET 0;;

        if (error) {
            throw error;
        }

        // Convertir el array crudo a un array con la forma Department[]
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
