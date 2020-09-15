import cloneLayer from 'leaflet-clonelayer';
import moment from 'moment';

export const BASE_LAYER = L.tileLayer( 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
});

export const BASE_LAYER_TONER = L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.{ext}', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  subdomains: 'abcd',
  minZoom: 0,
  maxZoom: 20,
  ext: 'png',
});

const CO_MONTHLY_CAMS = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/CAMS/CO/2017_08/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'CO',
  type: 'CAMS',
  legend: [
    { label: '<= 50', color: '#e8f6f6', value: 50 },
    { label: '<= 75', color: '#d9eaea', value: 75, },
    { label: '<= 100', color: '#badada', value: 100 },
    { label: '<= 125', color: '#a3cfda', value: 125 },
    { label: '<= 150', color: '#8fc3d2', value: 150 },
    { label: '<= 175', color: '#84b1c5', value: 175 },
    { label: '<= 200', color: '#7aa0be', value: 200 },
    { label: '<= 225', color: '#7392b9', value: 225 },
    { label: '<= 250', color: '#6a79a8', value: 250 },
    { label: '<= 275', color: '#6d5b90', value: 275},
    { label: '<= 300', color: '#6a4886', value: 300 },
    { label: '<= 325', color: '#703883', value: 325 },
    { label: '<= 350', color: '#73237a', value: 350 },
    { label: '<= 375', color: '#760d72', value: 375 },
    { label: '<= 400', color: '#c00061', value: 400 },
    { label: '<= 500', color: '#de0082', value: 500 },
    { label: '<= 600', color: '#ff00b7', value: 600 },
  ],
  range: [moment('2017-08-01'), moment('2020-07-01')],
});

const CO_MONTHLY_S5P = L.tileLayer( 'https://tiles.worldfromspace.cz/UAMD/S5P/CO/2018_05/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'CO',
  type: 'S5P',
  legend: [
    { label: '<= -1', color: '#000000', value: -1,  },
    { label: '-1 - 0.29', color: '#e8f6f6', value: 0.29,  },
    { label: '0.29 - 0.30', color: '#d9eaea', value: 0.3,  },
    { label: '0.30 - 0.31', color: '#badada', value: 0.31,  },
    { label: '0.31 - 0.32', color: '#a3cfda', value: 0.32,  },
    { label: '0.32 - 0.33', color: '#8fc3d2', value: 0.33,  },
    { label: '0.33 - 0.34', color: '#84b1c5', value: 0.34,  },
    { label: '0.34 - 0.35', color: '#7aa0be', value: 0.35,  },
    { label: '0.35 - 0.36', color: '#7392b9', value: 0.36,  },
    { label: '0.36 - 0.37', color: '#6a79a8', value: 0.37,  },
    { label: '0.37 - 0.38', color: '#6d5b90', value: 0.38,  },
    { label: '0.38 - 0.39', color: '#6a4886', value: 0.39,  },
    { label: '0.39 - 0.40', color: '#703883', value: 0.4,  },
    { label: '0.40 - 0.41', color: '#73237a', value: 0.41,  },
    { label: '0.41 - 0.42', color: '#760d72', value: 0.42,  },
    { label: '0.42 - 0.43', color: '#c00061', value: 0.43,  },
    { label: '0.43 - 0.44', color: '#de0082', value: 0.44,  },
    { label: '0.44 - 90', color: '#ff00b7', value: 90,  },
  ],
  range: [moment('2018-05-01'), moment('2020-07-01')],
});

const NO2_MONTHLY_CAMS = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/CAMS/NO2/2017_08/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'NO2',
  type: 'CAMS',
  legend: [
    { label: '< 1', color: '#002a8d', value: 1, },
    { label: '3', color: '#508cf4', value: 3, },
    { label: '6', color: '#6edcdd', value: 6, },
    { label: '9', color: '#88f477', value: 9, },
    { label: '12', color: '#faf45a', value: 12, },
    { label: '15', color: '#ff6124', value: 15, },
    { label: '18', color: '#ff0468', value: 18, },
    { label: '21', color: '#b60286', value: 21, },
    { label: '> 21', color: '#8a01b0', value: Math.POSITIVE_INFINITY, },
  ],
  range: [moment('2017-08-01'), moment('2020-07-01')],
});

const NO2_MONTHLY_S5P = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/S5P/NO2/2018_05/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'NO2',
  type: 'S5P',
  legend: [
    { color: '#000000', value: -1, label: '-1', },
    { color: '#002a8d', value: 0.1, label: '< 0.1', },
    { color: '#508cf4', value: 0.2, label: '0.20', },
    { color: '#6edcdd', value: 0.3, label: '0.30', },
    { color: '#88f477', value: 0.4, label: '0.40', },
    { color: '#faf45a', value: 0.5, label: '0.50', },
    { color: '#ff6124', value: 0.6, label: '0.60', },
    { color: '#ff0468', value: 0.7, label: '0.70', },
    { color: '#b60286', value: 0.8, label: '> 0.80', },
    { color: '#8a01b0', value: Number.POSITIVE_INFINITY, label: 'inf', },
  ],
  range: [moment('2018-05-01'), moment('2020-07-01')],
});

const O3_MONTHLY_CAMS = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/CAMS/O3/2017_08/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'O3',
  type: 'CAMS',
  legend: [
    { value: 35, color: '#eff7d6', label: '<=  50', },
    { value: 40, color: '#e0e9b9', label: '50 - 55', },
    { value: 45, color: '#cfdb94', label: '35 - 40', },
    { value: 50, color: '#bccc61', label: '45 - 50', },
    { value: 55, color: '#9eb44f', label: '50 - 55', },
    { value: 60, color: '#849c4a', label: '55 - 60', },
    { value: 65, color: '#61852b', label: '60 - 65', },
    { value: 70, color: '#486d28', label: '65 - 70', },
    { value: 75, color: '#30682e', label: '70 - 75', },
    { value: 80, color: '#174e2b', label: '75 - 80', },
    { value: 85, color: '#084736', label: '80 - 85', },
    { value: 90, color: '#05392a', label: '85 - 90', },
    { value: Math.POSITIVE_INFINITY, color: '#08352f', label: '> 90', },
  ],
  range: [moment('2017-08-01'), moment('2020-07-01')],
});

const PM10_MONTHLY_CAMS = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/CAMS/PM10/2017_08/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'PM10',
  type: 'CAMS',
  legend: [
    { label: '5', color: '#252ede', value: 5, },
    { label: '10', color: '#3669d2', value: 10, },
    { label: '15', color: '#1793c0', value: 15, },
    { label: '(10 WHO limit)', color: '#4cc25c', value: 20, },
    { label: '25', color: '#948716', value: 25, },
    { label: '30', color: '#8f5d00', value: 30, },
    { label: '35', color: '#6e3600', value: 35, },
    { label: '40', color: '#411800', value: 40, },
    { label: '45', color: '#7b062b', value: 45, },
    { label: '50 (WHO limit)', color: '#ff2cab', value: 50, },
    { label: '70', color: '#ff00f7', value: 70, },
  ],
  range: [moment('2017-08-01'), moment('2020-07-01')],
});

const PM25_MONTHLY_CAMS = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/CAMS/PM25/2017_08/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'PM25',
  type: 'CAMS',
  legend: [
    { label: '7', color: '#252ede', value: 7, },
    { label: '8', color: '#3669d2', value: 8, },
    { label: '9', color: '#1793c0', value: 9, },
    { label: '10 (WHO annual limit)', color: '#4cc25c', value: 10, },
    { label: '12', color: '#948716', value: 12, },
    { label: '14', color: '#8f5d00', value: 14, },
    { label: '16', color: '#6e3600', value: 16, },
    { label: '18', color: '#411800', value: 18, },
    { label: '20', color: '#7b062b', value: 20, },
    { label: '25 (WHO 24-hour limit)', color: '#ff2cab', value: 25, },
    { label: '50', color: '#ff00f7', value: 50, },
  ],
  range: [moment('2017-08-01'), moment('2020-07-01')],
});

const SO2_MONTHLY_CAMS = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/CAMS/SO2/2017_08/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'SO2',
  type: 'CAMS',
  legend: [
    { value: 0.1, color: '#468dff', label: '< 0.1', },
    { value: 0.4, color: '#48bdff', label: '0.4', },
    { value: 0.7, color: '#8dd7f7', label: '0.7', },
    { value: 1, color: '#befff7', label: '1', },
    { value: 3, color: '#ccffe6', label: '3', },
    { value: 5, color: '#d4ffce', label: '5', },
    { value: 7, color: '#bcecb6', label: '7', },
    { value: 9, color: '#b8d694', label: '9', },
    { value: 11, color: '#d3dd73', label: '11', },
    { value: 13, color: '#edcb48', label: '13', },
    { value: 15, color: '#f19f47', label: '15', },
    { value: 17, color: '#ec8e00', label: '17', },
    { value: 19, color: '#ef7525', label: '19', },
    { value: 21, color: '#e15b2a', label: '21', },
    { value: 23, color: '#d5326b', label: '23', },
    { value: 25, color: '#b0459b', label: '25', },
    { value: 27, color: '#b05dc9', label: '27', },
    { value: 29, color: '#6c397b', label: '< 29 ', },
  ],
  range: [moment('2017-08-01'), moment('2020-07-01')],
});

const SO2_MONTHLY_S5P = L.tileLayer('https://tiles.worldfromspace.cz/UAMD/S5P/SO2/2018_05/{z}/{x}/{y}.png', {
  tms: true,
  opacity: 0.7,
  name: 'SO2',
  type: 'S5P',
  legend: [
    { label: '-1', value: -1, color: '#000000', },
    { label: '0.1', value: 0.1, color: '#edfff6', },
    { label: '0.2', value: 0.2, color: '#dbffed', },
    { label: '0.3', value: 0.3, color: '#d4ffce', },
    { label: '0.4', value: 0.4, color: '#bcecb6', },
    { label: '0.5', value: 0.5, color: '#b8d694', },
    { label: '0.6', value: 0.6, color: '#d3dd73', },
    { label: '0.7', value: 0.7, color: '#edcb48', },
    { label: '0.8', value: 0.8, color: '#f19f47', },
    { label: '0.9', value: 0.9, color: '#ec8e00', },
    { label: '1', value: 1, color: '#ef7525', },
    { label: '1.5', value: 1.5, color: '#e15b2a', },
    { label: '2', value: 2, color: '#d5326b', },
    { label: '3', value: 3, color: '#b0459b', },
    { label: '6', value: 6, color: '#b05dc9', },
    { label: '12', value: 12, color: '#6c397b', },
  ],
  range: [moment('2018-05-01'), moment('2020-07-01')],
});

const overlays = {
  'CO monthly S5P': CO_MONTHLY_S5P,
  'CO monthly cams': CO_MONTHLY_CAMS,
  'NO<sub>2</sub> monthly cams': NO2_MONTHLY_CAMS,
  'NO<sub>2</sub> monthly S5P': NO2_MONTHLY_S5P,
  'O<sub>3</sub> monthly cams': O3_MONTHLY_CAMS,
  'PM<sub>10</sub> monthly cams': PM10_MONTHLY_CAMS,
  'PM<sub>25</sub> monthly cams': PM25_MONTHLY_CAMS,
  'SO<sub>2</sub> monthly cams': SO2_MONTHLY_CAMS,
  'SO<sub>2</sub> monthly S5P': SO2_MONTHLY_S5P,
};


export const cloneOverlays = () => Object
  .entries(overlays)
  .reduce((accum, [name, layer]) => {
    return {
      ...accum,
      [name]: cloneLayer(layer),
    };
  }, {});
