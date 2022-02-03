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
    },
    {
        bgcolor: 'warning',
        icon: 'bi bi-people',
        title: 'Clientes',
        subtitle: '',
        href: '/clientes',
    },
    {
        bgcolor: 'primary',
        icon: 'bi bi-file-earmark',
        title: 'Boletas',
        subtitle: '',
        href: '/busqueda-boleta',
    },
] 