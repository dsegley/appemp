/** Datos de la boleta */

import { Prenda } from "./prenda";

export class SearchBoletaResult {
    id_persona!: number;
    nombre_completo!: string;
    id_boleta!: number;
    fecha_alta!: string;
    fecha_fin!: string;
}

export class Boleta {
    id_boleta!: number;
    id_producto_emp!: number;
    id_persona!: number;
    numero_ide!: string;
    id_cat_stats_bol!: number;
    fecha_alta!: string;
    fecha_fin!: string;
    mont_prest_total!: number;
    tasa_interes!: number;
    periodo!: number;
    nom_stats_bol!: number;
    prendas!: Prenda[];
    nombre_completo!: string;
    dir_email!: string;
    no_tel!: number;
}