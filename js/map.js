import leaflet from 'leaflet';
import TimelineControl from './l.control.timeline';
import LegendControl from './legend/control';
import SwitchControl from './l.control.switch';
import { createChart } from './chart';
import { BASE_LAYER } from './config';

export default function initialize(elem, options) {
  const map = L.map(elem, options);
  const { overlays } = options;

  let currentDate;
  let geojsonSource;
  let geojsonLayer;
  let timelineControl;
  let legendControl;

  map.addControl(L.control.layers(overlays));

  const styleGeoJson = (feature) => {
    const { options } = overlays[Object.keys(overlays).find(key => map.hasLayer(overlays[key]))];
    const { legend, name, range, type } = options;
    const date = currentDate || range[0];
    const datePart = date.format('YY-MM');
    let attr = `${name}__${datePart}m`;

    if (type === 'S5P') {
      attr = `_${name}_${datePart}m`;
    }

    const value = feature.properties[attr];
    const { color } = legend.reduce((prev, curr) => Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev);
    return {
      color: 'rgba(255, 255, 255, .5)',
      fillColor: color,
      fillOpacity: 1,
      weight: 1,
    };
  };

  const toggleLayers = async () => {
    const { options } = overlays[Object.keys(overlays).find(key => map.hasLayer(overlays[key]))];
    const { name, type } = options;

    const url = `https://tiles.worldfromspace.cz/UAMD/vector/UA_MD_raions_${name}_${type}.geojson`;
    const result = await fetch(url);
    geojsonSource = await result.json();

    if (geojsonLayer) {
      map.removeLayer(geojsonLayer);
      geojsonLayer = null;
      return;
    }

    geojsonLayer = L.geoJSON(geojsonSource, {
      style: styleGeoJson,
    }).bindPopup(createChart);

    map.addLayer(geojsonLayer);
  }

  map.addControl(L.control.custom({
    ...SwitchControl,
    events: {
      click: toggleLayers,
    },
  }));

  const setLegendPosition = (position) => {
    legendControl && legendControl.setPosition(position);
  };

  const setTimelineSize = (size) => {
    timelineControl && timelineControl.setSize(size);
  };

  const onNextStep = (date) => {
    currentDate = date;
    if (geojsonSource) {
      if (geojsonLayer) {
        map.removeLayer(geojsonLayer);
        geojsonLayer = null;
      }
      geojsonLayer = L.geoJSON(geojsonSource, {
        style: styleGeoJson,
      }).bindPopup(createChart);

      map.addLayer(geojsonLayer);
    } else {
      map.eachLayer(layer => {
        if (layer.options.range) {
          const urlParts = layer._url.split('/');
          urlParts[6] = date.format('YYYY_MM');
          layer.setUrl(urlParts.join('/'));
        }
      });
    }
  };

  const handleBaseLayerChange = (e) => {
    if (timelineControl) {
      map.removeControl(timelineControl);
    }

    timelineControl = createTimelineControl(e, onNextStep);
    map.addControl(timelineControl);

    if (legendControl) {
      map.removeControl(legendControl);
    }

    if (e.layer.options.legend) {
      legendControl = createLegendControl(e);
      map.addControl(legendControl);
    }
  }

  map.on('baselayerchange', handleBaseLayerChange);
  map.addLayer(BASE_LAYER);
  map.addLayer(overlays[Object.keys(overlays)[0]]);
  handleBaseLayerChange({ layer: overlays[Object.keys(overlays)[0]] });

  return {
    map,
    setLegendPosition,
    setTimelineSize,
  };
}

function createTimelineControl(e, callback) {
  return TimelineControl({
    range: e.layer.options.range,
    autoplay: true,
    dateFormat: 'MMM <br /> YYYY',
    onNextStep: callback,
    position: 'bottomleft',
  });
}

function createLegendControl(e) {
  return LegendControl({
    layer: e.layer,
  });
}
