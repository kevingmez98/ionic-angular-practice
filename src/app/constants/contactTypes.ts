// Lista de tipos de contacto de proveedores (no se usa una tabla pero se tiene un select)
export const ContactType = {
    COMERCIAL: { name: 'Comercial' },
    OPERATIONS: { name: 'Operaciones' },
    ADMINISTRATIVE: { name: 'Administrativo' },
    MANAGEMENT: { name: 'Gerencial' },
    OTHERS: { name: 'Otros' },
} as const;