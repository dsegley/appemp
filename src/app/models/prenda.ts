// Esta clase obtiene los datos del buscador de prendas

export interface IDetallePrenda {
    id_prenda?: number;
    monto_prestamo?: number;
    id_cat_est_prenda?: number;
    id_detalle_prenda?: number;
    estado_prenda?: number;
    porc_aforo?: number;
}

export class Prenda implements IDetallePrenda {
    id_detalle_prenda!: number;
    nom_categoria!: String;
    marca!: String;
    modelo!: String;
    ram!: number;
    almacenamiento!: number;
    monto_aforo!: number;
}
