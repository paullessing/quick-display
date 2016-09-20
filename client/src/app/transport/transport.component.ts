import { Component, OnInit } from '@angular/core';
import {Http, ResponseContentType} from "@angular/http";

@Component({
  selector: 'qd-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['transport.component.scss']
})
export class TransportComponent implements OnInit {

  public stations: any = [];

  constructor(
    private http: Http
  ) {
  }

  ngOnInit() {
    this.http.get('http://localhost:9090/transport/latest')
      .subscribe((data) => {
        this.stations = data.json();
      })
  }
}
