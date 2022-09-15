const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


let data = JSON.parse(urlParams.get('data')).data;
let features = [];


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
    }
   });
}

console.log(features);


let lat,lon;
ymaps.ready(init);

function init () {
    
    var myMap = new ymaps.Map('map', {
            center: [42.317565011194475, 69.64582712893989],
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
