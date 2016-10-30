import * as request from 'request-promise-native';

import {Response} from '../routes';
import {config, StationConfig, LineConfig} from "../config";
import {ArrivalsResponse, ApiArrival} from "./transport.model";
import {Station, Direction, Departure} from "../shared/interfaces/stations";

type Map<T> = { [key: string]: T };

export class TransportService {
  public getLatestTimes(): Promise<Response> {
    return Promise.all<Station>(
      config.transport.stations.map((stationConfig: StationConfig): Promise<Station> => {
        return request(`https://api.tfl.gov.uk/StopPoint/${stationConfig.id}/Arrivals`, {
          qs: {
            app_id: config.tfl.appId,
            app_key: config.tfl.apiKey
          },
          json: true
        }).then((response: ArrivalsResponse) => {
          return response.filter((arrival: ApiArrival) => !!stationConfig.lines.find((line: LineConfig) => line.lineId === arrival.lineId))
        }).then((apiArrivals: ApiArrival[]) => {
          const directionsByName: Map<Direction> = {};

          apiArrivals.forEach((apiArrival: ApiArrival) => {
            const directionId = this.getDirection(apiArrival, stationConfig);
            const directionName = stationConfig.directions[directionId] || 'Unknown Direction';

            const direction: Direction = directionsByName[directionId] || (directionsByName[directionId] = {
              name: directionName,
              upcoming: [],
              past: []
            });

            const departure: Departure = {
              lineId: apiArrival.lineId,
              lineName: apiArrival.lineName,
              minutesToDeparture: Math.floor(apiArrival.timeToStation / 60),
              destination: this.getTowards(apiArrival)
            };

            const departureCategory: Departure[] =  departure.minutesToDeparture < stationConfig.walkingDistanceMinutes ? direction.past : direction.upcoming;

            departureCategory.push(departure);
            departureCategory.sort((a: Departure, b: Departure) => a.minutesToDeparture - b.minutesToDeparture);
          });


          const station: Station = {
            name: stationConfig.displayName,
            directions: Object.keys(directionsByName).map(directionName => directionsByName[directionName])
          };

          return station;
        });
      }
    ))
    .then(x => {console.log("\n\nDONE:\n", JSON.stringify(x)); return x})
    .then(Response.resolve);
  }

  private getTowards(arrival: ApiArrival): string {
    if (arrival.towards) {
      return arrival.towards;
    }
    if (arrival.destinationName) {
      return arrival.destinationName.replace(/DLR Station$/gi, '');
    }
    return null;
  }

  private getDirection(arrival: ApiArrival, stationConfig: StationConfig): string {
    return arrival.direction || stationConfig.platformDirections[arrival.platformName]; // Look up direction from platform
  }
}
