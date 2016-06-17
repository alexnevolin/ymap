var yMapApp = angular.module("YMap", [ "kendo.directives" ])

    .controller("MarkCtrl", function($scope,$http){

    	$scope.marksJSON;
    	$scope.idList = [];
    	$scope.counterList = [];
    	$scope.placemarkList = [];

    	$scope.update = null;

    	$http.get('../data/mark.json').success(function(data) {
            $scope.marksJSON = data;
        });

		var markNum = 0;

		function putObjects(map, onjectsJSON) {

			var chartBuild = function() {
				squareLayout.superclass.build.call(this);
				var chart = new MarkChart("obj1");
				chart.chartType = "ring";
				chart.data = [+4,8-4];
				chart.colors = ['#0FFF2B', '#00ffff'];
				chart.draw();
			}

			var squareLayout = ymaps.templateLayoutFactory.createClass('<div class="sq_mark"><span class="sq_text">4</span><canvas id="'+'obj1'+'" width="88" height="88" class="sq_canvas"></canvas></div>', {
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

        function putMarks(map, marksJSON) {
        	console.log('Расставить метки');
        	
        	for (var i = 0; i < marksJSON.houses.length; i++) {
        		var id = marksJSON.houses[i].mark_id;
        		var counter = marksJSON.houses[i].mark_counter;
        		var coords = marksJSON.houses[i].mark_coords;
        		$scope.idList[i] = marksJSON.houses[i].mark_id;  	
				$scope.counterList[i] = marksJSON.houses[i].mark_counter; 

				var markTemplate = '<div class="placemark_layout_container">' +
				 		'<div class="polygon_layout">' +
				 			'<span style="position: relative; top: 13.5px;" ng-click="alert("123")">{{ properties.chartCount }}</span>' +
				 			'<canvas id="'+id+'" width="90" height="90" style="position: relative; bottom: 39px; right: 20.5px;"></canvas>' +
						'</div></div>';

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
				}

				var polygonLayout = ymaps.templateLayoutFactory.createClass(markTemplate, {
					build: chartBuild
				});

				var balloonLayout = '<div style="width:200px; height: 100px;"><p><span>Количество: ' + counter +'<br>Название ЖК: название</span></p></div>';

				var polygonPlacemark = new ymaps.Placemark(
			        [coords.x, coords.y], {
			            // balloonContent: balloonLayout,
			            name: 'my name',
			            chartCount: counter
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

			putMarks($scope.map,$scope.marksJSON);
			putObjects($scope.map,null);

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
										'<li><input type="radio" name="colour-mark" id="colourm1" class="k-radio" checked="checked">'+
											'<label class="k-radio-label" for="colourm1">Класс дома</label></li>'+
										'<li><input type="radio" name="colour-mark" id="colourm2" class="k-radio">'+
											'<label class="k-radio-label" for="colourm2">Материал стен дома</label></li>'+
										'<li><input type="radio" name="colour-mark" id="colourm3" class="k-radio">'+
											'<label class="k-radio-label" for="colourm3">Максимальная этажность  дома</label></li>'+
										'<li><input type="radio" name="colour-mark" id="colourm4" class="k-radio">'+
											'<label class="k-radio-label" for="colourm4">Год постройки дома</label></li>'+
										'<li><input type="radio" name="colour-mark" id="colourm5" class="k-radio">'+
											'<label class="k-radio-label" for="colourm5">Когорта дома Объекта </label></li>'+
									'</ul>'+
									'<ul class="fieldlist">'+
										'<li><input type="radio" name="number-mark" id="numberm1" class="k-radio" checked="checked">'+
											'<label class="k-radio-label" for="numberm1">Количество Аналогов/Объявлений в доме</label></li>'+
										'<li><input type="radio" name="number-mark" id="numberm2" class="k-radio">'+
											'<label class="k-radio-label" for="numberm2">Максимальная этажность  дома</label></li>'+
										'<li><input type="radio" name="number-mark" id="numberm3" class="k-radio">'+
											'<label class="k-radio-label" for="numberm3">Год постройки дома</label></li>'+
										'<li><input type="radio" name="number-mark" id="numberm4" class="k-radio">'+
											'<label class="k-radio-label" for="numberm4">Количество описанных квартир в доме по Росреестру</label></li>'+
										'<li><input type="radio" name="number-mark" id="numberm5" class="k-radio">'+
											'<label class="k-radio-label" for="numberm5">Средняя удельная цена Аналогов/Объявлений (тыс.руб.)</label></li>'+
										'<li><input type="radio" name="number-mark" id="numberm6" class="k-radio">'+
											'<label class="k-radio-label" for="numberm6">Удельная Кадастровая стоимость (тыс.руб.)</label></li>'+
									'</ul>'+
									'<ul class="fieldlist">'+
										'<li><input type="radio" name="diagram-mark" id="diagramm1" class="k-radio" checked="checked">'+
											'<label class="k-radio-label" for="diagramm1">Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)</label></li>'+
										'<li><input type="radio" name="diagram-mark" id="diagramm2" class="k-radio">'+
											'<label class="k-radio-label" for="diagramm2">Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)</label></li>'+
									'</ul>'+
									'<ul class="fieldlist">'+
										'<li><input type="radio" name="special-mark" id="specialm1" class="k-radio" checked="checked">'+
											'<label class="k-radio-label" for="specialm1">В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)</label></li>'+
										'<li><input type="radio" name="special-mark" id="specialm2" class="k-radio">'+
											'<label class="k-radio-label" for="specialm2">Описание дома рассогласовано: да/нет (характеристики рассогласованности)</label></li>'+
									'</ul>'+
					        '</div>'+
							'<button class="k-button controlFeatures" id="resetFeatures">Отменить</button>'+
							'<button class="k-button controlFeatures" id="sendFeatures">Показать</button>'+
					'</div>').appendTo(parentDomContainer);

					var myWindow = $("#window"),
						features = $("#features");

					features.click(function() {
						myWindow.data("kendoWindow").open();
						features.fadeOut();
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
					}).data("kendoWindow").center();

				}

				/*_createRequest: function() {
					var lastCenter = this._lastCenter = this.getMap().getCenter().join(',');
					// Запрашиваем информацию о месте по координатам центра карты.
					ymaps.geocode(this._lastCenter, {
						// Указываем, что ответ должен быть в формате JSON.
						json: true,
						// Устанавливаем лимит на кол-во записей в ответе.
						results: 1
					}).then(function (result) {
						// Будем обрабатывать только ответ от последнего запроса.
						if (lastCenter == this._lastCenter) {
							this._onServerResponse(result);
						}
					}, this);
				},

				_onServerResponse: function (result) {
					// Данные от сервера были получены и теперь их необходимо отобразить.
					// Описание ответа в формате JSON.
					var members = result.GeoObjectCollection.featureMember,
							geoObjectData = (members && members.length) ? members[0].GeoObject : null;
					if (geoObjectData) {
						this._$content.text(geoObjectData.metaDataProperty.GeocoderMetaData.text);
					}
				}*/


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


