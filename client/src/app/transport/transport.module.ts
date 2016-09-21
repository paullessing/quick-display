import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportComponent } from './transport.component';
import {TimeToArrivalPipe} from "./timeToArrival.pipe";
import { ArrivalComponent } from './arrival/arrival.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TransportComponent,
    TimeToArrivalPipe,
    ArrivalComponent
  ],
  exports: [TransportComponent]
})
export class TransportModule { }
