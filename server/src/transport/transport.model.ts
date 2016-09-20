export interface ArrivalsResponse {
  $type: string; // "Tfl.Api.Presentation.Entities.Prediction, Tfl.Api.Presentation.Entities",
  id: string; // "1273855961",
  operationType: number; // 1,
  vehicleId: string; // "003",
  naptanId: string; // "940GZZLUBBB",
  stationName: string; // "Bromley-by-Bow Underground Station",
  lineId: string; // "district",
  lineName: string; // "District",
  platformName: string; // "Westbound - Platform 1",
  direction: string; // "inbound",
  bearing: string; // "",
  destinationNaptanId: string; // "940GZZLURMD",
  destinationName: string; // "Richmond Underground Station",
  timestamp: string; // "2016-09-20T12:30:33Z",
  timeToStation: number; // 267,                  // Seconds til arrival
  currentLocation: string; // "Left Plaistow",
  towards: string; // "Richmond",
  expectedArrival: string; // "2016-09-20T12:35:00.6933816Z",
  timeToLive: string; // "2016-09-20T12:35:00.6933816Z",
  modeName: string; // "tube"
}
