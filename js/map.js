import leaflet from 'leaflet';
import TimelineControl from './l.control.timeline';
import LegendControl from './legend/control';

export default function initialize(elem, options) {
  const map = L.map(elem, options);
  let timelineControl;
  let legendControl;

  const setLegendPosition = (position) => {
    legendControl && legendControl.setPosition(position);
  };

  const setTimelineSize = (size) => {
    timelineControl && timelineControl.setSize(size);
  };

  map.on('baselayerchange', (e) => {
    if (timelineControl) {
      map.removeControl(timelineControl);
    }

    timelineControl = createTimelineControl(e, map);
    map.addControl(timelineControl);

    if (legendControl) {
      map.removeControl(legendControl);
    }

    if (e.layer.options.legend) {
      legendControl = createLegendControl(e);
      map.addControl(legendControl);
    }
  });

  return {
    map,
    setLegendPosition,
    setTimelineSize,
  };
}

function createTimelineControl(e) {
  return TimelineControl({
    range: e.layer.options.range,
    autoplay: true,
    dateFormat: 'MMM <br /> YYYY',
    position: 'bottomleft',
  });
}

function createLegendControl(e) {
  return LegendControl({
    layer: e.layer,
  });
}
