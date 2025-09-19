import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Department } from '../interfaces/Department.model';
import { ProviderCategory } from '../interfaces/ProviderCategory.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de categorias o tipo de proveedor
export class ProviderCategoryService {

    constructor(private supabaseService: SupabaseService) { }

    // Metodo de recuperación de categorías
    async getCategories(page: number = 0, pageSize: number = 10, filters?: { [key: string]: any }): Promise<ProviderCategory[]> {
        let query = this.supabaseService.getSupabase()
            .from('provider_categories')
            .select('*');

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
        console.log(filters);
        const { data, error } = await query;
        console.log(data);

        if (error) {
            throw error;
        }

        return (data ?? []).map(this.mapCategory);
    }

    // Mapeo a categoria
    mapCategory(raw: any): ProviderCategory {
        return {
            categoryId: raw.id,
            code: raw.code,
            name: raw.name,
            createdAt: raw.created_at
        };
    }
}
