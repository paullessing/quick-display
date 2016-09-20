import {Pipe, PipeTransform} from "@angular/core";

@Pipe({ name: 'timeToArrival' })
export class TimeToArrivalPipe implements PipeTransform {
  transform(seconds: number): string {
    console.log(seconds);
    let date = new Date(seconds * 1000);
    console.log(date);
    let value = '';
    if (date.getHours() > 0) {
      value += date.getHours() + 'h';
    }
    let minutes = date.getMinutes();
    if (date.getSeconds() > 30) {
      minutes += 1;
    }
    if (value.length && minutes > 0 || !value.length) {
      value += minutes + 'm';
    }
    // Ignore seconds
    return value;
  }
}
