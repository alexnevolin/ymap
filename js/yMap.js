var yMapApp = angular.module("YMap", ["kendo.directives"])

.controller("MarkCtrl", function($scope, $http) {

    $scope.marksJSON;
    $scope.idList = [];
    $scope.counterList = [];
    $scope.chosenFeatures = [];
    $scope.featuresList = [];

    $http.get('../data/mark2.json').success(function(data) {
        $scope.marksJSON = data;
    });

    function putMarks(map) {
        var marksCount = $scope.marksJSON.houses;
        var markNum = 0;
        var specEvents = {};

        for (var i = 0; i < marksCount.length; i++) {

            bindFeatures(marksCount[i]);
            var counter = $scope.chosenFeatures[1];
            var colour = $scope.chosenFeatures[0];
            var id = marksCount[i].mark_id;
            var coords = marksCount[i].mark_coords;
            specEvents[id] = $scope.chosenFeatures[3];

            $scope.idList[i] = id;
            $scope.counterList[i] = $scope.chosenFeatures[2];

            var markTemplate = '';
            switch (marksCount[i].type) {
                case 'zc':
                    markTemplate = '<div class="zc_mark" style="background: {{properties.colour}};">' +
                        '<div class="zc_mark_before" style="border-right: 20px solid {{properties.colour}};"></div>' +
                        '<div class="zc_mark_after" style="border-left: 20px solid {{properties.colour}};"></div>' +
                        '<canvas id="' + id + '" class="zc_canvas" width="80" height="80"></canvas>' +
                        '<div class="zc_mark_hend" style="border-top: 30px solid {{properties.colour}};"></div>' +
                        '<span class="zc_counter">{{ properties.chartCount }}</span><div data-id="'+id+'" class="zc_trigger"></div></div>';
                    break;
                case 'home':
                    markTemplate = '<div class="placemark_layout_container">' +
                        '<div class="home_layout" style="border-color: {{properties.colour}};">' +
                        '<div class="home_layout_before" style="border-top: 20px solid {{properties.colour}};"></div>' +
                        '<span style="position: relative; top: 16px;">{{ properties.chartCount }}</span>' +
                        '<canvas id="' + id + '" width="90" height="90" style="position: relative; bottom: 39px; right: 20px;"></canvas>' +
                        '</div></div>';
                    break;
                case 'landmark':
                    markTemplate = '<div class="landmark"><div class="landmark_center"></div></div>';
                    break;
                case 'object':
                    markTemplate = '<div class="sq_mark" style="border-color: {{properties.colour}};">' +
                        '<div class="sq_mark_after" style="border-top: 30px solid {{properties.colour}};"></div>' +
                        '<span class="sq_text">{{ properties.chartCount }}</span>' +
                        '<canvas id="' + id + '" width="88" height="88" class="sq_canvas"></canvas></div>';
                    break;
                case 'analog':
                    markTemplate = '<div class="placemark_layout_container">' +
                        '<div class="polygon_layout" style="border-color: {{properties.colour}};">' +
                        '<span style="position: relative; top: 13.5px;" ng-click="alert("123")">{{ properties.chartCount }}</span>' +
                        '<canvas id="' + id + '" width="90" height="90" style="position: relative; bottom: 39px; right: 20.5px;"></canvas>' +
                        '</div><div class="arrow" style="border-top: 26px solid {{properties.colour}};"></div></div></div>';
                    break;
            }

            var chartBuild = function() {
                markLayout.superclass.build.call(this);

                var chart = new MarkChart($scope.idList[markNum]);
                chart.chartType = "ring";
                chart.data = [+$scope.counterList[markNum], 8 - $scope.counterList[markNum]];
                chart.colors = ['#0FFF2B', '#00ffff'];
                chart.draw();
                specEvent = '0';

                if($('.zc_trigger').data('id') == $scope.idList[markNum]){
                    var specEvent;

                    for(var key in specEvents){
                        if(key == $scope.idList[markNum]){
                            specEvent = specEvents[key];
                        }
                    }
                    specEvent == "1" ? $('.zc_trigger').css('visibility','visible') :  $('.zc_trigger').css('visibility','hidden');
                }

                if (markNum < $scope.marksJSON.houses.length + 1)
                    markNum++;
                else markNum = 0;
            };

            var markLayout = ymaps.templateLayoutFactory.createClass(markTemplate, {
                build: chartBuild
            });

            // var balloonLayout = '';

            var polygonPlacemark = new ymaps.Placemark(
                [coords.x, coords.y], {
                    // balloonContent: balloonLayout,
                    name: 'my name',
                    chartCount: counter,
                    colour: colour
                }, {
                    iconLayout: markLayout
                }
            );

            polygonPlacemark.events.add('contextmenu', function(e) {
                console.log("Показать балун");
                //polygonPlacemark.balloon.open(e.get('coords'), 'asd');
            });

            map.geoObjects.add(polygonPlacemark);
        }

    }

    function putChosenFeatures(data, features, i) {
        for (var key in data) {
            if (key == features[i]) {
                $scope.chosenFeatures[i] = data[key];
            }
        }
    }

    function bindFeatures(dataMark) {
        var features = $scope.featuresList;
        var position = 0;

        for (var key in dataMark) {
            if (key != "mark_coords" && key != "mark_id" && key != "type") {
                putChosenFeatures(dataMark[key], features, position);
                position++;
            }
        }
    }

    function init() {
        var map = new ymaps.Map("map_container", {
                center: [55.73, 37.58],
                zoom: 10
            }),

            CustomControlClass = function(options) {
                CustomControlClass.superclass.constructor.call(this, options);
                this._$content = null;
                this._geocoderDeferred = null;
            };

        $scope.map = map;

        ymaps.util.augment(CustomControlClass, ymaps.collection.Item, {
            onAddToMap: function(map) {
                CustomControlClass.superclass.onAddToMap.call(this, map);
                this._lastCenter = null;
                this.getParent().getChildElement(this).then(this._onGetChildElement, this);
            },

            onRemoveFromMap: function(oldMap) {
                this._lastCenter = null;
                if (this._$content) {
                    this._$content.remove();
                    this._mapEventGroup.removeAll();
                }
                CustomControlClass.superclass.onRemoveFromMap.call(this, oldMap);
            },

            _onGetChildElement: function(parentDomContainer) {
                this._$content = $('<button class="k-button" id="features">Характеристики</button>' +
                    '<div class="features-window" id="window">' +
                    '<div class="list-section k-content">' +
                    '<ul class="fieldlist">' +
                    '<li><input type="radio" name="colour-mark" id="colourm1" value="Класс дома" class="k-radio"  checked="checked">' +
                    '<label class="k-radio-label" for="colourm1">Класс дома</label></li>' +
                    '<li><input type="radio" name="colour-mark" id="colourm2" value="Материал стен дома" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm2">Материал стен дома</label></li>' +
                    '<li><input type="radio" name="colour-mark" id="colourm3" value="Максимальная этажность  дома" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm3">Максимальная этажность  дома</label></li>' +
                    '<li><input type="radio" name="colour-mark" id="colourm4" value="Год постройки дома" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm4">Год постройки дома</label></li>' +
                    '<li><input type="radio" name="colour-mark" id="colourm5" value="Когорта дома Объекта" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm5">Когорта дома Объекта </label></li>' +
                    '</ul>' +
                    '<ul class="fieldlist">' +
                    '<li><input type="radio" name="number-mark" id="numberm1" value="Количество Аналогов/Объявлений в доме" class="k-radio" checked="checked">' +
                    '<label class="k-radio-label" for="numberm1">Количество Аналогов/Объявлений в доме</label></li>' +
                    '<li><input type="radio" name="number-mark" id="numberm2" value="Максимальная этажность  дома" class="k-radio">' +
                    '<label class="k-radio-label" for="numberm2">Максимальная этажность  дома</label></li>' +
                    '<li><input type="radio" name="number-mark" id="numberm3" value="Год постройки дома" class="k-radio">' +
                    '<label class="k-radio-label" for="numberm3">Год постройки дома</label></li>' +
                    '<li><input type="radio" name="number-mark" id="numberm4" value="Количество описанных квартир в доме по Росреестру" class="k-radio">' +
                    '<label class="k-radio-label" for="numberm4">Количество описанных квартир в доме по Росреестру</label></li>' +
                    '<li><input type="radio" name="number-mark" id="numberm5" value="Средняя удельная цена Аналогов/Объявлений (тыс.руб.)" class="k-radio">' +
                    '<label class="k-radio-label" for="numberm5">Средняя удельная цена Аналогов/Объявлений (тыс.руб.)</label></li>' +
                    '<li><input type="radio" name="number-mark" id="numberm6" value="Удельная Кадастровая стоимость (тыс.руб.)" class="k-radio">' +
                    '<label class="k-radio-label" for="numberm6">Удельная Кадастровая стоимость (тыс.руб.)</label></li>' +
                    '</ul>' +
                    '<ul class="fieldlist">' +
                    '<li><input type="radio" name="diagram-mark" id="diagramm1" value="Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)" class="k-radio" checked="checked">' +
                    '<label class="k-radio-label" for="diagramm1">Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)</label></li>' +
                    '<li><input type="radio" name="diagram-mark" id="diagramm2" value="Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)" class="k-radio">' +
                    '<label class="k-radio-label" for="diagramm2">Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)</label></li>' +
                    '</ul>' +
                    '<ul class="fieldlist">' +
                    '<li><input type="radio" name="special-mark" id="specialm1" value="В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)" class="k-radio" checked="checked">' +
                    '<label class="k-radio-label" for="specialm1">В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)</label></li>' +
                    '<li><input type="radio" name="special-mark" id="specialm2" value="Описание дома рассогласовано: да/нет (характеристики рассогласованности)" class="k-radio">' +
                    '<label class="k-radio-label" for="specialm2">Описание дома рассогласовано: да/нет (характеристики рассогласованности)</label></li>' +
                    '</ul>' +
                    '</div>' +
                    '<button class="k-button controlFeatures" id="refreshFeatures">Отменить</button>' +
                    '<button class="k-button controlFeatures" id="sendFeatures">Показать</button>' +
                    '</div>').appendTo(parentDomContainer);
                this._mapEventGroup = this.getMap().events.group();

                var myWindow = $("#window"),
                    features = $("#features");

                var cache = $('#window').html();

                features.click(function() {
                    myWindow.data("kendoWindow").open();
                    features.fadeOut();
                });

                $('#window').on('click', '#refreshFeatures', function() {
                    $('#window').html(cache);
                });

                $("#map_container").click(function() {
                    if ($('#features').css('display') == "none") {
                        myWindow.data("kendoWindow").close();
                    }
                });

                function defaultFeatures() {
                    var vals = $('.k-radio').map(function(i, el) {
                        if ($(el).prop('checked')) {
                            return $(el).val();
                        }
                    }).get();
                    $scope.featuresList = vals;

                }
                defaultFeatures();
                putMarks(map);

                $('#window').on('click', '#sendFeatures', function() {
                    defaultFeatures();
                    map.geoObjects.removeAll();
                    markNum = 0;
                    putMarks(map);
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

    ymaps.ready(init);

});
