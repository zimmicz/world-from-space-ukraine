import leaflet from 'leaflet';
import cloneLayer from 'leaflet-clonelayer';
import 'normalize.css';
import '../node_modules/leaflet/dist/leaflet.css';
import 'leaflet.sync';
import 'leaflet-control-custom';
import { overlays } from './config';
import timelineControl from './l.control.timeline';
import legendControl from './legend/control';

let rightMap;
let leftLegend;
let leftTimelineControl;

const rightOverlays = Object
  .entries(overlays)
  .reduce((accum, [name, layer]) => {
    return {
      ...accum,
      [name]: cloneLayer(layer),
    };
  }, {});

const toggleRightMap = (leftMap) => {
  let legend;
  let rightTimelineControl;

  if (!rightMap) {
    L.DomUtil.removeClass(L.DomUtil.get('map2'), 'hidden');
    leftLegend.setPosition('bottomleft');
    leftTimelineControl.setSize('small');
    rightMap = L.map('map2', {
      center: leftMap.getCenter(),
      zoom: leftMap.getZoom(),
    });
    rightMap.addControl(L.control.layers(rightOverlays));
    leftMap.sync(rightMap);
    rightMap.sync(leftMap);

    rightMap.on('baselayerchange', (e) => {
      rightTimelineControl && rightMap.removeControl(rightTimelineControl);

      rightTimelineControl = timelineControl({
        range: e.layer.options.range,
        autoplay: true,
        dateFormat: 'MMM <br/> YYYY',
        position: 'bottomleft',
        size: 'small',
      });

      rightMap.addControl(rightTimelineControl);

      legend && rightMap.removeControl(legend);

      if (e.layer.options.legend) {
        legend = legendControl({
          layer: e.layer,
        });
        rightMap.addControl(legend);
      }
    });

    rightMap.addLayer(rightOverlays[Object.keys(rightOverlays)[0]]);
  } else {
    leftMap.unsync(rightMap);
    rightMap.unsync(leftMap);
    rightMap.off();
    rightMap.remove();
    rightMap = undefined;
    L.DomUtil.addClass(L.DomUtil.get('map2'), 'hidden');
    leftLegend.setPosition('topright');
    leftTimelineControl.setSize('small');
  }
}

initializeLeftMap();

function initializeLeftMap() {
  const leftMap = L.map('map1', {
    center: [51.505, -0.09],
    zoom: 13,
  });

  leftMap.on('baselayerchange', (e) => {
    leftTimelineControl && leftMap.removeControl(leftTimelineControl);

    leftTimelineControl = timelineControl({
      range: e.layer.options.range,
      autoplay: true,
      dateFormat: 'MMM <br /> YYYY',
      position: 'bottomleft',
    });

    leftMap.addControl(leftTimelineControl);

    leftLegend && leftMap.removeControl(leftLegend);

    if (e.layer.options.legend) {
      leftLegend = legendControl({
        layer: e.layer,
        position: rightMap ? 'topleft' : 'topright',
      });
      leftMap.addControl(leftLegend);
    }
  });

  L.control.custom({
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
  }).addTo(leftMap);
  leftMap.addControl(L.control.layers(overlays));

  leftMap.addLayer(overlays[Object.keys(overlays)[0]]);
}
