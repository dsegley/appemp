/** Registro de pagos */

export class Payment {
    id_res_pago!: number;
    id_boleta!: number;
    id_cat_stats_pago!: number;
    fecha_pago!: string;
    monto!: number;
    nom_stats_pago!: string;
}