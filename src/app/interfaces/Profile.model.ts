
import { User } from "./User.model";

// Interfaz base
export interface Profile {
    profileId: string;
    userId: string;
    fullName: string;
    displayName: string;
    role: string;
    status: boolean;
    createdAt: Date;
    user?: User;
}

// Tipo para insertar un nuevo perfil
export type NewProfile = Omit<Profile, 'profileId'>;
