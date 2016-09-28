export interface Arrival {
  station: string;
  platform: string;
  lineId: string;
  destination: string;
  timeToStationSeconds: number;
  timeToStationMinutes: number;
  isWalkingDistance: boolean;
}
