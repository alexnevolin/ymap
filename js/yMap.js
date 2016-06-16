var yMapApp = angular.module("YMap", [ "kendo.directives" ])

    .controller("CharactCtrl", function($scope){

    })

    .controller("MarkCtrl", function($scope,$http){

    	$http.get('../data/mark.json').success(function(data) {
            console.log("My data...");
            console.log(data);
        });

        //console.log($scope.markData);

     	function init() {
        	$scope.countOnMark = 4;
			var map = new ymaps.Map("map_container", {
		        center: [55.73, 37.58],
		        zoom: 10
	    	});
	    	
	    	var polygonLayout = ymaps.templateLayoutFactory.createClass('<div class="placemark_layout_container">' +
					'<div class="polygon_layout" style="position: relative;">' +
						'<span style="position: relative; top: 13.5px;" ng-click="alert("123")">{{ properties.chartCount }}</span>' +
						'<canvas id="chartCanvas" width="90" height="90"></canvas>' +
					'</div></div>', {

					build: function () {
						polygonLayout.superclass.build.call(this);
						var chart = new MarkChart('chartCanvas');
						chart.chartType = "ring";
						chart.data = [8-$scope.countOnMark,+$scope.countOnMark];
						chart.colors = ['#0FFF2B', '#00ffff'];
						chart.draw();
					}
			});
			ButtonLayout = ymaps.templateLayoutFactory.createClass(
					"<div class='my-button {% if state.selected %}my-button-selected{% endif %}'>" +
					"{{data.content}}" +
					"</div>"
			);

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

			button = new ymaps.control.Button({
				data: {
					content: "Характеристики"
				},
				options: {
					layout: ButtonLayout
				}
			});

			map.geoObjects.add(polygonPlacemark);
			map.controls.add(button, {
				float: 'right'
			});

		    polygonPlacemark.events.add('contextmenu', function (e) {
        		polygonPlacemark.balloon.open(e.get('coords'), '');
    		});

		};

		$scope.update = function() {
			balloonLayout = '<div style="width:200px; height: 100px;"><p><span>Количество: ' + $scope.countOnMark +'<br>Название ЖК: название</span></p></div>';
			polygonPlacemark.properties.set("chartCount",$scope.countOnMark);
			polygonPlacemark.properties.set("balloonContent", balloonLayout);
		};
		ymaps.ready(init);
    });


