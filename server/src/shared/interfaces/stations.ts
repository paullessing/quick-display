export interface Station {
  name: string;
  directions: Direction[];
}

export interface Direction {
  name: string;
  upcoming: Departure[];
  past: Departure[];
}

export interface Departure {
  lineId: string;
  lineName: string;
  minutesToDeparture: number;
  destination: string;
}
