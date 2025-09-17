export interface ProviderContact{
    id: string;
    contactType: string,
    contactName: string,
    position: string,
    email: string,
    mobilePhone: string,
    phone: string,
    isActive: boolean,
    providerId: string,
    isPrimary: boolean,
    createdAt: Date;
    updatedAt: Date;
}

// Tipo para insertar un nuevo contacto sin ID ni fechas de creación y actualización
export type NewProviderContact = Omit<ProviderContact, 'id' | 'createdAt' | 'updatedAt'>;
