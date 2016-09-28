export interface LineConfig {
  lineId: string;
}

export interface StationConfig {
  id: string;
  displayName: string;
  lines: LineConfig[];
  directions: {
    outbound: string;
    inbound: string;
  };
  platformDirections: {
    [platformName: string]: string;
  }
  walkingDistanceMinutes: number;
}

export interface Config {
  tfl: {
    appId: string;
    apiKey: string;
  },
  transport?: {
    stations?: StationConfig[]
  }
}
