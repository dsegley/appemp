/** Modelo Cliente */


// Formulario de agregar cliente
export class AddClientForm {
    nom_1!: string;
    nom_2!: string;
    apellido_pat!: string;
    apellido_mat!: string;
    edad!: number;
    numero_ide!: string;
    id_cat_ide!: number;
    correo!: string;
    telefono!: number;
    no_ext!: string;
    no_int!: string;
    calle!: string;
    cruzamientos!: string;
    cpIngreso!: number;

    public constructor(init?: Partial<AddClientForm>) {
        Object.assign(this, init)
    }

    public getFormatedClientData(
        tipoDom: string, verEmail: boolean, tipoTel: string, idRefCp: number)
        : Client {
        let dom: ClientDom = new ClientDom()
        dom.id_ref_cp = idRefCp
        dom.no_int = this.no_int
        dom.no_ext = this.no_ext
        dom.nom_direccion = this.calle + this.cruzamientos
        dom.tipo_domicilio = tipoDom
        dom.vigencia = true

        let email: ClientEmail = new ClientEmail()
        email.dir_email = this.correo
        email.ver_email = verEmail

        let tel: ClientTel = new ClientTel()
        tel.no_tel = this.telefono
        tel.tipo_tel = tipoTel

        return new Client(
            this.id_cat_ide,
            this.numero_ide,
            this.nom_1,
            this.nom_2,
            this.apellido_pat,
            this.apellido_mat,
            this.edad,
            [email],
            [dom],
            [tel],
        )
    }
}

export class ClientSearchResult {
    id_persona!: number;
    numero_ide!: string;
    nombre_completo!: string
}

export class CatIde {
    id_cat_ide!: number;
    nom_ide!: string;
}

export class ClientEmail {
    dir_email!: string;
    ver_email: boolean = false
}

export class ClientDom {
    tipo_domicilio!: string;
    id_ref_cp!: number;
    nom_direccion!: string;
    no_ext!: string;
    no_int!: string;
    vigencia!: boolean;
}

export class ClientTel {
    tipo_tel!: string;
    no_tel!: number
}

export class Client {
    constructor(
        public id_cat_ide: number = 0,
        public numero_ide: string = "",
        public nom_1: string = "",
        public nom_2: string = "",
        public apellido_pat: string = "",
        public apellido_mat: string = "",
        public edad: number = 0,
        public correos: ClientEmail[] = [],
        public domicilios: ClientDom[] = [],
        public telefonos: ClientTel[] = [],
    ) {

    }
}