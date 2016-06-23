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

            var chartBuild = function() {
                markLayout.superclass.build.call(this);

                var markId = "#id_" + $scope.idList[markNum];
                var currentMark = $(markId);
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

                if (markNum < $scope.marksJSON.houses.length + 1)
                    markNum++;
                else markNum = 0;
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
                this._$content = templateWindowFeatures.appendTo(parentDomContainer);
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
