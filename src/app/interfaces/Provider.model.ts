export interface Provider{
    id: string;
    bussinesName: string;
    isActive: boolean;
    notes?: string;
    createdAt: Date;
    updatedAt: Date;
    logoUrl: string;
    providerTypeId: string;
    providerType?: string;
}

// Tipo para insertar un nuevo perfil sin ID de authUser
export type NewProvider = Omit<Provider, 'id' | 'createdAt' | 'updatedAt'>;
