import {Component, Input, OnChanges} from '@angular/core';
import {Arrival} from "./arrival.model";

@Component({
  selector: 'qd-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss']
})
export class ArrivalComponent implements OnChanges {

  @Input('arrival')
  public arrival: Arrival;

  @Input('small')
  public small: boolean;

  public timeToStationMinutes: number;

  constructor() {}

  ngOnChanges() {
    if (this.arrival) {
      this.timeToStationMinutes = Math.floor(this.arrival.timeToStationSeconds / 60);
    }
  }
}
