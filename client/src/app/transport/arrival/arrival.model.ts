export interface Arrival {
  station: string;
  direction: string;
  lineId: string;
  destination: string;
  timeToStationSeconds: number;
  timeToStationMinutes: number;
  isWalkingDistance: boolean;
}
