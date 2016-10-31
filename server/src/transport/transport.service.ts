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

          const directions = Object.keys(directionsByName).map(directionName => directionsByName[directionName]);

          directions
            .forEach((direction: Direction) => {
              direction.past = direction.past.filter((departure: Departure) => {
                if (departure.minutesToDeparture < stationConfig.walkingDistanceMinutes / 2) {
                  return false;
                }
                return true;
              });
              const linesSeenBefore: Map<boolean> = {};
              direction.upcoming = direction.upcoming.filter((departure: Departure, index: number) => {
                const thisLineSeenBefore = linesSeenBefore[departure.lineId];
                linesSeenBefore[departure.lineId] = true;

                if (!thisLineSeenBefore) {
                  console.log('Not seen before', departure.lineId, direction.name);
                  return true;
                }
                if (index >= 3 && (departure.minutesToDeparture > stationConfig.walkingDistanceMinutes + 10 || index >= 5)) {
                  console.log('Removing', departure);
                  return false;
                }
                return true;
              })
            });

          directions.sort(sortInboundOutbound(stationConfig));

          const station: Station = {
            name: stationConfig.displayName,
            directions: directions
          };

          return station;
        });
      }
    ))
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

function sortInboundOutbound(stationConfig: StationConfig): (a: Direction, b: Direction) => number {
  return (directionA: Direction, directionB: Direction) => {
    if (typeof stationConfig.inboundFirst === 'undefined') {
      return 0;
    }

    if (directionA.name === directionB.name) {
      return 0;
    }

    const isAInbound = stationConfig.directions.inbound === directionA.name; // Not great
    const isBInbound = stationConfig.directions.inbound === directionB.name;
    const isAOutbound = stationConfig.directions.outbound === directionA.name;
    const isBOutbound = stationConfig.directions.outbound === directionB.name;

    console.log(isAInbound, isBInbound, isAOutbound, isBOutbound);

    if (stationConfig.inboundFirst) {
      if (isAInbound) {
        return -1;
      } else if (isBInbound) {
        return 1;
      } else if (isAOutbound) {
        return -1;
      } else if (isBOutbound) {
        return 1;
      } else {
        return 0;
      }
    } else {
      if (isAOutbound) {
        return -1;
      } else if (isBOutbound) {
        return 1;
      } else if (isAInbound) {
        return -1;
      } else if (isBInbound) {
        return 1;
      } else {
        return 0;
      }
    }
  };
}
