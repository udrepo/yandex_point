const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const point = [urlParams.get('lat'), urlParams.get('lon')];
const locationOfCourier = [urlParams.get('locationLat'), urlParams.get('locationLon')];

let data = JSON.parse(urlParams.get('data')).data;
let warehouses = JSON.parse(urlParams.get('warehouses')).data;
let features = [];
 

console.log(warehouses);
console.log(data);

let pointData = {
    lat : 0, lon : 0
};
function sendBack(pointData) {
    console.log(`${pointData.lat}, ${pointData.lon}`);
             messageHandler.postMessage(`${pointData.lat}, ${pointData.lon}`);
          }

for(let i=0; i<data.length; i++){
   features.push({
    type: "Feature",
    id: i,
    geometry: {
      type: "Point",
      coordinates: data[i].coords
    },
    properties: {
      balloonContent: data[i].order_number
    },
    options: {
        iconLayout: 'default#image',
        iconImageHref: './point.svg',
        iconImageSize: [30,30],
        iconImageOffset: [-13,-35]
            }

   });
}

for(let i=0; i<warehouses.length; i++){
    features.push({
     type: "Feature",
     id: i+ 333,
     geometry: {
       type: "Point",
       coordinates: warehouses[i].coords
     },
     properties: {
       balloonContent: warehouses[i].order_number
     },
     options: {
         iconLayout: 'default#image',
         iconImageHref: './Stock.svg',
         iconImageSize: [38,38],
         iconImageOffset: [-13,-35]
             }
 
    });
 }

 features.push({
  type: "Feature",
  id: 666,
  geometry: {
    type: "Point",
    coordinates: locationOfCourier
  },
  properties: {
    balloonContent: 'Вы здесь!'
  },
  options: {
      iconLayout: 'default#image',
      iconImageHref: './point.png',
      iconImageSize: [38,38],
      iconImageOffset: [-13,-35]
          }

 });
 

console.log(features);


let lat,lon;
ymaps.ready(init);

function init () {
  var location = ymaps.geolocation;
    var myMap = new ymaps.Map('map', {
            center: point,
            zoom: 12,
            controls: []
        }, {
            searchControlProvider: 'yandex#search'
        }),
        objectManager = new ymaps.ObjectManager({
            // Мы хотим загружать данные для балуна перед открытием, поэтому
            // запретим автоматически открывать балун по клику.
            geoObjectOpenBalloonOnClick: false
        });

    myMap.geoObjects.add(objectManager);
    myMap.controls.add('zoomControl');

  var collection = {
    type: "FeatureCollection",
    features: features
  };

  console.log(collection);
  // Object Manager
  objectManager.add(collection);

    // Функция, эмулирующая запрос за данными на сервер.
    function loadBalloonData (objectId) {
        var dataDeferred = ymaps.vow.defer();
        function resolveData () {
            dataDeferred.resolve('Данные балуна');
        }
        window.setTimeout(resolveData, 1000);
        return dataDeferred.promise();
    }

    function hasBalloonData (objectId) {
        return objectManager.objects.getById(objectId).properties.balloonContent;
    }

    objectManager.objects.events.add('click', function (e) {
        var objectId = e.get('objectId'),
            obj = objectManager.objects.getById(objectId);
        if (hasBalloonData(objectId)) {
            objectManager.objects.balloon.open(objectId);
            lat = obj.geometry.coordinates[0];
            lon = obj.geometry.coordinates[1];
            pointData.lat = lat; 
            pointData.lon = lon;
            console.log(pointData);
            sendBack(pointData);
        } else {
            obj.properties.balloonContent = "Идет загрузка данных...";
            objectManager.objects.balloon.open(objectId);
            loadBalloonData(objectId).then(function (data) {
                obj.properties.balloonContent = data;
                objectManager.objects.balloon.setData(obj);
            });
        }
    });
}
