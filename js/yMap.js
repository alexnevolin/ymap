var yMapApp = angular.module("YMap", [ "kendo.directives" ])

    .controller("CharactCtrl", function($scope){

    })

    .controller("MarkCtrl", function($scope){

     	$scope.text = "my text";

     	function init() {
        	$scope.countOnMark = 1;
			var map = new ymaps.Map("map_container", {
		        center: [55.73, 37.58],
		        zoom: 10
	    	});
	    	
	    	var polygonLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container"><div class="polygon_layout" style="position: relative;"><span style="position: relative; top: 13.5px;" ng-click="alert("123")">{{ properties.chartCount }}</span><canvas id="chartCanvas" width="80%" height="80% style="position:relative; z-index:10"></canvas></div></div>');

			var balloonLayout = '<div style="width:200px; height: 100px;"><p><span>Количество: ' + $scope.countOnMark +'<br>Название ЖК: название</span></p></div>';

			polygonPlacemark = new ymaps.Placemark(
		        [55.66, 37.55], {
		            balloonContent: balloonLayout,
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

		    polygonPlacemark.events.add('contextmenu', function (e) {
        		polygonPlacemark.balloon.open(e.get('coords'), '123');
    		});

		};

		$scope.update = function() {
			balloonLayout = '<div style="width:200px; height: 100px;"><p><span>Количество: ' + $scope.countOnMark +'<br>Название ЖК: название</span></p></div>';
			polygonPlacemark.properties.set("chartCount",$scope.countOnMark);
			polygonPlacemark.properties.set("balloonContent", balloonLayout);
		};
		ymaps.ready(init);
    });


