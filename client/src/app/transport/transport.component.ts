import { Component, OnInit } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Stations, Station, Platform} from "../shared";
import {Arrival} from "./arrival/arrival.model";
import {ArrivalAtPlatform} from "../../../../server/src/shared/interfaces/stations";

@Component({
  selector: 'qd-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['transport.component.scss']
})
export class TransportComponent implements OnInit {

  public stations: Stations = [];
  public arrivals: Arrival[] = [];
  public firstFutureArrival: number;

  constructor(
    private http: Http
  ) {
  }

  ngOnInit() {
    this.http.get('http://localhost:9090/transport/latest')
      .subscribe((data: Response) => {
        this.stations = data.json();
        this.arrivals = this.parseData(this.stations);
      })
  }

  private parseData(stations: Station[]): Arrival[] {
    let arrivals: Arrival[] = [];
    stations.forEach((station: Station) => {
      station.platforms.forEach((platform: Platform) => {
        platform.arrivals.forEach((arrival: ArrivalAtPlatform) => {
          if (arrival.timeToStation < station.timeToStation / 2) {
            return;
          }
          arrivals.push({
            station: station.stationName,
            platform: platform.platformName,
            lineId: arrival.lineId,
            destination: arrival.towards,
            timeToStationSeconds: arrival.timeToStation,
            timeToStationMinutes: Math.floor(arrival.timeToStation / 60),
            isWalkingDistance: station.timeToStation < arrival.timeToStation,
          });
        });
      });
    });

    arrivals.sort((a, b) => a.timeToStationSeconds - b.timeToStationSeconds);
    this.firstFutureArrival = arrivals.length;
    for (let i = 0; i < arrivals.length; i++) {
      if (arrivals[i].isWalkingDistance) {
        this.firstFutureArrival = i;
        break;
      }
    }

    return arrivals;
  }
}
