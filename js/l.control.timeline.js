import moment from 'moment';

L.Control.Timeline = L.Control.extend({
  options: {
    dateFormat: 'YYYY',
    interval: 1000,
    onNextStep: (current) => { console.log(`onNextStep ${current}`); },
  },
  initialize: function(options) {
    L.Control.prototype.initialize.call(this, options);
    const { range } = this.options;

    this.ID = L.stamp(this);
    this.timer = null;
    this.steps = [];

    const [first, last] = range;
    let next = first.clone();

    while (next.isBefore(last)) {
      this.steps.push(next);
      next = next.clone().add(1, 'month');
    }

    this.currentDate = this.steps[0];
  },

  onAdd: function(map) {
    const parent = map.getContainer();
    const wrapper = L.DomUtil.create('div', 'leaflet-timeline', parent);
    L.DomEvent.disableClickPropagation(wrapper);
    this._createPlayPauseButton(wrapper);
    this._createTimeRange(wrapper);

    return wrapper;
  },

  onRemove: function() {
    console.log('removed');
    this._destroyTimer();
  },

  _createPlayPauseButton(parent) {
    const button = L.DomUtil.create('button', 'leaflet-timeline-button', parent);
    button.innerHTML = 'Play/pause';
    button.addEventListener('click', () => {
      this.timer ? this._destroyTimer() : this._createTimer();
      button.innerHTML = this.timer ? 'Pause' : 'Play';
    });
  },

  _createTimeRange(parent) {
    const wrapper = L.DomUtil.create('div', 'leaflet-timeline-container', parent);

    this.steps.forEach((step, i) => {
      const point = L.DomUtil.create('span', 'leaflet-timeline-step', wrapper);
      point.innerHTML = step.format(this.options.dateFormat);
      point.id = `leaflet-timeline-step-${i}-${this.ID}`;
      point.addEventListener('click', () => {
        this.currentDate = step;
        this._destroyTimer();
        this._handleNextStep();
      });
    });

    /*
    this.options.steps.forEach((step, i) => {
      const point = L.DomUtil.create('span', 'leaflet-timeline-step', wrapper);
      point.innerHTML = step.format(this.options.dateFormat);
      point.id = `leaflet-timeline-step-${i}-${this.ID}`;
      point.addEventListener('click', () => {
        this.currentDate = step;
        this._destroyTimer();
        this._handleNextStep();
      });
    });
    */
  },

  _handleNextStep() {
    const { onNextStep } = this.options;
    onNextStep(this.currentDate);

    const currentDateIndex = this.steps.indexOf(this.currentDate);
    const nextDateIndex = currentDateIndex < this.steps.length - 1 ? currentDateIndex + 1 : 0;
    this.currentDate = this.steps[nextDateIndex];

    document.querySelectorAll('.leaflet-timeline-step').forEach(node => node.classList.remove('current'));
    L.DomUtil.get(`leaflet-timeline-step-${currentDateIndex}-${this.ID}`).classList.add('current');
  },

  _createTimer() {
    const { interval } = this.options;
    this.timer = setInterval(() => {
      this._handleNextStep();
    }, interval);
  },

  _destroyTimer() {
    clearTimeout(this.timer);
    this.timer = null;
  },
});

L.control.timeline = function(opts) {
    return new L.Control.Timeline(opts);
};

export default L.control.timeline;
