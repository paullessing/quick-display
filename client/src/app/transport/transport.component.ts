import { Component, OnInit } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Stations} from "../shared";

@Component({
  selector: 'qd-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['transport.component.scss']
})
export class TransportComponent implements OnInit {

  public stations: Stations = [];

  constructor(
    private http: Http
  ) {
  }

  ngOnInit() {
    this.http.get('http://localhost:9090/transport/latest')
      .subscribe((data: Response) => {
        this.stations = data.json();
        // TODO parse this properly, and subscribe to it
      })
  }
}
