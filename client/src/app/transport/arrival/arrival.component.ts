import { Component, Input } from '@angular/core';
import {ArrivalAtPlatform} from "../../shared";

@Component({
  selector: 'qd-arrival',
  templateUrl: './arrival.component.html',
  styleUrls: ['./arrival.component.scss']
})
export class ArrivalComponent {

  @Input('arrival')
  public arrival: ArrivalAtPlatform;

  @Input('displayName')
  public displayName: boolean;

  constructor() {}
}
