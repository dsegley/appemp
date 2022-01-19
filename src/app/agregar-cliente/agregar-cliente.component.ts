import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, ValidationErrors, Validators } from "@angular/forms";
import { Cp } from "../models/cp";
import { CpService } from "../services/cp/cp.service";

import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddClientForm, CatIde } from "../models/client";
import { ClientService } from "../services/client/client.service";
import { Router } from "@angular/router";


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
    <p>{{message}}</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline-dark" (click)="activeModal.close()">Cerrar</button>
  </div>`
})

export class CpModalMessage {
  message: string = ""
  constructor(public activeModal: NgbActiveModal) { }
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

  cpResult: Cp[] = []
  id_cat_ide: CatIde[] = []

  constructor(
    private formBuilder: FormBuilder,
    private cpService: CpService,
    private modalService: NgbModal,
    private clientService: ClientService,
    private router: Router,
  ) {
    this.form = this.formBuilder.group({
      nom_1: ["",
        [
          Validators.required,
        ]],
      nom_2: ["",
        [
        ]],
      apellido_pat: ["",
        [
          Validators.required,
        ]],
      apellido_mat: ["",
        [
          Validators.required,
        ]],
      edad: ["",
        [
          Validators.required,
        ]],
      numero_ide: ["", [
        Validators.required,
      ]],
      id_cat_ide: ["", [
        Validators.required,
      ]],
      correo: ["", [
        Validators.required,
        Validators.email,
      ]],
      telefono: ["", [
        Validators.required,
        Validators.min(10),
      ]],
      no_ext: ["", [
        Validators.required,
      ]],
      no_int: ["", [
      ]],
      calle: ["", [
        Validators.required,
        Validators.min(1),
      ]],
      cruzamientos: ["", [
        Validators.required,
      ]],
      cpIngreso: ["", [
        Validators.required,
        Validators.min(4)
      ]]
    });
  }

  ngOnInit(): void {
    this.loading = true
    this.clientService.getCatIde().subscribe(data => {
      this.loading = false
      this.id_cat_ide = data
    })

    this.form.get('id_cat_ide')?.setValue(4)
  }

  buscarCp(): void {
    this.cpIngreso = this.form.value["cpIngreso"]
    this.loading = true
    this.cpService.searchCp(this.cpIngreso).subscribe((data) => {
      this.cpResult = data
      this.loading = false
      if (this.cpResult.length == 0) {
        this.showModal("El codigo ingresado postal no existe")
      }
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      const result: any = [];
      Object.keys(this.form.controls).forEach(key => {

        const controlErrors: ValidationErrors | null | undefined = this.form.get(key)?.errors;
        if (controlErrors) {
          Object.keys(controlErrors).forEach(keyError => {
            result.push({
              'control': key,
              'error': keyError,
              'value': controlErrors[keyError]
            });
          });
        }
      });

      console.log(result)
      this.showModal("Datos incorrectos.")
      return
    }

    let newClient = new AddClientForm(this.form.value).getFormatedClientData(
      // hardcode unu
      "Casa",
      true,
      "Personal",
      this.cpResult[0].id_ref_cp
    )

    this.loading = true
    this.clientService.addClient(newClient).subscribe({
      next: () => {
        this.showModal("Cliente registrado con exito")
        this.router.navigateByUrl("/datos-empeno")
      },
      error: () => {
        this.showModal("Error al registrar cliente")
      }
    })
  }

  private showModal(message: string) {
    const activeModal = this.modalService.open(CpModalMessage, { 
      ariaLabelledBy: 'modal-basic-title' 
    })
    activeModal.componentInstance.message = message
  }
}
