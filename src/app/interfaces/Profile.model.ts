
// Interfaz base
export interface Profile {
    id: string;
    authUserId: string;
    fullName: string;    
    role: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    phone: string;
    email: string;
}

// Tipo para insertar un nuevo perfil sin ID de authUser
export type NewProfile = Omit<Profile, 'id' | 'authUserId' | 'createdAt' | 'updatedAt'>;

// Tipo para insertar un perfil con ID de authUser
export type InsertableProfile = Omit<Profile, 'id' | 'createdAt' | 'updatedAt'>;


