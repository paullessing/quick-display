import {Response} from "../routes/response.model";

export class TransportService {
  public getLatestTimes() {
    return Response.resolve({
      train: 'late',
      bus: 'later'
    });
  }
}
