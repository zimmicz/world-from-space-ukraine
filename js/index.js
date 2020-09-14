import 'regenerator-runtime/runtime';
import leaflet from 'leaflet';
import 'normalize.css';
import '../node_modules/leaflet/dist/leaflet.css';
import 'leaflet.sync';
import 'leaflet-control-custom';
import { cloneOverlays } from './config';
import Map from './map';

let rightMap;
const leftOverlays = cloneOverlays();
const rightOverlays = cloneOverlays();
const infobox = document.querySelector('#infobox');
const closeButton = document.querySelector('.button-close');

const hideInfo = () => {
  infobox.classList.toggle('hidden');
};

const showInfo = () => {
  infobox.classList.toggle('hidden');
};

closeButton.addEventListener('click', hideInfo);

const splitMapButton = L.control.custom({
  position: 'topleft',
  content: 'Srovnat',
  classes: 'leaflet-bar',
  style: {
    background: 'white',
    backgroundClip: 'padding-box',
    cursor: 'pointer',
    left: '190px',
    margin: '10px',
    padding: '7px 10px',
    top: '-131px',
  },
  events: {
    click: () => toggleRightMap(leftMap),
  },
});

const infoButton = L.control.custom({
  position: 'topleft',
  content: 'Informace',
  classes: 'leaflet-bar',
  style: {
    background: 'white',
    backgroundClip: 'padding-box',
    cursor: 'pointer',
    left: '260px',
    margin: '10px',
    padding: '7px 10px',
    top: '-187px',
  },
  events: {
    click: showInfo,
  },
});

const {
  map: leftMap,
  setLegendPosition: setLeftLegendPosition,
  setTimelineSize: setLeftTimelineSize,
} = Map('map1', {
  overlays: leftOverlays,
});
leftMap.fitBounds([
  [44.18, 22.14],
  [52.38, 40.23],
]);

leftMap.addControl(splitMapButton);
leftMap.addControl(infoButton);

const toggleRightMap = (leftMap) => {
  if (!rightMap) {
    L.DomUtil.removeClass(L.DomUtil.get('map2'), 'hidden');
    const right = Map('map2', {
      center: leftMap.getCenter(),
      zoom: leftMap.getZoom(),
      overlays: rightOverlays,
    });
    rightMap = right.map;
    leftMap.getContainer().classList.toggle('small');
    rightMap.getContainer().classList.toggle('small');
    leftMap.sync(rightMap);
    rightMap.sync(leftMap);
    setLeftLegendPosition('bottomleft');
    rightMap.invalidateSize();
    leftMap.invalidateSize();
  } else {
    leftMap.getContainer().classList.toggle('small');
    rightMap.getContainer().classList.toggle('small');
    leftMap.unsync(rightMap);
    rightMap.unsync(leftMap);
    rightMap.off();
    rightMap.remove();
    rightMap = undefined;
    leftMap.invalidateSize();
    L.DomUtil.addClass(L.DomUtil.get('map2'), 'hidden');
    setLeftLegendPosition('topright');
    setLeftTimelineSize('small');
  }
}
