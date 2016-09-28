import * as request from 'request-promise-native';

import {Response} from "../routes";
import {config, StationConfig, LineConfig} from "../config";
import {ArrivalsResponse, Arrival} from "./transport.model";
import {ArrivalAtStation, Direction, Station} from "../shared/interfaces/stations";

export class TransportService {
  public getLatestTimes(): Promise<Response> {
    return Promise.all(
      config.transport.stations.map((station: StationConfig) => {
        return request(`https://api.tfl.gov.uk/StopPoint/${station.id}/Arrivals`, {
          qs: {
            app_id: config.tfl.appId,
            app_key: config.tfl.apiKey
          },
          json: true
        })
        .then((response: ArrivalsResponse) => {
          return response.filter((arrival: Arrival) => !!station.lines.find((line: LineConfig) => line.lineId === arrival.lineId))
        }).then((arrivals: Arrival[]) => {
          console.log(arrivals);
          const directions: {[name: string]: ArrivalAtStation[]} = {};
          arrivals.forEach((arrival: Arrival) => {
            const direction = arrival.direction
              || station.platformDirections[arrival.platformName]; // Look up direction from platform
            if (!directions[direction]) {
              directions[direction] = [];
            }
            directions[direction].push({
              modeName: arrival.modeName,
              towards: this.getTowards(arrival),
              lineId: arrival.lineId,
              lineName: arrival.lineName,
              stationName: arrival.stationName,
              timeToStationSeconds: arrival.timeToStation,
              expectedArrival: arrival.expectedArrival,
              timestamp: arrival.timestamp
            } as ArrivalAtStation);
          });
          const directionList: Direction[] = [];
          for (const name in directions) {
            directions[name].sort((a: ArrivalAtStation, b: ArrivalAtStation) =>
              a.timeToStationSeconds - b.timeToStationSeconds);
            directionList.push({
              directionName: station.directions[name] || 'Unknown',
              arrivals: directions[name]
            });
          }
          // directionList.sort((a: Direction, b: Direction) => this.comparePlatforms(station, a, b));
          return {
            stationName: station.displayName,
            walkingDistanceSeconds: station.walkingDistanceMinutes * 60,
            directions: directionList
          } as Station;
        })
      }
    )).then((stations: any[]) => {
      return Response.resolve(stations);
    });
  }

  private getTowards(arrival: Arrival): string {
    if (arrival.towards) {
      return arrival.towards;
    }
    if (arrival.destinationName) {
      return arrival.destinationName.replace(/DLR Station$/gi, '');
    }
    return null;
  }
}
