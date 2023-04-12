/*
  일기도 분석-단열선도 JS(vanilla, without jquery)
  작성자: 이창재(2020.10.29)
*/
var tm_arr     = []; // 시간 배열(tm_arr[0]: 발효시간, tm_arr[n]: n번째 일기도 모델 발표시간)
var ajaxNum    = [];
var ajaxStn    = 0;
var tm_st      = 0;  // 발효시간 타임바의 첫번째 시간
var host = 'http://' + location.hostname;
var cht_mode, tm_itv, autoload = 0, ncht_max = 3;
var stn_id = 0;
var zoom_level = 0;  // 줌 레벨
var zoom_x = zoom_y = '0000000';
var cht_area, img_width, onload_cnt, comp = 0;

var PI = Math.asin(1.0)*2.0;
var DEGRAD = PI/180.0;
var RADDEG = 180.0/PI;

var reg_arr = [
  {reg_name: "수도권", reg_id: ["11A0","11B1","11B2"], stn: []},
  {reg_name: "경남권", reg_id: ["11H2"], stn: []},
  {reg_name: "경북권", reg_id: ["11H1","11E0"], stn: []},
  {reg_name: "전남권", reg_id: ["11F2","21F2"], stn: []},
  {reg_name: "전북",  reg_id: ["11F1","21F1"], stn: []},
  {reg_name: "충남권", reg_id: ["11C2"], stn: []},
  {reg_name: "충북",  reg_id: ["11C1"], stn: []},
  {reg_name: "강원도",  reg_id: ["11D1","11D2"], stn: []},
  {reg_name: "제주도",  reg_id: ["11G0"], stn: []}
];

var map, map_size, gis_img, gis_center = [41.364544, 115.355385];
var canvas1, canvas2, canvas3, canvas4, canvas5, img_data = [], stop_flag = false;
var graticule1, graticule2, graticule3, gis_proj4, gis_resolution, world_lon;
var geojsonData, geojsonWorldData, lakeData, koreaData, koreaCityData;
var geojsonVectorTile, lakeVectorTile, koreaVectorTile, koreaCityVectorTile, geojsonWorldVectorTile;
var geojsonVectorFillTile, lakeVectorFillTile, koreaVectorFillTile, koreaCityVectorFillTile, geojsonWorldVectorFillTile;
var markerLayer, latlon = 0, init = 0, click_count = 0, lat1 = lat2 = lon1 = lon2 = -999.;

var area_info = [
  {
    area: "EA_CHT", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [41.364544, 115.355385], center_origin: [41.364544, 115.355385], 
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 28000, 18666.6667, 12444.4444,
                     8296.2963, 5530.8642, 3687.2428,
                     2458.1619, 1638.7746, 1092.5164, 728.3443],
      zoom: {
        min: 0,
        max: 7
      }
    }
  },
  {
    area: "TP", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [25.686878, 141.707687], center_origin: [25.686878, 141.707687],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 32872.5, 21915, 14610, 9740, 6493.3333, 4328.8889,
                     2885.9259, 1923.9506, 1282.6337,
                     855.0892],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "E10", zoom_x: '5400000', zoom_y: '5400000', zoom_level: 2, center: [37.069424, 124.848145], center_origin: [37.069424, 124.848145],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 13500, 9000, 6000, 4000, 2666.6667,
                     1777.7778, 1185.1852, 790.1235,
                     526.7490, 351.1660],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "NHEM", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [89.993668, 255.000000], center_origin: [89.993668, 255.000000],
    map_attrs: {
      crs: "EPSG:3031",
      proj4string: "+proj=Polar_Stereographic +lat_0=90 +lat_ts=90 +lon_0=120 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 23550, 15700, 10466.6667,
                     6977.7778, 4651.8519, 3101.2346,
                     2067.4897, 1378.3265],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "WORLD", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [0.0, 126.000000], center_origin: [0.0, 126.000000],
    map_attrs: {
      crs: "EPSG:32662",
      proj4string: "+proj=eqc +lat_0=0 +lat_ts=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 30830, 20553.3333, 13702.2222,
                     9134.8148, 6089.8765, 4059.9177,
                     2706.6118, 1804.4079, 1202.9386],
      zoom: {
          min: 0,
          max: 7
      }
    }
  }
];

//document.addEventListener('load', onLoad(), false);

//IE에서 findIndex 함수 사용을 위한 polyfill
if (!Array.prototype.findIndex) {
  Object.defineProperty(Array.prototype, 'findIndex', {
    value: function(predicate) {
     // 1. Let O be ? ToObject(this value).
      if (this == null) {
        throw new TypeError('"this" is null or not defined');
      }

      var o = Object(this);

      // 2. Let len be ? ToLength(? Get(O, "length")).
      var len = o.length >>> 0;

      // 3. If IsCallable(predicate) is false, throw a TypeError exception.
      if (typeof predicate !== 'function') {
        throw new TypeError('predicate must be a function');
      }

      // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
      var thisArg = arguments[1];

      // 5. Let k be 0.
      var k = 0;

      // 6. Repeat, while k < len
      while (k < len) {
        // a. Let Pk be ! ToString(k).
        // b. Let kValue be ? Get(O, Pk).
        // c. Let testResult be ToBoolean(? Call(predicate, T, { kValue, k, O })).
        // d. If testResult is true, return k.
        var kValue = o[k];
        if (predicate.call(thisArg, kValue, k, o)) {
          return k;
        }
        // e. Increase k by 1.
        k++;
      }

      // 7. Return -1.
      return -1;
    },
    configurable: true,
    writable: true
  });
}

// 첫 시작(화면 로드 시)
function onLoad(opt) {
  cht_mode = opt.split(',')[0];
  var tmfc = opt.split(',')[1];
  var tmef = opt.split(',')[2];
  var mdl  = opt.split(',')[3];
  var lat  = opt.split(',')[4];
  var lon  = opt.split(',')[5];
  if (cht_mode == "crss_sct") {
    var lat2  = opt.split(',')[6];
    var lon2  = opt.split(',')[7];
    cht_area = opt.split(',')[8];
    zoom_x  = opt.split(',')[9];
    zoom_y  = opt.split(',')[10];
    stn_id = 0;
    document.getElementById("autoload").checked = 0;
    autoload = 0;
  }
  //console.log(cht_mode, tmfc, tmef, mdl, lat, lon);

  if (mdl.indexOf("1H") != -1) {
    document.getElementById('tm_1hr').style.display = "flex";
    tm_itv = 1;
  }
  else {
    document.getElementById('tm_1hr').style.display = "none";
    tm_itv = 3;
  }
  var data = document.getElementsByName("tm_itv");
  for (var i=0; i<data.length; i++) {
    if (parseInt(data[i].value) == tm_itv) {
      data[i].checked = true;
      break;
    }
  }

  if (mdl == "KIM_1H") mdl = "GDAPS_KIM";
  else if (mdl == "GDAPS_1H") mdl = "GDAPS";
  else if (mdl == "ECMWF_1H10G1") mdl = "ECMWF_H";

  for (var i=1; i<=ncht_max; i++) {
    ajaxNum[i] = 0;
  }

  doWindow(0);
  if (cht_mode == "skew") {
    document.getElementById('table_fc').style.display = "none";
    document.getElementById('table_itv').style.display = "flex";
    document.getElementById('table_ef').style.display = "flex";
    document.getElementById('table_tm').style.display = "block";
    document.getElementById('tm_1hr').style.display = "none";
    document.getElementById('table_stn').style.display = "block";
    document.getElementById('table_pnt2').style.display = "none";
    document.getElementById('table_load').style.display = "flex";
    document.getElementById('table_window').style.display = "flex";
    document.getElementById('table_mdl').style.display = "none";
    document.getElementById('mapLayer').style.display = "none";
  }
  else if (cht_mode == "crss_sct") {
    document.getElementById('table_fc').style.display = "none";
    document.getElementById('table_itv').style.display = "flex";
    document.getElementById('table_ef').style.display = "flex";
    document.getElementById('table_tm').style.display = "block";
    document.getElementById('tm_1hr').style.display = "none";
    document.getElementById('table_stn').style.display = "none";
    document.getElementById('table_pnt2').style.display = "block";
    document.getElementById('table_load').style.display = "none";
    document.getElementById('table_window').style.display = "flex";
    document.getElementById('table_mdl').style.display = "none";
    document.getElementById('table_crss').style.display = "flex";
    document.getElementById('mapLayer').style.display = "block";
  }
  else {
    document.getElementById('table_fc').style.display = "block";
    document.getElementById('table_itv').style.display = "none";
    document.getElementById('table_ef').style.display = "none";
    document.getElementById('tm_1hr').style.display = "none";
    document.getElementById('table_tm').style.display = "none";
    document.getElementById('table_load').style.display = "none";
    document.getElementById('table_window').style.display = "none";
    document.getElementById("tm_select1").style.display = "none";
    if (cht_mode == "lmto") document.getElementById('table_mdl').style.display = "none";
    else document.getElementById('table_mdl').style.display = "flex";
    document.getElementById('mapLayer').style.display = "none";
  }

  if (tmfc == 0) {
    return;
    //tm_init(0, 'fc');
    //if (cht_mode != "crss_sct") fnInitStn();
  }
  else {
    if (cht_mode == "crss_sct") fnInit(tmfc, tmef, mdl, lat, lon, lat2, lon2);
    else fnInit(tmfc, tmef, mdl, lat, lon);
  }
  fnBodyResize();
}

// 설정 초기화
function fnInit(tmfc, tmef, mdl, lat, lon, lat2, lon2) {
  tm_arr[0] = tmef;
  for (var i=1; i<=ncht_max; i++) {
    tm_arr[i] = tmfc;
    document.getElementById("tm"+i).value = tm_arr[i].substring(0,4) + "." + tm_arr[i].substring(4,6) + "." + tm_arr[i].substring(6,8) + "." + tm_arr[i].substring(8,10) + ":" + tm_arr[i].substring(10,12);
  }

  document.getElementById("tmfc").value = tmfc.substring(0,4) + "." + tmfc.substring(4,6) + "." + tmfc.substring(6,8) + "." + tmfc.substring(8,10) + ":" + tmfc.substring(10,12);
  document.getElementById("tm0").value = tmef.substring(0,4) + "." + tmef.substring(4,6) + "." + tmef.substring(6,8) + "." + tmef.substring(8,10) + ":" + tmef.substring(10,12);

  if (cht_mode == "skew" || cht_mode == "crss_sct") {
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById('model'+i).value = mdl;
    }
  }
  else document.getElementById('model').value = mdl;

  document.getElementById('lat').value = parseFloat(lat).toFixed(2);
  document.getElementById('lon').value = parseFloat(lon).toFixed(2);

  if (cht_mode == "crss_sct") {
    document.getElementById('lat2').value = parseFloat(lat2).toFixed(2);
    document.getElementById('lon2').value = parseFloat(lon2).toFixed(2);
  }
  else fnInitStn();

  if (cht_mode == "crss_sct") {
    map_init(cht_area);
  }

  onload_cnt = 0;
  for (var i=1; i<=document.getElementById('window').value; i++) {
    doChtVal(i, 0);
  }
}

// 창 크기 변경에 따른 일기도 표출단 크기 조정
function fnBodyResize() {
  var width  = window.innerWidth - 5;
  if (cht_mode == "skew" || cht_mode == "crss_sct") var height = window.innerHeight - 120;
  else var height = window.innerHeight - 55;
  document.getElementById('skew_body').style.width = parseInt(width) + "px";
  document.getElementById('skew_body').style.height = parseInt(height) + "px";
}

// 일기도 정보 처리(moving: timebar 이동 시)
function doChtVal(id, moving) {
  if (comp == 0) {
    var data = document.getElementsByName("comp");
    for(var idx = 0; idx < data.length; idx++) {
      data[idx].checked = 0;
    }
  }

  if (tm_itv == 1) {
    document.getElementById('tm_1hr').style.display = "flex";
    fnTimeBar();
  }
  else {
    document.getElementById('tm_1hr').style.display = "none";
    tm_itv = 3;

    var tm = document.getElementById("tm0").value;
    var YY = tm.substring(0,4);
    var MM = tm.substring(5,7);
    var DD = tm.substring(8,10);
    var HH = tm.substring(11,13);
    var MI = tm.substring(14,16);

    var HH = parseInt(tm.substring(11,13)/tm_itv)*parseInt(tm_itv);
    var MI = 0;
    tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + addZeros(HH,2) + addZeros(MI,2);
    document.getElementById("tm0").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_arr[0] = tm;
    fnTimeBar();
  }

  if (stn_id > 0) {
    fnStnLatLon();
  }

  var url = host + "/cht_new/cht_skew_lib.php?mode=1&tm_ef=" + tm_arr[0] + "&tm_fc=" + tm_arr[id] + "&cht_mode=" + cht_mode + "&save=1";// + document.getElementById('save').value;
  if (tm_itv == 1) {
    if (cht_mode == "skew" || cht_mode == "crss_sct") var mdl = document.getElementById('model'+id).value;
    else var mdl = document.getElementById('model').value;
    if (mdl == "GDAPS_KIM") url += "&mdl=KIM_1H";
    else if (mdl == "GDAPS") url += "&mdl=GDAPS_1H";
    else if (mdl == "ECMWF_H") url += "&mdl=ECMWF_1H10G1";
  }
  else {
    if (cht_mode == "skew" || cht_mode == "crss_sct") var mdl = document.getElementById('model'+id).value;
    else var mdl = document.getElementById('model').value;
    if (mdl == "KIM_1H") url += "&mdl=GDAPS_KIM";
    else if (mdl == "GDAPS_1H") url += "&mdl=GDAPS";
    else if (mdl == "ECMWF_1H10G1") url += "&mdl=ECMWF_H";
    url += "&mdl=" + mdl;
  }

  if (cht_mode == "crss_sct") {
    var data = document.getElementsByName("var"+id);
    for (var i=0; i<data.length; i++) {
      if (data[i].checked == 1) {
        var varname = data[i].value;
        break;
      }
    }
    
    if (latlon == 0) {
      lat1 = document.getElementById('lat').value;
      lat2 = document.getElementById('lat2').value;
      lon1 = document.getElementById('lon').value;
      lon2 = document.getElementById('lon2').value;

      crss_latlon_draw(lat1, lon1, lat2, lon2);
      latlon = 1;

      img_width = Math.acos(Math.sin(parseFloat(lat1) * DEGRAD) * Math.sin(parseFloat(lat2) * DEGRAD) + Math.cos(parseFloat(lat1) * DEGRAD) * Math.cos(parseFloat(lat2) * DEGRAD) * Math.cos(parseFloat(lon1) * DEGRAD - parseFloat(lon2) * DEGRAD)) * RADDEG * 60 * 1.1515 * 1.609344;
      if (img_width < 600) img_width = 600;
      else if (img_width > 1500) img_width = 1500;
      img_width += 45 + 85;
    }

    url += "&lat=" + lat1 + "&lon=" + lon1 + "&lat2=" + lat2 + "&lon2=" + lon2;
    url += "&map=" + cht_area + "&zoom_x=" + zoom_x + "&zoom_y=" + zoom_y + "&varname=" + varname;
    url += "&min_level=" + document.getElementById('min_level').value + "&max_level=" + document.getElementById('max_level').value;
    if (document.getElementById('rain').checked) {
      url += "&rain=1";
    }
  }
  else {
    url += "&lat=" + document.getElementById('lat').value + "&lon=" + document.getElementById('lon').value;
    if (cht_mode == "skew") {
      img_width = 860;
    }
  }

  if (document.getElementById('sat').checked && cht_mode == "skew") url += "&sat=1"
  if (stn_id != 0) url += "&stn_id=" + stn_id;

  console.log(url);

  ajaxNum[id]++;
  var curAjaxNum = ajaxNum[id];
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == ajaxNum[id]) {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        if (l[0] != "@") {
          document.getElementById("nocht"+id).style.display = 'none';

          if (l.indexOf("png") == -1) {
            if (cht_mode != "skew") document.getElementById("loading").style.display = "block";
            if (document.getElementById("img"+id) != null) document.getElementById("cht"+id).removeChild(document.getElementById("img"+id));
            if (autoload == 1 && document.getElementById("loading").style.display != "block") {
              document.getElementById("loading").style.display = "block";
              loadImage(moving);
            }
          }

          if (document.getElementById("img"+id) == null) {
            var img = document.createElement("img");
            document.getElementById("cht"+id).appendChild(img);
            img.id = "img"+id;
          }
          if (l.indexOf("png") != -1) document.getElementById("img"+id).src = host + l + "?timestamp=" + new Date().getTime();
          else document.getElementById("img"+id).src = l + "&timestamp=" + new Date().getTime();

          if (cht_mode == "skew" || cht_mode == "crss_sct") {
            var width = img_width * document.getElementById('size').value/100;
            document.getElementById("img"+id).setAttribute('width',  width);

            if (cht_mode == "crss_sct") {
              document.getElementById("img"+id).onload  = function() {onload_cnt++; if (onload_cnt == document.getElementById('window').value) document.getElementById("loading").style.display = "none";}
              document.getElementById("img"+id).onerror = function() {onload_cnt++; if (onload_cnt == document.getElementById('window').value) document.getElementById("loading").style.display = "none";}
            }
          }
          else {
            document.getElementById("img"+id).onload  = function() {document.getElementById("loading").style.display = "none";}
            document.getElementById("img"+id).onerror = function() {document.getElementById("loading").style.display = "none";}
          }
        }
        else {
          document.getElementById("nocht"+id).style.display = 'block';
          if (document.getElementById("img"+id) != null) document.getElementById("cht"+id).removeChild(document.getElementById("img"+id));
          if (cht_mode == "crss_sct") {
            onload_cnt++;
            if (onload_cnt == document.getElementById('window').value) document.getElementById("loading").style.display = "none";
          }
          else if (cht_mode != "skew") {
            document.getElementById("loading").style.display = "none";
          }
        }

        if (l[0] != "@") console.log("img" + id + ": " + host + l);
        else console.log("img" + id + ": @no data");

      });
    }
  };
  xhr.send();
}

// 표출할 창 개수 조절
function doWindow(opt)
{
  for (var i=parseInt(document.getElementById('window').value)+1; i<=ncht_max; i++)
  {
    document.getElementById("tm_select" + i).style.display = "none";
    if (cht_mode == "crss_sct") document.getElementById("var_select" + i).style.display = "none";
    if (document.getElementById("img"+i) != null) document.getElementById("cht"+i).removeChild(document.getElementById("img"+i));
  }

  for (var i=1; i<=document.getElementById('window').value; i++)
  {
    document.getElementById("tm_select" + i).style.display = "block";
    if (cht_mode == "crss_sct") document.getElementById("var_select" + i).style.display = "block";
  }

  if (opt != -1) {
    if (document.getElementById('window').value == 1) document.getElementById('size').value = 100;
    else if (document.getElementById('window').value == 2) document.getElementById('size').value = 90;
    else if (document.getElementById('window').value == 3) document.getElementById('size').value = 65;
    else if (document.getElementById('window').value >= 4) document.getElementById('size').value = 60;
  }

  if (opt != 0) tm_move('+0H', 0);
}

// 일기도 이미지 표출
function chtView(id,l,curAjaxNum) {
  if (curAjaxNum != ajaxNum[id]) return;

  var width = parseFloat(document.getElementById('hidden_img' + id).width * document.getElementById('size').value/100);
  if (width < 30) {
    console.log(document.getElementById('hidden_img' + id).width);
    document.getElementById("hidden"+id).innerHTML = "<img id=hidden_img" + id + " src='" + host + l + "' onload=chtView(" + id + ",'" + l + "'); onerror=chtErr(" + id + ");>"; 
    return;
  }

  if (document.getElementById("img"+id) == null) {
    var img = document.createElement("img");
    document.getElementById("cht"+id).appendChild(img);
    img.id = "img" + id;
  }
  document.getElementById("img"+id).src = host + img_arr[id].src + "?timestamp=" + new Date().getTime();
  document.getElementById("img"+id).setAttribute('width',  width);
  document.getElementById("img"+id).removeAttribute('usemap');
  if (ext_mode == "hlt") {
    document.getElementById("img"+id).removeAttribute('onmousedown');
    document.getElementById("img"+id).setAttribute('onmousemove', 'img_on(img' + id + ',event);');
    //document.getElementById("cht"+id).innerHTML = "<img id=img" + id + " src='http://cht.kma.go.kr" + img_arr[id].src + "' style='width:" + width + ";' onmousemove='img_on(img" + id + ",event);'>";
  }
  else {
    document.getElementById("img"+id).setAttribute('onmousemove', 'img_on(img' + id + ',event);');
    document.getElementById("img"+id).setAttribute('onmousedown', 'img_xy(img' + id + ',event);');
    //document.getElementById("cht"+id).innerHTML = "<img id=img" + id + " src='http://cht.kma.go.kr" + img_arr[id].src + "' style='width:" + width + ";' onmousedown='img_xy(img" + id + ",event);' onmousemove='img_on(img" + id + ",event);'>";
  }
}

// 일기도 이미지 자료 없을 시
function chtErr(id,curAjaxNum) {
  //document.getElementById("cht"+id).innerHTML = '이미지가 없습니다.<br>발표시각과 발효시각을 확인해주세요.';
  if (curAjaxNum != ajaxNum[id]) return;
  document.getElementById("nocht"+id).style.display = 'block';
  if (document.getElementById("img"+id) != null) document.getElementById("cht"+id).removeChild(document.getElementById("img"+id));
}


// ******시간 처리
// 달력(popupCalendar.js에서 callback)
function calPress() {
  var tm = targetId.value;
  tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
  //console.log(targetId.name.toString().slice(2,targetId.name.length));

  var id = targetId.name.slice(targetId.name.indexOf("tm")+2,targetId.name.length);
  console.log(targetId.name + ":" + tm);

  // 발표시간 전체변경
  if (id == "Chg") {
    document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_arr[i] = tm;
      console.log("tm" + i + ":" + tm);
    }
  }
  // 발효시간 변경
  else if (id == 0) {
    tm_arr[parseInt(id)] = tm;
    fnTimeBar();
  }
  // 발표시간 변경
  else if (id == "fc") {
    tm_arr[1] = tm;
  }
  else {
    tm_arr[parseInt(id)] = tm;
  }

  tm_move('+0H', 0);
}

//  발표시간 입력 및 선택(id = 0:발효시간, 1~6:발표시간)
function tm_input(id) {
  onload_cnt = 0;
  if (id == -1) {
    var tm = document.getElementById("tmChg").value;
  }
  else {
    var tm = document.getElementById("tm"+id).value;
  }

  if (event.keyCode == 13) {
      if (tm.length != 16) {
          alert("시간 입력이 틀렸습니다. (년.월.일.시:분)");
          if (id == -1) {
            tm = tm_arr[1];
            document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          else {
            if (id == "fc") tm = tm_arr[1];
            else tm = tm_arr[id];
            document.getElementById("tm" + id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          return;
      }else if (tm.charAt(4) != "." || tm.charAt(7) != "." || tm.charAt(10) != "." || tm.charAt(13) != ":") {
          alert("시간 입력 양식이 틀렸습니다. (년.월.일.시:분)");
          if (id == -1) {
            tm = tm_arr[1];
            document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          else {
            if (id == "fc") tm = tm_arr[1];
            else tm = tm_arr[id];
            document.getElementById("tm" + id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          return;
      }else {
          var YY = tm.substring(0,4);
          var MM = tm.substring(5,7);
          var DD = tm.substring(8,10);
          var HH = tm.substring(11,13);
          var MI = tm.substring(14,16);

          err = 0;
          if (YY < 1990 || YY > 2100) err = 1;
          else if (MM < 1 || MM > 12) err = 2;
          else if (DD < 1 || DD > 31) err = 3;
          else if (HH < 0 || HH > 24) err = 4;
          else if (MI < 0 || MI > 60) err = 5;

          if (err > 0)
          {
            if      (err == 1) alert("년도가 틀렷습니다.(" + YY + ")");
            else if (err == 2) alert("월이 틀렸습니다.(" + MM + ")");
            else if (err == 3) alert("일이 틀렸습니다.(" + DD + ")");
            else if (err == 4) alert("시간이 틀렸습니다.(" + HH + ")");
            else if (err == 5) alert("분이 틀렸습니다.(" + MI + ")");

            if (id == -1) {
              tm = tm_arr[1];
              document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            }
            else {
              if (id == "fc") tm = tm_arr[1];
              else tm = tm_arr[id];
              document.getElementById("tm" + id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            }
            return;
          }
      }

      var HH = parseInt(tm.substring(11,13)/tm_itv)*parseInt(tm_itv);
      var MI = 0;
      tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + addZeros(HH,2) + addZeros(MI,2);
      if (id == -1) {
        document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
        for (var i=1; i<=ncht_max; i++) {
          document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          tm_arr[i] = tm;
          console.log("tm" + i + ":" + tm);
        }

        for (var i=1; i<=document.getElementById('window').value; i++) {
          doChtVal(i);
        }
      }
      else {
        document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
        if (id == "fc") tm_arr[1] = tm;
        else tm_arr[id] = tm;
        console.log("tm" + id + ":" + tm);

        if (id == 0) {
          fnTimeBar();
          for (var i=1; i<=document.getElementById('window').value; i++) {
            doChtVal(i);
          }
        }
        else if (id == "fc") doChtVal(1);
        else doChtVal(id);
      }
  }else if (event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 58) {
      event.returnValue = true;
  }else if (event.keyCode >= 48 && event.keyCode <= 57) {
      event.returnValue = true;
  }else {
      event.returnValue = false;
  }
}

//  최근시간(mode = 0:첫 로드 시 / id = 0:발효시간, 1~6:발표시간)
function tm_init(mode, id, callback) {
  if (id == 0) {
    var now = new Date();
    var HH = parseInt(now.getHours()/tm_itv)*parseInt(tm_itv);
    var tm = addZeros(now.getFullYear(),4) + addZeros(now.getMonth()+1,2) + addZeros(now.getDate(),2) + addZeros(HH,2) + addZeros(0,2);

    document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_arr[id] = tm;
    console.log("tm" + id + ":" + tm);
    if (mode == 1) {
      onload_cnt = 0;
      fnTimeBar();
      for (var i=1; i<=document.getElementById('window').value; i++) {
        doChtVal(i);
      }
    }
  }
  else {
    var url = host + "/cht_new/cht_swc_lib.php?mode=0&type=fc";
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      else {
        var line = xhr.responseText.split('\n');
        if (xhr.responseText.length <= 1 && line[0] == "") {
          return;
        }

        line.forEach(function(l) {
          if (l[0] == "#" || l.length <= 1) {
            return;
          }
          tm = l;
        });
      }

      if (id == -1) {
        document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
        for (var i=1; i<=ncht_max; i++) {
          document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          tm_arr[i] = tm;
          console.log("tm" + i + ":" + tm);
        }
 
        onload_cnt = 0;
        for (var i=1; i<=document.getElementById('window').value; i++) {
          doChtVal(i);
        }
      }
      else {
        document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
        if (id == "fc") tm_arr[1] = tm;
        else tm_arr[id] = tm;
        console.log("tm" + id + ":" + tm);

        if (mode == 0) {
          tm_init(0, 0);
        }
        fnTimeBar();
        if (mode == 0) {
          onload_cnt = 0;
          for (var i=1; i<=document.getElementById('window').value; i++) {
            doChtVal(i, 0);
          }
        }
        else {
          onload_cnt = 0;
          for (var i=1; i<=document.getElementById('window').value; i++) {
            doChtVal(i);
          }
        }
      }
    };
    xhr.send();
  }
}

// 시간 이동(id = 0:발효시간, 1~6:발표시간)
function tm_move(moving, id) {
  var n = moving.length - 1;
  var mode = moving.charAt(n);
  var value = parseInt(moving);

  if (id == -1) {
    var tm = document.getElementById("tmChg").value;
  }
  else {
    var tm = document.getElementById("tm"+id).value;
  }
  var YY = tm.substring(0,4);
  var MM = tm.substring(5,7);
  var DD = tm.substring(8,10);
  var HH = tm.substring(11,13);
  var MI = tm.substring(14,16);
  var date = new Date(YY, MM-1, DD, HH, MI);
  date.setTime(date.getTime() + value*60*60*1000);
  var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

  if (id == -1) {
    document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_arr[i] = tm;
      console.log("tm" + i + ":" + tm);
    }

    onload_cnt = 0;
    for (var i=1; i<=document.getElementById('window').value; i++) {
      doChtVal(i);
    }
  }
  else {
    document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);

    if (id == "fc") tm_arr[1] = tm;
    else tm_arr[id] = tm;
    console.log("tm" + id + ":" + tm);

    if (id == 0 && (cht_mode == "skew" || cht_mode == "crss_sct")) {
      onload_cnt = 0;
      fnTimeBar();
      for (var i=1; i<=document.getElementById('window').value; i++) {
        doChtVal(i, value);
      }
    }
    else {
      onload_cnt = 0;
      for (var i=1; i<=document.getElementById('window').value; i++) {
        doChtVal(i);
      }
    }
  }
}

// 숫자 자리수 맞춤
function addZeros(num, digit) {
  var zero = '';
  num = num.toString();
  if (num.length < digit) {
    for (var i=0; i < digit - num.length; i++) {
      zero += '0'
    }
  }
  return zero + num;
}

// 키보드를 통한 동화 조작(opt- 0: keydown, 1: keyup)
function doKey(event, opt)
{
  if (opt == 0) {
    if (event.srcElement.attributes.class != undefined) {
      if (event.srcElement.attributes.class.value.indexOf("TimeBox") != -1) return -1;
      if (event.srcElement.attributes.class.value.indexOf("prevent-keydown") != -1) return -1;
    }

    if (document.getElementById("loading").style.display == "block") {
      return 0;
    }

    if (cht_mode == "skew" || cht_mode == "crss_sct") {
      if (event.ctrlKey && cht_mode == "skew") {
        if(event.keyCode == 76) {   // Ctrl + L
          if (document.getElementById("autoload").checked == 1) {
            document.getElementById("autoload").checked = 0;
            autoload = 0;
          }
          else {
            document.getElementById("autoload").checked = 1;
            autoload = 1;
          }
        }
      }
      else {
        if(event.keyCode == 37) {        // 왼 화살표
          tm_move('-' + parseInt(tm_itv) + 'H', 0);
        }
        else if(event.keyCode == 39) {   // 오른 화살표
          tm_move('+' + parseInt(tm_itv) + 'H', 0);
        }
        else if(event.keyCode == 38) {   // 위 화살표
          if (tm_itv == 1) tm_move('+3H', 0);
          else tm_move('+6H', 0);
        }
        else if(event.keyCode == 40) {   // 아래 화살표
          if (tm_itv == 1) tm_move('-3H', 0);
          else tm_move('-6H', 0);
        }
        else if(event.keyCode == 78) {   // N (now)
          tm_init(1, 0);
        }
        else if(event.keyCode == 48) {   // 0 (발효시간 동기화)
          if (cht_mode == "skew" || cht_mode == "crss_sct") document.getElementById('tm0').value = document.getElementById('tm1').value;
          else document.getElementById('tm0').value = document.getElementById('tmfc').value;
          tm_move('+0H', 0);
        }
        else if(event.keyCode == 76 && cht_mode == "skew") {   // L
          loadImage();
        }
      }
    }

    if(event.keyCode == 116) {   // F5
      location.reload();
    }
  }

  return 0;
}

// Time Bar 생성
function fnTimeBar()
{
    var YY = tm_arr[1].substring(0,4);
    var MM = tm_arr[1].substring(4,6);
    var DD = tm_arr[1].substring(6,8);
    var HH = tm_arr[1].substring(8,10);
    var MI = tm_arr[1].substring(10,12);
    var date_fc = new Date(YY, MM-1, DD, HH, MI);

    var YY = tm_arr[0].substring(0,4);
    var MM = tm_arr[0].substring(4,6);
    var DD = tm_arr[0].substring(6,8);
    var HH = tm_arr[0].substring(8,10);
    var MI = tm_arr[0].substring(10,12);
    var date_ef = new Date(YY, MM-1, DD, HH, MI);
    var date = new Date;

    if (tm_st == 0) {
      date.setTime(date_ef.getTime() - tm_itv*3*60*60*1000);
      if (date.getTime() < date_fc.getTime()) {
        date.setTime(date_fc.getTime());
      }
      tm_st = date.getTime();
    }
    else {
      date.setTime(tm_st);
    }

    if (date_ef.getTime() < date.getTime() || date_ef.getTime() >= date.getTime() + tm_itv*24*60*60*1000 || date.getHours()%tm_itv != 0)
    {
      date.setTime(date_ef.getTime() - tm_itv*3*60*60*1000);
      tm_st = date.getTime();
    }

    for (var i=0; i<24; i++) {
      document.getElementById("time"+i).innerText = addZeros(date.getHours(),2);
      document.getElementById("time"+i).value = date.getTime();

      if (i==0 || parseInt(date.getHours())%24==0) {      
        document.getElementById("date"+i).innerText = addZeros(date.getDate(),2) + "일";
        document.getElementById("date"+i).style.borderLeft = "solid #888888 1px";
      }
      else {
        document.getElementById("date"+i).innerText = "";
        document.getElementById("date"+i).style.borderLeft = "";
      }

      if (date.getTime() == date_ef.getTime()) {
        document.getElementById("time"+i).style.backgroundColor = "#c4e3ff";
      }
      else {
        document.getElementById("time"+i).style.backgroundColor = "#ffffff";
      }

      date.setTime(date.getTime() + tm_itv*60*60*1000);
    }
}

// Time bar 클릭 이벤트
function tmbarClick(num)
{
  var date = new Date;
  date.setTime(document.getElementById("time"+num).value);

  var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);
  document.getElementById("tm0").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
  tm_arr[0] = tm;
  console.log("tm_ef" + ":" + tm);
  fnTimeBar();

  onload_cnt = 0;
  for (var i=1; i<=document.getElementById('window').value; i++) {
    doChtVal(i);
  }
}

// 저장된 이미지 불러오기 기능 선택
function save_sel()
{
  if (document.getElementById('save').value == 0) document.getElementById('save').value = 1;
  else document.getElementById('save').value = 0;
  tm_move('+0H', 0);
}

// API 로딩하기(+24H)
function loadImage(moving) {
  if (tm_itv == 1) {
    var ntime = 24;
  }
  else {
    var ntime = 8;
  }
  if (cht_mode == "crss_sct") ntime /= 2;

  var ncht = 0;
  var cnt = 0;
  var urls = [];

  for (var i=1; i<=document.getElementById('window').value; i++) {

    if (tm_itv == 1) {
      if (cht_mode == "skew" || cht_mode == "crss_sct") var mdl = document.getElementById('model'+i).value;
      else var mdl = document.getElementById('model').value;
      if (mdl == "GDAPS_KIM") mdl = "KIM_1H";
      else if (mdl == "GDAPS") mdl = "GDAPS_1H";
      else if (mdl == "ECMWF_H") mdl = "ECMWF_1H10G1";
    }
    else {
      if (cht_mode == "skew" || cht_mode == "crss_sct") var mdl = document.getElementById('model'+i).value;
      else var mdl = document.getElementById('model').value;
      if (mdl == "KIM_1H") mdl = "GDAPS_KIM";
      else if (mdl == "GDAPS_1H") mdl = "GDAPS";
      else if (mdl == "ECMWF_1H10G1") mdl = "ECMWF_H";
    }

    urls[i] = [];
    for (var j=1; j<=ntime; j++) {
      var YY = tm_arr[0].substring(0,4);
      var MM = tm_arr[0].substring(4,6);
      var DD = tm_arr[0].substring(6,8);
      var HH = tm_arr[0].substring(8,10);
      var MI = tm_arr[0].substring(10,12);
      var date_ef = new Date(YY, MM-1, DD, HH, MI);
      var date = new Date;
      if (moving < 0) date.setTime(date_ef.getTime() - tm_itv*j*60*60*1000);
      else if (moving == 0) {
        if (j <= parseInt(ntime/2)) date.setTime(date_ef.getTime() + tm_itv*(j-parseInt(ntime/2)-1)*60*60*1000);
        else date.setTime(date_ef.getTime() + tm_itv*(j-parseInt(ntime/2))*60*60*1000);
      }
      else date.setTime(date_ef.getTime() + tm_itv*j*60*60*1000);
      var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

      urls[i][j] = host + "/cht_new/cht_skew_lib.php?mode=1&tm_ef=" + tm + "&tm_fc=" + tm_arr[i] + "&cht_mode=" + cht_mode + "&save=1";// + document.getElementById('save').value;
      urls[i][j] += "&mdl=" + mdl + "&lat=" + document.getElementById('lat').value + "&lon=" + document.getElementById('lon').value;
      if (document.getElementById('sat').checked) urls[i][j] += "&sat=1"
      if (stn_id != 0) urls[i][j] += "&stn_id=" + stn_id;
      if (cht_mode == "crss_sct") {
        var data = document.getElementsByName("var");
        for (var k=0; k<data.length; k++) {
          if (data[k].checked == 1) {
            var varname = data[k].value;
            break;
          }
        }
        urls[i][j] += "&lat2=" + document.getElementById('lat2').value + "&lon2=" + document.getElementById('lon2').value + "&varname=" + varname;
      }
      ncht++;
    }
  }

  if (ncht > 0) {
    document.getElementById("loading").style.display = "block";
    document.getElementById('loadingbar').style.minWidth = "0px";
    document.getElementById('loadingnum').innerText = "로딩 진행상황(0%)";
    document.getElementById("loadingStatus").style.display = "block";
  }
  else {
    document.getElementById("loading").style.display = "none";
    return;
  }

  for (var i=1; i<=document.getElementById('window').value; i++) {
    for (var j=1; j<=ntime; j++) {
      get_cgi(urls[i][j], i, j);
    }
  }

  function get_cgi(url, i, j) {
    //console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      else {
        var line = xhr.responseText.split('\n');
        if (xhr.responseText.length <= 1 && line[0] == "") {
          return;
        }

        //console.log(line[0]);
        if (line[0][0] == "@" || line[0].indexOf(".png") != -1) {
          cnt++;
          document.getElementById('loadingbar').style.minWidth = parseFloat(cnt/ncht*100).toFixed(1) + "%";
          document.getElementById('loadingnum').innerText = "로딩 진행상황(" + parseFloat(cnt/ncht*100).toFixed(1) + "%)";
          if (cnt == ncht) {
            document.getElementById("loading").style.display = "none";
            document.getElementById("loadingStatus").style.display = "none";
          }
        }
        else setTimeout(get_api_result, ((i-1)*ntime+(j-1))*10, line[0]);
      }
    };
    xhr.send();
  }

  function get_api_result(url) {
    console.log(url);
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.timeout = 60000;
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      cnt++;
      document.getElementById('loadingbar').style.minWidth = parseFloat(cnt/ncht*100).toFixed(1) + "%";
      document.getElementById('loadingnum').innerText = "로딩 진행상황(" + parseFloat(cnt/ncht*100).toFixed(1) + "%)";
      if (cnt == ncht) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    };
    xhr.ontimeout = function () {
      console.log('ajax timeout');
      cnt++;
      if (cnt == ncht) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.onerror = function () {
      console.log('ajax error');
      cnt++;
      if (cnt == ncht) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.send();
  }

}

// 시계열 분포도 주요지점 옵션 생성
function fnInitStn() {
  var url = "http://" + location.hostname + "/REF/INI/reg_sort.ini";
  console.log(url);
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        var d = l.split(',');
        for (var i=0; i<reg_arr.length; i++) {
          for (var j=0; j<reg_arr[i].reg_id.length; j++) {
            if (d[1].indexOf(reg_arr[i].reg_id[j]) != -1) {
              var n = reg_arr[i].stn.length;
              reg_arr[i].stn[n] = {};
              reg_arr[i].stn[n].stn_id = d[3];
              reg_arr[i].stn[n].stn_ko = d[2];
              break;
            }
          }
        }
      });
    }

    console.log(reg_arr);

    var select_element = document.createElement("select");
    select_element.setAttribute('onchange', 'fnStnList(this.value);');
    select_element.classList.add("text3");
    select_element.style.height = "20px";
    for (var i=0; i<reg_arr.length; i++) {
      var opt_element = document.createElement("option");
      opt_element.value = reg_arr[i].reg_name;
      opt_element.innerText = reg_arr[i].reg_name;
      select_element.appendChild(opt_element); 
    }
    document.getElementById("tms_stn1").appendChild(select_element); 

    var select_element = document.createElement("select");
    //select_element.setAttribute('onchange', 'stn_id = this.value; console.log(stn_id); doChtVal();');
    select_element.id = "select_stn";
    select_element.classList.add("text3");
    select_element.style.height = "20px";
    document.getElementById("tms_stn2").appendChild(select_element); 
    fnStnList(0);
  };
  xhr.send();
}

// 시계열 분포도 주요지점 옵션 생성2
function fnStnList(reg_name) {  
  var item = document.getElementById("select_stn");
  while (item.hasChildNodes()) {
    item.removeChild(item.childNodes[0]);
  }

  for (var i=0; i<reg_arr.length; i++) {
    if (reg_arr[i].reg_name == reg_name || (reg_name == 0 && i == 0)) {
      for (var j=0; j<reg_arr[i].stn.length; j++) {
        if (reg_arr[i].stn[j].stn_id == -999) continue;
        var opt_element = document.createElement("option");
        opt_element.value = reg_arr[i].stn[j].stn_id;
        opt_element.innerText = reg_arr[i].stn[j].stn_ko + "(" + reg_arr[i].stn[j].stn_id + ")";
        document.getElementById("select_stn").appendChild(opt_element); 
      }
      break;
    }
  }
}

// 모델 비교
function mdl_comp(opt, mode) {
  // 체크박스 설정
  comp = opt;
  var data = document.getElementsByName("comp");
  for(var i = 0; i < data.length; i++) {
    if(data[i].checked == 1 && i+1 !== opt) data[i].checked = 0;
  }

  var checked = 0;
  for(var i = 0; i < data.length; i++) {
    if(data[i].checked == 1) checked++;
  }
  if (checked == 0) comp = 0;

  if (comp == 0 && mode == -1) {
    tm_move('+0H', 0);
    return;
  }

  if (cht_mode == "crss_sct") {
    var data = document.getElementsByName("var1");
    for (var i=0; i<data.length; i++) {
      if (data[i].checked == 1) {
        var varname = data[i].value;
        break;
      }
    }
  }

  switch (opt) {
    case 0:
      document.getElementById('window').value = 1;
      break;
    case 1:
      if (document.getElementById('window').value < 2) document.getElementById('window').value = 2;
      document.getElementById('model1').value = "GDAPS_KIM";
      document.getElementById('model2').value = "GDAPS";
      break;
    case 2:
      if (document.getElementById('window').value < 2) document.getElementById('window').value = 2;
      document.getElementById('model1').value = "GDAPS_KIM";
      document.getElementById('model2').value = "ECMWF_H";
      break;
    case 3:
      if (document.getElementById('window').value < 2) document.getElementById('window').value = 2;
      document.getElementById('model1').value = "GDAPS";
      document.getElementById('model2').value = "ECMWF_H";
      break;
    case 4:
      if (document.getElementById('window').value < 3) document.getElementById('window').value = 3;
      document.getElementById('model1').value = "GDAPS_KIM";
      document.getElementById('model2').value = "GDAPS";
      document.getElementById('model3').value = "ECMWF_H";
      break;
  } // end switch

  if (cht_mode == "crss_sct") {
    if (opt != 0) {
      var data = document.getElementsByName("var2");
      for (var i=0; i<data.length; i++) {
        if (data[i].value == varname) {
          data[i].checked = true;
          break;
        }
      }
    }

    if (opt == 4) {
      var data = document.getElementsByName("var3");
      for (var i=0; i<data.length; i++) {
        if (data[i].value == varname) {
          data[i].checked = true;
          break;
        }
      }
    }
  }

  doWindow(-1);
  //tm_move('+0H', 0);
}

// 전체변경/부가기능 이벤트
function fn_btnClick(func) {
  // 이벤트 창 실행/닫기
  if (func == 'tm') { 
    if (tmLayer.style.display == 'block') {
      tmLayer.style.display = 'none';
    }
    else {
      tmLayer.style.display = 'block';

      var tm = tm_arr[1];
      document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    }
  }
}

// 지점 위경도 가져오기
function fnStnLatLon() {
  ajaxStn++;
  var curAjaxNum = ajaxStn;
  var url = host + "/cht_new/cht_skew_lib.php?mode=2&stn_id=" + stn_id;
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == ajaxStn) {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        document.getElementById('lat').value = parseFloat(l.split(',')[0]).toFixed(2);
        document.getElementById('lon').value = parseFloat(l.split(',')[1]).toFixed(2);
      });
    }
  };
  xhr.send();
}

//////////////////////////////////////////////////////////////////////////////////////////
//  GIS 제어
//////////////////////////////////////////////////////////////////////////////////////////
//  지도 생성
function map_init(area) {
  //var n = area_info.findIndex(function(x){return x.area == cht_area});
  //area_info[n].zoom_x = zoom_x;
  //area_info[n].zoom_y = zoom_y;
  //area_info[n].zoom_level = zoom_level;
  //area_info[n].center = gis_center;

  var map_attrs = {};
  var n = area_info.findIndex(function(x){return x.area == area});
  //zoom_x = area_info[n].zoom_x;
  //zoom_y = area_info[n].zoom_y;
  //zoom_level = area_info[n].zoom_level;
  map_attrs = area_info[n].map_attrs;
  map_attrs.center = area_info[n].center;

  //if (area == "E10") {
  //  zoom_x = '5400000';
  //  zoom_y = '5400000';
  //  zoom_level = 2;
  //  map_attrs.center = [37.069424, 124.848145];
  //}

  cht_area = area;
  if (cht_area == "E10") {
    var map_size = 260;
  }
  else {
    var map_size = 300;
  }

  var map_crs = new L.Proj.CRS(map_attrs.crs, map_attrs.proj4string,
                      { resolutions: map_attrs.resolutions }
                );

  if (cht_area == "EA_CHT") {
    NX = 9640;  NY = 6760;
  }
  else if (cht_area == "TP") {
    NX = 11200;  NY = 6880;
  }
  else if (cht_area == "E10") {
    NX = 3600;  NY = 3600;
  }
  else if (cht_area == "NHEM") {
    NX = 1000;  NY = 1000;
  }
  else if (cht_area == "WORLD") {
    NX = 1000;  NY = 500;
  }
  document.getElementById('map').style.width = map_size + "px";
  document.getElementById('map').style.height = parseInt(map_size*NY/NX) + "px";

  if (map == null) {
    map = L.map('map', {
        maxZoom: map_attrs.zoom.max, //6,
        minZoom: map_attrs.zoom.min, //0,
        crs: map_crs,
        continuousWorld: false,
        worldCopyJump: false,
        inertia: false,
        keyboard: false,
        attributionControl: false
    }).setView(map_attrs.center, zoom_level, {animate:false});
    map.doubleClickZoom.disable();

    // pane 추가
    var mapPaneName1 = "world";
    var mapPaneName2 = "lake";
    var mapPaneName3 = "image";
    var mapPaneName4 = "borderline";
    var mapPaneName5 = "marker";

    // pane layer 생성
    map.createPane(mapPaneName1);
    map.createPane(mapPaneName2);
    map.createPane(mapPaneName3);
    map.createPane(mapPaneName4);
    map.createPane(mapPaneName5);

    // pane layer z-inex set
    map.getPane(mapPaneName1).style.zIndex = 0;
    map.getPane(mapPaneName2).style.zIndex = 10;
    map.getPane(mapPaneName3).style.zIndex = 50;
    map.getPane(mapPaneName4).style.zIndex = 100;
    map.getPane(mapPaneName5).style.zIndex = 150;

    // pane layer 마우스 및 클릭 이벤트
    map.getPane(mapPaneName1).style.pointerEvents = 'none';
    map.getPane(mapPaneName2).style.pointerEvents = 'none';
    map.getPane(mapPaneName3).style.pointerEvents = 'none';
    map.getPane(mapPaneName4).style.pointerEvents = 'none';
    map.getPane(mapPaneName5).style.pointerEvents = 'none';

    canvas1 = L.canvas({pane: "world"});
    canvas2 = L.canvas({pane: "lake"});
    canvas3 = L.canvas({pane: "borderline", padding: 1.5});
    canvas4 = L.canvas({pane: "marker"});

    fnGeoJson();

    graticule1 = L.graticule({ interval:20, style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3 });
    graticule2 = L.graticule({ interval:10, style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3 }).addTo(map);
    graticule3 = L.graticule({ interval:5,  style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3 });

    markerLayer = L.layerGroup().addTo(map);

    map.on('zoomstart', removeImg);
    map.on('zoomend', calcZoomArea);
    map.on('dragend', calcZoomArea);
    map.on('click', img_click);
/*
    map.on('dragend', calcZoomArea);
    map.on('moveend', fnSetPosition);
    map.on("mousemove", function(e) {
      var curLat = Number(e.latlng.lat);
      var curLon = Number(e.latlng.lng);

      document.getElementById('lat').value = (curLat).toFixed(2);
      document.getElementById('lon').value = (curLon).toFixed(2);
    })
    map.on('click', img_click);
*/
  }
  else {
    removeImg();
    disableRuler();
    if (geojsonVectorTile != undefined && geojsonVectorTile._leaflet_id != undefined) {
      map.removeLayer(geojsonVectorTile);
    }
    if (geojsonVectorFillTile != undefined && geojsonVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(geojsonVectorFillTile);
    }
    if (lakeVectorTile != undefined && lakeVectorTile._leaflet_id != undefined) {
      map.removeLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined && lakeVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined && koreaVectorTile._leaflet_id != undefined) {
      map.removeLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined && koreaVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(koreaVectorFillTile);
    }
    if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
      map.removeLayer(koreaCityVectorTile);
    }
    if (geojsonWorldVectorTile != undefined && geojsonWorldVectorTile._leaflet_id != undefined) {
      map.removeLayer(geojsonWorldVectorTile);
    }
    if (geojsonWorldVectorFillTile != undefined && geojsonWorldVectorFillTile._leaflet_id != undefined) {
      map.removeLayer(geojsonWorldVectorFillTile);
    }

    map.options.crs = map_crs;
    //map.fire('viewreset');
    //map.invalidateSize();

    n = area_info.findIndex(function(x){return x.area == area});
    if (gis_proj4 != area_info[n].map_attrs.proj4string) {
      gis_proj4 = area_info[n].map_attrs.proj4string;
      if (cht_area == "WORLD") {
        if (world_lon == undefined) {
          world_lon = 126.0;
          geojsonWorldData = sliceGeojson(geojsonData, world_lon);
        }

        fnGeoBounds(map, geojsonWorldData);
      }
      else {
        fnGeoBounds(map, geojsonData);
      }
      fnGeoBounds(map, lakeData);
      fnGeoBounds(map, koreaData);
      fnGeoBounds(map, koreaCityData);
    }

    map.fire('viewreset');
    map.invalidateSize();
    stop_flag = true;
    map.setView(map_attrs.center, zoom_level, {animate:false});

    //fnLayer();
    //doSubmit();
  }
}

function fnGeoJson() {
  var url = "/lsp/htdocs/data/custom.geo.50m.json";
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.timeout = 60000;
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else {
      geojsonData = JSON.parse(xhr.responseText);
      geojsonWorldData = JSON.parse(xhr.responseText);

      fnGeoBounds(map, geojsonData);
      geojsonVectorTile = fnGeoTile(map, geojsonData, "borderline", "geojson", false, "#000");
      geojsonVectorTile.addTo(map);
      geojsonVectorFillTile = fnGeoTile(map, geojsonData, "world", "geojsonfill", true, "#ffffe5");
      geojsonVectorFillTile.addTo(map);
    }
  };
  xhr.send();

  var url2 = "/lsp/htdocs/data/lake.json";
  var xhr2 = new XMLHttpRequest();
  xhr2.open("GET", url2, true);
  xhr2.timeout = 60000;
  xhr2.onreadystatechange = function () {
    if (xhr2.readyState != 4 || xhr2.status != 200) return;
    else {
      lakeData = JSON.parse(xhr2.responseText);

      fnGeoBounds(map, lakeData);
      lakeVectorTile = fnGeoTile(map, lakeData, "borderline", "lake", false, "#000");
      lakeVectorTile.addTo(map);
      lakeVectorFillTile = fnGeoTile(map, lakeData, "lake", "lakefill", true, "#e5ffff");
      lakeVectorFillTile.addTo(map);
    }
  };
  xhr2.send();

  var url3 = "/lsp/htdocs/data/korea_metropolitan.json";
  var xhr3 = new XMLHttpRequest();
  xhr3.open("GET", url3, true);
  xhr3.timeout = 60000;
  xhr3.onreadystatechange = function () {
    if (xhr3.readyState != 4 || xhr3.status != 200) return;
    else {
      koreaData = JSON.parse(xhr3.responseText);

      fnGeoBounds(map, koreaData);
      koreaVectorTile = fnGeoTile(map, koreaData, "borderline", "korea", false, "#000");
      koreaVectorTile.addTo(map);
      koreaVectorFillTile = fnGeoTile(map, koreaData, "world", "koreafill", true, "#ffffe5");
      koreaVectorFillTile.addTo(map);
    }
  };
  xhr3.send();

  var url4 = "/lsp/htdocs/data/korea_city.json";
  var xhr4 = new XMLHttpRequest();
  xhr4.open("GET", url4, true);
  xhr4.timeout = 60000;
  xhr4.onreadystatechange = function () {
    if (xhr4.readyState != 4 || xhr4.status != 200) return;
    else {
      koreaCityData = JSON.parse(xhr4.responseText);

      fnGeoBounds(map, koreaCityData);
      koreaCityVectorTile = fnGeoTile(map, koreaCityData, "borderline", "koreacity", false, "gray");
      fnLayer();
    }
  };
  xhr4.send();
}

// GeoJson 범위값 구하기
function fnGeoBounds(map, geojson) {
  gis_resolution = 1/map.options.crs._scales[0];

  for (var i=0; i<geojson.features.length; i++) {
    var xmax = null;
    var ymax = null;
    var xmin = null;
    var ymin = null;

    if (geojson.features[i].geometry.type == "MultiPolygon") {
      for (var j=0; j<geojson.features[i].geometry.coordinates.length; j++) {
        for (var k=0; k<geojson.features[i].geometry.coordinates[j].length; k++) {
          for (var l=0; l<geojson.features[i].geometry.coordinates[j][k].length; l++) {
            if (geojson.features[i].geometry.coordinates[j][k][l][1] >= 90) {
              geojson.features[i].geometry.coordinates[j][k][l][1] = 89.999999;
            }

            if (geojson.features[i].geometry.coordinates[j][k][l][1] <= -90) {
              geojson.features[i].geometry.coordinates[j][k][l][1] = -89.999999;
            }

            var point = map.project(L.latLng([geojson.features[i].geometry.coordinates[j][k][l][1], geojson.features[i].geometry.coordinates[j][k][l][0]]), 0);

            if (xmax <= point.x || xmax === null) {
              xmax = point.x;
            }

            if (xmin >= point.x || xmin === null) {
              xmin = point.x;
            }

            if (ymax <= point.y || ymax === null) {
              ymax = point.y;
            }

            if (ymin >= point.y || ymin === null) {
              ymin = point.y;
            }
          }
        }
      }

      geojson.features[i].properties.xmax = xmax;
      geojson.features[i].properties.xmin = xmin;
      geojson.features[i].properties.ymax = ymax;
      geojson.features[i].properties.ymin = ymin;
    }
    else if (geojson.features[i].geometry.type == "Polygon") {
      for (var j=0; j<geojson.features[i].geometry.coordinates.length; j++) {
        for (var k=0; k<geojson.features[i].geometry.coordinates[j].length; k++) {
          if (geojson.features[i].geometry.coordinates[j][k][1] >= 90) {
            geojson.features[i].geometry.coordinates[j][k][1] = 89.999999;
          }

          if (geojson.features[i].geometry.coordinates[j][k][1] <= -90) {
            geojson.features[i].geometry.coordinates[j][k][1] = -89.999999;
          }

          var point = map.project(L.latLng([geojson.features[i].geometry.coordinates[j][k][1], geojson.features[i].geometry.coordinates[j][k][0]]), 0);

          if (xmax <= point.x || xmax === null) {
            xmax = point.x;
          }

          if (xmin >= point.x || xmin === null) {
            xmin = point.x;
          }

          if (ymax <= point.y || ymax === null) {
            ymax = point.y;
          }

          if (ymin >= point.y || ymin === null) {
            ymin = point.y;
          }
        }
      }

      geojson.features[i].properties.xmax = xmax;
      geojson.features[i].properties.xmin = xmin;
      geojson.features[i].properties.ymax = ymax;
      geojson.features[i].properties.ymin = ymin;
    }

  }

  return geojson;
}

function fnGeoTile(map, data, pane, tag, fill, color) {
  if (pane != null) {
    var tiles = new L.GridLayer({tileSize:1024, pane:pane});
  }
  else {
    var tiles = new L.GridLayer({tileSize:1024});
  }

  tiles.createTile = function(coords) {
    //console.log(tag, coords);
    var tile = L.DomUtil.create('canvas', 'leaflet-tile');
    var size = this.getTileSize();
    var ctx = tile.getContext('2d');
    tile.width = size.x;
    tile.height = size.y;
    //let offscreen = tile.transferControlToOffscreen();
  
    // calculate projection coordinates of top left tile pixel
    var nwPoint = coords.scaleBy(size)
    var ratio = gis_resolution*map.options.crs._scales[coords.z];

    for (var i=0; i<data.features.length; i++) {
      var xmin = data.features[i].properties.xmin*ratio;
      var ymin = data.features[i].properties.ymin*ratio;

      var xmax = data.features[i].properties.xmax*ratio;
      var ymax = data.features[i].properties.ymax*ratio;

      if (xmax < nwPoint.x || xmin > nwPoint.x + tile.width || ymax < nwPoint.y || ymin > nwPoint.y + tile.height) {
        continue;
      }

      if ((tag == "geojson" || tag == "geojsonworld") && data.features[i].properties.admin != undefined && data.features[i].properties.admin.indexOf("Korea") != -1) {
        continue;
      }
      else drawTile(tile, ctx, coords, i, nwPoint, fill, color);
    }

    return tile;
  }

  function drawTile(tile, ctx, coords, i, nwPoint, fill, color) {
    var tolerance = 0.5;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;

    if (color == "gray" || color == "#222") {
      ctx.lineWidth = 0.4;
    }
    else {
      ctx.lineWidth = 1.0;
    }
    if (cht_area == "NHEM" || cht_area == "WORLD") {
      ctx.lineWidth *= 0.5;
    }
    ctx.beginPath();

    if (data.features[i].geometry.type == "MultiPolygon") {
      for (var j=0; j<data.features[i].geometry.coordinates.length; j++) {
        for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
          var polygon = [];
          for (var l=0; l<data.features[i].geometry.coordinates[j][k].length; l++) {
            var point = map.project(L.latLng([data.features[i].geometry.coordinates[j][k][l][1], data.features[i].geometry.coordinates[j][k][l][0]]), coords.z);
            polygon.push(point);

            //if (l==0) {
            //  ctx.moveTo(point.x - nwPoint.x, point.y - nwPoint.y);
            //}
            //else {
            //  ctx.lineTo(point.x - nwPoint.x, point.y - nwPoint.y);
            //}
          }

          //if (data.features[i].properties.NAME_0 != undefined && data.features[i].properties.NAME_0 == "North Korea") {
            polygon = L.LineUtil.simplify(polygon, tolerance);
          //}

          for (var n = 0; n < polygon.length; n ++) {
            if (n==0) {
              ctx.moveTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
            }
            else {
              ctx.lineTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
            }
          }
        }
      }
    }
    else if (data.features[i].geometry.type == "Polygon") {
      for (var j=0; j<data.features[i].geometry.coordinates.length; j++) {
        var polygon = [];
        for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
          var point = map.project(L.latLng([data.features[i].geometry.coordinates[j][k][1], data.features[i].geometry.coordinates[j][k][0]]), coords.z);
          polygon.push(point);

          //if (k==0) {
          //  ctx.moveTo(point.x - nwPoint.x, point.y - nwPoint.y);
          //}
          //else {
          //  ctx.lineTo(point.x - nwPoint.x, point.y - nwPoint.y);
          //}
        }

        //if (data.features[i].properties.NAME_0 != undefined && data.features[i].properties.NAME_0 == "North Korea") {
          polygon = L.LineUtil.simplify(polygon, tolerance);
        //}

        for (var n = 0; n < polygon.length; n++) {
          if (n==0) {
            ctx.moveTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
          }
          else {
            ctx.lineTo(polygon[n].x - nwPoint.x, polygon[n].y - nwPoint.y);
          }
        }
      }
    }

    ctx.closePath();
    if (fill == true) {
      ctx.fill();
    }
    else {
      ctx.stroke();
    }
  }

  return tiles;
}

// GeoJson 경도선 기준으로 자르기
function sliceGeojson(geojson, lon_0) {
  var data = JSON.parse(JSON.stringify(geojson));
  lon_0 -= 180.0;
  if (lon_0 < -180.0) {
    lon_0 += 360.0;
  }

  var ok;

  for (var i=0; i<data.features.length; i++) {
    for (var j=0; j<data.features[i].geometry.coordinates.length; j++) {
      for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
        if (data.features[i].geometry.type == "MultiPolygon") {
          ok = 0;
          for (var l=0; l<data.features[i].geometry.coordinates[j][k].length; l++) {
            if (l == 0) continue;
            else if (data.features[i].geometry.coordinates[j][k][l-1][0] >= lon_0 && data.features[i].geometry.coordinates[j][k][l][0] < lon_0) {
              ok = 1;
              break;
            }
          }

          if (ok == 1) {
            var n1 = data.features[i].geometry.coordinates[j].length;
            data.features[i].geometry.coordinates[j][n1] = [];
            for (var l=0; l<data.features[i].geometry.coordinates[j][k].length; l++) {
              if (data.features[i].geometry.coordinates[j][k][l][0] >= lon_0) {
                var n2 = data.features[i].geometry.coordinates[j][n1].length;
                data.features[i].geometry.coordinates[j][n1][n2] = data.features[i].geometry.coordinates[j][k][l];
                data.features[i].geometry.coordinates[j][k].splice(l,1);
                l--;
              }
            }
          }
        }
        else if (data.features[i].geometry.type == "Polygon") {
          if (k==0) continue;
          else if (data.features[i].geometry.coordinates[j][k-1][0] >= lon_0 && data.features[i].geometry.coordinates[j][k][0] < lon_0) {
           ok = 1;
           break;
          }
        }
      }


      if (ok == 1 && data.features[i].geometry.type == "Polygon") {
        var polygon1 = [];
        var polygon2 = [];

        for (var k=0; k<data.features[i].geometry.coordinates[j].length; k++) {
          var n1 = polygon1.length;
          var n2 = polygon2.length;
          if (data.features[i].geometry.coordinates[j][k][0] >= lon_0) {
            polygon1[n1] = data.features[i].geometry.coordinates[j][k];
          }
          else {
            polygon2[n2] = data.features[i].geometry.coordinates[j][k];
          }
          data.features[i].geometry.coordinates[j].splice(k,1)
          k--;
        }

        data.features[i].geometry.type = "MultiPolygon";
        data.features[i].geometry.coordinates[j][0] = polygon1;
        data.features[i].geometry.coordinates[j][1] = polygon2;
      }
    }
  }

  return data;
}

// 연직단면도 단면 위치 표출
function crss_latlon_draw(lat, lon, lat2, lon2) {
  markerLayer.clearLayers();

  for (var i=0; i<=5; i++) {
    var point = L.latLng(parseFloat(lat) + (parseFloat(lat2) - parseFloat(lat))/5.*parseFloat(i), parseFloat(lon) + (parseFloat(lon2) - parseFloat(lon))/5.*parseFloat(i));
    if (i == 0) {
      var circle = L.circleMarker(point, {color: 'red', radius: 1, pane:"marker", interactive:false});
      var text = L.marker(point, {icon: L.divIcon({html: "A", className: 'marker-tip', iconAnchor:[5,20]}), pane:"marker", interactive:false});
    }
    else if (i == 5) {
      var circle = L.circleMarker(point, {color: 'red', radius: 1, pane:"marker", interactive:false});
      var text = L.marker(point, {icon: L.divIcon({html: "B", className: 'marker-tip', iconAnchor:[5,20]}), pane:"marker", interactive:false});
    }
    else {
      var circle = L.circleMarker(point, {color: 'blue', radius: 1, pane:"marker", interactive:false});
      var text = L.marker(point, {icon: L.divIcon({html: i, className: 'marker-interval', iconAnchor:[5,20]}), pane:"marker", interactive:false});
    }
    markerLayer.addLayer(circle);
    markerLayer.addLayer(text);
  }

  if (init == 0) {
    for (var i = 0; i < 7; i++) {
      var zx = (parseInt)(zoom_x.charAt(i));
      var zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
    }
    zoom_level = i;

    var img = {};
    var NX, NY;
    var point = {};

    if (cht_area == "EA_CHT") {
      NX = 9640;  NY = 6760;
      img.width = NX;
      img.height = NY;
      point.xx = NX/2.;
      point.yy = NY/2.;
      var offset = pixel_to_LatLon_lamc(img,point,1);
    }
    else if (cht_area == "TP") {
      NX = 11200;  NY = 6880;
      img.width = NX;
      img.height = NY;
      point.xx = NX/2.;
      point.yy = NY/2.;
      var offset = pixel_to_LatLon_lamc(img,point,1);
    }
    else if (cht_area == "E10") {
      NX = 3600;  NY = 3600;
      img.width = NX;
      img.height = NY;
      point.xx = NX/2.;
      point.yy = NY/2.;
      var offset = pixel_to_LatLon_lamc(img,point,1);
    }
    else if (cht_area == "NHEM") {
      var PI = Math.asin(1.0)*2.0;
      var ea = 6378.138;              // 장반경 (km)
      NX = NY = ea*2*PI/2;
      img.width = NX;
      img.height = NY;
      point.xx = NX/2.;
      point.yy = NY/2.;
      var offset = pixel_to_LatLon_ster(img,point,1);
    }
    else if (cht_area == "WORLD") {
      var PI = Math.asin(1.0)*2.0;
      var ea = 6378.138;              // 장반경 (km)
      NX = ea*2*PI;
      NY = ea*PI;
      img.width = NX;
      img.height = NY;
      point.xx = NX/2.;
      point.yy = NY/2.;
      var offset = pixel_to_LatLon_eqdc(img,point,1);
    }

    var center = {};
    center.lng = offset.lon;
    center.lat = offset.lat;
    map.setView(center, zoom_level, {animate:false});

    init = 1;
  }

  //console.log(map.distance(L.latLng(lat, lon), L.latLng(lat2, lon2))/1000., 1/map.options.crs._scales[map.getZoom()]);
}

function fnLayer() {
  if (cht_area == "WORLD") {
    if (geojsonWorldVectorTile == undefined) {
      geojsonWorldVectorTile = fnGeoTile(map, geojsonWorldData, "borderline", "geojsonworld", false, "#000");
      geojsonWorldVectorFillTile = fnGeoTile(map, geojsonWorldData, "world", "geojsonworldfill", true, "#ffffe5");
    }

    if (geojsonWorldVectorTile != undefined) {
      map.addLayer(geojsonWorldVectorTile);
    }
    if (geojsonWorldVectorFillTile != undefined) {
      map.addLayer(geojsonWorldVectorFillTile);
    }
    if (lakeVectorTile != undefined) {
      map.addLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined) {
      map.addLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined) {
      map.addLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined) {
      map.addLayer(koreaVectorFillTile);
    }
  }
  else {
    if (geojsonVectorTile != undefined) {
      map.addLayer(geojsonVectorTile);
    }
    if (geojsonVectorFillTile != undefined) {
      map.addLayer(geojsonVectorFillTile);
    }
    if (lakeVectorTile != undefined) {
      map.addLayer(lakeVectorTile);
    }
    if (lakeVectorFillTile != undefined) {
      map.addLayer(lakeVectorFillTile);
    }
    if (koreaVectorTile != undefined) {
      map.addLayer(koreaVectorTile);
    }
    if (koreaVectorFillTile != undefined) {
      map.addLayer(koreaVectorFillTile);
    }
  }

  if (cht_area == "NHEM" || cht_area == "WORLD") {
    if (zoom_level >= 4) {
      map.removeLayer(graticule1);
      map.removeLayer(graticule2);
      map.addLayer(graticule3);

      if (koreaCityVectorTile != undefined) {
        koreaCityVectorTile.addTo(map);
      }
    }
    else if (zoom_level >= 2) {
      map.removeLayer(graticule1);
      map.removeLayer(graticule3);
      map.addLayer(graticule2);

      if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
        map.removeLayer(koreaCityVectorTile);
      }
    }
    else {
      map.removeLayer(graticule2);
      map.removeLayer(graticule3);
      map.addLayer(graticule1);

      if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
        map.removeLayer(koreaCityVectorTile);
      }
    }
  }
  else {
    if (zoom_level > 2 || (cht_area == "E10" && zoom_level >= 2)) {
      map.removeLayer(graticule1);
      map.removeLayer(graticule2);
      map.addLayer(graticule3);

      if (koreaCityVectorTile != undefined) {
        koreaCityVectorTile.addTo(map);
      }
    }
    else {
      map.removeLayer(graticule1);
      map.removeLayer(graticule3);
      map.addLayer(graticule2);

      if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
        map.removeLayer(koreaCityVectorTile);
      }
    }
  }
}

// ********부가기능
// 위.경도 변환
var PI = Math.asin(1.0)*2.0;
var DEGRAD = PI/180.0;
var RADDEG = 180.0/PI;

var ea = 6378.138;              // 장반경 (km)
var f  = 1.0/298.257223563;     // 편평도 : (장반경-단반경)/장반경
var ep = Math.sqrt(2.0*f - f*f);

// LCC
var slat1 = 30. * DEGRAD;
var slat2 = 60. * DEGRAD;
var olon = 126. * DEGRAD;
var olat = 38. * DEGRAD;

var m1 = Math.cos(slat1)/Math.sqrt(1.0-ep*ep*Math.sin(slat1)*Math.sin(slat1));
var m2 = Math.cos(slat2)/Math.sqrt(1.0-ep*ep*Math.sin(slat2)*Math.sin(slat2));
var t1 = Math.tan(PI*0.25 - slat1*0.5)/Math.pow((1.0-ep*Math.sin(slat1))/(1.0+ep*Math.sin(slat1)), ep*0.5);
var t2 = Math.tan(PI*0.25 - slat2*0.5)/Math.pow((1.0-ep*Math.sin(slat2))/(1.0+ep*Math.sin(slat2)), ep*0.5);

var sn = (Math.log(m1) - Math.log(m2))/(Math.log(t1) - Math.log(t2));
var sf = m1/(sn*Math.pow(t1, sn));

// 북반구
var EPSLN = 1.0e-10;
var slon = 120. * DEGRAD;
var slat = 90. * DEGRAD;

var cons = Math.sqrt(Math.pow(1+ep,1+ep)*Math.pow(1-ep,1-ep));
if (Math.abs(Math.cos(slat)) > EPSLN) {
  var ms1 = Math.cos(slat) / Math.sqrt(1-ep*Math.sin(slat)*ep*Math.sin(slat)); 
  var x0 = 2*Math.atan(Math.tan(0.5*(PI/2 + slat) * Math.pow((1-Math.sin(slat)*ep)/(1+Math.sin(slat)*ep), ep*0.5))) - PI/2;
}

if (slat > 0) con = 1;
else con = -1;

// 위경도 변환(lcc)
function pixel_to_LatLon_lamc(img,point,opt) {
  var map   = cht_area;
  var top   = 0;
  var bot   = 0;
  var left  = 0;
  var right = 0; //if (document.getElementById("varn").value.indexOf("bias") != -1) right = 70;
  var SX, SY, NX, NY;

  var RIGHT_pixel = parseFloat(right); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);
  if (map == "EA_CHT") {
    SX = 5680;  SY = 2960;  NX = 9640;  NY = 6760;
  }
  else if (map == "H4") {
    SX = 2800;  SY = 2800;  NX = 4800;  NY = 4800;
  }
  else if (map == "E10") {
    SX = 1800;  SY = 1800;  NX = 3600;  NY = 3600;
  }
  else if (map == "TP") {
    SX = 4000;  SY = 4640;  NX = 11200;  NY = 6880;
  }
  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;

  if (opt != -1) {
    for (var i = 0; i < 7; i++, zm *= 1.5) {
      zx = (parseInt)(zoom_x.charAt(i));
      zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
      xo += (parseFloat)(NX/24.0*(zx-1)/zm);
      yo += (parseFloat)(NY/24.0*(zy-1)/zm);
    }
  }
  grid /= zm;
  xo = (SX - xo)*zm;
  yo = (SY - yo)*zm;

  var re = ea/grid;
  var t0 = Math.tan(PI*0.25 - olat*0.5)/Math.pow((1.0-ep*Math.sin(olat))/(1.0+ep*Math.sin(olat)), ep*0.5);
  var ro = re*sf*Math.pow(t0, sn);

  var result = new Object();

  if (opt == 0 || opt == -1) {
    t0 = Math.tan(PI*0.25 - (point.lat)*DEGRAD*0.5)/Math.pow((1.0-ep*Math.sin((point.lat)*DEGRAD))/(1.0+ep*Math.sin((point.lat)*DEGRAD)), ep*0.5);
    var ra = re*sf*Math.pow(t0, sn);
    var theta = sn*((point.lon)*DEGRAD - olon);

    result.x = (ra*Math.sin(theta) + xo)/(NX/img_NI);
    result.y = (ro - ra*Math.cos(theta) + yo)/(NY/img_NJ);
    result.y = img_NJ - (result.y - img_OJ);
    //result.y += TOP_pixel;

    if (opt != -1) {
      if (result.y < img_OJ || result.y > (img_NJ+img_OJ)) return;    // 제목표시줄
      if (result.x > img_NI || result.x <= 0) return;    // 범례
      //console.log('x:' + result.x + ', y:' + result.y);
    }
  }
  else {
    var xn = X - xo;
    var yn = ro - Y + yo;
    var ra = Math.sqrt(xn*xn+yn*yn);
    if (sn < 0.0) ra = -1*ra;

    t0 = Math.pow(ra/(re*sf), 1.0/sn);
    var alat = PI*0.5 - 2.0*Math.atan(t0);

    for (i=0; i<5; i++) {
      alat = PI*0.5 - 2.0*Math.atan(t0*Math.pow((1.0-ep*Math.sin(alat))/(1.0+ep*Math.sin(alat)), ep*0.5));
    }

    var alon = Math.atan2(xn, yn)/sn + olon;

    result.lat = alat*RADDEG;
    result.lon = alon*RADDEG;

    //console.log('lat:' + result.lat + ', lon:' + result.lon);
  }

  return result;
}

// 위경도 변환(북반구)
function pixel_to_LatLon_ster(img,point,opt) {
  var map   = cht_area;
  var top   = 0;
  var bot   = 0;
  var left  = 0;
  var right = 0; //if (document.getElementById("varn").value.indexOf("bias") != -1) right = 70;
  var SX, SY, NX, NY;
  var ts, ce, chi, phi, dphi;

  var RIGHT_pixel = parseFloat(right); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);

  NX = NY = ea*2*PI/2;
  SX = SY = ea*PI/2;
  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;
  
  if (opt != -1) {
    for (var i = 0; i < 7; i++, zm *= 1.5) {
      zx = (parseInt)(zoom_x.charAt(i));
      zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
      xo += (parseFloat)(NX/24.0*(zx-1)/zm);
      yo += (parseFloat)(NY/24.0*(zy-1)/zm);
    }
  }
  grid /= zm;
  xo = (SX - xo)*zm;
  yo = (SY - yo)*zm;

  var re = ea/grid;
  var result = new Object();

  if (opt == 0 || opt == -1) {
    var alat = point.lat*DEGRAD;
    var alon = point.lon*DEGRAD - slon;

    if (Math.abs(Math.cos(slat)) <= EPSLN) {

      var ts = Math.tan(0.5*(PI/2 - alat*con)) / (Math.pow(((1-ep*con*Math.sin(alat))/(1+ep*con*Math.sin(alat))), 0.5*ep));
      var ra = 2 * ts / cons;

      result.x = re*ra*Math.sin(alon) + xo;
      result.y = -con*re*ra*Math.cos(alon) + yo;
    }
    else {
      x1 = 2*Math.atan(Math.tan(0.5*(PI/2 + alat) * Math.pow((1-Math.sin(alat)*ep)/(1+Math.sin(alat)*ep), ep*0.5))) - PI/2;

      if (Math.abs(Math.sin(slat)) <= EPSLN) {
        ak = 2 / (1 + Math.cos(x1)*Math.cos(alon));
        result.y = re*ak*Math.sin(x1);
      }
      else {
        ak = 2 * ms1 / (Math.cos(x0)*(1+Math.sin(x0)*Math.sin(x1) + Math.cos(x0)*Math.cos(x1)*Math.cos(alon)));
        result.y = re*ak*(Math.cos(x0)*Math.sin(x1) - Math.sin(x0)*Math.cos(x1)*Math.cos(alon)) + yo;
      }
      result.x = re*ak*Math.cos(x1)*Math.sin(alon) + xo;
    }

    result.x /= (NX/img_NI);
    result.y /= (NY/img_NJ);
    result.y = img_NJ - (result.y - img_OJ);
    //result.y += TOP_pixel;

    if (opt != -1) {
      if (result.y < img_OJ || result.y > (img_NJ+img_OJ)) return;    // 제목표시줄
      if (result.x > img_NI || result.x <= 0) return;    // 범례
      //console.log('x:' + result.x + ', y:' + result.y);
    }
  }
  else {
    var xn = X - xo;
    var yn = Y - yo;
    var ra = Math.sqrt(xn*xn + yn*yn);

    if (Math.abs(Math.cos(slat)) <= EPSLN) {
      if (ra <= EPSLN) {
        result.lon = slon*RADDEG;
        result.lat = slat*RADDEG;        
        return result;
      }
      xn *= con;
      yn *= con;
      ts = ra * cons / (2*re);
      phi = PI/2 - 2*Math.atan(ts);
      for (var i=0; i<=15; i++) {
        dphi = PI/2 - 2*Math.atan(ts*Math.pow((1-ep*Math.sin(phi))/(1+ep*Math.sin(phi)),0.5*ep)) - phi;
        phi += dphi;
        if (Math.abs(dphi) <= EPSLN) break;
      }

      var alat = con * phi;
      var alon = con * (con*slon + Math.atan2(xn,-yn));
    }
    else {
      ce = 2*Math.atan(ra*Math.cos(x0)/(2*re*ms1));
      var alon = slon;
      if (ra <= EPSLN) chi = x0;
      else {
        chi = Math.asin(Math.cos(ce)*Math.sin(x0) + yn*Math.sin(ce)*Math.cos(x0)/ra);
        var alon = slon + Math.atan2(xn*Math.sin(ce),ra*Math.cos(x0)*Math.cos(ce) - yn*Math.sin(x0)*Math.sin(ce)); 
      }

      ts = Math.tan(0.5*(PI/2 + chi));
      phi = PI/2 - 2*Math.atan(ts);
      for (var i=0; i<=15; i++) {
        dphi = PI/2 - 2*Math.atan(ts*Math.pow((1-ep*Math.sin(phi))/(1+ep*Math.sin(phi)),0.5*ep)) - phi;
        phi += dphi;
        if (Math.abs(dphi) <= EPSLN) break;
      }
      var alat = -1*phi;
    }
    
    result.lat = alat*RADDEG;
    result.lon = alon*RADDEG;
    if (result.lon > 180) result.lon -= 360;
    //console.log('lat:' + result.lat + ', lon:' + result.lon);
  }

  return result;
}

// 위경도 변환(직교좌표)
function pixel_to_LatLon_eqdc(img,point,opt) {
  var map   = cht_area;
  var top   = 0;
  var bot   = 0;
  var left  = 0;
  var right = 0; if (document.getElementById("varn").value.indexOf("bias") != -1) right = 70;
  var SX, SY, NX, NY;

  var RIGHT_pixel = parseFloat(right); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);

  NX = ea*2*PI;
  NY = ea*PI;
  SX = ea*PI;
  SY = ea*PI/2;

  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;

  if (opt != -1) {
    for (var i = 0; i < 7; i++, zm *= 1.5) {
      zx = (parseInt)(zoom_x.charAt(i));
      zy = (parseInt)(zoom_y.charAt(i));
      if (zx == 0 || zy == 0) break;
      xo += (parseFloat)(NX/24.0*(zx-1)/zm);
      yo += (parseFloat)(NY/24.0*(zy-1)/zm);
    }
  }

  grid /= zm;
  xo = (SX - xo)*zm;
  yo = (SY - yo)*zm;

  var re = ea/grid;
  var slon = 126*DEGRAD;
  var slat = 0*DEGRAD;
  var olon = 126*DEGRAD;
  var olat = 0*DEGRAD;

  var xn = olon - slon;
  if (xn > PI)  xn -= 2.0*PI;
  if (xn < -PI) xn += 2.0*PI;
  xo = re*xn*Math.cos(slat) - xo;

  var result = new Object();

  if (opt == 0 || opt == -1) {
    xn = (point.lon)*DEGRAD - slon;
    if (xn > PI)  xn -= 2.0*PI;
    if (xn < -PI) xn += 2.0*PI;

    result.x = re*xn*Math.cos(slat) - xo;
    result.y = re*((point.lat)*DEGRAD - olat) + yo;

    result.x /= (NX/img_NI);
    result.y /= (NY/img_NJ);
    result.y = img_NJ - (result.y - img_OJ);
    //result.y += TOP_pixel;

    if (opt != -1) {
      if (result.y < img_OJ || result.y > (img_NJ+img_OJ)) return;    // 제목표시줄
      if (result.x > img_NI || result.x <= 0) return;    // 범례
      //console.log('x:' + result.x + ', y:' + result.y);
    }
  }
  else {
    result.lat = ((Y - yo)/re + olat)*RADDEG;
    result.lon = ((X + xo)/(re*Math.cos(slat)) + slon)*RADDEG;

    console.log('lat:' + result.lat + ', lon:' + result.lon + ', x:' + point.xx + ', y:' + point.yy);
  }

  return result;
}

//  줌 위치 구하기
function calcZoomArea(e) {
  var zmlvl = map.getZoom();

  gis_center = map.getCenter();
  var n = area_info.findIndex(function(x){return x.area == cht_area});
  area_info[n].center = gis_center;

  var img = {};
  var NX, NY;
  var point = {};
  point.lon = gis_center.lng;
  point.lat = gis_center.lat;

  if (cht_area == "EA_CHT") {
    NX = 9640;  NY = 6760;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_lamc(img,point,-1);
  }
  else if (cht_area == "TP") {
    NX = 11200;  NY = 6880;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_lamc(img,point,-1);
  }
  else if (cht_area == "E10") {
    NX = 3600;  NY = 3600;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_lamc(img,point,-1);
  }
  else if (cht_area == "NHEM") {
    var PI = Math.asin(1.0)*2.0;
    var ea = 6378.138;              // 장반경 (km)
    NX = NY = ea*2*PI/2;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_ster(img,point,-1);
  }
  else if (cht_area == "WORLD") {
    var PI = Math.asin(1.0)*2.0;
    var ea = 6378.138;              // 장반경 (km)
    NX = ea*2*PI;
    NY = ea*PI;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_eqdc(img,point,-1);
  }
  offset.y = NY - offset.y;

  var zm = 1.0;
  var xx = yy = 0;

  for (k=0; k<zmlvl; k++) {
    var ii = parseInt((offset.x - NX/(3*zm)) / (NX/(24*zm)) + 0.5) + 1;
    if (ii < 1) ii = 1;
    else if (ii > 9) ii = 9;
    offset.x -= ((ii-1)*NX)/(24*zm);

    var jj = parseInt((offset.y - NY/(3*zm)) / (NY/(24*zm)) + 0.5) + 1;
    if (jj < 1) jj = 1;
    else if (jj > 9) jj = 9;
    offset.y -= ((jj-1)*NY)/(24*zm);

    xx += ii * Math.pow(10, (6 - k));
    yy += jj * Math.pow(10, (6 - k));

    zm *= 1.5;
  }

  if (zoom_level != zmlvl || parseInt(zoom_x) != xx || parseInt(zoom_y) != yy) {
    console.log(xx, yy);
    if (xx == 0 || yy == 0) {
      zoom_x = zoom_y = "0000000";
    }
    else {
      zoom_x = xx.toString();
      zoom_y = yy.toString();
    }
    zoom_level = zmlvl;
  }
  else {
  }

  fnLayer();
}

//  이미지 레이어 제거
function removeImg() {
  if (geojsonVectorTile != undefined && geojsonVectorTile._leaflet_id != undefined) {
    map.removeLayer(geojsonVectorTile);
  }
  if (geojsonVectorFillTile != undefined && geojsonVectorFillTile._leaflet_id != undefined) {
    map.removeLayer(geojsonVectorFillTile);
  }
  if (lakeVectorTile != undefined && lakeVectorTile._leaflet_id != undefined) {
    map.removeLayer(lakeVectorTile);
  }
  if (lakeVectorFillTile != undefined && lakeVectorFillTile._leaflet_id != undefined) {
    map.removeLayer(lakeVectorFillTile);
  }
  if (koreaVectorTile != undefined && koreaVectorTile._leaflet_id != undefined) {
    map.removeLayer(koreaVectorTile);
  }
  if (koreaVectorFillTile != undefined && koreaVectorFillTile._leaflet_id != undefined) {
    map.removeLayer(koreaVectorFillTile);
  }
  if (koreaCityVectorTile != undefined && koreaCityVectorTile._leaflet_id != undefined) {
    map.removeLayer(koreaCityVectorTile);
  }
  if (geojsonWorldVectorTile != undefined && geojsonWorldVectorTile._leaflet_id != undefined) {
    map.removeLayer(geojsonWorldVectorTile);
  }
  if (geojsonWorldVectorFillTile != undefined && geojsonWorldVectorFillTile._leaflet_id != undefined) {
    map.removeLayer(geojsonWorldVectorFillTile);
  }
}

// 지도 토글
function map_toggle(node) {
  if (document.getElementById("map_container").style.display == "none") {
    document.getElementById("map_container").style.display = "block";
    node.innerText = "지도 숨기기";
  }
  else {
    document.getElementById("map_container").style.display = "none";
    node.innerText = "지도 펼치기";
  }
}

// 이미지 클릭 이벤트
function img_click(e) {
  if (e.originalEvent.srcElement.attributes.class == undefined || e.originalEvent.srcElement.attributes.class.value.indexOf("leaflet-control-layers") != -1) {
    return;
  }
  else {
    if (e.originalEvent.srcElement.parentNode != undefined) {
      if (e.originalEvent.srcElement.parentNode.attributes.class != undefined) {
        if (e.originalEvent.srcElement.parentNode.attributes.class.value.indexOf("leaflet-control-layers") != -1) {
          return;
        }
      }
    }
  }

  if (click_count == 0) {
    click_count++;
    lat1 = e.latlng.lat;
    lon1 = e.latlng.lng;
  }
  else {
    click_count = 0;
    lat2 = e.latlng.lat;
    lon2 = e.latlng.lng;
  }

  if (click_count == 0) {
    document.getElementById('lat').value = parseFloat(lat1).toFixed(2);
    document.getElementById('lat2').value = parseFloat(lat2).toFixed(2);
    document.getElementById('lon').value = parseFloat(lon1).toFixed(2);
    document.getElementById('lon2').value = parseFloat(lon2).toFixed(2);
    latlon = 0;
    tm_move('+0H', 0);
  }

  return;
}