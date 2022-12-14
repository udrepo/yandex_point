const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
console.log(urlParams.get('lon'))
console.log(urlParams.get('lat'))

const point = [urlParams.get('lat'), urlParams.get('lon')];
const balloon = {
  title: urlParams.get('title'),
  address: urlParams.get('address')
}

ymaps.ready(init);

function init() {
    var myMap = new ymaps.Map('map', {
        center: point,
        zoom: 15,
        controls: []
    });

  let placemark = new ymaps.Placemark(point, {
    balloonContentHeader: balloon.title,
    balloonContentBody: balloon.address
  }, {
    iconLayout: 'default#image',
    iconImageHref: './point.svg',
    iconImageSize: [30,30],
    iconImageOffset: [-13,-35]

  });

  myMap.geoObjects.add(placemark);
}
