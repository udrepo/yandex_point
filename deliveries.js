const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);


let data = JSON.parse(urlParams.get('data')).data;
let features = [];


let pointData = {
    lat : 0, lon : 0
};
function sendBack(pointData) {
    console.log('sendBack');
             messageHandler.postMessage('lol, i am from web');
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
            zoom: 10,
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
    features: [
      {
        type: "Feature",
        id: 2,
        geometry: {
          type: "Point",
          coordinates: [42.319183802205345, 69.60766818037288]
        },
        properties: {
          balloonContent: "TEST001"
        }
      },
      {
        type: "Feature",
        id: 3,
        geometry: {
          type: "Point",
          coordinates: [42.3174214421985, 69.57482493580406]
        },
        properties: {
          balloonContent: "TEST002"
        }
      }
    ,
    {
        type: "Feature",
        id: 4,
        geometry: {
          type: "Point",
          coordinates: [42.317565011194475, 69.64582712893989]
        },
        properties: {
          balloonContent: "TEST004"
        }
      },
      {
        type: "Feature",
        id: 5,
        geometry: {
          type: "Point",
          coordinates: [42.33465543823662, 69.58724541599965]
        },
        properties: {
          balloonContent: "TEST003"
        }
      },
      {
        type: "Feature",
        id: 10,
        geometry: {
          type: "Point",
          coordinates: [42.379183802205345, 69.65766818037288]
        },
        properties: {
          balloonContent: "TEST001"
        }
      },
      {
        type: "Feature",
        id: 11,
        geometry: {
          type: "Point",
          coordinates: [42.3124214421985, 69.50482493580406]
        },
        properties: {
          balloonContent: "TEST002"
        }
      }
    ,
    {
        type: "Feature",
        id: 6,
        geometry: {
          type: "Point",
          coordinates: [42.217565011194475, 69.66582712893989]
        },
        properties: {
          balloonContent: "TEST004"
        }
      }
    ]
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