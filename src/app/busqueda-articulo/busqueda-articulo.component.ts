import { Component, AfterViewInit, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Prenda } from '../models/prenda';
import { PrendaService } from '../services/prenda/prenda.service';
import { DataTableDirective } from 'angular-datatables';

@Component({
  selector: 'app-busqueda',
  templateUrl: './busqueda-articulo.component.html',
  styleUrls: ['./busqueda-articulo.component.scss']
})
export class BusquedaArticuloComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild(DataTableDirective, { static: false })
  private datatableElement!: DataTableDirective;

  public busqueda: Prenda[] = []
  public query: string = ''
  public showAlert = false

  loading = false
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(
    private prendaService: PrendaService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      searching: false,
    };

    this.route.queryParamMap.subscribe(params => {
      let param = params.get("query")

      if (param) {
        this.query = param
        this.search()
      }
    })
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe()
  }

  ngAfterViewInit(): void {
    this.dtTrigger.next();
  }

  search(): void {
    this.datatableElement.dtInstance.then((dtInstance: DataTables.Api) => {
      dtInstance.clear();
      dtInstance.destroy();
    })

    this.loading = true
    this.showAlert = false
    this.busqueda = []
    this.prendaService.searchItem(this.query).subscribe(data => {
      this.busqueda = data;
      this.loading = false
      this.dtTrigger.next()
      if (this.busqueda.length < 1) {
        this.showAlert = true
      }
    })
  }

}
