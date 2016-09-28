import { Component, Input } from '@angular/core';
import {ArrivalAtPlatform} from "../../shared";
import {Arrival} from "./arrival.model";

@Component({
  selector: 'qd-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss']
})
export class ArrivalComponent {

  @Input('arrival')
  public arrival: Arrival;

  @Input('small')
  public small: boolean;

  constructor() {}
}
