import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild } from '@angular/core';
import { LngLat, Map } from 'mapbox-gl';

@Component({
  templateUrl: './zoom-range-page.component.html',
  styleUrls: ['./zoom-range-page.component.css']
})
export class ZoomRangePageComponent implements AfterViewInit, OnDestroy {

  @ViewChild('map') divMap?: ElementRef;

  public zoonLevel: number = 10;
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
      zoom: this.zoonLevel, // starting zoom
    });

    this.mapListeners();
  }

  ngOnDestroy(): void {
    this.map?.remove();
  }

  mapListeners() {

    if (!this.map) {
      throw new Error('map is not defined');
    }

    this.map.on('zoom', (event) => {
      this.zoonLevel = this.map!.getZoom();
    });

    this.map.on('zoomend', (event) => {
      if (this.map!.getZoom() > 18) {
        this.map!.zoomTo(18);
      }
    });

    this.map.on('move', () => {
      this.currentLngLat = this.map!.getCenter();
      const { lng, lat } = this.currentLngLat;
    });

  }

  zoomOut() {
    this.map?.zoomOut();
  }

  zoomIn() {
    this.map?.zoomIn();
  }

  zoomRangeChange(value: string) {
    this.map?.zoomTo(Number(value));
  }

}
