import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

@Component({
  selector: 'maps-mini-map',
  templateUrl: './mini-map.component.html',
  styleUrls: ['./mini-map.component.css']
})
export class MiniMapComponent implements AfterViewInit {

  @Input() lngLat?: [ number, number ];
  @ViewChild('map') divMap?: ElementRef;

  public map?: Map;


  ngAfterViewInit(): void {

    if(!this.divMap?.nativeElement) {
      throw new Error('divMap is not defined');
    }

    if(!this.lngLat) {
      throw new Error('lngLat is not defined');
    }

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.lngLat, // starting position [lng, lat]
      zoom: 15, // starting zoom
      interactive: false
    });

    new Marker()
      .setLngLat( this.lngLat )
      .addTo( this.map );

  }
}
