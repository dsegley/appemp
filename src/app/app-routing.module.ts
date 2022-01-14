import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AgregarClienteComponent } from './agregar-cliente/agregar-cliente.component';
import { BusquedaArticuloComponent } from './busqueda-articulo/busqueda-articulo.component';
import { BusquedaBoletaComponent } from './busqueda-boleta/busqueda-boleta.component';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component';
import { ClientsComponent } from './clients/clients.component';
import { DatosEmpenoComponent } from './datos-empeno/datos-empeno.component';

import { FullComponent } from './layouts/full/full.component';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './services/auth/auth.guard';

export const Approutes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: FullComponent,
    canActivate: [AuthGuard],
    children: [
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
        path: 'cotizacion',
        loadChildren: () => import('./cotizacion/cotizacion.module').then(m => m.CotizacionModule)
      },
      {
        path: 'busqueda-articulo',
        component: BusquedaArticuloComponent
      },
      {
        path: 'busqueda-cliente',
        component: BusquedaClienteComponent
      },
      {
        path: 'busqueda-boleta',
        component: BusquedaBoletaComponent
      },
      {
        path: 'datos-empeno/:boleta',
        component: DatosEmpenoComponent
      }
      ,
      {
        path: 'agregar-cliente',
        component: AgregarClienteComponent
      },
      {
        path: 'datos-empeno',
        component: DatosEmpenoComponent
      },
      {
        path: 'clientes',
        component: ClientsComponent
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
