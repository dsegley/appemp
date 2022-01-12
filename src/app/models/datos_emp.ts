/** Datos para registrar un empeño */

export class EmpPrendasStats {
    id_detalle_prenda!: number;
    id_cat_est_prenda!: number;
}

export class DatosEmp {
    id_cliente!: number;
    id_producto_emp!: number;
    prendas!: EmpPrendasStats[];
}