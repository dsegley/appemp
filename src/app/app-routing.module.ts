import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BusquedaArticuloComponent } from './busqueda-articulo/busqueda-articulo.component';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component';

import { FullComponent } from './layouts/full/full.component';

export const Approutes: Routes = [
  {
    path: '',
    component: FullComponent,
    children: [
      { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
      },
      {
        path: 'about',
        loadChildren: () => import('./about/about.module').then(m => m.AboutModule)
      },
      {
        path: 'component',
        loadChildren: () => import('./component/component.module').then(m => m.ComponentsModule)
      },
      {
        path: 'cotizacion/:prenda',
        loadChildren: () => import('./cotizacion/cotizacion.module').then(m => m.CotizacionModule)
      },
      {
        path: 'busqueda-articulo',
        component: BusquedaArticuloComponent
      },
      {
        path: 'busqueda-cliente',
        component: BusquedaClienteComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/starter'
  }
];
