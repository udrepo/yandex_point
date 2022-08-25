
function init () {
// Создание маршрута.
var multiRoute = new ymaps.multiRouter.MultiRoute({
    referencePoints: [
        [55.734470, 37.58000],
        [55.734336, 37.51218],
        [55.724102, 37.10912],
        [55.714470, 37.59000],
        [55.704336, 37.53218],
        [55.784102, 37.10912],
        [55.739470, 37.58000],
        [55.737336, 37.51218],
        [55.723102, 37.12912],
        [55.712470, 37.57000],
        [55.702336, 37.58218],
        [55.734102, 37.13912]
    ]
}, {
    // Внешний вид путевых точек.
    wayPointStartIconColor: "#FFFFFF",
    wayPointStartIconFillColor: "#B3B3B3",
    // Внешний вид линии активного маршрута.
    routeActiveStrokeWidth: 8,
    routeActiveStrokeStyle: 'solid',
    routeActiveStrokeColor: "#002233",
    // Внешний вид линий альтернативных маршрутов.
    routeStrokeStyle: 'dot',
    routeStrokeWidth: 3,
    boundsAutoApply: true
});

var myMap = new ymaps.Map('map', {
    center: [55.750625, 37.626],
    zoom: 7,
}, {
    buttonMaxWidth: 300
});
// Добавление маршрута на карту.
myMap.geoObjects.add(multiRoute);
}

ymaps.ready(init);

