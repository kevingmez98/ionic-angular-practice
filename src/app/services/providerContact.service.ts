import { Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { ProviderContact, NewProviderContact } from '../interfaces/providerContact.model';

@Injectable({
    providedIn: 'root' // Singleton
})

// Servicio de providers
export class ProviderContactService {

    constructor(private supabaseService: SupabaseService) { }

    // Petición directa a contactos
    async getContacts(page: number = 1, pageSize: number = 10, filters?: { [key: string]: any }): Promise<{ data: ProviderContact[], total: number }> {
        const from = (page - 1) * pageSize; // Calcular el registro desde donde empieza
        const to = from + pageSize - 1; // Calcular el registro hasta donde llega

        // Generar query basica de la vista
        let query = this.supabaseService.getSupabase()
            .from("provider_contacts")
            .select('*', { count: 'exact' });

        // Aplicar filtros
        if (filters) {
            for (const [key, value] of Object.entries(filters)) {
                // Validar que cada filtro no esté vacío
                if (value !== undefined && value !== null && value !== "") {
                    if (key === "contact_type" || key === "contact_name" || key === "position"|| key==="email") {
                        // Para búsqueda de nombre, correo o rol
                        query = query.ilike(key, `%${value}%`);
                    } else if (key === "id" || key === "provider_id") {
                        // Búsquedas exactas
                        query = query.eq(key, value);
                    }
                }
            }
        }


        // Enviar petición
        const { data, error, count } = await query.range(from, to);
        if (error) {
            console.log(error);
            throw error;
        }
        return {
            data: (data ?? []).map(this.mapContact),
            total: count ?? 0
        };

    }

    // Metodo de registro a contacts
    async saveContactData(contactData: any) {
        const contactDB = this.mapToDbContact(contactData);
        const { data, error } = await this.supabaseService.getSupabase()
            .from('provider_contacts')
            .insert([contactDB]);

        if (error) {
            throw error;
        }
        return (data ?? []).map(this.mapContact);
    }


    // Método para actualizar datos del contact usando id
    async updateAdvisorData(contactId: string, contactData: any) {
        const contactDB = this.mapToDbContact(contactData);

        // Construir consulta base
        let query = this.supabaseService.getSupabase().from('provider_contacts').update(contactDB);

        const { data, error } = await query;
        if (error) {
            throw error;
        }
    }


    /* Mapeo de contactos */
    // Mapeo a contacto
    mapContact(raw: any): ProviderContact {
        const contact: ProviderContact = {
            id: raw.id,
            contactName: raw.contact_name,
            contactType: raw.contact_type,
            email: raw.email,
            phone: raw.phone,
            isActive: raw.isActive,
            isPrimary: raw.is_primary,
            mobilePhone: raw.mobile_phone,
            position: raw.position,
            providerId: raw.provider_id,
            createdAt: new Date(raw.created_at),
            updatedAt: new Date(raw.created_at),
        };
        return contact;
    }

    // Mapeo de contacts a campos de la BD
    mapToDbContact(contact: NewProviderContact) {
        return {
            name: contact.contactName,
            type: contact.contactType,
            email: contact.email,
            is_active: contact.isActive,
            phone: contact.phone,
            is_primary: contact.isPrimary,
            mobile_phone: contact.mobilePhone,
            position: contact.position,
            provider_id: contact.providerId
        };
    }

}
