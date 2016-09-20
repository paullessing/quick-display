import * as request from 'request-promise-native';

import {Response} from "../routes";
import {config, StationConfig, LineConfig} from "../config";
import {ArrivalsResponse, Arrival} from "./transport.model";
import {ArrivalAtPlatform, Platform} from "../shared/interfaces/stations";

export class TransportService {
  public getLatestTimes(): Promise<Response> {
    return Promise.all(
      config.transport.stations.map((station: StationConfig) => {
        return request<ArrivalsResponse>(`https://api.tfl.gov.uk/StopPoint/${station.id}/Arrivals`, {
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
          const platforms: {[name: string]: ArrivalAtPlatform[]} = {};
          arrivals.forEach((arrival: Arrival) => {
            if (!platforms[arrival.platformName]) {
              platforms[arrival.platformName] = [];
            }
            platforms[arrival.platformName].push({
              modeName: arrival.modeName,
              towards: this.getTowards(arrival),
              lineId: arrival.lineId,
              lineName: arrival.lineName,
              stationName: arrival.stationName,
              timeToStation: arrival.timeToStation,
              expectedArrival: arrival.expectedArrival,
              timestamp: arrival.timestamp
            });
          });
          const platformList: Platform[] = [];
          for (const name in platforms) {
            platforms[name].sort((a: ArrivalAtPlatform, b: ArrivalAtPlatform) =>
              a.timeToStation - b.timeToStation);
            platformList.push({
              platformName: name,
              arrivals: platforms[name]
            });
          }
          platformList.sort((a: Platform, b: Platform) => this.comparePlatforms(a, b));
          return {
            stationName: station.displayName,
            platforms: platformList
          };
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

  private comparePlatforms(a: Platform, b: Platform): number {
    const nameA = a.platformName;
    const nameB = b.platformName;
    let matchA = nameA.match(/Platform ([0-9]+)/gi);
    let matchB = nameB.match(/Platform ([0-9]+)/gi);
    console.log('Comparing', nameA, nameB, matchA, matchB);
    if (matchA && matchB) {
      return matchA[0] < matchB[0] ? -1 : matchA[0] === matchB[0] ? 0 : 1;
    } else {
      return nameA < nameB ? -1 : nameA === nameB ? 0 : 1;
    }
  }
}
