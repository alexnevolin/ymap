var yMapApp = angular.module("YMap", ["kendo.directives"])

    .controller("MarkCtrl", function($scope, $http) {

        $scope.marksJSON;
        $scope.idList = [];
        $scope.counterList = [];
        $scope.chosenFeatures = [];
        $scope.featuresList = [];



        var INEXACT_COORD = 0;
        var COLOUR_MARK = 1;
        var NUMBER_VALUE = 2;
        var CHART = 3;
        var SPEC_EVENT = 4;


        $http.get('data/mark2.json').success(function(data) {
            $scope.marksJSON = data;
        });

        $scope.colorCriteria;
        var defaultColors = [
            {"Класс дома" : ['#ddd0ca', '#672B10']},
            {"Материал стен дома" : ['#f5dada', '#BF0909']},
            {"Максимальная этажность дома" : ['#ebebff', '#0000FF']},
            {"Год постройки дома" : ['#dae7d8', '#146302']},
            {"Когорта дома Объекта" : ['#eddeed', '#8C278C']}
        ];
        var arrColors = ['#ffffff'];
        var flag = false;
        var chosenCriteria;

        $http.get('data/colors.json').success(function(response) {
            $scope.colorCriteria = response;
        });

        function paint(count, from, to, target)
        {
            var n = count;
            var sFadeStartColor = from;
            var sFadeFinishColor = to;
            var aRGBStart = sFadeStartColor.replace("#","").match(/.{2}/g);
            var aRGBFinish = sFadeFinishColor.replace("#","").match(/.{2}/g);

            for (var i = 1; i <= n; i++) {
                arrColors[i] = getFadeMiddleColor(i, n, aRGBStart, aRGBFinish);

            };
        }

        function getFadeMiddleColor(i, n, aRGBStart, aRGBFinish)
        {
            /*процент содержания конечного цвета в текущем промежуточном цвете;
             изменяется от 0 (не включая 0) до 1 (1 = 100%)*/
            var finishPercent = i/n;
            /*процент содержания начального цвета в текущем промежуточном цвете;
             изменяется от 1 до 0 (1 = 100%) */
            var startPercent = 1 - finishPercent;

            var R,G,B;
            //вычисляем значения красного, зеленого, синего промежуточного цвета
            R = Math.floor( ('0x'+aRGBStart[0]) * startPercent + ('0x'+aRGBFinish[0]) * finishPercent );
            G = Math.floor( ('0x'+aRGBStart[1]) * startPercent + ('0x'+aRGBFinish[1]) * finishPercent );
            B = Math.floor( ('0x'+aRGBStart[2]) * startPercent + ('0x'+aRGBFinish[2]) * finishPercent );

            return 'rgb('+R+ ',' + G + ',' + B +')';
        }

        function getMaxPriorities(criteria){
            var priorities;
            var maxPriority = 0;
            for (var key in $scope.colorCriteria) {
                if (key == criteria) {
                    priorities = $scope.colorCriteria[key];
                }
            }
            for (var value in priorities) {
                if(priorities[value] > maxPriority){
                    maxPriority = priorities[value];
                }
            }

            return maxPriority;
        }

        function getParamsInterface(string, returnCriteria){
            var criterias = $scope.colorCriteria;
            for (var key in criterias) {
                for (var value in criterias[key]) {
                    if (value == string) {
                        return returnCriteria ? key : criterias[key][value];
                    }
                }
            }
        }

        function getDefaultColorsByCriteria(criteria){
            for (var i = 0; i < defaultColors.length; i++) {
                if(defaultColors[i][criteria] !== undefined){
                    return defaultColors[i][criteria];
                }
            }
        }

        function putMarks(map) {

            var marksCount = $scope.marksJSON.houses;
            var markNum = 0;
            var specEvents = {};
            var greyBorders = {};

            for (var i = 0; i < marksCount.length; i++) {

                bindFeatures(marksCount[i]);

                var id = marksCount[i].mark_id;
                var coords = marksCount[i].mark_coords;
                var counter = $scope.chosenFeatures[NUMBER_VALUE];
                var defaultColor = getDefaultColorsByCriteria(getParamsInterface($scope.chosenFeatures[COLOUR_MARK], true));
                paint(getMaxPriorities(chosenCriteria), defaultColor[0], defaultColor[1]);
                var colour = arrColors[getParamsInterface($scope.chosenFeatures[COLOUR_MARK], false)];

                specEvents[id] = $scope.chosenFeatures[SPEC_EVENT];
                greyBorders[id] = $scope.chosenFeatures[INEXACT_COORD];

                $scope.idList[i] = id;
                $scope.counterList[i] = $scope.chosenFeatures[CHART];

                var chartBuild = function() {
                    markLayout.superclass.build.call(this);

                    var markId = "#id_" + $scope.idList[markNum];
                    var borderId = "#br_" + $scope.idList[markNum];
                    var pinId = "#vs_" + $scope.idList[markNum];
                    var currentMark = $(markId);
                    var greyBorder = $(borderId);
                    var pinBorder = $(pinId);
                    var chart = new MarkChart($scope.idList[markNum]);

                    chart.chartType = "ring";
                    chart.data = [+$scope.counterList[markNum], 8 - $scope.counterList[markNum]];
                    chart.colors = ['#0FFF2B', '#00ffff'];
                    chart.draw();

                    if(currentMark.data('id') == $scope.idList[markNum] ){
                        var specEvent;

                        for(var key in specEvents){
                            if(key == $scope.idList[markNum]){
                                specEvent = specEvents[key];
                            }
                        }
                        specEvent == "1" ? currentMark.css('visibility','visible') :  currentMark.css('visibility','hidden');
                    }

                    if(greyBorder.data('id') == $scope.idList[markNum] ){
                        var uncoords;

                        for(var key in greyBorders){
                            if(key == $scope.idList[markNum]){
                                uncoords = greyBorders[key];
                            }
                        }
                        if(uncoords) {
                            greyBorder.css('box-shadow', '#ad9c94 0 0 0 2px');
                            pinBorder.css('visibility', 'visible');
                        }
                    }

                    (markNum < $scope.marksJSON.houses.length + 1) ? markNum++ : markNum = 0;
                };

                var markLayout = ymaps.templateLayoutFactory.createClass(getMarkTemplate(marksCount[i].type,id), {
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
            if(flag) {
                chosenCriteria = features[i];
                flag = false;
            }
            for (var key in data) {
                if (key == features[i]) {
                    $scope.chosenFeatures[++i] = data[key];
                }
            }
        }

        function bindFeatures(dataMark) {
            var features = $scope.featuresList;
            var position = 0;


            for (var key in dataMark) {
                if (key == "mark_colors") {
                    flag = true;
                }
                if (key != "mark_coords" && key != "mark_id" && key != "type" && key != "mark_uncoords") {
                    putChosenFeatures(dataMark[key], features, position);
                    position++;
                }

                if (key == "mark_uncoords") {
                    $scope.chosenFeatures[INEXACT_COORD] = dataMark[key];
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
                    this._$content = templateWindowFeatures.appendTo(parentDomContainer);
                    this._mapEventGroup = this.getMap().events.group();

                    var myWindow = $("#window"),
                        features = $("#features"),
                        mapContainer = $("#map_container");

                    var cache = myWindow.html();

                    features.click(function() {
                        myWindow.data("kendoWindow").open();
                        features.fadeOut();
                    });

                    myWindow.on('click', '#refreshFeatures', function() {
                        myWindow.html(cache);
                    });

                    mapContainer.click(function() {
                        if (features.css('display') == "none") {
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

                    myWindow.on('click', '#sendFeatures', function() {
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

                    defaultFeatures();
                    putMarks(map);
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
