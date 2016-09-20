import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportComponent } from './transport.component';
import {TimeToArrivalPipe} from "./timeToArrival.pipe";

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TransportComponent, TimeToArrivalPipe],
  exports: [TransportComponent]
})
export class TransportModule { }
