export interface topcard {
    bgcolor: string,
    icon: string,
    title: string,
    subtitle: string,
    href: string,
}

export const topcards: topcard[] = [

    {
        bgcolor: 'success',
        icon: 'bi bi-wallet',
        title: 'Nueva Cotización',
        subtitle: '',
        href: '/busqueda-articulo',
    },
    {
        bgcolor: 'danger',
        icon: 'bi bi-coin',
        title: 'Registrar Pago',
        subtitle: '',
        href: '/busqueda-boleta',
    }
] 