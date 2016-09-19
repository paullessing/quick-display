import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransportComponent } from './transport.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TransportComponent],
  exports: [TransportComponent]
})
export class TransportModule { }
