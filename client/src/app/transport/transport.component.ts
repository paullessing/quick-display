import { Component, OnInit } from '@angular/core';
import {Http, Response} from "@angular/http";
import {Station, ArrivalAtStation, Direction} from "../shared";
import {Arrival} from "./arrival/arrival.model";

// TODO move to model file
export interface DirectionFromStation {
  stationName: string;
  directionName: string;
  // lineId: string;
  // lineName: string;
  missed: Arrival[];
  next: Arrival[];
}

@Component({
  selector: 'qd-transport',
  templateUrl: './transport.component.html',
  styleUrls: ['transport.component.scss']
})
export class TransportComponent implements OnInit {

  public stations: Station[] = [];
  public arrivals: Arrival[] = [];
  public directions: DirectionFromStation[] = [];
  public firstFutureArrival: number;

  constructor(
    private http: Http
  ) {
  }

  ngOnInit() {
    this.http.get('http://localhost:9090/transport/latest')
      .map((data: Response) => data.json())
      .map((stations: Station[]): DirectionFromStation[][] => {
        return stations.map((station: Station): DirectionFromStation[] => {
          console.log('Station', station.stationName, station.directions);
          return station.directions.map((direction: Direction) => {
            // TODO figure out "next H&S/District etc.", group by line
            return {
              stationName: station.stationName,
              directionName: direction.directionName,
              missed: direction.arrivals.filter((arrival: ArrivalAtStation) => arrival.timeToStationSeconds < station.walkingDistanceSeconds)
                .map((arrival: ArrivalAtStation) => this.convertArrivalForDisplay(station, direction, arrival)),
              next: direction.arrivals.filter((arrival: ArrivalAtStation) => arrival.timeToStationSeconds >= station.walkingDistanceSeconds)
                .map((arrival: ArrivalAtStation) => this.convertArrivalForDisplay(station, direction, arrival))
              };
            });
          });
      })
      .map((directionss: DirectionFromStation[][]) => {
        return [].concat(...directionss);
      })
      .subscribe((directions: DirectionFromStation[]) => {
        this.directions = directions;
      })
  }

  private convertArrivalForDisplay(station: Station, direction: Direction, arrival: ArrivalAtStation): Arrival {
    return {
      station: station.stationName,
      direction: direction.directionName,
      lineId: arrival.lineId,
      destination: arrival.towards,
      timeToStationSeconds: arrival.timeToStationSeconds,
      timeToStationMinutes: Math.floor(arrival.timeToStationSeconds / 60),
      isWalkingDistance: station.walkingDistanceSeconds < arrival.timeToStationSeconds,
    };
  }
}
