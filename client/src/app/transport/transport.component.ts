import { Component, OnInit } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Station} from "../shared";

@Component({
  selector: 'qd-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['transport.component.scss']
})
export class TransportComponent implements OnInit {
  public stations: any[] = [];

  constructor(
    private http: Http
  ) {
  }

  public ngOnInit() {
    this.http.get('http://localhost:9090/transport/latest')
      .map((data: Response) => data.json())
      .subscribe((data: Station[]) => this.stations = data);
  }
}
