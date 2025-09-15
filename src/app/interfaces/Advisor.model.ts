
// Interfaz base
export interface Advisor {
    id: string;
    departmentId: string;
    specialty: string;    
    profileId: string;
    createdAt: Date;
}

// Tipo para insertar un nuevo advisor sin algunos datos
export type NewAdvisor = Omit<Advisor, 'id' | 'createdAt'>;



