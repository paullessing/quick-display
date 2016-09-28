import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportComponent } from './transport.component';
import { ArrivalComponent } from './arrival/arrival.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TransportComponent,
    ArrivalComponent
  ],
  exports: [TransportComponent]
})
export class TransportModule { }
