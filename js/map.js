import leaflet from 'leaflet';
import TimelineControl from './l.control.timeline';
import LegendControl from './legend/control';
import { overlays } from './config';

let timelineControl;
let legendControl;

export default function initialize(elem, options) {
  const map = L.map(elem, options);

  map.on('baselayerchange', (e) => {
    updateTimelineOnLayerChange(e, map);
    updateLegendOnLayerChange(e, map);
  });

  map.addControl(L.control.layers(overlays));
  map.addLayer(overlays[Object.keys(overlays)[0]]);

  return map;
}

function updateTimelineOnLayerChange(e, map) {
  timelineControl && map.removeControl(timelineControl);

  timelineControl = TimelineControl({
    range: e.layer.options.range,
    autoplay: true,
    dateFormat: 'MMM <br /> YYYY',
    position: 'bottomleft',
  });

  map.addControl(timelineControl);
}

function updateLegendOnLayerChange(e, map) {
  legendControl && map.removeControl(legendControl);

  if (e.layer.options.legend) {
    legendControl = LegendControl({
      layer: e.layer,
      //position: rightMap ? 'topleft' : 'topright',
    });
    map.addControl(legendControl);
  }
}
