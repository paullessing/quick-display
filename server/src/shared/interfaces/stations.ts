import {DateTime} from "./common";

export interface Station {
  stationName: string;
  walkingDistanceSeconds: number;
  directions: Direction[];
}

export interface Direction {
  directionName: string;
  arrivals: ArrivalAtStation[];
}

export interface ArrivalAtStation {
  modeName: string;
  towards: string;
  lineId: string;
  lineName: string;
  stationName: string;
  timeToStationSeconds: number;
  expectedArrival: DateTime;
  timestamp: DateTime;
}
