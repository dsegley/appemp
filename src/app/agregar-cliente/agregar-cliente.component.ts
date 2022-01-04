import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Cp } from "../models/cp";
import { CpService } from "../services/cp/cp.service";

import { NgbActiveModal, NgbModal} from '@ng-bootstrap/ng-bootstrap';



@Component({

  selector: 'ngbd-cp-modal-message',

  template: `

  <div class="modal-header">

    <h4 class="modal-title">Mensaje</h4>

    <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.close()">

      <span aria-hidden="true">&times;</span>

    </button>

  </div>

  <div class="modal-body">

    <p>El código postal no existe</p>

  </div>

  <div class="modal-footer">

    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close()">Cerrar</button>

  </div>

`

})

export class CpModalMessage {

  constructor(public activeModal: NgbActiveModal) {}

}

@Component({
  selector: "app-agregar-cliente",
  templateUrl: "./agregar-cliente.component.html",
  styleUrls: ["./agregar-cliente.component.scss"],
})
export class AgregarClienteComponent implements OnInit {
  form: FormGroup;
  submited = false;
  cpIngreso: string = ""
  loading = false;

  public cpResult : Cp[] = []

  constructor(private formBuilder: FormBuilder, private cpService: CpService, private modalService: NgbModal) {
    this.form = this.formBuilder.group({
      nom_1: ["", Validators.required],
      nom_2: [""],
      apellido_pat: ["", Validators.required],
      apellido_mat: ["", Validators.required],
      edad: ["", Validators.required],
      numero_ide: ["", Validators.required],
      id_cat_ide: ["", Validators.required],
      correo: ["", Validators.required],
      telefono: ["", Validators.required],
    });
  }

  ngOnInit(): void {

  }
  buscarCp(): void{
    this.loading = true
    this.cpService.searchCp(this.cpIngreso).subscribe((data) => {
      this.cpResult=data
      this.loading = false
      if (this.cpResult.length == 0){
this.modalService.open(CpModalMessage,{ariaLabelledBy:'modal-basic-title'})

      }
    });



  }


}
