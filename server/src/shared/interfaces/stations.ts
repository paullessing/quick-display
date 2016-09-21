import {DateTime} from "./common";

export type Stations = Station[];

export interface Station {
  stationName: string;
  timeToStation: number;
  platforms: Platform[];
}

export interface Platform {
  platformName: string;
  arrivals: ArrivalAtPlatform[];
}

export interface ArrivalAtPlatform {
  modeName: string;
  towards: string;
  lineId: string;
  lineName: string;
  stationName: string;
  timeToStation: number;
  expectedArrival: DateTime;
  timestamp: DateTime;
}
