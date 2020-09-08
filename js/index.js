import leaflet from 'leaflet';
import cloneLayer from 'leaflet-clonelayer';
import * as d3 from 'd3';
import 'normalize.css';
import '../node_modules/leaflet/dist/leaflet.css';
import 'leaflet.sync';
import 'leaflet-control-custom';
import { BASE_LAYER, cloneOverlays } from './config';
import Map from './map';
import geojson from '../data/UA_MD_raions_CO_CAMS.json';

let rightMap;
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
  events: {
    click: () => toggleRightMap(leftMap),
  },
};

function createChart({ feature }) {
  const values = Object
    .keys(feature.properties)
    .filter(key => !['NAME_1', 'TYPE_1'].includes(key))
    .reduce((prev, cur) => ([
      ...prev,
      {
        date: new Date(`20${cur.split('_').reverse()[0]}-01`.replace('m', '')),
        value: feature.properties[cur],
      }
    ]), []);

  let height  = 250;
  let width   = 400;

  const margin = {
    top: 20,
    right: 15,
    bottom: 70,
    left: 35,
  };
  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const div = d3.create('div');
  var svg = div.append('svg')
    .attr('width',  width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append('g')
    .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  // set the ranges
  var x = d3.scaleTime().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  x.domain(d3.extent(values, function(d) { return d.date; }));
  y.domain([d3.min(values, function(d) { return d.value; }) - 5, d3.max(values, (d) => d.value) + 5]);

  var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.value);  });

  svg.append('path')
    .data([values])
    .attr('class', 'line')
    .attr('d', valueline);

  var xAxis = d3
    .axisBottom(x)
    .tickFormat(d3.timeFormat('%b %Y'))
    .tickValues(values.map((d ,idx) => idx % 3 || d.date));

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', 'translate(0,' + height + ')')
    .call(xAxis)
    .selectAll('text')
    .attr('transform', 'rotate(90)')
    .attr('dy', '-.55em')
    .attr('x', 9)
    .style('text-anchor', 'start');

  //Add the Y Axis
  svg.append('g').call(d3.axisLeft(y));

  svg.selectAll('.dot')
    .data(values)
    .enter()
    .append('circle') // Uses the enter().append() method
    .attr('class', 'dot') // Assign a class for styling
    .attr('cx', function(d) { return x(d.date) })
    .attr('cy', function(d) { return y(d.value) })
    .attr('r', 2);

  return div.node();
}

const geojsonLayer = L.geoJSON(geojson, {
  style: function(feature) {
    const { legend } = leftOverlays['CO monthly cams'].options;
    const value = feature.properties['CO__17-08m'];
    const output = legend.reduce((prev, curr) => Math.abs(curr.value - value) < Math.abs(prev.value - value) ? curr : prev);
    return {
      color: 'rgba(255, 255, 255, .5)',
      fillColor: output.color,
      fillOpacity: 1,
      weight: 1,
    };
  },
}).bindPopup(createChart);

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
leftMap.addControl(L.control.custom(layerSwitch));
leftMap.addLayer(geojsonLayer);

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
