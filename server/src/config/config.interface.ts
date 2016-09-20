export interface LineConfig {
  lineName: string;
}

export interface StationConfig {
  id: string;
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
