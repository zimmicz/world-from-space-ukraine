import * as d3 from 'd3';

export function createChart({ feature }) {
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
  y.domain([
    d3.min(values, (d) => d.value - (d.value * 0.1)),
    d3.max(values, (d) => d.value + (d.value * 0.1))
]);

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
