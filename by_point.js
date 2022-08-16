const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get('lon'))
console.log(urlParams.get('lat'))

const point = [urlParams.get('lat'), urlParams.get('lon')];

ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: point,
        zoom: 15,
        controls: []
    });

  let placemark = new ymaps.Placemark(point, {}, {});

  myMap.geoObjects.add(placemark);
}