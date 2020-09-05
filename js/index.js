import leaflet from 'leaflet';
import cloneLayer from 'leaflet-clonelayer';
import 'normalize.css';
import '../node_modules/leaflet/dist/leaflet.css';
import 'leaflet.sync';
import 'leaflet-control-custom';
import { cloneOverlays } from './config';
import Map from './map';

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
} = Map('map1', {
  center: [51.505, -0.09],
  zoom: 13,
});

const leftOverlays = cloneOverlays();
const rightOverlays = cloneOverlays();

leftMap.addControl(L.control.layers(leftOverlays));
leftMap.addLayer(leftOverlays[Object.keys(leftOverlays)[0]]);
leftMap.addControl(splitMapButton);

let rightMap;

const toggleRightMap = (leftMap) => {
  if (!rightMap) {
    L.DomUtil.removeClass(L.DomUtil.get('map2'), 'hidden');
    setLeftLegendPosition('bottomleft');
    rightMap = Map('map2', {
      center: leftMap.getCenter(),
      zoom: leftMap.getZoom(),
    }).map;
    rightMap.addControl(L.control.layers(rightOverlays));
    leftMap.sync(rightMap);
    rightMap.sync(leftMap);
    rightMap.addLayer(rightOverlays[Object.keys(rightOverlays)[0]]);
  } else {
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
