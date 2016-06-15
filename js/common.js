function mapCtrl(ymaps) {
	var map = new ymaps.Map("map_container", {
        center: [55.73, 37.58],
        zoom: 10
    });
<<<<<<< HEAD
=======

    var polygonLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="polygon_layout"><div class="inner_chart"><span>2</span></div></div></div>');

    var polygonPlacemark = new ymaps.Placemark(
        [55.662693, 37.558416], {
            hintContent: 'Метка'
        }, {
            iconLayout: polygonLayout,
            iconShape: {   
                type: 'Polygon',
                coordinates: [
                    [[-28,-76],[28,-76],[28,-20],[12,-20],[0,-4],[-12,-20],[-28,-20]]
                ]
            }
        }
    );
    map.geoObjects.add(polygonPlacemark);
>>>>>>> 96ecd1660fc9e1bd8a29814e8a8d7303ab82519f
}