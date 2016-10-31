import { Component, OnInit } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Station, Direction} from "../shared";

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
      .map((stations: Station[]) => {
        stations.forEach((station: Station) => {
          station.directions.forEach((direction: Direction) => {
            for (let i = direction.upcoming.length; i < 3; i++) {
              direction.upcoming.push(null); // Bad, should not be modifying object here
            }
          });
        });
        return stations;
      })
      .subscribe((data: Station[]) => this.stations = data);
  }
}
