import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-datos-empeno',
  templateUrl: './datos-empeno.component.html',
  styleUrls: ['./datos-empeno.component.scss']
})
export class DatosEmpenoComponent implements OnInit {

  id_detalle_prenda = 0

  constructor() { }

  ngOnInit(): void {
  }

}
