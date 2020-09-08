import 'regenerator-runtime/runtime';
import leaflet from 'leaflet';
import cloneLayer from 'leaflet-clonelayer';
import 'normalize.css';
import '../node_modules/leaflet/dist/leaflet.css';
import 'leaflet.sync';
import 'leaflet-control-custom';
import { BASE_LAYER, cloneOverlays } from './config';
import Map from './map';
import { createChart } from './chart';
import geojson from '../data/UA_MD_raions_CO_CAMS.json';

let rightMap;
let leftGeojson;
const leftOverlays = cloneOverlays();
const rightOverlays = cloneOverlays();

const splitMapButton = L.control.custom({
  position: 'topleft',
  content: 'Srovnat',
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

const layerSwitch = {
  position: 'topleft',
  content: 'Zobrazit adm. jednotky',
  classes: 'leaflet-bar',
  style: {
    background: 'white',
    backgroundClip: 'padding-box',
    cursor: 'pointer',
    left: '110px',
    margin: '10px',
    padding: '7px 10px',
    top: '-131px',
  },
};

//const geojsonLayer = L.geoJSON(geojson, {
  //style: function(feature) {
    //const { legend } = leftOverlays['CO monthly cams'].options;
    //const value = feature.properties['CO__17-08m'];
    //const output = legend.reduce((prev, curr) => Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev);
    //return {
      //color: 'rgba(255, 255, 255, .5)',
      //fillColor: output.color,
      //fillOpacity: 1,
      //weight: 1,
    //};
  //},
//}).bindPopup(createChart);

const {
  map: leftMap,
  setLegendPosition: setLeftLegendPosition,
  setTimelineSize: setLeftTimelineSize,
} = Map('map1');
leftMap.fitBounds([
  [44.18, 22.14],
  [52.38, 40.23],
]);

leftMap.addLayer(BASE_LAYER);
leftMap.addLayer(leftOverlays[Object.keys(leftOverlays)[0]]);
leftMap.addControl(L.control.layers(leftOverlays));
leftMap.addControl(splitMapButton);
leftMap.addControl(L.control.custom({
  ...layerSwitch,
  events: {
    click: async () => {
      const currentLayer = Object.keys(leftOverlays).find(key => leftMap.hasLayer(leftOverlays[key]));

      const [element, , type] = currentLayer.split(' ');
      const url = `https://tiles.worldfromspace.cz/UAMD/vector/UA_MD_raions_${element}_${type}.geojson`;
      const result = await fetch(url);

      if (leftGeojson) {
        leftMap.removeLayer(leftGeojson);
      }

      leftGeojson = L.geoJSON(result, {
        style: function(feature) {
          const { legend, range } = leftOverlays[`${element} monthly ${type}`].options;
          const date = range.format('YY-MM');
          const value = feature.properties[`${element}__${date}m`];
          const { color } = legend.reduce((prev, curr) => Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev);
          return {
            color: 'rgba(255, 255, 255, .5)',
            fillColor: color,
            fillOpacity: 1,
            weight: 1,
          };
        },
      }).bindPopup(createChart);

      leftMap.addLayer(leftGeojson);
    },
  },
}));
//leftMap.addLayer(geojsonLayer);

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
    rightMap.addControl(L.control.custom({
      ...layerSwitch,
      style: {
        ...layerSwitch.style,
        left: '40px',
        top: '-75px',
      },
    }));
    leftMap.sync(rightMap);
    rightMap.sync(leftMap);
    rightMap.addLayer(cloneLayer(BASE_LAYER));
    rightMap.addLayer(rightOverlays[Object.keys(rightOverlays)[0]]);
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
