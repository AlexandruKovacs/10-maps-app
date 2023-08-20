import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map, Marker } from 'mapbox-gl';

interface MarkerColor {
  color: string;
  marker?: Marker;
}

interface PlaneMarker {
  color: string;
  lngLat: [ number, number ];
}

@Component({
  templateUrl: './markers-page.component.html',
  styleUrls: ['./markers-page.component.css']
})
export class MarkersPageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerColor[] = [];

  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-3.7067462687683133, 40.415443039294445);

  ngAfterViewInit(): void {

    if (!this.divMap) {
      throw new Error('divMap is not defined');
    }

    this.map = new Map({
      container: this.divMap?.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 13, // starting zoom
    });

    this.readFromLocalStorage();

    // const markerHtml = document.createElement('div');
    // markerHtml.innerHTML = 'Hello World!';

    // const marker = new Marker({
    //   color: 'red',
    //   element: markerHtml
    // })
    //   .setLngLat( this.currentLngLat )
    //   .addTo( this.map );

  }

  public createMarker(): void {

    if (!this.map) {
      throw new Error('map is not defined');
    }

    const color = '#xxxxxx'.replace(/x/g, y => (Math.random() * 16 | 0).toString(16));
    const lngLat = this.map.getCenter();

    this.addMarker(lngLat, color);
  }

  public addMarker(lngLat: LngLat, color: string): void {

    if (!this.map) {
      throw new Error('map is not defined');
    }

    const marker = new Marker({
      color,
      draggable: true
    })
      .setLngLat(lngLat)
      .addTo(this.map);

    this.markers.push({ color, marker });
    this.saveToLocalStorage();

    marker.on('dragend', () => {
      this.saveToLocalStorage();
    });
  }

  removeMarker(index: number): void {

    if (!this.map) {
      throw new Error('map is not defined');
    }

    this.markers[index].marker?.remove();
    this.markers.splice(index, 1);
  }

  flyToMarker(marker: Marker | undefined): void {

    if (!this.map) {
      throw new Error('map is not defined');
    }

    this.map.flyTo({
      zoom: 14,
      center: marker?.getLngLat()
    });
  }

  saveToLocalStorage(): void {
    const plainMarkers: PlaneMarker[] = this.markers.map( ({ color, marker }) => {
      return {
        color,
        lngLat: marker?.getLngLat().toArray() as [ number, number ]
      };
    });

    localStorage.setItem('plainMarkers', JSON.stringify( plainMarkers ));
  }

  readFromLocalStorage(): void {
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlaneMarker[] = JSON.parse( plainMarkersString ); // ojo

    plainMarkers.forEach( ({ color, lngLat }) => {

      const [ lng, lat ] = lngLat;
      const coords = new LngLat( lng, lat );

      this.addMarker( coords, color );
    });

  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

}
