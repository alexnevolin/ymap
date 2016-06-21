var yMapApp = angular.module("YMap", [ "kendo.directives" ])

    .controller("MarkCtrl", function($scope,$http){

    	$scope.marksJSON;
    	$scope.idList = [];
    	$scope.counterList = [];
    	$scope.placemarkList = [];
		$scope.featuresList = ["Класс дома", "Количество Аналогов/Объявлений в доме", "Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)", "В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)"];
		$scope.chosenFeatures = [];


    	$scope.update = null;

    	$http.get('../data/mark2.json').success(function(data) {
            $scope.marksJSON = data;
        });

		var markNum = 0;

		function putZCMarks(map, zcJSON) {
			var zcTemplate = '<div class="zc_mark"><div class="zc_mark_before"></div><div class="zc_mark_after"></div><canvas id="zc1" class="zc_canvas" width="80" height="80"></canvas><div class="zc_mark_hend"></div><span class="zc_counter">2</span><div class="zc_trigger"></div></div>';
			var chartBuild = function() {
				zcLayout.superclass.build.call(this);
				var chart = new MarkChart("zc1");
				chart.chartType = "ring";
				chart.data = [+2,8-2];
				chart.colors = ['#FF0410', '#4772FF'];
				chart.draw();
			}
			var zcLayout = ymaps.templateLayoutFactory.createClass(zcTemplate, {build: chartBuild});
			var zcmark = new ymaps.Placemark([55.65, 37.6], {hintContent: 'Жилой комплекс'}, {iconLayout: zcLayout,});
			map.geoObjects.add(zcmark);
		};

		function putHomemarks(map, homeJSON) {
			var chartBuild = function() {
				homemarkLayout.superclass.build.call(this);
				var chart = new MarkChart("home1");
				chart.chartType = "ring";
				chart.data = [+4,8-4];
				chart.colors = ['#0FFF2B', '#00ffff'];
				chart.draw();
			}

			var homemarkTemplate = '<div class="placemark_layout_container">' +
				 		'<div class="home_layout"><div class="home_layout_before"></div>' +
				 			'<span style="position: relative; top: 16px;">4</span>' +
				 			'<canvas id="'+'home1'+'" width="90" height="90" style="position: relative; bottom: 39px; right: 20px;"></canvas>' +
						'</div></div>';

			var homemarkLayout = ymaps.templateLayoutFactory.createClass(homemarkTemplate, {build: chartBuild});

			var homemark = new ymaps.Placemark(
		        [55.65, 37.77], {
		            hintContent: 'Ориентир'
		        }, {
		            iconLayout: homemarkLayout,
		            iconShape: {
		                type: 'Rectangle',
		                coordinates: [
		                    [-25, -25], [25, 25]
		                ]
		            }
		        }
		    );
			map.geoObjects.add(homemark);
		};


		function putLandmarks(map, onjectsJSON) {
			var landmarkLayout = ymaps.templateLayoutFactory.createClass('<div class="landmark"><div class="landmark_center"></div></div>', {});
			var landmark = new ymaps.Placemark(
		        [55.7, 37.85], {
		            hintContent: 'Ориентир'
		        }, {
		            iconLayout: landmarkLayout,
		            iconShape: {
		                type: 'Rectangle',
		                coordinates: [
		                    [-25, -25], [25, 25]
		                ]
		            }
		        }
		    );
			map.geoObjects.add(landmark);
		}

		function putObjects(map, onjectsJSON) {

			var chartBuild = function() {
				squareLayout.superclass.build.call(this);
				var chart = new MarkChart("obj1");
				chart.chartType = "ring";
				chart.data = [+4,8-4];
				chart.colors = ['#0FFF2B', '#00ffff'];
				chart.draw();
			}

			var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="sq_mark"><div class="sq_mark_after"></div><span class="sq_text">4</span><canvas id="'+'obj1'+'" width="88" height="88" class="sq_canvas"></canvas></div>', {
				build: chartBuild
			});

			var polygonPlacemark = new ymaps.Placemark(
		        [55.8, 37.8], {
		            hintContent: 'Метка'
		        }, {
		            iconLayout: squareLayout,
		            iconShape: {
		                type: 'Rectangle',
		                coordinates: [
		                    [-25, -25], [25, 25]
		                ]
		            }
		        }
		    );

			map.geoObjects.add(polygonPlacemark);
		}

        function putMarks(map) {
			var marksCount = $scope.marksJSON.houses;

        	for (var i = 0; i < marksCount.length; i++) {

				bindFeatures (marksCount[i]);
				var counter = $scope.chosenFeatures[1];
				var colour = $scope.chosenFeatures[0];
				var specEvent = $scope.chosenFeatures[3];
				var id = marksCount[i].mark_id;
				var coords = marksCount[i].mark_coords;

				$scope.idList[i] = marksCount[i].mark_id;
				$scope.counterList[i] = $scope.chosenFeatures[2];

				var markTemplate = '<div class="placemark_layout_container">' +
				 		'<div class="polygon_layout" style="border-color: {{properties.colour}};">' +
				 			'<span style="position: relative; top: 13.5px;" ng-click="alert("123")">{{ properties.chartCount }}</span>' +
				 			'<canvas id="'+id+'" width="90" height="90" style="position: relative; bottom: 39px; right: 20.5px;"></canvas>' +
						'</div><div class="arrow" style="border-top: 26px solid {{properties.colour}};"></div></div></div>';

				var chartBuild = function() {
					polygonLayout.superclass.build.call(this);

					var chart = new MarkChart($scope.idList[markNum]);
					 chart.chartType = "ring";
					 chart.data = [+$scope.counterList[markNum],8-$scope.counterList[markNum]];
					 chart.colors = ['#0FFF2B', '#00ffff'];
					 chart.draw();
					if (markNum < $scope.marksJSON.houses.length+1)
						markNum++;
					else markNum = 0;
				};

				var polygonLayout = ymaps.templateLayoutFactory.createClass(markTemplate, {
					build: chartBuild
				});

				var balloonLayout = '<div style="width:200px; height: 100px;"><p><span>Количество: ' + counter +'<br>Название ЖК: название</span></p></div>';

				var polygonPlacemark = new ymaps.Placemark(
			        [coords.x, coords.y], {
			            // balloonContent: balloonLayout,
			            name: 'my name',
			            chartCount: counter,
						colour: colour
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

				polygonPlacemark.events.add('contextmenu', function (e) {
        			console.log("Показать балун");
        			//polygonPlacemark.balloon.open(e.get('coords'), 'asd');
    			});

    			$scope.placemarkList[i] = polygonPlacemark;

			   	map.geoObjects.add(polygonPlacemark);
		   }

        }

		function bindFeatures (dataMark)  {
			var features =  $scope.featuresList;

				for(var key in dataMark) {

					if(key == features[0]){
						$scope.chosenFeatures[0] = dataMark[key];
					}

					if(key == features[1]){
						$scope.chosenFeatures[1] = dataMark[key];
					}

					if(key == features[2]){
						$scope.chosenFeatures[2] = dataMark[key];
					}

					if(key == features[3]){
						$scope.chosenFeatures[3] = dataMark[key];
					}
				}
		}

     	function init() {
     		//console.log("INIT");
			var map = new ymaps.Map("map_container", {
		        center: [55.73, 37.58],
		        zoom: 10
	    	}),

			CustomControlClass = function (options) {
				CustomControlClass.superclass.constructor.call(this, options);
				this._$content = null;
				this._geocoderDeferred = null;
			};

			$scope.map = map;

			putMarks($scope.map,$scope.chosenFeatures);
			putObjects($scope.map,null);
			putLandmarks($scope.map,null);
			putHomemarks($scope.map,null);
			putZCMarks($scope.map,null);

			ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
				onAddToMap: function (map) {
					CustomControlClass.superclass.onAddToMap.call(this, map);
					this._lastCenter = null;
					this.getParent().getChildElement(this).then(this._onGetChildElement, this);
				},

				onRemoveFromMap: function (oldMap) {
					this._lastCenter = null;
					if (this._$content) {
						this._$content.remove();
						this._mapEventGroup.removeAll();
					}
					CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
				},

				_onGetChildElement: function (parentDomContainer) {
					this._$content = $('<button class="k-button" id="features">Характеристики</button>'+
							'<div class="features-window" id="window">'+
							'<div class="list-section k-content">'+
							'<ul class="fieldlist">'+
							'<li><input type="radio" name="colour-mark" id="colourm1" value="Класс дома" class="k-radio" checked="checked">'+
							'<label class="k-radio-label" for="colourm1">Класс дома</label></li>'+
					'<li><input type="radio" name="colour-mark" id="colourm2" value="Материал стен дома" class="k-radio">'+
							'<label class="k-radio-label" for="colourm2">Материал стен дома</label></li>'+
					'<li><input type="radio" name="colour-mark" id="colourm3" value="Максимальная этажность  дома" class="k-radio">'+
							'<label class="k-radio-label" for="colourm3">Максимальная этажность  дома</label></li>'+
					'<li><input type="radio" name="colour-mark" id="colourm4" value="Год постройки дома" class="k-radio">'+
							'<label class="k-radio-label" for="colourm4">Год постройки дома</label></li>'+
					'<li><input type="radio" name="colour-mark" id="colourm5" value="Когорта дома Объекта" class="k-radio">'+
							'<label class="k-radio-label" for="colourm5">Когорта дома Объекта </label></li>'+
					'</ul>'+
					'<ul class="fieldlist">'+
							'<li><input type="radio" name="number-mark" id="numberm1" value="Количество Аналогов/Объявлений в доме" class="k-radio" checked="checked">'+
							'<label class="k-radio-label" for="numberm1">Количество Аналогов/Объявлений в доме</label></li>'+
					'<li><input type="radio" name="number-mark" id="numberm2" value="Максимальная этажность  дома" class="k-radio">'+
							'<label class="k-radio-label" for="numberm2">Максимальная этажность  дома</label></li>'+
					'<li><input type="radio" name="number-mark" id="numberm3" value="Год постройки дома" class="k-radio">'+
							'<label class="k-radio-label" for="numberm3">Год постройки дома</label></li>'+
					'<li><input type="radio" name="number-mark" id="numberm4" value="Количество описанных квартир в доме по Росреестру" class="k-radio">'+
							'<label class="k-radio-label" for="numberm4">Количество описанных квартир в доме по Росреестру</label></li>'+
					'<li><input type="radio" name="number-mark" id="numberm5" value="Средняя удельная цена Аналогов/Объявлений (тыс.руб.)" class="k-radio">'+
							'<label class="k-radio-label" for="numberm5">Средняя удельная цена Аналогов/Объявлений (тыс.руб.)</label></li>'+
					'<li><input type="radio" name="number-mark" id="numberm6" value="Удельная Кадастровая стоимость (тыс.руб.)" class="k-radio">'+
							'<label class="k-radio-label" for="numberm6">Удельная Кадастровая стоимость (тыс.руб.)</label></li>'+
					'</ul>'+
					'<ul class="fieldlist">'+
							'<li><input type="radio" name="diagram-mark" id="diagramm1" value="Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)" class="k-radio" checked="checked">'+
							'<label class="k-radio-label" for="diagramm1">Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)</label></li>'+
					'<li><input type="radio" name="diagram-mark" id="diagramm2" value="Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)" class="k-radio">'+
							'<label class="k-radio-label" for="diagramm2">Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)</label></li>'+
					'</ul>'+
					'<ul class="fieldlist">'+
							'<li><input type="radio" name="special-mark" id="specialm1" value="В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)" class="k-radio" checked="checked">'+
							'<label class="k-radio-label" for="specialm1">В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)</label></li>'+
					'<li><input type="radio" name="special-mark" id="specialm2" value="Описание дома рассогласовано: да/нет (характеристики рассогласованности)" class="k-radio">'+
							'<label class="k-radio-label" for="specialm2">Описание дома рассогласовано: да/нет (характеристики рассогласованности)</label></li>'+
					'</ul>'+
					'</div>'+
					'<button class="k-button controlFeatures" id="refreshFeatures">Отменить</button>'+
							'<button class="k-button controlFeatures" id="sendFeatures">Показать</button>'+
					'</div>').appendTo(parentDomContainer);
					this._mapEventGroup = this.getMap().events.group();

					var myWindow = $("#window"),
						features = $("#features");

					var cache = $('#window').html();

					features.click(function(){
						myWindow.data("kendoWindow").open();
						features.fadeOut();
					});

					$('#window').on('click','#refreshFeatures', function() {
						$('#window').html(cache);
					});

					$("#map_container").click(function(){
							if($('#features').css('display') == "none"){
								myWindow.data("kendoWindow").close();
							}
					});

					function defaultFeatures (){
						var vals = $('.k-radio').map(function(i,el){
							if($(el).prop('checked')){
								return $(el).val();
							}
						}).get();
						$scope.featuresList = vals;
						console.log($scope.featuresList);
					}

					defaultFeatures();

					$('#window').on('click','#sendFeatures', function(){
						defaultFeatures();
						putMarks();
					});

					function onClose() {
						features.fadeIn();
					}

					myWindow.kendoWindow({
						visible: false,
						title: "Задать характеристики для отображения меток",
						actions: [
							"Close"
						],
						close: onClose
					}).data("kendoWindow");
					}

			});

			var buttonControl = new CustomControlClass();
			map.controls.add(buttonControl, {
				float: 'right',
				position: {
					top: 50,
					right: 10
				}
			});
		}

		$scope.update = function(markNum) {
			// balloonLayout = '<div style="width:200px; height: 100px;"><p><span>Количество: ' + $scope.countOnMark +'<br>Название ЖК: название</span></p></div>';
			// polygonPlacemark.properties.set("chartCount",$scope.countOnMark);
			// $scope.placemarkList[markNum].properties.set("chartCount",$scope.counterList[markNum]);
		};
		ymaps.ready(init);

    });