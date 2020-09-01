import './control.css';

L.Control.Legend = L.Control.extend({
  initialize: function(options) {
    L.Control.prototype.initialize.call(this, options);
  },

  onAdd: function(map) {
    const parent = map.getContainer();
    console.log('onAdd legend', parent.id);
    const wrapper = L.DomUtil.create('div', 'leaflet-legend', parent);
    L.DomEvent.disableClickPropagation(wrapper);

    this._createLegend(wrapper);

    return wrapper;
  },

  onRemove: function() {
    console.log('onRemove legend');
  },

  _createLegend(parent) {
    const legend = this.options.layer.options.legend;
    const list = L.DomUtil.create('ul', undefined, parent);

    legend
      .forEach(({ label, color }) => {
        const row = L.DomUtil.create('li', undefined, list);
        const colorSquare = L.DomUtil.create('span', 'leaflet-legend-color', row);
        const value = L.DomUtil.create('span', 'leaflet-legend-value', row);

        colorSquare.style.backgroundColor = color;
        value.innerHTML = label;

        row.appendChild(colorSquare);
        row.appendChild(value);
      });
  },
});

L.control.legend = function(opts) {
    return new L.Control.Legend(opts);
};

export default L.control.legend;
