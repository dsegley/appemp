import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CotizacionComponent } from './cotizacion.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [
  ]
})
export class CotizacionModule { }
