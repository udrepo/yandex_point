ymaps.ready(init);


let pointData = {
    coordinates: [],
    address: ''
};


function sendBack(pointData) {
    console.log(pointData);
             messageHandler.postMessage(pointData);
          }


function init() {
    var myPlacemark,
        myMap = new ymaps.Map('map', {
            zoom: 12,
            center: [42.313994, 69.592093],
               controls: ['searchControl']
          
        }, {
           
        });

        var searchControl = myMap.controls.get('searchControl')
        searchControl.events.add('resultselect', function(e) {
            var index = e.get('index');
            searchControl.getResult(index).then(function(res) {
        
              console.info(res); // получаем координаты найденной точки
        
              const pickedPoint = document.getElementById('header');
              pointData.address = res.properties._data.text;
              pickedPoint.innerHTML = `Выбранный адрес: ${pointData.address}`;
              pointData.coordinates = res.geometry._coordinates;
              let text = `${pointData.address}: ${pointData.coordinates[0]}: ${pointData.coordinates[1]}`;
              console.table(pointData);
              sendBack(text);
        
        
            });
          })
        console.log(myMap);
   

    // Слушаем клик на карте.
    myMap.events.add('click', function (e) {
        var coords = e.get('coords');

        // Если метка уже создана – просто передвигаем ее.
        if (myPlacemark) {
            myPlacemark.geometry.setCoordinates(coords);
        }
        // Если нет – создаем.
        else {
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
            // Слушаем событие окончания перетаскивания на метке.
            myPlacemark.events.add('dragend', function () {
                getAddress(myPlacemark.geometry.getCoordinates());
            });
        }
        getAddress(coords);
    });

    // Создание метки.
    function createPlacemark(coords) {
        return new ymaps.Placemark(coords, {
            iconCaption: 'поиск...'
        }, {
            preset: 'islands#violetDotIconWithCaption',
            draggable: true
        });
    }

    // Определяем адрес по координатам (обратное геокодирование).
    function getAddress(coords) {
        myPlacemark.properties.set('iconCaption', 'поиск...');
        ymaps.geocode(coords).then(function (res) {
            var firstGeoObject = res.geoObjects.get(0);
console.log(firstGeoObject);
            myPlacemark.properties
                .set({
                    // Формируем строку с данными об объекте.
                    iconCaption: [
                        // Название населенного пункта или вышестоящее административно-территориальное образование.
                        firstGeoObject.getLocalities().length ? firstGeoObject.getLocalities() : firstGeoObject.getAdministrativeAreas(),
                        // Получаем путь до топонима, если метод вернул null, запрашиваем наименование здания.
                        firstGeoObject.getThoroughfare() || firstGeoObject.getPremise()
                    ].filter(Boolean).join(', '),
                    // В качестве контента балуна задаем строку с адресом объекта.
                    balloonContent: firstGeoObject.getAddressLine()
                });

                const pickedPoint = document.getElementById('header');
                pointData.address = myPlacemark.properties._data.balloonContent;
                pickedPoint.innerHTML = `Выбранный адрес: ${pointData.address}`;
                pointData.coordinates = myPlacemark.geometry._coordinates;
                let text = `${pointData.address}: ${pointData.coordinates[0]}: ${pointData.coordinates[1]}`;
                console.table(pointData);
                sendBack(text);
        });
    }
}
