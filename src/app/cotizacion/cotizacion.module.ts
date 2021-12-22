import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionComponent } from './cotizacion.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BusquedaComponent } from './busqueda/busqueda.component';
import { PrendaService } from '../services/prenda/prenda.service';
import { Prenda } from '../services/prenda/prenda';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Cotizacion",
      urls: [{ title: "Cotizacion", url: "/cotizacion" }, { title: "Cotizacion" }],
    },
    component: CotizacionComponent,
  },
]

@NgModule({
  declarations: [
    CotizacionComponent,
    BusquedaComponent,
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
    PrendaService
  ]
})
export class CotizacionModule { }
