import { Component, OnInit } from '@angular/core';
import {
  Router,
  Event,
  ActivationStart,
  ActivatedRouteSnapshot,
  ActivationEnd,
  NavigationEnd,
  NavigationStart
} from "@angular/router";
import { filter, map, buffer, pluck } from "rxjs/operators";
/**
 * Check if an angular router 'Event' is instance of 'NavigationEnd' event
 */
 const isNavigationEnd = (ev: Event) => ev instanceof NavigationEnd;
 /**
  * Check if an angular router 'Event' is instance of 'NavigationEnd' event
  */
 const isActivationEnd = (ev: Event) => ev instanceof ActivationEnd;
@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss']
})
export class BreadcrumbComponent implements OnInit {
  bcLoadedData:any;
  bcForDisplay: any;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const navigationEnd$ = this.router.events.pipe(filter(isNavigationEnd));
    this.router.events
      .pipe(
        filter(isActivationEnd),
        pluck("snapshot"),
        pluck("data"),
        buffer(navigationEnd$),
        map((bcData: any[]) => bcData.reverse())
      )
      .subscribe(x => {
        this.bcLoadedData = x;
      });
  }

}
