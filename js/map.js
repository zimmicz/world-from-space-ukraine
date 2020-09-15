import leaflet from 'leaflet';
import cloneLayer from 'leaflet-clonelayer';
import TimelineControl from './l.control.timeline';
import LegendControl from './legend/control';
import SwitchControl from './l.control.switch';
import { createChart } from './chart';
import { BASE_LAYER, BASE_LAYER_TONER } from './config';

export default function initialize(elem, options) {
  const map = L.map(elem, options);
  const { overlays } = options;

  let currentDate;
  let geojsonSource;
  let geojsonLayer;
  let switchControl;
  let timelineControl;
  let legendControl;

  map.addControl(L.control.layers(overlays));

  const styleGeoJson = (feature) => {
    const { options } = overlays[Object.keys(overlays).find(key => map.hasLayer(overlays[key]))];
    const { legend, name, range } = options;
    const date = currentDate || range[0];
    const regex = /\d{2}[-_]\d{2}/;
    const key = Object.keys(feature.properties).find(key => key.match(regex));
    const attr = key
      .replace(name, '~~')
      .replace(regex, [date.format('YY'), date.format('MM')].join(key.indexOf('-') > -1 ? '-' : '_'))
      .replace('~~', name);
    const value = feature.properties[attr];

    const { color } = legend.reduce((prev, curr) => Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev);
    return {
      color: 'rgba(0, 0, 0, .5)',
      fillColor: color,
      fillOpacity: 1,
      weight: 1,
    };
  };

  const fetchVectorLayer = async () => {
    const { options } = overlays[Object.keys(overlays).find(key => map.hasLayer(overlays[key]))];
    const { name, range, type } = options;
    currentDate = range[0];

    const url = `https://tiles.worldfromspace.cz/UAMD/vector/UA_MD_raions_${name}_${type}.geojson`;
    const result = await fetch(url);
    return result.json();
  };

  const loadVectorLayer = async () => {
    if (geojsonLayer) {
      geojsonSource = await fetchVectorLayer();
      map.removeLayer(geojsonLayer);
      geojsonLayer = null;

      geojsonLayer = L.geoJSON(geojsonSource, {
        style: styleGeoJson,
      }).bindPopup(createChart);

      map.addLayer(geojsonLayer);
    }
  };

  const toggleLayers = async () => {
    if (geojsonLayer) {
      switchControl.container.innerHTML = 'Zobrazit adm. jednotky';
      map.removeLayer(geojsonLayer);
      geojsonLayer = null;
      return;
    }

    switchControl.container.innerHTML = 'Skrýt adm. jednotky';
    currentDate = null;
    geojsonSource = await fetchVectorLayer();
    geojsonLayer = L.geoJSON(geojsonSource, {
      style: styleGeoJson,
    }).bindPopup(createChart);

    map.addLayer(geojsonLayer);
  }

  switchControl = createSwitchControl(toggleLayers);

  map.addControl(switchControl);

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
    }

    map.eachLayer(layer => {
      if (layer.options.range) {
        const urlParts = layer._url.split('/');
        urlParts[6] = date.format('YYYY_MM');
        layer.setUrl(urlParts.join('/'));
      }
    });
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

    loadVectorLayer();
  }

  map.on('baselayerchange', handleBaseLayerChange);
  map.addLayer(cloneLayer(BASE_LAYER_TONER));
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

function createSwitchControl(callback) {
  return L.control.custom({
    ...SwitchControl,
    events: {
      click: callback,
    },
  });
};
