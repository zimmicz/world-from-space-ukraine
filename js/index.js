import leaflet from 'leaflet';
import cloneLayer from 'leaflet-clonelayer';
import 'normalize.css';
import '../node_modules/leaflet/dist/leaflet.css';
import 'leaflet.sync';
import 'leaflet-control-custom';
import { BASE_LAYER, cloneOverlays } from './config';
import Map from './map';

let rightMap;
const leftOverlays = cloneOverlays();
const rightOverlays = cloneOverlays();
const splitMapButton = L.control.custom({
  position: 'topleft',
  content: 'Split map',
  classes: 'leaflet-bar',
  style: {
    background: 'white',
    backgroundClip: 'padding-box',
    cursor: 'pointer',
    left: '40px',
    margin: '10px',
    padding: '7px 10px',
    top: '-75px',
  },
  events: {
    click: () => toggleRightMap(leftMap),
  },
});

const {
  map: leftMap,
  setLegendPosition: setLeftLegendPosition,
  setTimelineSize: setLeftTimelineSize,
} = Map('map1');
leftMap.fitBounds([
  [44.18, 22.14],
  [52.38, 40.23],
]);

leftMap.addControl(L.control.layers(leftOverlays));
leftMap.addLayer(BASE_LAYER);
leftMap.addControl(splitMapButton);

const toggleRightMap = (leftMap) => {
  if (!rightMap) {
    L.DomUtil.removeClass(L.DomUtil.get('map2'), 'hidden');
    const right = Map('map2', {
      center: leftMap.getCenter(),
      zoom: leftMap.getZoom(),
    });
    rightMap = right.map;
    leftMap.getContainer().classList.toggle('small');
    rightMap.getContainer().classList.toggle('small');
    rightMap.addControl(L.control.layers(rightOverlays));
    leftMap.sync(rightMap);
    rightMap.sync(leftMap);
    rightMap.addLayer(cloneLayer(BASE_LAYER));
    setLeftLegendPosition('bottomleft');
  } else {
    leftMap.getContainer().classList.toggle('small');
    rightMap.getContainer().classList.toggle('small');
    leftMap.unsync(rightMap);
    rightMap.unsync(leftMap);
    rightMap.off();
    rightMap.remove();
    rightMap = undefined;
    L.DomUtil.addClass(L.DomUtil.get('map2'), 'hidden');
    setLeftLegendPosition('topright');
    setLeftTimelineSize('small');
  }
}
