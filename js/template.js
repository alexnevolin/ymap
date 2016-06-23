var templateWindowFeatures = $('<button class="k-button" id="features">Характеристики</button>' +
    '<div class="features-window" id="window">' +
        '<div class="list-section k-content">' +
            '<span>Основной цвет фигуры</span>'+
            '<ul class="fieldlist">' +
                '<li><input type="radio" name="colour-mark" id="colourm1" value="Класс дома" class="k-radio"  checked="checked">' +
                    '<label class="k-radio-label" for="colourm1">Класс дома</label></li>' +
                '<li><input type="radio" name="colour-mark" id="colourm2" value="Материал стен дома" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm2">Материал стен дома</label></li>' +
                '<li><input type="radio" name="colour-mark" id="colourm3" value="Максимальная этажность дома" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm3">Максимальная этажность  дома</label></li>' +
                '<li><input type="radio" name="colour-mark" id="colourm4" value="Год постройки дома" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm4">Год постройки дома</label></li>' +
                '<li><input type="radio" name="colour-mark" id="colourm5" value="Когорта дома Объекта" class="k-radio">' +
                    '<label class="k-radio-label" for="colourm5">Когорта дома Объекта </label></li>' +
            '</ul>' +
            '<span>Числовое значение в середине метки</span>'+
            '<ul class="fieldlist">' +
                '<li><input type="radio" name="number-mark" id="numberm1" value="Количество Аналогов/Объявлений в доме" class="k-radio" checked="checked">' +
                    '<label class="k-radio-label" for="numberm1">Количество Аналогов/Объявлений в доме</label></li>' +
                '<li><input type="radio" name="number-mark" id="numberm2" value="Максимальная этажность дома" class="k-radio">' +
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
            '<span>Круговая диаграмма</span>'+
            '<ul class="fieldlist">' +
                '<li><input type="radio" name="diagram-mark" id="diagramm1" value="Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)" class="k-radio" checked="checked">' +
                    '<label class="k-radio-label" for="diagramm1">Доли Аналогов/Объявлений в доме по комнатности (1, 2, 3 , 4+)</label></li>' +
                '<li><input type="radio" name="diagram-mark" id="diagramm2" value="Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)" class="k-radio">' +
                    '<label class="k-radio-label" for="diagramm2">Доли Аналогов/Объявлений в доме по классу (дихотомия: доминирующий класс и остальные)</label></li>' +
            '</ul>' +
            '<span>Дополнительный знак "Красный круг"</span>'+
            '<ul class="fieldlist">' +
                '<li><input type="radio" name="special-mark" id="specialm1" value="В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)" class="k-radio" checked="checked">' +
                    '<label class="k-radio-label" for="specialm1">В доме выданы кредиты: да/нет (информация о выданных кредитах в доме)</label></li>' +
                '<li><input type="radio" name="special-mark" id="specialm2" value="Описание дома рассогласовано: да/нет (характеристики рассогласованности)" class="k-radio">' +
                    '<label class="k-radio-label" for="specialm2">Описание дома рассогласовано: да/нет (характеристики рассогласованности)</label></li>' +
            '</ul>' +
        '</div>' +
        '<button class="k-button controlFeatures" id="refreshFeatures">Отменить</button>' +
        '<button class="k-button controlFeatures" id="sendFeatures">Показать</button>' +
    '</div>');

var getMarkTemplate = function(type,id) {
    console.log(type);
    var tmpl = '';
    switch (type) {
        case 'zc':
            tmpl = '<div class="placemark_layout_container">'+
                '<div class="zc_layout" style="background: {{properties.colour}};">' +
                 '<div class="zc_layout_left" style="border-right: 10px solid {{properties.colour}};"></div>' +
                 '<div class="zc_layout_right" style="border-left: 10px solid {{properties.colour}};"></div>' +
                 '<canvas id="' + id + '" class="canvas" width="70" height="70"></canvas>' +
                 '<div class="pin" style="border-top: 20px solid {{properties.colour}};"></div>' +
                 '<span class="text">{{ properties.chartCount }}</span>'+
                 '<div id="id_'+id+'" data-id="'+id+'" class="zc_trigger"></div>'+
                '</div></div>';
            break;
        case 'home':
            tmpl = '<div class="placemark_layout_container">' +
                '<div class="home_layout" style="border-color: {{properties.colour}};">' +
                 '<div class="home_layout_pin pin" style="border-top: 23px solid {{properties.colour}};"></div>' +
                 '<span class="home_layout_text text">{{ properties.chartCount }}</span>' +
                 '<canvas id="' + id + '" width="70" height="70" class="home_layout_canvas canvas"></canvas>' +
                '</div></div>';
            break;
        case 'landmark':
            tmpl = '<div class="landmark"><div class="landmark_center"></div></div><canvas style="display:none" id="' + id + '""></canvas>';
            break;
        case 'object':
            tmpl = '<div class="placemark_layout_container">' +
                '<div class="sq_layout" style="background: {{properties.colour}};">' +
                 '<div class="sq_layout_pin pin" style="border-top: 22px solid {{properties.colour}};"></div>' +
                 '<span class="sq_layout_text text">{{ properties.chartCount }}</span>' +
                 '<canvas id="' + id + '" width="70" height="70" class="sq_layout_canvas canvas"></canvas>' +
                '</div></div>';
            break;
        case 'analog':
            tmpl = '<div class="placemark_layout_container">' +
                '<div class="analog_layout" style="background: {{properties.colour}}; box-shadow: #ad9c94 0px 0px 0px 2px;">' +
                 '<span class="analog_layout_text text">{{ properties.chartCount }}</span>' +
                 '<canvas id="' + id + '" width="70" height="70" class="analog_layout_canvas canvas"></canvas>' +
                 '<div class="analog_uncoord pin" style="visibility: visible;"></div>'+
                 '<div class="analog_layout_pin pin" style="border-top: 23px solid {{properties.colour}};"></div>'+
                '</div></div>';
            break;
        case 'landmark_home_ak':
            tmpl = '<div class="landmark_home"><div class="landmark_home_icon fa fa-home"></div></div><canvas style="display:none" id="' + id + '""></canvas>';
            break;
        case 'landmark_home_aknew':
            tmpl = '<div class="landmark_home"><div class="landmark_home_aknew_icon fa fa-building"></div></div><canvas style="display:none" id="' + id + '""></canvas>';
            break; 
        case 'landmark_zc_ak':
            tmpl = '<div class="placemark_layout_container">'+
                '<div class="zc_layout" style="background: #000;">' +
                 '<div class="zc_layout_left" style="border-right: 10px solid #000;"></div>' +
                 '<div class="zc_layout_right" style="border-left: 10px solid #000;"></div>' +
                 '<canvas id="' + id + '" class="canvas" width="70" height="70"></canvas>' +
                 '<div class="pin" style="border-top: 20px solid #000;"></div>' +
                 '<span class="landmark_zc_ak_text" style="width: 25px; height: 25px;""><i class="landmark_zc_ak_icon fa fa-home"></i></span>'+
                 '<div id="id_'+id+'" data-id="'+id+'" class="zc_trigger" style="display:none;"></div>'+
                '</div></div>';
            break;      
        case 'landmark_zc_aknew':
            tmpl = '<div class="placemark_layout_container">'+
                '<div class="zc_layout" style="background: #000;">' +
                 '<div class="zc_layout_left" style="border-right: 10px solid #000;"></div>' +
                 '<div class="zc_layout_right" style="border-left: 10px solid #000;"></div>' +
                 '<canvas id="' + id + '" class="canvas" width="70" height="70"></canvas>' +
                 '<div class="pin" style="border-top: 20px solid #000;"></div>' +
                 '<span class="landmark_zc_ak_text" style="width: 25px; height: 25px;""><i class="landmark_zc_aknew_icon fa fa-building"></i></span>'+
                 '<div id="id_'+id+'" data-id="'+id+'" class="zc_trigger" style="display:none;"></div>'+
                '</div></div>';
            break;      
    }
    return tmpl;
}