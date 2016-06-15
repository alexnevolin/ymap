var yMapApp = angular.module("YMap", [ "kendo.directives" ])

    .controller("CharactCtrl", function($scope){

    })

    .controller("MarkCtrl", function($scope){

     	var myMap,
     		myPlacemark;

     	function init() {
        	$scope.countOnMark = 1;
        	console.log("Создание карты!!!")
			var map = new ymaps.Map("map_container", {
		        center: [55.73, 37.58],
		        zoom: 10
	    	});
	    	
	    	var polygonLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="polygon_layout"><div class="inner_chart"><span>{{ properties.chartCount }}</span></div></div></div>');

			polygonPlacemark = new ymaps.Placemark(
		        [55.66, 37.55], {
		            hintContent: 'Метка',
		            name: 'my name',
		            chartCount: $scope.countOnMark
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
    
		};

		$scope.update = function() {
			polygonPlacemark.properties.set("chartCount",$scope.countOnMark)
		};
		ymaps.ready(init);
    });