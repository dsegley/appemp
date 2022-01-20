import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  CommonModule, LocationStrategy,
  PathLocationStrategy
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';

import { NgbModule, NgbModalModule, NgbDatepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

import { FullComponent } from './layouts/full/full.component';


import { NavigationComponent } from './shared/header/navigation.component';
import { SidebarComponent } from './shared/sidebar/sidebar.component';

import { Approutes } from './app-routing.module';
import { AppComponent } from './app.component';
import { SpinnerComponent } from './shared/spinner.component';

import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { PERFECT_SCROLLBAR_CONFIG } from 'ngx-perfect-scrollbar';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { BusquedaArticuloComponent } from './busqueda-articulo/busqueda-articulo.component';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component';
import { CountUpModule } from 'ngx-countup';
import { BusquedaBoletaComponent } from './busqueda-boleta/busqueda-boleta.component';
import { LoginComponent } from './login/login.component';
import { AgregarClienteComponent } from './agregar-cliente/agregar-cliente.component';
import { DatosEmpenoComponent } from './datos-empeno/datos-empeno.component';
import { ErrorInterceptor } from './services/auth/error.interceptor';
import { ModalMessageComponent } from './shared/modal-message/modal-message.component';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { ClientsComponent } from './clients/clients.component';
import { DataTablesModule } from "angular-datatables";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
  suppressScrollX: true,
  wheelSpeed: 1,
  wheelPropagation: true,
  minScrollbarLength: 20
};

@NgModule({
  declarations: [
    AppComponent,
    SpinnerComponent,
    FullComponent,
    NavigationComponent,
    SidebarComponent,
    BusquedaArticuloComponent,
    BusquedaClienteComponent,
    BusquedaBoletaComponent,
    LoginComponent,
    AgregarClienteComponent,
    DatosEmpenoComponent,
    ModalMessageComponent,
    BreadcrumbComponent,
    ClientsComponent,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    NgbModalModule,
    RouterModule.forRoot(Approutes, { useHash: false, relativeLinkResolution: 'legacy' }),
    PerfectScrollbarModule,
    CountUpModule,
    DataTablesModule,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy
    },
    {
      provide: PERFECT_SCROLLBAR_CONFIG,
      useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
