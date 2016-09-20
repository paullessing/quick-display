export interface LineConfig {
  lineId: string;
}

export interface StationConfig {
  id: string;
  displayName: string;
  lines: LineConfig[];
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
