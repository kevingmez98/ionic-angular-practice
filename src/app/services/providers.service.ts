import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { NewProvider, Provider } from '../interfaces/Provider.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de providers
export class ProviderService {

    constructor(private supabaseService: SupabaseService) { }

    // Metodo para leer la vista de providers con el nombre de la categoría
    async getExtendedProviderInfo(page: number = 1, pageSize: number = 10, filters?: { [key: string]: any }): Promise<{ data: Provider[], total: number }> {
        const from = (page - 1) * pageSize; // Calcular el registro desde donde empieza
        const to = from + pageSize - 1; // Calcular el registro hasta donde llega

        // Generar query basica de la vista
        let query = this.supabaseService.getSupabase()
            .from("extended_provider_info")
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                // Validar que cada filtro no esté vacío
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "bussines_name" || key === "provider_type") {
                        // Para búsqueda de nombre o tipo
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
            data: (data ?? []).map(this.mapProvider),
            total: count ?? 0
        };
    }

    // Petición directa a providers
    async getProviders(page: number = 1, pageSize: number = 10, filters?: { [key: string]: any }): Promise<{ data: Provider[], total: number }> {
        const from = (page - 1) * pageSize; // Calcular el registro desde donde empieza
        const to = from + pageSize - 1; // Calcular el registro hasta donde llega

        // Generar query basica de la vista
        let query = this.supabaseService.getSupabase()
            .from("providers")
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                // Validar que cada filtro no esté vacío
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "bussines_name" || key === "is_active") {
                        // Para búsqueda de nombre, estado
                        query = query.ilike(key, `%${value}%`);
                    } else if (key === "id" || key === "provider_type_id") {
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
            data: (data ?? []).map(this.mapProvider),
            total: count ?? 0
        };
    }

    // Metodo de registro a provider
    async saveProviderData(providerData: NewProvider): Promise<Provider[]> {
        const providerDB = this.mapToDbProvider(providerData);
        const { data, error } = await this.supabaseService.getSupabase()
            .from('providers')
            .insert([providerDB]).select();

        if (error) {
            throw error;
        }
        return (data ?? []).map(this.mapProvider);
    }

    //Metodo de actualización providers
    async updateProviderData(providerId: string, providerData: NewProvider): Promise<Provider[]> {
        const providerDB = this.mapToDbProvider(providerData);
        const { data, error } = await this.supabaseService.getSupabase()
            .from('providers')
            .update([providerDB]).eq('id', providerId);
        if (error) {
            throw error;
        }
        return (data ?? []).map(this.mapProvider);
    }


    /* Mapeo de providers */

    // Mapeo a provider
    mapProvider(raw: any): Provider {
        const provider: Provider = {
            id: raw.id,
            bussinesName: raw.bussines_name,
            isActive: raw.is_active,
            logoUrl: raw.logo_url,
            notes: raw.notes,
            providerTypeId: raw.provider_type_id,
            providerType: raw.provider_type,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.updated_at),
        };
        return provider;
    }

    // Mapeo de providers a campos de la BD
    mapToDbProvider(provider: NewProvider) {
        return {
            bussines_name: provider.bussinesName,
            is_active: provider.isActive,
            logo_url: provider.logoUrl,
            notes: provider.notes,
            provider_type_id: provider.providerTypeId
        };
    }


}
