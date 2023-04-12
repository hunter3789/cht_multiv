/*
  일기도 분석 JS(vanilla, without jquery)
  작성자: 이창재(2020.10.29)
*/
var cht_val  = new Array();
var b_val    = new Array();
var c_val    = new Array();
var mdl_val  = new Array();
var b_list   = new Array();
var c_list   = new Array();
var mdl_list = new Array();

var ncht_max   = 9;  // 전체 일기도 갯수
var tm_arr     = []; // 시간 배열(tm_arr[0]: 발효시간, tm_arr[n]: n번째(1~6) 일기도 모델 발표시간)
var img_arr    = []; // 일기도 이미지 주소 배열(n번째(1~6) 일기도 이미지 주소)
var win_num    = []; // 일기도 창 번호 배열(n번째(1~6) 창)
var ajaxNum    = [];
var ajaxStn    = 0;
var ajaxLegend = [];
var tm_st      = 0;  // 발효시간 타임바의 첫번째 시간
var ext_mode   = 0;  // 부가기능
var zoom_level = 0;  // 줌 레벨
var zoom_x = zoom_y = '0000000';
//var host = 'http://cht.kma.go.kr/cht_new/';
var host = 'http://' + location.hostname;
var tm_itv, cht_area, comp = 0, autoload = 0;
var click_count = 0, lat1, lat2, lon1, lon2;
var window_x, window_y, window_xy;

// 지도 관련 변수
var cht_area, map = [], gis_img = [], gis_size, gis_center, gis_img_bounds, gis_proj4, gis_resolution, world_lon;
var canvas1 = [], canvas2 = [], canvas3 = [], canvas4 = [], canvas5 = [], stop_flag = [], tileNumber;
var graticule1 = [], graticule2 = [], graticule3 = [], graticule4 = [];
var rulerLayer = [], rulerTextLayer = [], tempLayer = [], tempTextLayer = [], rulerNum = [], r_obj = [], rulerMapId = 0;
var geojsonData, geojsonWorldData, lakeData, koreaData, koreaCityData;
var geojsonVectorTile = [], lakeVectorTile = [], koreaVectorTile = [], koreaCityVectorTile = [], geojsonWorldVectorTile = [];
var geojsonVectorFillTile = [], lakeVectorFillTile = [], koreaVectorFillTile = [], koreaCityVectorFillTile = [], geojsonWorldVectorFillTile = [];
 
var area_info = [
  {
    area: "EA_CHT", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [41.364544, 115.355385], center_origin: [41.364544, 115.355385], bounds: [[41.737885, 39.695240], [6.134133, 156.715973]],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 11250, 7500, 5000,
                     3333.3333, 2222.2222, 1481.4815,
                     987.6543, 658.4362, 438.9575, 292.6383],
      zoom: {
        min: 0,
        max: 7
      }
    }
  },
  {
    area: "TP", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [25.686878, 141.707687], center_origin: [25.686878, 141.707687], bounds: [[44.937626, 68.784088], [-13.724107, 170.814819]],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 12500, 6493.3333, 4328.8889,
                     2885.9259, 1923.9506, 1282.6337,
                     855.0892, 570.0594, 380.0396, 253.3598],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "E10", zoom_x: '5400000', zoom_y: '5400000', zoom_level: 2, center: [37.396154, 125.194221], center_origin: [37.396154, 125.194221], bounds: [[43.893845, 114.366562], [29.487047, 133.211594]],
    map_attrs: {
      crs: "EPSG:2154",
      proj4string: "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 5400, 3600, 2400,
                     1600, 1066.6667, 711.1111,
                     474.0741, 316.0494, 210.6996, 140.4664],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "NHEM", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [89.993668, 255.000000], center_origin: [89.993668, 255.000000], bounds: [[-6.173436, -15.002863], [-6.173436, 165.002869]],
    map_attrs: {
      crs: "EPSG:3031",
      proj4string: "+proj=Polar_Stereographic +lat_0=90 +lat_ts=90 +lon_0=120 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 29000, 19333.3333, 12888.8889,
                     8592.5926, 5728.3951, 3818.9300,
                     2545.9534, 1697.3022],
      zoom: {
          min: 0,
          max: 7
      }
    }
  },
  {
    area: "WORLD", zoom_x: '0000000', zoom_y: '0000000', zoom_level: 0, center: [0.004497, 126.000000], center_origin: [0.004497, 126.000000], bounds: [[89.999999, -53.998970], [-89.994987, 305.998962]],
    map_attrs: {
      crs: "EPSG:32662",
      proj4string: "+proj=eqc +lat_0=0 +lat_ts=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs",
      resolutions: [ 40000, 26000, 17333.3333,
                     11555.5556, 7703.7037, 5135.8025,
                     3423.8683, 2282.5789, 1521.7193],
      zoom: {
          min: 0,
          max: 7
      }
    }
  }
];

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

//document.addEventListener('load', onLoad(), false);

// 첫 시작(화면 로드 시)
function onLoad() {
  // 변수 초기화
  cht_area = "EA_CHT";
  tm_itv = 3;
  gis_center = [41.364544, 115.355385];
  gis_img_bounds = [[41.737885, 39.695240], [6.134133, 156.715973]];
  gis_proj4 = "+proj=lcc +lat_1=30 +lat_2=60 +lat_0=0 +lon_0=126 +x_0=0 +y_0=0 +ellps=WGS84 +units=m +no_defs";
  gis_size = 90;
  tileNumber = 1;

  for (var i=1; i<=ncht_max; i++) {
    ajaxNum[i] = 0;
    ajaxLegend[i] = 0;
    rulerNum[i] = 0;
    stop_flag[i] = false;
    r_obj[i] = [];
  }

  fnBodyResize();
  for (var i=1; i<=ncht_max; i++) {
    map_init(cht_area, i);
  }

  tm_init(0, 0);
  doWindow(0);
  fnScroll();
  fnGetThemeInfoList();

  fnGetChtInfoList().then(function(response){
    for (var i=1; i<=ncht_max; i++) {
      doCht(0, i);
      doChtInit(i);
    }
    //해면기압/누적강수 일기도 표출
    document.getElementById("c2").options[16].selected = true;

    function doChtInit(i){
      tm_init(0, i).then(function(response){
        doChtVal(i);
      });
    }
  });

  fnGeoJson();
  initDragElement();
  fnInitAwsStn();
}

// 창 크기 변경에 따른 일기도 표출단 크기 조정
function fnBodyResize() {
  var width  = window.innerWidth - 5;
  var height = window.innerHeight - 77;
  document.getElementById('cht_body').style.width = parseInt(width) + "px";
  document.getElementById('cht_body').style.height = parseInt(height) + "px";
}

//////////////////////////////////////////////////////////////////////////////////////////
//  GIS 제어
//////////////////////////////////////////////////////////////////////////////////////////
//  지도 생성
function map_init(area, id) {
  var map_attrs = {};
  var n = area_info.findIndex(function(x){return x.area == area});
  map_attrs = area_info[n].map_attrs;
  map_attrs.center = area_info[n].center;

  cht_area = area;

  var resolutions = [];
  for (var i=0; i<map_attrs.resolutions.length; i++) {
    resolutions[i] = map_attrs.resolutions[i] / (document.getElementById("size").value * 0.01);
  }

  var map_crs = new L.Proj.CRS(map_attrs.crs, map_attrs.proj4string,
                      { resolutions: resolutions }
                );

  var map_size;
  if (cht_area == "EA_CHT") {
    NX = 9640;  NY = 6760;
    map_size = 854;
  }
  else if (cht_area == "TP") {
    NX = 11200;  NY = 6880;
    map_size = 854;
  }
  else if (cht_area == "E10") {
    NX = 3600;  NY = 3600;
    map_size = 604;
  }
  else if (cht_area == "NHEM") {
    NX = 1000;  NY = 1000;
    map_size = 654;
  }
  else if (cht_area == "WORLD") {
    NX = 1000;  NY = 500;
    map_size = 1000;
  }
  document.getElementById('map'+id).style.width = map_size * document.getElementById("size").value * 0.01 + "px";
  document.getElementById('map'+id).style.height = parseInt(map_size*NY/NX) * document.getElementById("size").value * 0.01 + "px";
  if (cht_area == "WORLD") {
    //document.getElementById('map'+id).style.backgroundColor = "#e5ffff";
  }
  else {
    document.getElementById('map'+id).style.backgroundColor = "#fff";
  }

  if (map[id] == null) {
    map[id] = L.map('map'+id, {
        maxZoom: map_attrs.zoom.max, //6,
        minZoom: map_attrs.zoom.min, //0,
        crs: map_crs,
        continuousWorld: false,
        worldCopyJump: false,
        inertia: false,
        keyboard: false,
        attributionControl: false,
        zoomControl: false
    }).setView(map_attrs.center, zoom_level, {animate:false});
    map[id].doubleClickZoom.disable();

    // pane 추가
    var mapPaneName1 = "world";
    var mapPaneName2 = "lake";
    var mapPaneName3 = "image";
    var mapPaneName4 = "borderline";
    var mapPaneName5 = "marker";
    var mapPaneName6 = "ruler";

    // pane layer 생성
    map[id].createPane(mapPaneName1);
    map[id].createPane(mapPaneName2);
    map[id].createPane(mapPaneName3);
    map[id].createPane(mapPaneName4);
    map[id].createPane(mapPaneName5);
    map[id].createPane(mapPaneName6);

    // pane layer z-inex set
    map[id].getPane(mapPaneName1).style.zIndex = 0;
    map[id].getPane(mapPaneName2).style.zIndex = 10;
    map[id].getPane(mapPaneName3).style.zIndex = 50;
    map[id].getPane(mapPaneName4).style.zIndex = 100;
    map[id].getPane(mapPaneName5).style.zIndex = 150;
    map[id].getPane(mapPaneName6).style.zIndex = 200;

    // pane layer 마우스 및 클릭 이벤트
    map[id].getPane(mapPaneName1).style.pointerEvents = 'none';
    map[id].getPane(mapPaneName2).style.pointerEvents = 'none';
    map[id].getPane(mapPaneName3).style.pointerEvents = 'none';
    map[id].getPane(mapPaneName4).style.pointerEvents = 'none';
    map[id].getPane(mapPaneName5).style.pointerEvents = 'none';
    map[id].getPane(mapPaneName6).style.pointerEvents = 'none';

    canvas1[id] = L.canvas({pane: "world"});
    canvas2[id] = L.canvas({pane: "lake"});
    canvas3[id] = L.canvas({pane: "borderline", padding: 1.5});
    canvas4[id] = L.canvas({pane: "marker"});
    canvas5[id] = L.canvas({pane: "ruler"});

    // 범례 버튼
    var legendControl = L.Control.extend({
      options:{
        position:'topleft'
      },

      onAdd:function(map) {
        var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control leaflet-control-custom');

        container.title = "정보/범례";
        container.style.width = container.style.height = "28px";
        container.style.textAlign = "center";
        container.style.cursor = "pointer";
        //container.style.backgroundColor = "#eee";
        container.id = "legendControl"+id;
        container.style.border = "1.5px solid #aaa";
        container.style.display = "none";

        container.onclick = function() {
          for (var i=1; i<=ncht_max; i++) {
            if (document.getElementById("legend"+i).style.display == "none") {
              document.getElementById("title"+i).style.display = "block";
              document.getElementById("legend"+i).style.display = "block";
            }
            else {
              document.getElementById("title"+i).style.display = "none";
              document.getElementById("legend"+i).style.display = "none";
            }
          }
        }

        var label = L.DomUtil.create("i", "fas fa-info");
        label.style.position = "relative";
        label.style.top = "2px";
        container.appendChild(label);
        return container;
      }

    });

    map[id].addControl(new legendControl())

    var titleView = L.Control.extend({
      options:{
        position:'bottomleft'
      },

      onAdd:function(map) {
        var container = L.DomUtil.create('div', 'title');
        container.setAttribute('id', 'title'+id);
        container.style.backgroundColor = "#eee";
        container.style.padding = "2px";
        container.style.marginBottom = "0px";
        container.style.marginLeft = "0px";

        return container;
      }

    });

    map[id].addControl(new titleView())

    var legendView = L.Control.extend({
      options:{
        position:'topright'
      },

      onAdd:function(map) {
        var container = L.DomUtil.create('div', 'legend');
        container.setAttribute('id', 'legend'+id);
        container.style.backgroundColor = "#ffffff";
        container.style.marginTop = "0px";
        container.style.marginRight = "0px";

        return container;
      }

    });

    map[id].addControl(new legendView())

    if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {
    }
    else {
      var screenControl = L.Control.extend({
        options:{
          position:'topleft'
        },

        onAdd:function(map) {
          var container = L.DomUtil.create('div', 'leaflet-control-layers leaflet-control leaflet-control-custom screencapture');

          container.title = "스크린샷";
          container.style.width = container.style.height = "28px";
          container.style.textAlign = "center";
          container.style.cursor = "pointer";
          container.id = "screencapture"+id;
          container.style.border = "1.5px solid #aaa";
          container.style.display = "none";

          container.onclick = function() {
            fnScreenshot(id);
          }

          var label = L.DomUtil.create("i", "fas fa-camera");
          label.style.position = "relative";
          label.style.top = "2px";
          container.appendChild(label);
          return container;
        }

      });

      map[id].addControl(new screenControl())
    }

    rulerLayer[id] = L.layerGroup().addTo(map[id]);
    rulerTextLayer[id] = L.layerGroup().addTo(map[id]);
    tempLayer[id] = L.layerGroup().addTo(map[id]);
    tempTextLayer[id] = L.layerGroup().addTo(map[id]);

    graticule1[id] = L.graticule({ interval:30, style:{dashArray:'1,3', color:'#333', weight:0.5}, renderer: canvas3[id] });
    graticule2[id] = L.graticule({ interval:20, style:{dashArray:'2,2', color:'#333', weight:0.5}, renderer: canvas3[id] });
    graticule3[id] = L.graticule({ interval:10, style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3[id] }).addTo(map[id]);
    graticule4[id] = L.graticule({ interval:5,  style:{dashArray:'4,4', color:'#333', weight:0.5}, renderer: canvas3[id] });
 
    map[id].on('zoomstart', removeImg);
    map[id].on('zoomend', calcZoomArea);
    map[id].on('dragend', calcZoomArea);
    map[id].on('movestart', hidePopup);
    map[id].on("mousemove", img_mousemove);
    map[id].on("mousemove", controlsOn);
    map[id].on("mouseout", controlsOff);
    map[id].on('click', img_click);
  }
  else {
    disableRuler(id);

    if (geojsonVectorTile[id] != undefined && geojsonVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonVectorTile[id]);
    }
    if (geojsonVectorFillTile[id] != undefined && geojsonVectorFillTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonVectorFillTile[id]);
    }
    if (lakeVectorTile[id] != undefined && lakeVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(lakeVectorTile[id]);
    }
    if (lakeVectorFillTile[id] != undefined && lakeVectorFillTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(lakeVectorFillTile[id]);
    }
    if (koreaVectorTile[id] != undefined && koreaVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(koreaVectorTile[id]);
    }
    if (koreaCityVectorTile[id] != undefined && koreaCityVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(koreaCityVectorTile[id]);
    }
    if (geojsonWorldVectorTile[id] != undefined && geojsonWorldVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonWorldVectorTile[id]);
    }
    if (geojsonWorldVectorFillTile[id] != undefined && geojsonWorldVectorFillTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonWorldVectorFillTile[id]);
    }

    map[id].options.crs = map_crs;
    //map[id].fire('viewreset');
    //stop_flag[id] = true;
    //map[id].invalidateSize();
  }
}

//  이미지 레이어 제거
function removeImg(e, id) {
  if (e != null) {
    id = e.target._container.id.slice(e.target._container.id.indexOf("map")+3,e.target._container.id.length);
  }

  if (gis_img[id] != undefined) {
    //console.log(id);
    map[id].removeLayer(gis_img[id]);

    if (geojsonVectorTile[id] != undefined && geojsonVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonVectorTile[id]);
    }
    if (geojsonVectorFillTile[id] != undefined && geojsonVectorFillTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonVectorFillTile[id]);
    }
    if (lakeVectorTile[id] != undefined && lakeVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(lakeVectorTile[id]);
    }
    if (lakeVectorFillTile[id] != undefined && lakeVectorFillTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(lakeVectorFillTile[id]);
    }
    if (koreaVectorTile[id] != undefined && koreaVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(koreaVectorTile[id]);
    }
    if (koreaCityVectorTile[id] != undefined && koreaCityVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(koreaCityVectorTile[id]);
    }
    if (geojsonWorldVectorTile[id] != undefined && geojsonWorldVectorTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonWorldVectorTile[id]);
    }
    if (geojsonWorldVectorFillTile[id] != undefined && geojsonWorldVectorFillTile[id]._leaflet_id != undefined) {
      map[id].removeLayer(geojsonWorldVectorFillTile[id]);
    }

  }
}

//  이미지 레이어 추가
function addImg(id) {
  if (id == undefined) {
    for (var i=1; i<=ncht_max; i++) {
      if (gis_img[i] != undefined) {
        map[i].addLayer(gis_img[i]);
      }
    }
  }
  else {
    if (gis_img[id] != undefined) {
      map[id].addLayer(gis_img[id]);
    }
  }
}

//  컨트롤 추가/제거
function controlsOn() {
  if (ext_mode != "hlt") {
    for (var i=1; i<=ncht_max; i++) {
      if (document.getElementById("legendControl"+i) != null) {
        document.getElementById("legendControl"+i).style.display = "block";
      }
      if (document.getElementById("screencapture"+i) != null) {
        document.getElementById("screencapture"+i).style.display = "block";
      }
    }
  }
}

function controlsOff() {
  for (var i=1; i<=ncht_max; i++) {
    if (document.getElementById("legendControl"+i) != null) {
      document.getElementById("legendControl"+i).style.display = "none";
    }
    if (document.getElementById("screencapture"+i) != null) {
      document.getElementById("screencapture"+i).style.display = "none";
    }
  }
}

//  레이어 조정
function fnLayer(id) {
  for (var i=1; i<=ncht_max; i++) {
    if (document.getElementById("map"+i).style.display == 'none') {
      continue;
    }

    if (id != undefined && id != i) {
      continue;
    }

    if (cht_area == "WORLD") {
      if (geojsonWorldVectorTile[i] == undefined) {
        geojsonWorldVectorTile[i] = fnGeoTile(map[i], geojsonWorldData, "borderline", "geojsonworld", false, "#000");
        geojsonWorldVectorFillTile[i] = fnGeoTile(map[i], geojsonWorldData, "world", "geojsonworldfill", true, "#ffffe5");
      }

      if (geojsonWorldVectorTile[i] != undefined) {
        map[i].addLayer(geojsonWorldVectorTile[i]);
      }
      if (geojsonWorldVectorFillTile[i] != undefined) {
        map[i].addLayer(geojsonWorldVectorFillTile[i]);
      }
      if (lakeVectorTile[i] != undefined) {
        map[i].addLayer(lakeVectorTile[i]);
      }
      if (lakeVectorFillTile[i] != undefined) {
        map[i].addLayer(lakeVectorFillTile[i]);
      }
      if (koreaVectorTile[i] != undefined) {
        map[i].addLayer(koreaVectorTile[i]);
      }
    }
    else if (cht_area == "NHEM") {
      if (geojsonVectorTile[i] != undefined) {
        map[i].addLayer(geojsonVectorTile[i]);
      }
      if (geojsonVectorFillTile[i] != undefined) {
        map[i].addLayer(geojsonVectorFillTile[i]);
      }
      if (lakeVectorTile[i] != undefined) {
        map[i].addLayer(lakeVectorTile[i]);
      }
      if (lakeVectorFillTile[i] != undefined) {
        map[i].addLayer(lakeVectorFillTile[i]);
      }
      if (koreaVectorTile[i] != undefined) {
        map[i].addLayer(koreaVectorTile[i]);
      }
    }
    else {
      if (geojsonVectorTile[i] != undefined) {
        map[i].addLayer(geojsonVectorTile[i]);
      }
      if (lakeVectorTile[i] != undefined) {
        map[i].addLayer(lakeVectorTile[i]);
      }
      if (koreaVectorTile[i] != undefined) {
        map[i].addLayer(koreaVectorTile[i]);
      }
    }

    if (cht_area == "WORLD") {
      map[i].removeLayer(graticule2[i]);
      map[i].removeLayer(graticule3[i]);
      map[i].removeLayer(graticule4[i]);
      map[i].addLayer(graticule1[i]);
    }
    else if (cht_area == "NHEM") {
      if (zoom_level >= 4) {
        map[i].removeLayer(graticule1[i]);
        map[i].removeLayer(graticule2[i]);
        map[i].removeLayer(graticule3[i]);
        map[i].addLayer(graticule4[i]);
      }
      else if (zoom_level >= 2) {
        map[i].removeLayer(graticule1[i]);
        map[i].removeLayer(graticule2[i]);
        map[i].removeLayer(graticule4[i]);
        map[i].addLayer(graticule3[i]);
      }
      else {
        map[i].removeLayer(graticule1[i]);
        map[i].removeLayer(graticule3[i]);
        map[i].removeLayer(graticule4[i]);
        map[i].addLayer(graticule2[i]);
      }
    }
    else {
      if (zoom_level >= 4 || (cht_area == "E10" && zoom_level >= 2)) {
        map[i].removeLayer(graticule1[i]);
        map[i].removeLayer(graticule2[i]);
        map[i].removeLayer(graticule3[i]);
        map[i].addLayer(graticule4[i]);

        if (koreaCityVectorTile[i] != undefined) {
          map[i].addLayer(koreaCityVectorTile[i]);
        }
      }
      else {
        map[i].removeLayer(graticule1[i]);
        map[i].removeLayer(graticule2[i]);
        map[i].removeLayer(graticule4[i]);
        map[i].addLayer(graticule3[i]);

        if (koreaCityVectorTile[i] != undefined) {
          map[i].removeLayer(koreaCityVectorTile[i]);
        }
      }
    }
  }
}

//  줌 위치 구하기
function calcZoomArea(e, id) {
  if (e != null) {
    id = e.target._container.id.slice(e.target._container.id.indexOf("map")+3,e.target._container.id.length);
  }

  if (document.getElementById("map"+id).style.display == 'none') {
    return;
  }

  if (stop_flag[id]) {
    stop_flag[id] = false;
    console.log(id);
    return;
  }

  gis_center = map[id].getCenter();
  var n = area_info.findIndex(function(x){return x.area == cht_area});
  area_info[n].center = gis_center;

  var zmlvl = map[id].getZoom();
  var img = {};
  var NX, NY;
  var point = {};
  point.lon = gis_center.lng;
  point.lat = gis_center.lat;
  if (img_arr[id] == undefined) {
    return;
  }

  if (cht_area == "EA_CHT") {
    NX = 9640;  NY = 6760;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon(img,point,id,-1);
  }
  else if (cht_area == "TP") {
    NX = 11200;  NY = 6880;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon(img,point,id,-1);
  }
  else if (cht_area == "E10") {
    NX = 3600;  NY = 3600;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon(img,point,id,-1);
  }
  else if (cht_area == "NHEM") {
    var PI = Math.asin(1.0)*2.0;
    var ea = 6378.138;              // 장반경 (km)
    NX = NY = ea*2*PI/2;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_ster(img,point,id,-1);
  }
  else if (cht_area == "WORLD") {
    var PI = Math.asin(1.0)*2.0;
    var ea = 6378.138;              // 장반경 (km)
    NX = ea*2*PI;
    NY = ea*PI;
    img.width = NX;
    img.height = NY;
    var offset = pixel_to_LatLon_eqdc(img,point,id,-1);
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
    //console.log(xx, yy);
    if (xx == 0 || yy == 0) {
      zoom_x = zoom_y = "0000000";
    }
    else {
      zoom_x = xx.toString();
      zoom_y = yy.toString();
    }
    zoom_level = zmlvl;

    gis_img_bounds = fnGetBounds(img,id);
    area_info[n].bounds = gis_img_bounds;
    for (var i=1; i<=ncht_max; i++) {
      doChtVal(i);
    }
  }
  else {
    addImg(id);
  }

  //fnLayer(id);

  document.getElementById("center_lon").value = point.lon.toFixed(2);
  document.getElementById("center_lat").value = point.lat.toFixed(2);
  document.getElementById("map_zoom").value = zoom_level;
}

// GeoJson 자료 읽기
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

      for (var i=1; i<=ncht_max; i++) {
        if (i==1) {
          fnGeoBounds(map[i], geojsonData);
        }
        geojsonVectorTile[i] = fnGeoTile(map[i], geojsonData, "borderline", "geojson", false, "#000");
        geojsonVectorTile[i].addTo(map[i]);
        geojsonVectorFillTile[i] = fnGeoTile(map[i], geojsonData, "world", "geojsonfill", true, "#ffffe5");
        //geojsonVectorFillTile[i].addTo(map[i]);
      }
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

      for (var i=1; i<=ncht_max; i++) {
        if (i==1) {
          fnGeoBounds(map[i], lakeData);
        }
        lakeVectorTile[i] = fnGeoTile(map[i], lakeData, "borderline", "lake", false, "#000");
        lakeVectorTile[i].addTo(map[i]);
        //lakeVectorFillTile[i] = fnGeoTile(map[i], lakeData, "lake", "lakefill", true, "#e5ffff");
        //lakeVectorFillTile[i].addTo(map[i]);
      }
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

      for (var i=1; i<=ncht_max; i++) {
        if (i==1) {
          fnGeoBounds(map[i], koreaData);
        }
        koreaVectorTile[i] = fnGeoTile(map[i], koreaData, "borderline", "korea", false, "#000");
        koreaVectorTile[i].addTo(map[i]);
      }
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

      for (var i=1; i<=ncht_max; i++) {
        if (i==1) {
          fnGeoBounds(map[i], koreaCityData);
        }
        koreaCityVectorTile[i] = fnGeoTile(map[i], koreaCityData, "borderline", "koreacity", false, "gray");
        //koreaCityVectorTile[i].addTo(map[i]);
      }
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
    var tiles = new L.GridLayer({tileSize:512, pane:pane});
  }
  else {
    var tiles = new L.GridLayer({tileSize:512});
  }

  var id = map._container.id.slice(map._container.id.indexOf("map")+3,map._container.id.length)

  tiles.createTile = function(coords) {
    //if (id == 1) {
    //  console.log(tag, coords);
    //}
    var tile = L.DomUtil.create('canvas', 'leaflet-tile');
    tile.id = "map" + id + "|tile|" + tag + "|" + coords.x + "|" + coords.y + "|" + coords.z;
    //console.log(id, tileNumber);
    //var tile = document.createElement('canvas');
    var size = this.getTileSize();
    var ctx = tile.getContext('2d');
    tile.width = size.x;
    tile.height = size.y;
    //let offscreen = tile.transferControlToOffscreen();
  
    // calculate projection coordinates of top left tile pixel
    var nwPoint = coords.scaleBy(size)
    var ratio = gis_resolution*map.options.crs._scales[coords.z];

    if (id != tileNumber) {
      getCanvasImg(ctx, coords);
      return tile;
    }

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

    if (color == "gray") {
      ctx.lineWidth = 0.2 * document.getElementById("size").value * 0.01;
    }
    else if (color == "#222") {
      ctx.lineWidth = 0.4 * document.getElementById("size").value * 0.01;
    }
    else {
      ctx.lineWidth = 1.0 * document.getElementById("size").value * 0.01;
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

          polygon = L.LineUtil.simplify(polygon, tolerance);

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

        polygon = L.LineUtil.simplify(polygon, tolerance);

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

  function getCanvasImg(ctx, coords) {
    var interval = setInterval(function() {
      if (document.getElementById("map" + tileNumber + "|tile|" + tag + "|" + coords.x + "|" + coords.y + "|" + coords.z) != null) {
        clearInterval(interval);
        var canvas = document.getElementById("map" + tileNumber + "|tile|" + tag + "|" + coords.x + "|" + coords.y + "|" + coords.z);
        ctx.drawImage(canvas, 0, 0);
      }
    }, 100);
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

// 이미지 정보 생성
function makeTitle(id) {
  var legend = "";
  legend += "<div style='display:flex;'>";
  legend += "<div style='width:4px;'></div>";
  legend += "<div style='font-weight:bold; font-family:Tahoma; font-size:8pt;'>";

  for (var i=0; i<document.getElementById('mdl'+id).options.length; i++) {
    if (document.getElementById('mdl'+id).options[i].selected == true) {
      var mdl_text = document.getElementById('mdl'+id).options[i].text;      
    }
  }
  legend += mdl_text + " / ";

  var url = img_arr[id].url;

  var tm = tm_arr[0];
  var YY = tm.substring(0,4);
  var MM = tm.substring(4,6);
  var DD = tm.substring(6,8);
  var HH = tm.substring(8,10);
  var MI = tm.substring(10,12);
  var date_ef = new Date(YY, MM-1, DD, HH, MI);

  var tm = tm_arr[id];
  var YY = tm.substring(0,4);
  var MM = tm.substring(4,6);
  var DD = tm.substring(6,8);
  var HH = tm.substring(8,10);
  var MI = tm.substring(10,12);
  var date = new Date(YY, MM-1, DD, HH, MI);

  if (date_ef < date || img_arr[id].type.indexOf("ana") != -1) {
    if (url.indexOf("png") == -1) {
      var tm_ef = url.substring(url.indexOf("&tm=") + 4, url.indexOf("&tm=") + 4 + 10);
    }
    else {
      var tm_ef = url.substring(url.indexOf("_area=") - 10, url.indexOf("_area="));
    }

    var YY2 = tm_ef.substring(0,4);
    var MM2 = tm_ef.substring(4,6);
    var DD2 = tm_ef.substring(6,8);
    var HH2 = tm_ef.substring(8,10);
    var MI2 = tm_ef.substring(10,12);
    var date_ef = new Date(YY2, MM2-1, DD2, HH2, MI2);
    date_ef.setTime(date_ef.getTime() + 9*60*60*1000);

    legend += addZeros(date_ef.getFullYear(),4) + "." + addZeros(date_ef.getMonth()+1,2) + "." + addZeros(date_ef.getDate(),2) + "." + addZeros(date_ef.getHours(),2) + "KST 분석";
  }
  else {
    legend += YY + "." + MM + "." + DD + "." + HH + "KST 발표 / ";

    if (url.indexOf("png") == -1) {
      var tm_ef = url.substring(url.indexOf("&tm=") + 4, url.indexOf("&tm=") + 4 + 10);
      var YY2 = tm_ef.substring(0,4);
      var MM2 = tm_ef.substring(4,6);
      var DD2 = tm_ef.substring(6,8);
      var HH2 = tm_ef.substring(8,10);
      var MI2 = tm_ef.substring(10,12);
      var date_ef = new Date(YY2, MM2-1, DD2, HH2, MI2);
      date_ef.setTime(date_ef.getTime() + 9*60*60*1000);

      legend += "VALID: +" + parseInt((date_ef - date)/(60*60*1000)) + "H";
    }
    else {  
      date.setTime(date.getTime() - 9*60*60*1000);
      var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2);
      legend += "VALID: +" + parseInt(url.substring(url.indexOf("_" + tm) - 3, url.indexOf("_" + tm))) + "H";
    }
  }

  legend += "</div>";
  legend += "<div style='width:4px;'></div>";

  legend += "</div>";

  document.getElementById("title"+id).innerHTML = legend;

  if (img_arr[id].type.indexOf("ana") != -1) {
    if (document.getElementById("legend_img"+id) != null) document.getElementById("legend"+id).removeChild(document.getElementById("legend_img"+id));
  }
  else {
    makeLegend(id);
  }
}

// 범례 정보 생성
function makeLegend(id) {
  var url = host + "/cht_new/cht_multiv_gis_lib.php?mode=2&tm_ef=" + tm_arr[0] + "&tm_fc=" + tm_arr[id] + "&dir1=" + img_arr[id].dir + "&img_name=" + img_arr[id].img_name;
  url += "&type=" + img_arr[id].type + "&save=1&zoom_x=" + zoom_x + "&zoom_y=" + zoom_y + "&zoom_level=" + zoom_level;
  url += "&mdl=" + img_arr[id].api.split(',')[3] + "&area=" + cht_area;

  ajaxLegend[id]++;
  var curAjaxNum = ajaxLegend[id];
  var xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
  xhr.onreadystatechange = function () {
    if (xhr.readyState != 4 || xhr.status != 200) return;
    else if (curAjaxNum == ajaxLegend[id]) {
      var line = xhr.responseText.split('\n');
      if (xhr.responseText.length <= 1 && line[0] == "") {
        return;
      }

      line.forEach(function(l) {
        if (l[0] == "#" || l.length <= 1) {
          return;
        }

        if (l[0] != "@") {
          if (document.getElementById("legend_img"+id) == null) {
            var img = document.createElement("img");
            document.getElementById("legend"+id).appendChild(img);
            img.id = "legend_img" + id;
          }
          document.getElementById("legend_img"+id).src = host + l;
          var width = parseFloat(45 * document.getElementById("size").value * 0.01);
          document.getElementById("legend_img"+id).setAttribute('width', width);
        }
        else {
          if (document.getElementById("legend_img"+id) != null) document.getElementById("legend"+id).removeChild(document.getElementById("legend_img"+id));
        }
      });

    }
  };
  xhr.send();
}

//  스크린캡쳐 표출
function fnScreenshot(id) {
  var node = document.getElementById("map"+id);

  function filter (node) {
    return (node.classList == undefined || (!node.classList.contains('leaflet-control-layers') && !node.classList.contains('leaflet-control-zoom')));
  }

  domtoimage.toPng(node, {width:node.offsetWidth, height:node.offsetHeight, filter: filter})
  .then(function (dataUrl) {
      document.getElementById("capture_img").src = dataUrl;
      var container = document.getElementById("screenshot");
      container.style.width = parseInt(node.offsetWidth) + 40 + "px";
      container.style.height = parseInt(node.offsetHeight) + 50 + "px";
      container.style.display = "block";
  })
  .catch(function (error) {
      console.error('oops, something went wrong!', error);
  });
}

// 스크린캡쳐 창 드래그 적용
function initDragElement() {
  var pos1 = 0,
      pos2 = 0,
      pos3 = 0,
      pos4 = 0;
  var popups = document.getElementsByClassName("screen-pop");
  var elmnt = null;
  var currentZIndex = 1000; //TODO reset z index when a threshold is passed

  for (var i = 0; i < popups.length; i++) {
    var popup = popups[i];
    var header = getHeader(popup);

    popup.onmousedown = function() {
      this.style.zIndex = "" + ++currentZIndex;
    };

    if (header) {
      header.parentPopup = popup;
      header.onmousedown = dragMouseDown;
    }
  }

  function dragMouseDown(e) {
    elmnt = this.parentPopup;
    elmnt.style.zIndex = "" + ++currentZIndex;

    e = e || window.event;
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    if (!elmnt) {
      return;
    }

    e = e || window.event;
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    if (elmnt.offsetTop - pos2 > 10) {
      elmnt.style.top = elmnt.offsetTop - pos2 + "px";
      tms_top = elmnt.offsetTop - pos2;
    }
    else {
      elmnt.style.top = "10px";
      tms_top = 10;
    }
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
    tms_left = elmnt.offsetLeft - pos1;
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }

  function getHeader(element) {
    var headerItems = element.getElementsByClassName("screen-pop-header");

    if (headerItems.length === 1) {
      return headerItems[0];
    }

    return null;
  }
}

// 스크롤에 따른 popupBox 위치 조정
function fnScroll() {
  var cht_body = document.getElementById('cht_body');
  cht_body.addEventListener('scroll', function() {
    var left = document.getElementById('cht_body').scrollLeft;
    var top  = document.getElementById('cht_body').scrollTop;
    var pop = document.querySelectorAll('.pop');

    for (var i=0; i<pop.length; i++) {
      pop[i].style.transform = "translate(" + parseInt(-left) + "px, " + parseInt(-top) + "px)";
    }
  });
}

// 표출할 창 개수 조절
function doWindow(opt)
{
  window_y = parseInt(document.getElementById('window').value.split(',')[0]);
  window_x = parseInt(document.getElementById('window').value.split(',')[1]);
  window_xy = window_x * window_y;

  if (window_y == 2 && window_x == 1) win_num = [0,1,4,7,2,5,8,3,6,9];
  else if (window_y == 2 && window_x == 2) win_num = [0,1,2,4,5,7,8,3,6,9];
  else if (window_y == 3 && window_x == 1) win_num = [0,1,4,7,2,5,8,3,6,9];
  else if (window_y == 3 && window_x == 2) win_num = [0,1,4,7,2,5,8,3,6,9];
  else win_num = [0,1,2,3,4,5,6,7,8,9];

  for (var i=window_xy+1; i<=ncht_max; i++)
  {
      document.getElementById("cht_select" + win_num[i]).style.display = "none";
      document.getElementById("tm_select" + win_num[i]).style.display = "none";
      document.getElementById("cht_table" + win_num[i]).style.display = "none";
      //document.getElementById("map" + win_num[i]).style.display = "none";
  }

  for (var i=1; i<=window_xy; i++)
  {
      document.getElementById("cht_select" + win_num[i]).style.display = "block";
      document.getElementById("tm_select" + win_num[i]).style.display = "block";
      document.getElementById("cht_table" + win_num[i]).style.display = "block";
      //document.getElementById("map" + win_num[i]).style.display = "block";
  }

  if (opt != -1) {
    if (cht_area == "E10") {
      if (window_xy == 1) document.getElementById('size').value = 100;
      else if (window_xy == 2) document.getElementById('size').value = 90;
      else if (window_xy == 3) document.getElementById('size').value = 90;
      else if (window_xy >= 4) document.getElementById('size').value = 80;
    }
    else {
      if (window_xy == 1) document.getElementById('size').value = 100;
      else if (window_xy == 2) document.getElementById('size').value = 90;
      else if (window_xy == 3) document.getElementById('size').value = 65;
      else if (window_xy >= 4) document.getElementById('size').value = 60;
    }
  }

  if (opt == 0) {
    fnLayer();
  }
  else {
    doSize();
  }
}

// 맵 타일링 대표 정보 찾기
function getTileNumber(id) {
  for (var i=1; i<=ncht_max; i++) {
    if (document.getElementById("map"+i).style.display == 'block') {
      if (tileNumber != i) {
        tileNumber = i;
      }
      break;
    }
  }

  for (var i=1; i<=ncht_max; i++) {
    if (i==id) continue;
    else {
      if (map[id].isSynced(map[i])) {
        map[id].unsync(map[i]);
      }
    }
  }

  if (document.getElementById("map"+id).style.display == 'block') {
    //stop_flag[id] = true;
    map[id].fire('viewreset');
    map[id].invalidateSize();
    map[id].setView(gis_center, zoom_level, {animate:false});
    //console.log(id);
  }

  for (var i=1; i<=ncht_max; i++) {
    if (i==id) continue;
    else {
      map[id].sync(map[i], {noInitialSync: true, syncCursor: false});
    }
  }

  fnLayer(id);
}

// 일기도 메뉴 리스트 조회(ajax 호출)
function fnGetChtInfoList(callback) {

  return new Promise(function(resolve, reject) {
    //var url = host + "vmulti.ini";
    var url = host + "/cht_new/vmulti.ini?_=" + new Date().getTime();
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
           
          inputChtInfoList(l);
        });
      }
      sortChtList();

      resolve(xhr.response);
    };
    xhr.send();
  });

  function inputChtInfoList(l) {
    var d = l.split(':');

    if (!cht_val[parseInt(d[1])]) {
      cht_val[parseInt(d[1])]  = new Array();
      c_list[parseInt(d[1])]   = new Array();
      mdl_list[parseInt(d[1])] = new Array();
      c_val[parseInt(d[1])]   = new Array();
      mdl_val[parseInt(d[1])] = new Array();
    }       

    if (b_list.indexOf(d[1]) < 0) {
      b_list.push(d[1]);
      b_val[b_list.length-1] = new Object();
      b_val[b_list.length-1].list = d[1];
      b_val[b_list.length-1].text = d[2];
    }

    if (d[2][0] == "-") return;

    if (!cht_val[parseInt(d[1])][parseInt(d[3])]) {
      cht_val[parseInt(d[1])][parseInt(d[3])]  = new Array();
      mdl_list[parseInt(d[1])][parseInt(d[3])] = new Array();
      mdl_val[parseInt(d[1])][parseInt(d[3])] = new Array();
    }

    cht_val[parseInt(d[1])][parseInt(d[3])][parseInt(d[5])] = new Object();
    cht_val[parseInt(d[1])][parseInt(d[3])][parseInt(d[5])].img  = d[7];
    cht_val[parseInt(d[1])][parseInt(d[3])][parseInt(d[5])].map  = d[8];
    cht_val[parseInt(d[1])][parseInt(d[3])][parseInt(d[5])].api  = d[9];
    cht_val[parseInt(d[1])][parseInt(d[3])][parseInt(d[5])].type = d[0];

    if (c_list[parseInt(d[1])].indexOf(d[3]) < 0) {
      c_list[parseInt(d[1])].push(d[3]);
      c_val[parseInt(d[1])][c_list[parseInt(d[1])].length-1] = new Object();
      c_val[parseInt(d[1])][c_list[parseInt(d[1])].length-1].list = d[3];
      c_val[parseInt(d[1])][c_list[parseInt(d[1])].length-1].text = d[4];
    }
    if (mdl_list[parseInt(d[1])][parseInt(d[3])].indexOf(d[5]) < 0) {
      mdl_list[parseInt(d[1])][parseInt(d[3])].push(d[5]);
      mdl_val[parseInt(d[1])][parseInt(d[3])][mdl_list[parseInt(d[1])][parseInt(d[3])].length-1] = new Object();
      mdl_val[parseInt(d[1])][parseInt(d[3])][mdl_list[parseInt(d[1])][parseInt(d[3])].length-1].list = d[5];
      mdl_val[parseInt(d[1])][parseInt(d[3])][mdl_list[parseInt(d[1])][parseInt(d[3])].length-1].text = d[6];
    }
  }

  function sortChtList() {
    b_val.sort(function(a,b){
      return(parseInt(a.list)<parseInt(b.list))?-1:(parseInt(a.list)>parseInt(b.list))?1:0;
    });

    for (var i=0; i<b_val.length; i++) {
      c_val[b_val[i].list].sort(function(a,b){
        return(parseInt(a.list)<parseInt(b.list))?-1:(parseInt(a.list)>parseInt(b.list))?1:0;
      });
    }

    for (var i=0; i<b_val.length; i++) {
      for (var j=0; j<c_val[b_val[i].list].length; j++) {
        var k = c_val[b_val[i].list][j].list;
        mdl_val[b_val[i].list][k].sort(function(a,b){
          return(parseInt(a.list)<parseInt(b.list))?-1:(parseInt(a.list)>parseInt(b.list))?1:0;
        });
      }
    }
  }

}

// 일기도 메뉴 선택(mode = 0:첫 로드 시, 1:카테고리1 변경, 2:카테고리2 변경, -1:doChtVal 호출 불필요 시)
function doCht(mode, id) {
  if (mode == 0) {
    document.getElementById('b'+id).options.length = b_val.length;
    for (var i=0; i<b_val.length; i++) {
      document.getElementById('b'+id).options[i].text = b_val[i].text;
      document.getElementById('b'+id).options[i].value = b_val[i].list;
    }
  }

  if (mode < 2) {
    for (var k=0; k<b_val.length; k++) {
      if (document.getElementById('b'+id).options[k].selected == true) {
        i = b_val[k].list;
        // 시작이 '-'인 경우에 예외처리
        if (b_val[k].text[0] == "-") {
          if (img_arr[id]) {
            for (var j=0; j<b_val.length; j++) {    
              if (b_val[j].list == img_arr[id].b) {
                document.getElementById('b'+id).options[j].selected = true;
                break;
              }
            }
          }
          return; 
        }
        break;
      }
    }

    if (mode == 1) {
      for (var j=0; j<document.getElementById('c'+id).options.length; j++) {
        if (document.getElementById('c'+id).options[j].selected == true) {
          var c_text = document.getElementById('c'+id).options[j].text;      
        }
      }

      for (var j=0; j<document.getElementById('mdl'+id).options.length; j++) {
        if (document.getElementById('mdl'+id).options[j].selected == true) {
          var mdl_text = document.getElementById('mdl'+id).options[j].text;      
        }
      }
    }

    document.getElementById('c'+id).options.length = c_val[i].length;
    for (var j=0; j<c_val[i].length; j++) {
      document.getElementById('c'+id).options[j].text = c_val[i][j].text;
      document.getElementById('c'+id).options[j].value = c_val[i][j].list;
    }
  }

  if (mode == 1) {
    var c_ok = 0;
    for (var j=0; j<c_val[i].length; j++) {
      if (c_val[i][j].text == c_text || c_val[i][j].text == " " + c_text) {
        document.getElementById('c'+id).options[j].selected = true;
        c_ok = 1;
        break;
      }
    }
    if (c_ok == 0) document.getElementById('c'+id).options[0].selected = true;
  }

  for (var k=0; k<b_val.length; k++) {
    if (document.getElementById('b'+id).options[k].selected == true) {
      i = b_val[k].list;
      break;
    }
  }
  for (var k=0; k<c_val[i].length; k++) {
    if (document.getElementById('c'+id).options[k].selected == true) {
      j = c_val[i][k].list;
      break;
    }
  }

  document.getElementById('mdl'+id).options.length = mdl_val[i][j].length;
  for (var k=0; k<mdl_val[i][j].length; k++) {
    document.getElementById('mdl'+id).options[k].text = mdl_val[i][j][k].text;
    document.getElementById('mdl'+id).options[k].value = mdl_val[i][j][k].list;
  }

  if (mode == 1) {
    var mdl_ok = 0;
    for (var k=0; k<mdl_val[i][j].length; k++) {
      if (mdl_val[i][j][k].text == mdl_text) {
        document.getElementById('mdl'+id).options[k].selected = true;
        mdl_ok = 1;
        break;
      }
    }
    if (mdl_ok == 0) document.getElementById('mdl'+id).options[0].selected = true;
  }

  if (mode > 0) doChtVal(id, 1);
}

// 일기도 정보 처리(이미지 표출 등) (first: 무한 루프 방지용 변수, 일기도 종류 변경 선택 시 first = 1, 모델 종류 변경 선택 시 first = -1 / moving: timebar 이동 시)
function doChtVal(id, first, moving) {
  if (document.getElementById("cht_table"+id).style.display == 'none') {
    return;
  }

  // 모델 비교 수행(좌측 일기도 기준으로)
  if (first == 1 && (id == 1 || id == 4 || id == 7) && comp > 0) {
    if (mdl_comp(comp) != -1) return;
  }
  else if (first == -1) {
    // 모델 종류 변경 시, 모델 비교 체크 해제
    var data = document.getElementsByName("comp");
    for(var idx = 0; idx < data.length; idx++) {
      data[idx].checked = 0;
    }
    comp = 0;
  }

  for (var k=0; k<b_val.length; k++) {
    if (document.getElementById('b'+id).options[k].selected == true) {
      var i = b_val[k].list;
      break;
    }
  }

  for (var k=0; k<c_val[i].length; k++) {
    if (document.getElementById('c'+id).options[k].selected == true) {
      var j = c_val[i][k].list;
      break;
    }
  }

  for (var k=0; k<mdl_val[i][j].length; k++) {
    if (document.getElementById('mdl'+id).options[k].selected == true) {
      //console.log(cht_val[i][j][mdl_val[i][j][k].list]);
   
      var img_val = cht_val[i][j][mdl_val[i][j][k].list].img.split('#');
      var mdl = cht_val[i][j][mdl_val[i][j][k].list].api.split('/')[0].split(',')[3];
      var url = host + "/cht_new/cht_multiv_gis_lib.php?mode=1&tm_ef=" + tm_arr[0] + "&tm_fc=" + tm_arr[id] + "&dir1=" + img_val[3] + "&img_name=" + img_val[4];
      url += "&type=" + cht_val[i][j][mdl_val[i][j][k].list].type + "&save=" + document.getElementById('save').value + "&zoom_x=" + zoom_x + "&zoom_y=" + zoom_y + "&zoom_level=" + zoom_level;
      url += "&mdl=" + mdl + "&area=" + cht_area;
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

            if (!img_arr[id]) {
              img_arr[id] = new Object();
            }
            img_arr[id].src  = l;
            img_arr[id].b    = i;
            img_arr[id].api  = cht_val[i][j][mdl_val[i][j][k].list].api;
            img_arr[id].type = cht_val[i][j][mdl_val[i][j][k].list].type;
            img_arr[id].itv  = cht_val[i][j][mdl_val[i][j][k].list].img.split('#')[2];
            img_arr[id].dir  = cht_val[i][j][mdl_val[i][j][k].list].img.split('#')[3];
            img_arr[id].img_name  = cht_val[i][j][mdl_val[i][j][k].list].img.split('#')[4];
            if (cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("afs") == -1 && cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("ana") == -1) {
              img_arr[id].map = cht_val[i][j][mdl_val[i][j][k].list].map;
            }
            else {
              if (cht_area == "EA_CHT") img_arr[id].map = "EA,20,36,0,50";
              else if (cht_area == "E10") img_arr[id].map = "E10,20,36,0,50";
              else if (cht_area == "TP") img_arr[id].map = "TP,20,36,0,50";
              else if (cht_area == "NHEM") img_arr[id].map = "NHEM,20,36,0,50";
              else if (cht_area == "WORLD") img_arr[id].map = "WORLD,20,36,0,50";
            }

            if (cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("afs") == -1 && cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("ana") == -1) {
              document.getElementById("map"+id).style.display = 'none';
              document.getElementById("tm_select"+id).style.display = 'block';
              if (l[0] != "@") {
                document.getElementById("nocht"+id).style.display = 'none';
                document.getElementById("hidden"+id).innerHTML = "<img id=hidden_img" + id + " src='" + host + l + "' onload=chtView(" + id + ",'" + l + "'," + curAjaxNum + "); onerror=chtErr(" + id + "," + curAjaxNum + ");>";
              }
              else {
                document.getElementById("nocht"+id).style.display = 'block';
                if (document.getElementById("img"+id) != null) document.getElementById("cht"+id).removeChild(document.getElementById("img"+id));
              }

              if (cht_val[i][j][mdl_val[i][j][k].list].type == "fct0") {
                document.getElementById("tm_select"+id).style.display = 'none';                
              }
            }
            else {
              if (cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("ana") != -1) {
                document.getElementById("tm_select"+id).style.display = 'none';                
              }
              else {
                document.getElementById("tm_select"+id).style.display = 'block';
              }

              if (l[0] != "@") {
                document.getElementById("map"+id).style.display = 'block';
                document.getElementById("nocht"+id).style.display = 'none';
                if (document.getElementById("img"+id) != null) document.getElementById("cht"+id).removeChild(document.getElementById("img"+id));
                img_arr[id].url = l;

                if (l.indexOf("png") == -1) {
                  removeImg(null, id);
                  if (autoload == 1 && document.getElementById("loading").style.display != "block") {
                    document.getElementById("loading").style.display = "block";
                    loadImage(moving);
                  }
                }

                console.log(gis_img_bounds);
                if (gis_img[id] == undefined || gis_img[id]._mapToAdd == null) {
                  if (l.indexOf("png") != -1) {
                    gis_img[id] = L.Proj.imageOverlay(host + l + "?timestamp=" + new Date().getTime(), gis_img_bounds, {pane: "image"});
                  }
                  else {
                    gis_img[id] = L.Proj.imageOverlay(host + l + "&timestamp=" + new Date().getTime(), gis_img_bounds, {pane: "image"});
                  }
                  //gis_img[id] = L.imageOverlay(host + l + "?timestamp=" + new Date().getTime(), gis_img_bounds, {pane: "image"});
                  gis_img[id].addTo(map[id]);
                }
                else {
                  if (l.indexOf("png") != -1) {
                    gis_img[id].setUrl(host + l + "?timestamp=" + new Date().getTime()).setBounds(gis_img_bounds);
                  }
                  else {
                    gis_img[id].setUrl(host + l + "&timestamp=" + new Date().getTime()).setBounds(gis_img_bounds);
                  }
                }

                makeTitle(id);
              }
              else {
                document.getElementById("map"+id).style.display = 'none';
                document.getElementById("nocht"+id).style.display = 'block';
                if (document.getElementById("img"+id) != null) document.getElementById("cht"+id).removeChild(document.getElementById("img"+id));
              }
            }

            if (l[0] != "@") console.log("img" + id + ": " + host + l);
            else console.log("img" + id + ": @no data");
            getTileNumber(id);
          });
        }
      };
      xhr.send();
      break;
    }
  }

  hidePopup();
  //mapSync();
}

// 일기도 이미지 정보 세팅
function doChtInfo(id) {
  for (var k=0; k<b_val.length; k++) {
    if (document.getElementById('b'+id).options[k].selected == true) {
      var i = b_val[k].list;
      break;
    }
  }

  for (var k=0; k<c_val[i].length; k++) {
    if (document.getElementById('c'+id).options[k].selected == true) {
      var j = c_val[i][k].list;
      break;
    }
  }

  for (var k=0; k<mdl_val[i][j].length; k++) {
    if (document.getElementById('mdl'+id).options[k].selected == true) {
   
      var img_val = cht_val[i][j][mdl_val[i][j][k].list].img.split('#');
      var mdl = cht_val[i][j][mdl_val[i][j][k].list].api.split('/')[0].split(',')[3];

      if (!img_arr[id]) {
        img_arr[id] = new Object();
      }
      img_arr[id].b    = i;
      img_arr[id].api  = cht_val[i][j][mdl_val[i][j][k].list].api;
      img_arr[id].type = cht_val[i][j][mdl_val[i][j][k].list].type;
      img_arr[id].itv  = cht_val[i][j][mdl_val[i][j][k].list].img.split('#')[2];
      img_arr[id].dir  = cht_val[i][j][mdl_val[i][j][k].list].img.split('#')[3];
      img_arr[id].img_name  = cht_val[i][j][mdl_val[i][j][k].list].img.split('#')[4];
      if (cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("afs") == -1 && cht_val[i][j][mdl_val[i][j][k].list].type.indexOf("ana") == -1) {
        img_arr[id].map = cht_val[i][j][mdl_val[i][j][k].list].map;
      }
      else {
        if (cht_area == "EA_CHT") img_arr[id].map = "EA,20,36,0,50";
        else if (cht_area == "E10") img_arr[id].map = "E10,20,36,0,50";
        else if (cht_area == "TP") img_arr[id].map = "TP,20,36,0,50";
        else if (cht_area == "NHEM") img_arr[id].map = "NHEM,20,36,0,50";
        else if (cht_area == "WORLD") img_arr[id].map = "WORLD,20,36,0,50";
      }

      break;
    }
  }
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
  if (ext_mode == "hlt") {
    document.getElementById("img"+id).removeAttribute('onmousedown');
    document.getElementById("img"+id).setAttribute('onmousemove', 'img_mousemove(event,img' + id + ');');
    //document.getElementById("cht"+id).innerHTML = "<img id=img" + id + " src='http://cht.kma.go.kr" + img_arr[id].src + "' style='width:" + width + ";' onmousemove='img_on(img" + id + ",event);'>";
  }
  else {
    document.getElementById("img"+id).setAttribute('onmousemove', 'img_mousemove(event,img' + id + ');');
    document.getElementById("img"+id).setAttribute('onmousedown', 'img_click(event,img' + id + ');');
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

// 일기도 모아보기 리스트 조회(ajax 호출)
function fnGetThemeInfoList() {
  var group_list = [];
  var group_val  = [];
  var theme_list = [];
  var theme_val  = [];

  var url = host + "/cht_new/vtheme.ini?_=" + new Date().getTime();
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

        var d = l.split(':');
 
        if (!theme_val[parseInt(d[0])]) {
          theme_list[parseInt(d[0])] = [];
          theme_val[parseInt(d[0])]  = [];
        }  

        if (group_list.indexOf(d[0]) < 0) {
          group_list.push(d[0]);
          group_val[group_list.length-1] = {};
          group_val[group_list.length-1].list = d[0];
          group_val[group_list.length-1].text = d[1];
        }

        if (theme_list[parseInt(d[0])].indexOf(d[2]) < 0) {
          theme_list[parseInt(d[0])].push(d[2]);
        }

        theme_val[parseInt(d[0])][parseInt(d[2])] = {};
        theme_val[parseInt(d[0])][parseInt(d[2])].list  = d[2];
        theme_val[parseInt(d[0])][parseInt(d[2])].text  = d[3];
        theme_val[parseInt(d[0])][parseInt(d[2])].val   = d[4];
      });

      group_val.sort(function(a,b){
        return(parseInt(a.list)<parseInt(b.list))?-1:(parseInt(a.list)>parseInt(b.list))?1:0;
      });

      for (var i=0; i<group_val.length; i++) {
        theme_list[group_val[i].list].sort(function(a,b){
          return(parseInt(a)<parseInt(b))?-1:(parseInt(a)>parseInt(b))?1:0;
        });
      }

      var count = 0;
      var option = [];
      var optGroup = [];
      option[count] = document.createElement('option');
      option[count].text = '일기도 모음';
      option[count].value = 0;
      document.getElementById('theme').appendChild(option[count]);
      for (var i=0; i<group_list.length; i++) {
        optGroup[i] = document.createElement('OPTGROUP')
        optGroup[i].label = group_val[i].text;
        document.getElementById('theme').appendChild(optGroup[i]);
        for (var j=0; j<theme_list[group_val[i].list].length; j++) {
          count++;
          option[count] = document.createElement('option');
          option[count].text  = theme_val[group_val[i].list][theme_list[group_val[i].list][j]].text;
          option[count].value = theme_val[group_val[i].list][theme_list[group_val[i].list][j]].val;
          optGroup[i].appendChild(option[count]);
        }
      }

    }
  };
  xhr.send();
}

// 일기도 모아보기 표출 적용
function doTheme() {
  for (var i=0; i<document.getElementById('theme').options.length; i++) {
    if (document.getElementById('theme').options[i].selected == true) {
      if (i == 0) return;
      d = document.getElementById('theme').options[i].value.split('/');

      if (d.length == 1) {
        document.getElementById('window').value = "1,1";
      }
      else if (d.length == 2) {
        document.getElementById('window').value = "1,2";
      }
      else if (d.length == 3) {
        document.getElementById('window').value = "1,3";
      }
      else if (d.length == 4) {
        document.getElementById('window').value = "2,2";
      }
      else if (d.length == 6) {
        document.getElementById('window').value = "2,3";
      }
      else if (d.length == 9) {
        document.getElementById('window').value = "3,3";
      }

      for (var j=0; j<document.getElementById('mdl1').options.length; j++) {
        if (document.getElementById('mdl1').options[j].selected == true) {
          var mdl_text = document.getElementById('mdl1').options[j].text;      
        }
      }

      for (var j=0; j<d.length; j++) {
        var id = win_num[j+1];
        for (var k=0; k<document.getElementById('b'+id).options.length; k++) {
          if (document.getElementById('b'+id).options[k].value == d[j].split(',')[0]) {
            document.getElementById('b'+id).options[k].selected = true;
            doCht(-1, id);
            break;
          }
        }

        for (var k=0; k<document.getElementById('c'+id).options.length; k++) {
          if (document.getElementById('c'+id).options[k].value == d[j].split(',')[1]) {
            document.getElementById('c'+id).options[k].selected = true;
            doCht(-1, id);
            break;
          }
        }

        var mdl_ok = 0;
        for (var k=0; k<document.getElementById('mdl'+id).options.length; k++) {
          if (d[j].split(',')[2] == 0) {
            if (document.getElementById('mdl'+id).options[k].text == mdl_text) {
              document.getElementById('mdl'+id).options[k].selected = true;
              //doChtVal(id);
              mdl_ok = 1;
              break;
            }
          }
          else {
            if (document.getElementById('mdl'+id).options[k].value == d[j].split(',')[2]) {
              document.getElementById('mdl'+id).options[k].selected = true;
              //doChtVal(id);
              mdl_ok = 1;
              break;
            }
          }
        }

        if (mdl_ok == 0) {
          document.getElementById('mdl'+id).options[0].selected = true;
          //doChtVal(id);
        }
      }

      doWindow();
      break;
    }
  }

  document.getElementById('theme').options[0].selected = true;
}

// ******시간 처리
// 달력(popupCalendar.js에서 callback)
function calPress() {
  var tm = targetId.value;
  tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + tm.substring(11,13) + tm.substring(14,16);
  //console.log(targetId.name.toString().slice(2,targetId.name.length));
  //tm_arr[parseInt(targetId.name.toString().split("tm")[1])] = tm;

  var id = targetId.name.slice(targetId.name.indexOf("tm")+2,targetId.name.length);

  // 발표시간 전체변경
  if (id == "Chg") {
    document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_arr[i] = tm;
      console.log("tm" + i + ":" + tm);
      doChtInfo(i);
    }

    for (var i=1; i<=ncht_max; i++) {
      doChtVal(i);
    }
  }
  else {
    tm_arr[parseInt(id)] = tm;
    console.log(targetId.name + ":" + tm);

    // 발효시간 변경
    if (id == 0) {
      fnTimeBar();
      for (var i=1; i<=window_xy; i++) {
        doChtVal(win_num[i]);
      }
    }
    // 발표시간 변경
    else {
      doChtVal(id);
    }
  }
}

//  발표시간 입력 및 선택(id = 0:발효시간, 1~6:발표시간, -1:발표시간 전체변경)
function tm_input(id) {
  if (id != -1) {
    var tm = document.getElementById("tm"+id).value;
  }
  else {
    var tm = document.getElementById("tmChg").value;
  }
  if (event.keyCode == 13) {
      if (tm.length != 16) {
          alert("시간 입력이 틀렸습니다. (년.월.일.시:분)");
          if (id != -1) {
            tm = tm_arr[id];
            document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          else {
            tm = tm_arr[1];
            document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          return;
      }else if (tm.charAt(4) != "." || tm.charAt(7) != "." || tm.charAt(10) != "." || tm.charAt(13) != ":") {
          alert("시간 입력 양식이 틀렸습니다. (년.월.일.시:분)");
          if (id != -1) {
            tm = tm_arr[id];
            document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          }
          else {
            tm = tm_arr[1];
            document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
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

            if (id != -1) {
              tm = tm_arr[id];
              document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            }
            else {
              tm = tm_arr[1];
              document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            }
            return;
          }
      }

      var HH = parseInt(tm.substring(11,13)/tm_itv)*parseInt(tm_itv);
      var MI = 0;
      tm = tm.substring(0,4) + tm.substring(5,7) + tm.substring(8,10) + addZeros(HH,2) + addZeros(MI,2);
      if (id != -1) {
        document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
        tm_arr[id] = tm;
        console.log("tm" + id + ":" + tm);

        if (id == 0) {
          fnTimeBar();
          for (var i=1; i<=window_xy; i++) {
            doChtVal(win_num[i]);
          }
        }
        else {
          doChtVal(id);
        }
      }
      else {
        document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
        for (var i=1; i<=ncht_max; i++) {
          document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          tm_arr[i] = tm;
          console.log("tm" + i + ":" + tm);
          doChtInfo(i);
        }

        for (var i=1; i<=ncht_max; i++) {
          doChtVal(i);
        }
      }
  }else if (event.keyCode == 45 || event.keyCode == 46 || event.keyCode == 58) {
      event.returnValue = true;
  }else if (event.keyCode >= 48 && event.keyCode <= 57) {
      event.returnValue = true;
  }else {
      event.returnValue = false;
  }
}

//  최근시간(mode = 0:첫 로드 시 / id = 0:발효시간, 1~6:발표시간, -1:발표시간 전체변경)
function tm_init(mode, id, callback) {
  if (id == 0) {
    var now = new Date();
    var HH = parseInt(now.getHours()/tm_itv)*parseInt(tm_itv);
    var tm = addZeros(now.getFullYear(),4) + addZeros(now.getMonth()+1,2) + addZeros(now.getDate(),2) + addZeros(HH,2) + addZeros(0,2);

    document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_arr[id] = tm;
    console.log("tm" + id + ":" + tm);
    fnTimeBar();
    if (mode == 1) {
      for (var i=1; i<=window_xy; i++) {
        doChtVal(win_num[i]);
      }
    }
  }
  else {
    return new Promise(function(resolve, reject) {
      var url = host + "/cht_new/cht_multiv_gis_lib.php?mode=0";
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

        if (id != -1) {
          document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          tm_arr[id] = tm;
          console.log("tm" + id + ":" + tm);
          resolve(xhr.response);
          if (mode == 1) {
            doChtVal(id);
          }
        }
        else {
          resolve(xhr.response);
          document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
          for (var i=1; i<=ncht_max; i++) {
            document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
            tm_arr[i] = tm;
            console.log("tm" + i + ":" + tm);
            doChtInfo(i);
          }

          for (var i=1; i<=ncht_max; i++) {
            doChtVal(i);
          }
        }
      };
      xhr.send();
    });
  }
}

// 시간 이동(id = 0:발효시간, 1~6:발표시간, -1:발표시간 전체변경)
function tm_move(moving, id) {
  var n = moving.length - 1;
  var mode = moving.charAt(n);
  var value = parseInt(moving);

  if (id != -1) {
    var tm = document.getElementById("tm"+id).value;
  }
  else {
    var tm = document.getElementById("tmChg").value;
  }
  var YY = tm.substring(0,4);
  var MM = tm.substring(5,7);
  var DD = tm.substring(8,10);
  var HH = tm.substring(11,13);
  var MI = tm.substring(14,16);
  HH = parseInt(tm.substring(11,13)/tm_itv)*parseInt(tm_itv);
  var date = new Date(YY, MM-1, DD, HH, MI);

  if (mode == "H") {
    //date.setHours(date.getHours() + value);
    date.setTime(date.getTime() + value*60*60*1000);
  }
  var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

  if (id != -1) {
    document.getElementById("tm"+id).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    tm_arr[id] = tm;
    console.log("tm" + id + ":" + tm);

    if (id == 0) {
      fnTimeBar();

      if (value == 0) {
        for (var i=1; i<=window_xy; i++) {
          doChtInfo(win_num[i]);
        }
      }

      for (var i=1; i<=window_xy; i++) {
        doChtVal(win_num[i], 0, value);
      }
    }
    else {
      doChtVal(id);
    }
  }
  else {
    document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById("tm"+i).value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
      tm_arr[i] = tm;
      console.log("tm" + i + ":" + tm);
      doChtInfo(i);
    }

    for (var i=1; i<=ncht_max; i++) {
      doChtVal(i);
    }
  }
}

// 시간 이동
function tm_next() {
  if (img_arr[1].type.indexOf("afs") != -1 || img_arr[1].type.indexOf("ana") != -1 || img_arr[1].type.indexOf("sea") != -1 || document.getElementById('next').checked == false) {
    tm_move('+' + tm_itv + 'H', 0);
  }
  else {
    if (img_arr[1].itv == 3 || img_arr[1].itv == 6 || img_arr[1].itv == 12) {
      var tm = tm_arr[0];
      var YY = tm.substring(0,4);
      var MM = tm.substring(4,6);
      var DD = tm.substring(6,8);
      var HH = tm.substring(8,10);
      var MI = tm.substring(10,12);
      var date_ef = new Date(YY, MM-1, DD, HH, MI);

      var tm = tm_arr[1];
      var YY = tm.substring(0,4);
      var MM = tm.substring(4,6);
      var DD = tm.substring(6,8);
      var HH = tm.substring(8,10);
      var MI = tm.substring(10,12);
      var date = new Date(YY, MM-1, DD, HH, MI);

      var tm_diff = (date_ef - date)/(60*60*1000);

      if (img_arr[1].itv == 3) {
        if      (tm_diff < 84) tm_move('+3H', 0);
        else if (tm_diff < 96) {
          if (tm_diff % 6 != 0) tm_move('+' + (6 - tm_diff % 6) + 'H', 0);
          else tm_move('+6H', 0);
        }
        else {
          if (tm_diff % 12 != 0) tm_move('+' + (12 - tm_diff % 12) + 'H', 0);
          else tm_move('+12H', 0);
        }
      }
      else {
        if (tm_diff % img_arr[1].itv != 0) {
          tm_move('+' + (img_arr[1].itv - tm_diff % img_arr[1].itv) + 'H', 0);
        }
        else tm_move('+' + img_arr[1].itv + 'H', 0);
      }
    }
    else {
      tm_move('+' + tm_itv + 'H', 0);
    }
  }
}

// 시간 이동
function tm_prev() {
  if (img_arr[1].type.indexOf("afs") != -1 || img_arr[1].type.indexOf("ana") != -1 || img_arr[1].type.indexOf("sea") != -1 || document.getElementById('next').checked == false) {
    tm_move('-' + tm_itv + 'H', 0);
  }
  else {
    if (img_arr[1].itv == 3 || img_arr[1].itv == 6 || img_arr[1].itv == 12) {
      var tm = tm_arr[0];
      var YY = tm.substring(0,4);
      var MM = tm.substring(4,6);
      var DD = tm.substring(6,8);
      var HH = tm.substring(8,10);
      var MI = tm.substring(10,12);
      var date_ef = new Date(YY, MM-1, DD, HH, MI);

      var tm = tm_arr[1];
      var YY = tm.substring(0,4);
      var MM = tm.substring(4,6);
      var DD = tm.substring(6,8);
      var HH = tm.substring(8,10);
      var MI = tm.substring(10,12);
      var date = new Date(YY, MM-1, DD, HH, MI);

      var tm_diff = (date_ef - date)/(60*60*1000);

      if (img_arr[1].itv == 3) {
        if      (tm_diff <= 84) tm_move('-3H', 0);
        else if (tm_diff <= 96) {
          if (tm_diff % 6 != 0) tm_move('-' + (tm_diff % 6) + 'H', 0);
          else tm_move('-6H', 0);
        }
        else {
          if (tm_diff % 12 != 0) tm_move('-' + (tm_diff % 12) + 'H', 0);
          else tm_move('-12H', 0);
        }
      }
      else {
        if (tm_diff % img_arr[1].itv != 0) {
          tm_move('-' + (tm_diff % img_arr[1].itv) + 'H', 0);
        }
        else tm_move('-' + img_arr[1].itv + 'H', 0);
      }
    }
    else {
      tm_move('-' + tm_itv + 'H', 0);
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
/*
  if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {
    if (event.srcElement.attributes.class != undefined) {
      if (event.srcElement.attributes.class.value.indexOf("TimeBox") != -1) return;
      if (event.srcElement.attributes.class.value.indexOf("prevent-keydown") != -1) return;
    }
  }
  else {
    if (event.path[0].attributes.class != undefined) {
      if (event.path[0].attributes.class.value.indexOf("TimeBox") != -1) return;
      if (event.path[0].attributes.class.value.indexOf("prevent-keydown") != -1) return;
    }
  }
*/

  if (event.keyCode == 122) { // F11
    return -1;
  }
  else if(event.keyCode == 116) { // F5
    return -1;
  }

  if (event.srcElement.attributes.class != undefined) {
    if (event.srcElement.attributes.class.value.indexOf("TimeBox") != -1) return -1;
    if (event.srcElement.attributes.class.value.indexOf("prevent-keydown") != -1) return -1;
  }

  if (opt == 0) {
    if (event.srcElement.attributes.class != undefined) {
      if (event.srcElement.attributes.class.value.indexOf("TimeBox") != -1) return -1;
      if (event.srcElement.attributes.class.value.indexOf("prevent-keydown") != -1) return -1;
    }

    if (document.getElementById("loading").style.display == "block") {
      return 0;
    }

    if(event.keyCode == 49) {   // 1번 키
      ext_sel("zoom");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 50) {   // 2번 키
      ext_sel("skew");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 51) {   // 3번 키
      ext_sel("mto");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 52) {   // 4번 키
      ext_sel("mdl");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 53) {   // 5번 키
      ext_sel("crss_sct");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 54) {   // 6번 키
      ext_sel("hlt");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 55) {   // 7번 키
      ext_sel("lmto");
      fadeOut(document.getElementById('extraLayer'));
    }
    else if(event.keyCode == 56) {   // 8번 키
      ext_sel("ruler");
      fadeOut(document.getElementById('extraLayer'));
    }
    else {
      if(event.keyCode == 37) {        // 왼 화살표
        if (event.ctrlKey) {
          if (cht_area == "E10") tm_move('-6H', 0);
          else tm_move('-12H', 0);
        }
        else {
          //tm_move('-3H', 0);
          tm_prev();
        }
      }
      else if(event.keyCode == 39) {   // 오른 화살표
        if (event.ctrlKey) {
          if (cht_area == "E10") tm_move('+6H', 0);
          else tm_move('+12H', 0);
        }
        else {
          //tm_move('+3H', 0);
          tm_next();
        }
      }
      else if(event.keyCode == 38) {   // 위 화살표
        if (event.ctrlKey) {
          if (cht_area == "E10") tm_move('+12H', 0);
          else tm_move('+24H', 0);
        }
        else {
          if (cht_area == "E10") tm_move('+3H', 0);
          else tm_move('+6H', 0);
        }
      }
      else if(event.keyCode == 40) {   // 아래 화살표
        if (event.ctrlKey) {
          if (cht_area == "E10") tm_move('-12H', 0);
          else tm_move('-24H', 0);
        }
        else {
          if (cht_area == "E10") tm_move('-3H', 0);
          else tm_move('-6H', 0);
        }
      }
      else if(event.keyCode == 85) {   // U
        mdl_chg('UM');
      }
      else if(event.keyCode == 69) {   // E
        mdl_chg('ECMWF');
      }
      else if(event.keyCode == 75) {   // K
        mdl_chg('KIM');
      }
      else if(event.keyCode == 76) {   // L
        if (event.ctrlKey) {
          if (document.getElementById("autoload").checked == 1) {
            document.getElementById("autoload").checked = 0;
            autoload = 0;
          }
          else {
            document.getElementById("autoload").checked = 1;
            autoload = 1;
          }
        }
        else {
          loadImage();
        }
      }
      else if(event.keyCode == 33) {        // Page Up
        fn_btnClick('tm');
        tm_move('+12H', -1);
        fn_btnClick('tm');
      }
      else if(event.keyCode == 34) {   // Page Down
        fn_btnClick('tm');
        tm_move('-12H', -1);
        fn_btnClick('tm');
      }
      else if(event.keyCode == 27) {   // ESC
        tmLayer.style.display = 'none';
        extraLayer.style.display = 'none';
        ctrlLayer.style.display = 'none';
        document.getElementById("notice").style.display = "none";
        document.getElementById("screenshot").style.display = "none";
        hidePopup();
      }
      else if(event.keyCode == 78) {   // N (now)
        tm_init(1, 0);
      }
      else if(event.keyCode == 48) {   // 0 (발효시간 동기화)
        fn_btnClick('tm');
        document.getElementById('tm0').value = document.getElementById('tmChg').value;
        tm_move('+0H', 0);
        fn_btnClick('tm');
      }
    }
  }
  else {
    if (ext_mode == "hlt") {
      for (var i=1; i<=window_xy; i++) {
        if (img_arr[win_num[i]].map[0] == "X") continue;  
        document.getElementById('Highlight'+win_num[i]).style.visibility = 'visible';
      }
    }
  }


  function fadeOut(el) {
    el.style.opacity = 1;
    el.style.display = "block";

    fade();

    function fade() {
      var val = parseFloat(el.style.opacity);
      if      (val > 0.8) var chg = 0.008;
      else if (val > 0.5) var chg = 0.010;
      else if (val > 0.2) var chg = 0.015;
      else                var chg = 0.020;

      if ((el.style.opacity -= chg) < 0) {
        el.style.display = "none";
        //el.style.opacity = 1;
      }
      else {
        requestAnimationFrame(fade);
      }
    }
  }

  return 0;
}

// Time Bar 생성
function fnTimeBar()
{
    var YY = tm_arr[0].substring(0,4);
    var MM = tm_arr[0].substring(4,6);
    var DD = tm_arr[0].substring(6,8);
    var HH = tm_arr[0].substring(8,10);
    var MI = tm_arr[0].substring(10,12);
    var date_ef = new Date(YY, MM-1, DD, HH, MI);
    var date = new Date;

    if (tm_st == 0) {
      date.setTime(date_ef.getTime() - tm_itv*3*60*60*1000);
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
  console.log("tm0" + ":" + tm);
  fnTimeBar();

  for (var i=1; i<=window_xy; i++) {
    doChtVal(win_num[i]);
  }
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
      extraLayer.style.display = 'none';
      ctrlLayer.style.display = 'none';

      var tm = tm_arr[1];
      document.getElementById("tmChg").value = tm.substring(0,4) + "." + tm.substring(4,6) + "." + tm.substring(6,8) + "." + tm.substring(8,10) + ":" + tm.substring(10,12);
    }
  }
  else if (func == 'extra') {
    if (extraLayer.style.display == 'block') {
      extraLayer.style.display = 'none';
    }
    else {
      extraLayer.style.opacity = 1;
      extraLayer.style.display = 'block';
      tmLayer.style.display = 'none';
      ctrlLayer.style.display = 'none';
    }
  }
  else if (func == 'ctrl') {
    if (ctrlLayer.style.display == 'block') {
      ctrlLayer.style.display = 'none';
    }
    else {
      ctrlLayer.style.opacity = 1;
      ctrlLayer.style.display = 'block';
      tmLayer.style.display = 'none';
      extraLayer.style.display = 'none';
      fnZoomReset();
    }
  }
}

// 부가기능 선택
function ext_sel(mode)
{
  document.getElementById("zoom_input").style.backgroundColor = "#ffffff";
  document.getElementById("skew_input").style.backgroundColor = "#ffffff";
  document.getElementById("skew_input").value = " 단열선도 off ";
  document.getElementById("mto_input").style.backgroundColor = "#ffffff";
  document.getElementById("mto_input").value = " 연직시계열 off ";
  document.getElementById("mdl_input").style.backgroundColor = "#ffffff";
  document.getElementById("mdl_input").value = " 자료샘플링 off ";
  document.getElementById("lmto_input").style.backgroundColor = "#ffffff";
  document.getElementById("lmto_input").value = " 연직바람장 off ";
  document.getElementById("hlt_input").style.backgroundColor = "#ffffff";
  document.getElementById("hlt_input").value = " 하이라이트 off ";
  document.getElementById("crss_input").style.backgroundColor = "#ffffff";
  document.getElementById("crss_input").value = " 연직단면도 off ";
  document.getElementById("ruler_input").style.backgroundColor = "#ffffff";
  document.getElementById("ruler_input").value = " 거리재기 off ";
  document.getElementById("ruler_input").style.backgroundColor = "#ffffff";
  hidePopup();
  disableRuler();
  click_count = 0;

  for (var i=1; i<=ncht_max; i++) {
    if (map[i] == null) continue;
    map[i].off('mousemove', rulerMoving);
    map[i].off('zoomend', rulerZoom);
  }

  if (mode == "skew") {
    if (ext_mode == "skew") ext_mode = 0;
    else {
      document.getElementById("skew_input").style.backgroundColor = "#aaffaa";
      document.getElementById("skew_input").value = " 단열선도 on ";
      ext_mode = "skew";
    }
  }
  else if (mode == "mto") {
    if (ext_mode == "mto") ext_mode = 0;
    else {
      document.getElementById("mto_input").style.backgroundColor = "#aaffaa";
      document.getElementById("mto_input").value = " 연직시계열 on ";
      ext_mode = "mto";
    }
  }
  else if (mode == "mdl") {
    if (ext_mode == "mdl") ext_mode = 0;
    else {
      document.getElementById("mdl_input").style.backgroundColor = "#aaffaa";
      document.getElementById("mdl_input").value = " 자료샘플링 on ";
      ext_mode = "mdl";
    }
  }
  else if (mode == "lmto") {
    if (ext_mode == "lmto") ext_mode = 0;
    else {
      document.getElementById("lmto_input").style.backgroundColor = "#aaffaa";
      document.getElementById("lmto_input").value = " 연직바람장 on ";
      ext_mode = "lmto";
    }
  }
  else if (mode == "hlt") {
    if (ext_mode == "hlt") ext_mode = 0;
    else {
      document.getElementById("hlt_input").style.backgroundColor = "#aaffaa";
      document.getElementById("hlt_input").value = " 하이라이트 on ";
      ext_mode = "hlt";
    }
  }
  else if (mode == "crss_sct") {
    if (ext_mode == "crss_sct") ext_mode = 0;
    else {
      document.getElementById("crss_input").style.backgroundColor = "#aaffaa";
      document.getElementById("crss_input").value = " 연직단면도 on ";
      ext_mode = "crss_sct";
    }
  }
  else if (mode == "ruler") {
    if (ext_mode == "ruler") ext_mode = 0;
    else {
      document.getElementById("ruler_input").style.backgroundColor = "#aaffaa";
      document.getElementById("ruler_input").value = " 거리재기 on ";
      ext_mode = "ruler";

      for (var i=1; i<=ncht_max; i++) {
        if (map[i] == null) continue;
        map[i].on('mousemove', rulerMoving);
        map[i].on('zoomend', rulerZoom);
      }
    }
  }
  else if (mode == "zoom") {
    ext_mode = 0;
  }

  if (ext_mode == 0) {
    document.getElementById("zoom_input").style.backgroundColor = "#aaffaa";
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById("map"+i).style.cursor = "grab";
    }
  }
  else {
    for (var i=1; i<=ncht_max; i++) {
      document.getElementById("map"+i).style.cursor = "pointer";
    }
  }
}

// 거리재기 기능
function disableRuler(id) {
  if (id == undefined) {
    for (var i=1; i<=ncht_max; i++) {
      if (map[i] == null) continue;
      rulerNum[i] = 0;
      rulerLayer[i].clearLayers();
      rulerTextLayer[i].clearLayers();
      tempLayer[i].clearLayers();
      tempTextLayer[i].clearLayers();
    }
  }
  else {
    rulerNum[id] = 0;
    rulerLayer[id].clearLayers();
    rulerTextLayer[id].clearLayers();
    tempLayer[id].clearLayers();
    tempTextLayer[id].clearLayers();
  }
}

function rulerClicked(id) {
  var clickedPoints = [];
  clickedPoints[0] = L.latLng(lat1,lon1);
  clickedPoints[1] = L.latLng(lat2,lon2);

  var line = L.polyline([clickedPoints[0], clickedPoints[1]], {color: 'red', dashArray: '1,6', pane:"ruler"});
  rulerLayer[id].addLayer(line);
  var distance = map[id].distance(clickedPoints[0], clickedPoints[1])/1000.;  
  var bearing = fnGetBearingTr(parseFloat(clickedPoints[0].lat), parseFloat(clickedPoints[0].lng),
                                 parseFloat(clickedPoints[1].lat), parseFloat(clickedPoints[1].lng));

  var point = map[id].latLngToContainerPoint(clickedPoints[1]);
  var newPoint = L.point([point.x-20, point.y-30]);
  var text = L.marker(map[id].containerPointToLatLng(newPoint), {icon: L.divIcon({html: parseInt(distance) + "km " + parseInt(bearing) + "º", className: 'ruler'}), pane:"ruler"});
  rulerTextLayer[id].addLayer(text);

  r_obj[id][rulerNum[id]] = {};
  r_obj[id][rulerNum[id]].lat = clickedPoints[1].lat;
  r_obj[id][rulerNum[id]].lon = clickedPoints[1].lng;
  r_obj[id][rulerNum[id]].distance = distance;
  r_obj[id][rulerNum[id]].bearing = bearing;
  rulerNum[id]++;
}

function rulerMoving(e) {
  var id = e.target._container.id.slice(e.target._container.id.indexOf("map")+3,e.target._container.id.length);
  if (id != rulerMapId) {
    return;
  }

  if (click_count > 0){
    var clickedLatLong = L.latLng(lat1,lon1);
    var movingLatLong = e.latlng;
    tempLayer[id].clearLayers();
    tempTextLayer[id].clearLayers();

    var distance = map[id].distance(clickedLatLong, movingLatLong)/1000.;  
    var bearing = fnGetBearingTr(parseFloat(lat1), parseFloat(lon1),
                                 parseFloat(movingLatLong.lat), parseFloat(movingLatLong.lng));

    var line = L.polyline([clickedLatLong, movingLatLong], {color: 'gray', dashArray: '1,6', pane:"ruler"});
    tempLayer[id].addLayer(line);
    var circle = L.circleMarker(movingLatLong, {color: 'red', radius: 2, pane:"ruler"});
    tempLayer[id].addLayer(circle);

    var point = map[id].latLngToContainerPoint(movingLatLong);
    var newPoint = map[id].containerPointToLatLng(L.point([point.x-20, point.y-30]));
    var text = L.marker(newPoint, {icon: L.divIcon({html: parseInt(distance) + "km " + parseInt(bearing) + "º", className: 'ruler'}), pane:"ruler"});
    tempTextLayer[id].addLayer(text);
  }
}

function rulerZoom(e) {
  var id = e.target._container.id.slice(e.target._container.id.indexOf("map")+3,e.target._container.id.length);

  rulerTextLayer[id].clearLayers();
  for (var num = 0; num < rulerNum[id]; num++) {
    var point = map[id].latLngToContainerPoint([r_obj[id][num].lat, r_obj[id][num].lon]);
    var newPoint = L.point([point.x-20, point.y-30]);
    var text = L.marker(map[id].containerPointToLatLng(newPoint), {icon: L.divIcon({html: parseInt(r_obj[id][num].distance) + "km " + parseInt(r_obj[id][num].bearing) + "º", className: 'ruler'}), 
                    pane:"ruler"});
    rulerTextLayer[id].addLayer(text);
  }
}

// 두 지점 사이 각도 재기
function fnGetBearingTr(real_lat, real_lon, exp_lat, exp_lon) {

  // 현재 위치 :위도나 경도는 지구 중심을 기반으로 하는 각도이기 때문에 라디안 각도로 변환한다.
  var cur_lat_radian = parseFloat(real_lat * (3.141592 / 180));
  var cur_lon_radian = parseFloat(real_lon * (3.141592 / 180));

  // 목표 위치 :위도나 경도는 지구 중심을 기반으로 하는 각도이기 때문에 라디안 각도로 변환한다.
  var dest_lat_radian = parseFloat(exp_lat * (3.141592 / 180));
  var dest_lon_radian = parseFloat(exp_lon * (3.141592 / 180));

  // radian distance
  var radian_distance = parseFloat(Math.acos(Math.sin(cur_lat_radian) * Math.sin(dest_lat_radian) + Math.cos(cur_lat_radian) * Math.cos(dest_lat_radian) * Math.cos(cur_lon_radian - dest_lon_radian)));

  // 목적지 이동 방향을 구한다.(현재 좌표에서 다음 좌표로 이동하기 위해서는 방향을 설정해야 한다. 라디안값이다. // acos의 인수로 주어지는 x는 360분법의 각도가 아닌 radian 값이다.
  var radian_bearing = parseFloat(Math.acos((Math.sin(dest_lat_radian) - Math.sin(cur_lat_radian) * Math.cos(radian_distance)) / (Math.cos(cur_lat_radian) * Math.sin(radian_distance))));

  var true_bearing = 0;
  var sub_bearing = parseFloat(Math.sin(dest_lon_radian - cur_lon_radian));

  if (sub_bearing < 0) {
    true_bearing = parseFloat(radian_bearing * (180 / 3.141592));
    true_bearing = parseFloat(360 - true_bearing);
  }else {
    true_bearing = parseFloat(radian_bearing * (180 / 3.141592));
  }

  return Math.round(true_bearing);
}

// 수치모델 종류 전체변경
function mdl_chg(mdl)
{
  comp = 0;
  var data = document.getElementsByName("comp");
  for(var i = 0; i < data.length; i++) {
    data[i].checked = 0;
  }

  if (mdl == "KIM") {
    for (var i=1; i<=ncht_max; i++) {
      for (var j=0; j<document.getElementById("mdl"+i).options.length; j++) {
        if (document.getElementById("mdl"+i).options[j].selected == true) {
          var k = j;
          break;
        }
      }
      for (var j=0; j<document.getElementById("mdl"+i).options.length; j++) {
        if (document.getElementById("mdl"+i).options[k].text.indexOf("한반도") != -1) {
          if (document.getElementById("mdl"+i).options[j].text == "KIM(한반도)") {
            document.getElementById("mdl"+i).options[j].selected = true;
            break;
          }
        }
        else {
          if (document.getElementById("mdl"+i).options[j].text == "KIM") {
            document.getElementById("mdl"+i).options[j].selected = true;
            break;
          }
        }
      }
    }
  }
  else if (mdl == "UM") {
    for (var i=1; i<=ncht_max; i++) {
      for (var j=0; j<document.getElementById("mdl"+i).options.length; j++) {
        if (document.getElementById("mdl"+i).options[j].selected == true) {
          var k = j;
          break;
        }
      }
      for (var j=0; j<document.getElementById("mdl"+i).options.length; j++) {
        if (document.getElementById("mdl"+i).options[k].text.indexOf("한반도") != -1) {
          if (document.getElementById("mdl"+i).options[j].text == "UM(한반도)") {
            document.getElementById("mdl"+i).options[j].selected = true;
            break;
          }
        }
        else {
          if (document.getElementById("mdl"+i).options[j].text == "UM전구") {
            document.getElementById("mdl"+i).options[j].selected = true;
            break;
          }
        }
      }
    }
  }
  else if (mdl == "ECMWF") {
    for (var i=1; i<=ncht_max; i++) {
      for (var j=0; j<document.getElementById("mdl"+i).options.length; j++) {
        if (document.getElementById("mdl"+i).options[j].text == "ECMWF") {
          document.getElementById("mdl"+i).options[j].selected = true;
          break;
        }
      }
    }
  }
  tm_move('+0H', 0);
}

// API<->이미지 변경
function api_chg(opt)
{
  if (opt == "API"){
    var input  = "(이미지)";
    var output = "(GIS)";
  }
  else {
    var input  = "(GIS)";
    var output = "(이미지)";
  }

  for (var id=1; id<=ncht_max; id++) {
    for (var i=0; i<b_val.length; i++) {
      if (document.getElementById('b'+id).options[i].selected == true) {
        if (document.getElementById('b'+id).options[i].text.indexOf(input) != -1) {
          var b_text = document.getElementById('b'+id).options[i].text.slice(0,document.getElementById('b'+id).options[i].text.indexOf(input)) + output;
          for (var ii=0; ii<b_val.length; ii++) {
            if (b_val[ii].text == b_text) {
              for (var j=0; j<c_val[b_val[i].list].length; j++) {
                if (document.getElementById('c'+id).options[j].selected == true) {
                  var c_text = document.getElementById('c'+id).options[j].text;
                  for (var jj=0; jj<c_val[b_val[ii].list].length; jj++) {
                    if (c_val[b_val[ii].list][jj].text == c_text) {
                      for (var k=0; k<mdl_val[b_val[i].list][c_val[b_val[i].list][j].list].length; k++) {
                        if (document.getElementById('mdl'+id).options[k].selected == true) {
                          var mdl_text = document.getElementById('mdl'+id).options[k].text;
                          for (var kk=0; kk<mdl_val[b_val[ii].list][c_val[b_val[ii].list][jj].list].length; kk++) {
                            if (mdl_val[b_val[ii].list][c_val[b_val[ii].list][jj].list][kk].text == mdl_text) {
                              document.getElementById("b"+id).options[ii].selected = true;
                              doCht(-1,id);
                              document.getElementById("c"+id).options[jj].selected = true;
                              doCht(-1,id);
                              document.getElementById("mdl"+id).options[kk].selected = true;
                              //doChtVal(id);
                              break;
                            }
                          }
                          break;
                        }
                      }
                      break;
                    }
                  }
                  break;
                }
              }
              break;
            }
          }
        } 
        break;
      }
    }
  }

  tm_move('+0H', 0);
}

// 영역 전체 전체변경
function area_chg(reg)
{
  var n = area_info.findIndex(function(x){return x.area == cht_area});
  area_info[n].zoom_x = zoom_x;
  area_info[n].zoom_y = zoom_y;
  area_info[n].zoom_level = zoom_level;
  area_info[n].center = gis_center;
  area_info[n].bounds = gis_img_bounds;

  var n = area_info.findIndex(function(x){return x.area == reg});
  cht_area = reg;

  if (reg == "E10") {
    zoom_x = '5400000';
    zoom_y = '5400000';
    zoom_level = 2;
    gis_center = [37.396154, 125.194221];
    gis_img_bounds = [[43.893845, 114.366562], [29.487047, 133.211594]];

    tm_itv = 1;
    document.getElementById("tm_1hr").style.display = "block";
    document.getElementById("hotkey").innerHTML = "&nbsp;&nbsp;&nbsp;← : -1H, &nbsp;→ : +1H, &nbsp;↓ : -3H, &nbsp;↑ : +3H";
  }
  else {
    zoom_x = area_info[n].zoom_x;
    zoom_y = area_info[n].zoom_y;
    zoom_level = area_info[n].zoom_level;
    gis_center = area_info[n].center;
    gis_img_bounds = area_info[n].bounds;

    tm_itv = 3;
    document.getElementById("tm_1hr").style.display = "none";
    document.getElementById("hotkey").innerHTML = "&nbsp;&nbsp;&nbsp;← : -3H, &nbsp;→ : +3H, &nbsp;↓ : -6H, &nbsp;↑ : +6H";
  }
  fnTimeBar();

  for (var i=1; i<=ncht_max; i++) {
    removeImg(null, i);
    map_init(reg, i);
  }

  if (cht_area == "WORLD") {
    if (world_lon == undefined) {
      world_lon = 126.0;
      geojsonWorldData = sliceGeojson(geojsonData, world_lon);
    }
  }

  for (var i=1; i<=ncht_max; i++) {
    if (i==1) {
      if (gis_proj4 != area_info[n].map_attrs.proj4string) {
        gis_proj4 = area_info[n].map_attrs.proj4string;
        if (cht_area == "WORLD") {
          fnGeoBounds(map[i], geojsonWorldData);
        }
        else {
          fnGeoBounds(map[i], geojsonData);
        }
        fnGeoBounds(map[i], lakeData);
        fnGeoBounds(map[i], koreaData);
        fnGeoBounds(map[i], koreaCityData);
      }
    }
  }

  tm_move('+0H', 0);
}

// 저장된 이미지 불러오기 기능 선택
function save_sel()
{
  if (document.getElementById('save').value == 0) document.getElementById('save').value = 1;
  else document.getElementById('save').value = 0;
  tm_move('+0H', 0);
}

// 모델 비교
function mdl_comp(opt)
{
  var mode1 = 0, mode2 = 0, mode3 = 0, numx = 0, numy = 0;

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
  
  switch (opt) {
    case 1:
      if ((document.getElementById("mdl1").options.length == 3)&&(document.getElementById("mdl1").options[0].text == "KIM")&&(document.getElementById("mdl1").options[1].text == "UM전구")&&(document.getElementById("mdl1").options[2].text == "ECMWF")){
        var mode1 = 1;
      }

      if (window_y >= 2) {
        if ((document.getElementById("mdl4").options.length == 3)&&(document.getElementById("mdl4").options[0].text == "KIM")&&(document.getElementById("mdl4").options[1].text == "UM전구")&&(document.getElementById("mdl4").options[2].text == "ECMWF")){
          var mode2 = 1;
        }
      }

      if (window_y >= 3) {
        if ((document.getElementById("mdl7").options.length == 3)&&(document.getElementById("mdl7").options[0].text == "KIM")&&(document.getElementById("mdl7").options[1].text == "UM전구")&&(document.getElementById("mdl7").options[2].text == "ECMWF")){
          var mode3 = 1;
        }
      }
      break;
    case 2:
      if ((document.getElementById("mdl1").options.length == 3)&&(document.getElementById("mdl1").options[0].text == "KIM")&&(document.getElementById("mdl1").options[1].text == "UM전구")&&(document.getElementById("mdl1").options[2].text == "ECMWF")){
        var mode1 = 2;
      }

      if (window_y >= 2) {
        if ((document.getElementById("mdl4").options.length == 3)&&(document.getElementById("mdl4").options[0].text == "KIM")&&(document.getElementById("mdl4").options[1].text == "UM전구")&&(document.getElementById("mdl4").options[2].text == "ECMWF")){
          var mode2 = 2;
        }
      }

      if (window_y >= 3) {
        if ((document.getElementById("mdl7").options.length == 3)&&(document.getElementById("mdl7").options[0].text == "KIM")&&(document.getElementById("mdl7").options[1].text == "UM전구")&&(document.getElementById("mdl7").options[2].text == "ECMWF")){
          var mode3 = 2;
        }
      }
      break;
    case 3:
      if ((document.getElementById("mdl1").options.length == 3)&&(document.getElementById("mdl1").options[0].text == "KIM")&&(document.getElementById("mdl1").options[1].text == "UM전구")&&(document.getElementById("mdl1").options[2].text == "ECMWF")){
        var mode1 = 3;
      }

      if (window_y >= 2) {
        if ((document.getElementById("mdl4").options.length == 3)&&(document.getElementById("mdl4").options[0].text == "KIM")&&(document.getElementById("mdl4").options[1].text == "UM전구")&&(document.getElementById("mdl4").options[2].text == "ECMWF")){
          var mode2 = 3;
        }
      }

      if (window_y >= 3) {
        if ((document.getElementById("mdl7").options.length == 3)&&(document.getElementById("mdl7").options[0].text == "KIM")&&(document.getElementById("mdl7").options[1].text == "UM전구")&&(document.getElementById("mdl7").options[2].text == "ECMWF")){
          var mode3 = 3;
        }
      }
      break;
    case 4:
      if ((document.getElementById("mdl1").options.length == 3)&&(document.getElementById("mdl1").options[0].text == "KIM")&&(document.getElementById("mdl1").options[1].text == "UM전구")&&(document.getElementById("mdl1").options[2].text == "ECMWF")){
        var mode1 = 4;
      }

      if (window_y >= 2) {
        if ((document.getElementById("mdl4").options.length == 3)&&(document.getElementById("mdl4").options[0].text == "KIM")&&(document.getElementById("mdl4").options[1].text == "UM전구")&&(document.getElementById("mdl4").options[2].text == "ECMWF")){
          var mode2 = 4;
        }
      }

      if (window_y >= 3) {
        if ((document.getElementById("mdl7").options.length == 3)&&(document.getElementById("mdl7").options[0].text == "KIM")&&(document.getElementById("mdl7").options[1].text == "UM전구")&&(document.getElementById("mdl7").options[2].text == "ECMWF")){
          var mode3 = 4;
        }
      }
      break;
    default:
      break;
  } // end switch

  if (document.getElementById("mdl1").options.length == 2 || document.getElementById("mdl1").options.length == 4){
    for (var k=0; k<document.getElementById("mdl1").options.length; k++) {
      if (document.getElementById("mdl1").options[k].selected == true) {
        break;
      }
    }
    //if (document.getElementById("mdl1").options[k].text.indexOf("동아시아") != -1) {
    if (document.getElementById("mdl1").options[k].text == "KIM" || document.getElementById("mdl1").options[k].text == "UM전구") {
      var mode1 = 5;
    }
    else if (document.getElementById("mdl1").options[k].text.indexOf("한반도") != -1) {
      var mode1 = 6;
    }
  }

  if (window_y >= 2) {
    if (document.getElementById("mdl4").options.length == 2 || document.getElementById("mdl4").options.length == 4){
      for (var k=0; k<document.getElementById("mdl4").options.length; k++) {
        if (document.getElementById("mdl4").options[k].selected == true) {
          break;
        }
      }
      //if (document.getElementById("mdl4").options[k].text.indexOf("동아시아") != -1) {
      if (document.getElementById("mdl4").options[k].text == "KIM" || document.getElementById("mdl4").options[k].text == "UM전구") {
        var mode2 = 5;
      }
      else if (document.getElementById("mdl4").options[k].text.indexOf("한반도") != -1) {
        var mode2 = 6;
      }
    }
  }

  if (window_y >= 3) {
    if (document.getElementById("mdl7").options.length == 2 || document.getElementById("mdl7").options.length == 4){
      for (var k=0; k<document.getElementById("mdl7").options.length; k++) {
        if (document.getElementById("mdl7").options[k].selected == true) {
          break;
        }
      }
      //if (document.getElementById("mdl4").options[k].text.indexOf("동아시아") != -1) {
      if (document.getElementById("mdl7").options[k].text == "KIM" || document.getElementById("mdl7").options[k].text == "UM전구") {
        var mode3 = 5;
      }
      else if (document.getElementById("mdl7").options[k].text.indexOf("한반도") != -1) {
        var mode3 = 6;
      }
    }
  }

  if (mode1 == 0 && mode2 == 0 && mode3 == 0) {
    return -1;
  }

  for (var k=0; k<b_val.length; k++) {
    if (document.getElementById('b1').options[k].selected == true) {
      var i = b_val[k].list;
      var i2 = k;
      break;
    }
  }
  for (var k=0; k<c_val[i].length; k++) {
    if (document.getElementById('c1').options[k].selected == true) {
      var j = c_val[i][k].list;
      var j2 = k;
      break;
    }
  }

  if (mode1 > 0) {
    document.getElementById('b2').options[i2].selected = true;

    document.getElementById('c2').options.length = c_val[i].length;
    for (var k=0; k<c_val[i].length; k++) {
      document.getElementById('c2').options[k].text = c_val[i][k].text;
      document.getElementById('c2').options[k].value = c_val[i][k].list;
    }
    document.getElementById('c2').options[j2].selected = true;

    document.getElementById('mdl2').options.length = mdl_val[i][j].length;
    for (var k=0; k<mdl_val[i][j].length; k++) {
      document.getElementById('mdl2').options[k].text = mdl_val[i][j][k].text;
      document.getElementById('mdl2').options[k].value = mdl_val[i][j][k].list;
    }
  }

  if (mode1 == 4) {
    document.getElementById('b3').options[i2].selected = true;

    document.getElementById('c3').options.length = c_val[i].length;
    for (var k=0; k<c_val[i].length; k++) {
      document.getElementById('c3').options[k].text = c_val[i][k].text;
      document.getElementById('c3').options[k].value = c_val[i][k].list;
    }
    document.getElementById('c3').options[j2].selected = true;

    document.getElementById('mdl3').options.length = mdl_val[i][j].length;
    for (var k=0; k<mdl_val[i][j].length; k++) {
      document.getElementById('mdl3').options[k].text = mdl_val[i][j][k].text;
      document.getElementById('mdl3').options[k].value = mdl_val[i][j][k].list;
    }
  }

  if (mode2 > 0) {
    for (var k=0; k<b_val.length; k++) {
      if (document.getElementById('b4').options[k].selected == true) {
        var ii = b_val[k].list;
        var ii2 = k;
        break;
      }
    }
    for (var k=0; k<c_val[ii].length; k++) {
      if (document.getElementById('c4').options[k].selected == true) {
        var jj = c_val[ii][k].list;
        var jj2 = k;
        break;
      }
    }

    document.getElementById('b5').options[ii2].selected = true;

    document.getElementById('c5').options.length = c_val[ii].length;
    for (var k=0; k<c_val[ii].length; k++) {
      document.getElementById('c5').options[k].text = c_val[ii][k].text;
      document.getElementById('c5').options[k].value = c_val[ii][k].list;
    }
    document.getElementById('c5').options[jj2].selected = true;

    document.getElementById('mdl5').options.length = mdl_val[ii][jj].length;
    for (var k=0; k<mdl_val[ii][jj].length; k++) {
      document.getElementById('mdl5').options[k].text = mdl_val[ii][jj][k].text;
      document.getElementById('mdl5').options[k].value = mdl_val[ii][jj][k].list;
    }
  }

  if (mode2 == 4) {
    document.getElementById('b6').options[ii2].selected = true;

    document.getElementById('c6').options.length = c_val[ii].length;
    for (var k=0; k<c_val[ii].length; k++) {
      document.getElementById('c6').options[k].text = c_val[ii][k].text;
      document.getElementById('c6').options[k].value = c_val[ii][k].list;
    }
    document.getElementById('c6').options[jj2].selected = true;

    document.getElementById('mdl6').options.length = mdl_val[ii][jj].length;
    for (var k=0; k<mdl_val[ii][jj].length; k++) {
      document.getElementById('mdl6').options[k].text = mdl_val[ii][jj][k].text;
      document.getElementById('mdl6').options[k].value = mdl_val[ii][jj][k].list;
    }
  }

  if (mode3 > 0) {
    for (var k=0; k<b_val.length; k++) {
      if (document.getElementById('b7').options[k].selected == true) {
        var ii = b_val[k].list;
        var ii2 = k;
        break;
      }
    }
    for (var k=0; k<c_val[ii].length; k++) {
      if (document.getElementById('c7').options[k].selected == true) {
        var jj = c_val[ii][k].list;
        var jj2 = k;
        break;
      }
    }

    document.getElementById('b8').options[ii2].selected = true;

    document.getElementById('c8').options.length = c_val[ii].length;
    for (var k=0; k<c_val[ii].length; k++) {
      document.getElementById('c8').options[k].text = c_val[ii][k].text;
      document.getElementById('c8').options[k].value = c_val[ii][k].list;
    }
    document.getElementById('c8').options[jj2].selected = true;

    document.getElementById('mdl8').options.length = mdl_val[ii][jj].length;
    for (var k=0; k<mdl_val[ii][jj].length; k++) {
      document.getElementById('mdl8').options[k].text = mdl_val[ii][jj][k].text;
      document.getElementById('mdl8').options[k].value = mdl_val[ii][jj][k].list;
    }
  }

  if (mode3 == 4) {
    document.getElementById('b9').options[ii2].selected = true;

    document.getElementById('c9').options.length = c_val[ii].length;
    for (var k=0; k<c_val[ii].length; k++) {
      document.getElementById('c9').options[k].text = c_val[ii][k].text;
      document.getElementById('c9').options[k].value = c_val[ii][k].list;
    }
    document.getElementById('c9').options[jj2].selected = true;

    document.getElementById('mdl9').options.length = mdl_val[ii][jj].length;
    for (var k=0; k<mdl_val[ii][jj].length; k++) {
      document.getElementById('mdl9').options[k].text = mdl_val[ii][jj][k].text;
      document.getElementById('mdl9').options[k].value = mdl_val[ii][jj][k].list;
    }
  }

  switch (mode1) {
    case 1:
      document.getElementById("mdl1").options[0].selected = true;
      document.getElementById("mdl2").options[1].selected = true;
      numx = 2; numy = 1;
      break;
    case 2:
      document.getElementById("mdl1").options[0].selected = true;
      document.getElementById("mdl2").options[2].selected = true;
      numx = 2; numy = 1;
      break;
    case 3:
      document.getElementById("mdl1").options[1].selected = true;
      document.getElementById("mdl2").options[2].selected = true;
      numx = 2; numy = 1;
      break;
    case 4:
      document.getElementById("mdl1").options[0].selected = true;
      document.getElementById("mdl2").options[1].selected = true;
      document.getElementById("mdl3").options[2].selected = true;
      numx = 3; numy = 1;
      break;
    case 5:
      document.getElementById("mdl1").options[0].selected = true;
      document.getElementById("mdl2").options[1].selected = true;
      numx = 2; numy = 1;
      break;
    case 6:
      document.getElementById("mdl1").options[2].selected = true;
      document.getElementById("mdl2").options[3].selected = true;
      numx = 2; numy = 1;
      break;
    default:
      break;
  } // end switch

  switch (mode2) {
    case 1:
      document.getElementById("mdl4").options[0].selected = true;
      document.getElementById("mdl5").options[1].selected = true;
      numx = 2; numy = 2;      
      break;
    case 2:
      document.getElementById("mdl4").options[0].selected = true;
      document.getElementById("mdl5").options[2].selected = true;
      numx = 2; numy = 2;
      break;
    case 3:
      document.getElementById("mdl4").options[1].selected = true;
      document.getElementById("mdl5").options[2].selected = true;
      numx = 2; numy = 2;   
      break;
    case 4:
      document.getElementById("mdl4").options[0].selected = true;
      document.getElementById("mdl5").options[1].selected = true;
      document.getElementById("mdl6").options[2].selected = true;
      numx = 2; numy = 3;   
      break;
    case 5:
      document.getElementById("mdl4").options[0].selected = true;
      document.getElementById("mdl5").options[1].selected = true;
      numx = 2; numy = 2;   
      break;
    case 6:
      document.getElementById("mdl4").options[2].selected = true;
      document.getElementById("mdl5").options[3].selected = true;
      numx = 2; numy = 2;   
      break;
    default:
      break;
  } // end switch

  switch (mode3) {
    case 1:
      document.getElementById("mdl7").options[0].selected = true;
      document.getElementById("mdl8").options[1].selected = true;
      numx = 2; numy = 3;   
      break;
    case 2:
      document.getElementById("mdl7").options[0].selected = true;
      document.getElementById("mdl8").options[2].selected = true;
      numx = 2; numy = 3;   
      break;
    case 3:
      document.getElementById("mdl7").options[1].selected = true;
      document.getElementById("mdl8").options[2].selected = true;
      numx = 2; numy = 3; 
      break;
    case 4:
      document.getElementById("mdl7").options[0].selected = true;
      document.getElementById("mdl8").options[1].selected = true;
      document.getElementById("mdl9").options[2].selected = true;
      numx = 3; numy = 3; 
      break;
    case 5:
      document.getElementById("mdl7").options[0].selected = true;
      document.getElementById("mdl8").options[1].selected = true;
      numx = 2; numy = 3; 
      break;
    case 6:
      document.getElementById("mdl7").options[2].selected = true;
      document.getElementById("mdl8").options[3].selected = true;
      numx = 2; numy = 3; 
      break;
    default:
      break;
  } // end switch

  if (numx*numy > window_xy) {
    document.getElementById('window').value = numy + "," + numx;
  }

  if (numx*numy > 0) {
    doWindow(-1);
  }
  else {
    //alert('비교할 일기도가 없습니다.');
  }
}


// ********부가기능
// 위.경도 변환
var PI = Math.asin(1.0)*2.0;
var DEGRAD = PI/180.0;
var RADDEG = 180.0/PI;

// LCC
var slat1 = 30. * DEGRAD;
var slat2 = 60. * DEGRAD;
var olon = 126. * DEGRAD;
var olat = 38. * DEGRAD;

var ea = 6378.138;              // 장반경 (km)
var f  = 1.0/298.257223563;     // 편평도 : (장반경-단반경)/장반경
var ep = Math.sqrt(2.0*f - f*f);

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

// 이미지 클릭 이벤트
function img_click(e,img) {
  if (e.latlng == undefined) {
    //e.preventDefault();
    //e.returnValue = false;
    var xx  = e.offsetX;
    var yy  = e.offsetY;
    var point = new Object();
    var id = img.id.slice(img.id.indexOf("img")+3,img.id.length);

    if (img_arr[id].map.split(',')[0] == "X") {
      return;
    }
    point.xx = xx;
    point.yy = yy;
    if (e.button == 0) {
      if (cht_area == "NHEM" && (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1)) var latlon = pixel_to_LatLon_ster(img,point,id,1);
      else if (cht_area == "WORLD" && (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1)) var latlon = pixel_to_LatLon_eqdc(img,point,id,1);
      else var latlon = pixel_to_LatLon(img,point,id,1);
      if (latlon != undefined) {
        if (isNaN(latlon.lat) || latlon.lat == undefined) {
          return;
        }

        point.lat = latlon.lat;
        point.lon = latlon.lon;
        point.xx = xx;
        point.yy = yy;
        do_iwa_api(point,id);
        return;
      }
      else {
        return;
      }
    }
  }
  else {
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

    var id = e.target._container.id.slice(e.target._container.id.indexOf("map")+3,e.target._container.id.length);
    var point = {};
    point.lat = e.latlng.lat;
    point.lon = e.latlng.lng;
  }

  do_iwa_api(point,id);

  return;
}

// 이미지 마우스무브 이벤트
function img_mousemove(e,img) {
  if (e.latlng == undefined) {
    //e.preventDefault();
    //e.returnValue = false;
    var xx  = e.offsetX;
    var yy  = e.offsetY;
    var id = img.id.slice(img.id.indexOf("img")+3,img.id.length);

    var point = new Object();
    point.xx = xx;
    point.yy = yy;
    if (cht_area == "NHEM" && (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1)) var latlon = pixel_to_LatLon_ster(img,point,id,1);
    else if (cht_area == "WORLD" && (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1)) var latlon = pixel_to_LatLon_eqdc(img,point,id,1);
    else var latlon = pixel_to_LatLon(img,point,id,1);
    if (latlon != undefined && !isNaN(latlon.lat)) {
      point.lat = latlon.lat;
      point.lon = latlon.lon;
      point.xx = xx;
      point.yy = yy;

      var curLat = Number(point.lat);
      var curLon = Number(point.lon);
    }
    else {
      var curLat = 0;
      var curLon = 0;

      return;
    }
  }
  else {
    var curLat = Number(e.latlng.lat);
    var curLon = Number(e.latlng.lng);

    var id = e.target._container.id.slice(e.target._container.id.indexOf("map")+3,e.target._container.id.length);
    var point = {};
    point.lat = e.latlng.lat;
    point.lon = e.latlng.lng;
  }

  document.getElementById('lat').value = (curLat).toFixed(2);
  document.getElementById('lon').value = (curLon).toFixed(2);

  if (ext_mode == "hlt") {
    var dd = 5 + document.getElementById('menu').offsetHeight + 10 + document.getElementById('cht_select1').offsetHeight + document.getElementById('tm_select1').offsetHeight;
    for (var i=1; i<=window_xy; i++) {
      if (img_arr[win_num[i]].map[0] == "X") continue;
      var dxdy = fnImgOffset(win_num[i]);

      if (img_arr[win_num[i]].type.indexOf("afs") != -1 || img_arr[win_num[i]].type.indexOf("ana") != -1) {
        if (document.getElementById('map'+win_num[i]).style.display == "none") {
          document.getElementById('Highlight'+win_num[i]).style.visibility = 'hidden';
          continue;
        }
        var point2 = map[win_num[i]].latLngToContainerPoint(L.latLng([point.lat, point.lon]));
      }
      else {    
        var img2 = document.getElementById('img'+win_num[i]);
        if (cht_area == "NHEM" && (img_arr[win_num[i]].type.indexOf("afs") != -1 || img_arr[win_num[i]].type.indexOf("ana") != -1)) var point2 = pixel_to_LatLon_ster(img2,point,win_num[i],0);
        else if (cht_area == "WORLD" && (img_arr[win_num[i]].type.indexOf("afs") != -1 || img_arr[win_num[i]].type.indexOf("ana") != -1)) var point2 = pixel_to_LatLon_eqdc(img2,point,win_num[i],0);
        else var point2 = pixel_to_LatLon(img2,point,win_num[i],0);
        if (point2 == undefined) {
          document.getElementById('Highlight'+win_num[i]).style.visibility = 'hidden';
          continue;
        }
      }

      document.getElementById('Highlight'+win_num[i]).style.top = parseFloat(point2.y + dxdy.dy + dd + 5) + "px";
      document.getElementById('Highlight'+win_num[i]).style.left = parseFloat(point2.x + dxdy.dx + 5) + "px";
      document.getElementById('Highlight'+win_num[i]).style.visibility = 'visible';
    }
  }

  return;
}

// 위경도 변환
function pixel_to_LatLon(img,point,id,opt) {
  if (img_arr[id] == undefined) {
    return;
  }

  if (img_arr[id].type.indexOf("afs") == -1 && img_arr[id].type.indexOf("ana") == -1) {
    mapInfo = img_arr[id].map.split(',');
    var map   = mapInfo[0];
    var top   = mapInfo[1];
    var bot   = mapInfo[2];
    var left  = mapInfo[3];
    var right = mapInfo[4];
    var SX, SY, NX, NY;

    var mdl = img_arr[id].api.split('/')[0].split(',')[3];
    // 한반도 일기도 이미지 변경(2021.05.04.00UTC부터, 등온위면은 06UTC)
    if (map == "KOR" && (mdl == "GDAPS" || mdl == "ECMWF_H") && tm_arr[id] >= 202105040900) {
      map = "WT";
      if (mdl == "GDAPS") {
        top = 25; bot = 28; right = 50;
      }
      else if (mdl == "ECMWF_H") {
        top = 28; bot = 32; right = 50;
      }
    }
    else if (map == "KOR" && mdl == "ISEN-UMGL" && tm_arr[id] >= 202105041500) {
      map = "WT";
      top = 25; bot = 28; right = 50;
    }
    else if (map == "KOR2" && tm_arr[id] >= 202105040900) {
      map = "WT2";
      if (mdl == "GDAPS") {
        top = 28; bot = 32; right = 1227;
      }
      else if (mdl == "ECMWF_H") {
        top = 28; bot = 32; right = 1249;
      }
    }
    else if (map == "KOR3" && tm_arr[id] >= 202105040900) {
      map = "WT2";
      if (mdl == "GDAPS") {
        top = 27; bot = 1356; right = 48;
      }
      else if (mdl == "ECMWF_H") {
        top = 27; bot = 1356; right = 50;
      }
    }

    // 여름철.겨울철 이미지 사이즈 변경에 따른 예외처리(누적강수량 일기도)
    if (map == "WT2" || map == "KOR2") {
      var MM = parseInt(tm_arr[id].substring(4,6));
      if (MM >= 5 && MM <= 9) {
        if (mdl == "GDAPS_KIM") {
          top = 34; bot = 38; right = 41;
        }
        else if (mdl == "GDAPS") {
          top = 25; bot = 28; right = 50;
        }
        else if (mdl == "ECMWF_H") {
          top = 29; bot = 29; right = 50;
        }
      }
    }
  }
  else {
    var map   = cht_area;
    var top   = 0;
    var bot   = 0;
    var left  = 0;
    var right = 0;
    var SX, SY, NX, NY;
  }

  var RIGHT_pixel = parseFloat(right * document.getElementById("size").value/100); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top * document.getElementById("size").value/100);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot * document.getElementById("size").value/100);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);

  if (map == "EA" || map == "EA_CHT") {
    SX = 5680 - 40;  SY = 2960 - 40;  NX = 9640 - 40;  NY = 6760 - 40;
    if (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) {
      SX = 5680;  SY = 2960;  NX = 9640;  NY = 6760;
    }
  }
  else if (map == "KOR" || map == "KOR2" || map == "KOR3") {
    SX = 260 - 20;  SY = 700 - 20;  NX = 780 - 20;  NY = 1300 - 20;
    if (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) {
      SX = 260;  SY = 700;  NX = 780;  NY = 1300;
    }
  }
  else if (map == "WT" || map == "WT2") {
    SX = 640 - 20;  SY = 740 - 20;  NX = 1220 - 20;  NY = 1340 - 20;
    if (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) {
      SX = 640;  SY = 740;  NX = 1220;  NY = 1340;
    }
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

  if ((img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) && opt != -1) {
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
function pixel_to_LatLon_ster(img,point,id,opt) {
  if (img_arr[id] == undefined) {
    return;
  }

  if (img_arr[id].type.indexOf("afs") == -1 && img_arr[id].type.indexOf("ana") == -1) {
    mapInfo = img_arr[id].map.split(',');
    var map   = mapInfo[0];
    var top   = mapInfo[1];
    var bot   = mapInfo[2];
    var left  = mapInfo[3];
    var right = mapInfo[4];
  }
  else {
    var map   = cht_area;
    var top   = 0;
    var bot   = 0;
    var left  = 0;
    var right = 0;
  }

  var SX, SY, NX, NY;
  var ts, ce, chi, phi, dphi;

  var RIGHT_pixel = parseFloat(right * document.getElementById("size").value/100); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top * document.getElementById("size").value/100);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot * document.getElementById("size").value/100);   // 시간정보(pixel)
  var img_rate = 1.0;     // 이미지 계산시 확대 비율
  var img_NI = img.width - RIGHT_pixel/img_rate;        // 결과이미지내 자료영역
  var img_NJ = img.height - BOT_pixel/img_rate - TOP_pixel/img_rate;
  var img_OJ = TOP_pixel/img_rate;  // 결과이미지내 제목 폭(pixel)

  if (opt == 1) {
    if (point.yy < img_OJ || point.yy > (img_NJ+img_OJ)) return;    // 제목표시줄
    if (point.xx > img_NI) return;    // 범례
  }
  point.yy = img_NJ - (point.yy - img_OJ);

  if (img_arr[id].type.indexOf("afs") != -1 && img_arr[id].type.indexOf("ana") == -1) {
    NX = NY = ea*2*PI/2;
    SX = SY = ea*PI/2;
  }
  else {
  }
  var grid = 1;
  var x3 = point.xx*NX/img_NI;
  var y3 = point.yy*NY/img_NJ;
  var X = x3;
  var Y = y3;

  var zm = 1.0;
  var xo = 0.;
  var yo = 0.;
  if ((img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) && opt != -1) {
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
function pixel_to_LatLon_eqdc(img,point,id,opt) {
  if (img_arr[id] == undefined) {
    return;
  }

  if (img_arr[id].type.indexOf("afs") == -1 && img_arr[id].type.indexOf("ana") == -1) {
    mapInfo = img_arr[id].map.split(',');
    var map   = mapInfo[0];
    var top   = mapInfo[1];
    var bot   = mapInfo[2];
    var left  = mapInfo[3];
    var right = mapInfo[4];
  }
  else {
    var map   = cht_area;
    var top   = 0;
    var bot   = 0;
    var left  = 0;
    var right = 0;
  }

  var SX, SY, NX, NY;

  var RIGHT_pixel = parseFloat(right * document.getElementById("size").value/100); // 범레 폭(pixel)
  var TOP_pixel   = parseFloat(top * document.getElementById("size").value/100);   // 제목 폭(pixel)
  var BOT_pixel   = parseFloat(bot * document.getElementById("size").value/100);   // 시간정보(pixel)
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
  if ((img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) && opt != -1) {
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

// 표출 영역 bounds 구하기
function fnGetBounds(img,id) {
  var x = 0;           var y = 0;
  var x1 = img.width;  var y1 = img.height;

  var point = {};
  point.xx = x;
  point.yy = y;

  if (cht_area == "NHEM") {
    var offset = pixel_to_LatLon_ster(img,point,id,1);
  }
  else if (cht_area == "WORLD") {
    var offset = pixel_to_LatLon_eqdc(img,point,id,1);
    if (offset.lat == 90) {
      offset.lat -= 0.00001;
    }
  }
  else {
    var offset = pixel_to_LatLon(img,point,id,1);
  }

  point.xx = x1;
  point.yy = y1;
  if (cht_area == "NHEM") {
    var offset1 = pixel_to_LatLon_ster(img,point,id,1);
  }
  else if (cht_area == "WORLD") {
    var offset1 = pixel_to_LatLon_eqdc(img,point,id,1);
    if (offset1.lat == 90) {
      offset1.lat -= 0.00001;
    }
  }
  else {
    var offset1 = pixel_to_LatLon(img,point,id,1);
  }

  var bounds = [[offset.lat, offset.lon], [offset1.lat, offset1.lon]];

  return bounds;
}

// 통합기상분석 api 호출 이벤트
function do_iwa_api(point,id) {

  if (ext_mode != "crss_sct" && ext_mode != "ruler") {
    click_count = 1;
  }

  if (click_count == 0) {
    click_count++;
    lat1 = point.lat;
    lon1 = point.lon;
  }
  else {
    if (ext_mode == "ruler" && id != rulerMapId) {
      return;
    }
    click_count = 0;
    lat2 = point.lat;
    lon2 = point.lon;
  }

  if (ext_mode == "ruler") {
    tempLayer[id].clearLayers();
    tempTextLayer[id].clearLayers();

    var circle = L.circleMarker(L.latLng(point.lat, point.lon), {color: 'red', radius: 2, pane:"ruler"});
    rulerLayer[id].addLayer(circle);
    rulerMapId = id;
  }

  if (click_count != 0) return;

  if (ext_mode == "mdl") {
    // 발효시간 변경(KST -> UTC)
    var YY = tm_arr[0].substring(0,4);
    var MM = tm_arr[0].substring(4,6);
    var DD = tm_arr[0].substring(6,8);
    var HH = tm_arr[0].substring(8,10);
    var MI = tm_arr[0].substring(10,12);
    var date2 = new Date(YY, MM-1, DD, HH, MI);
    date2.setTime(date2.getTime() - 9*60*60*1000);
    var tm2 = addZeros(date2.getFullYear(),4) + addZeros(date2.getMonth()+1,2) + addZeros(date2.getDate(),2) + addZeros(date2.getHours(),2) + addZeros(date2.getMinutes(),2);

    var popup_text = new Array();
    var count = new Array();
    var d = new Array();
    var var_text = new Array();

    for (var i=1; i<=window_xy; i++) {
      // 모델 발표시간 변경(KST -> UTC)
      var YY = tm_arr[win_num[i]].substring(0,4);
      var MM = tm_arr[win_num[i]].substring(4,6);
      var DD = tm_arr[win_num[i]].substring(6,8);
      var HH = tm_arr[win_num[i]].substring(8,10);
      var MI = tm_arr[win_num[i]].substring(10,12);
      var date1 = new Date(YY, MM-1, DD, HH, MI);
      date1.setTime(date1.getTime() - 9*60*60*1000);

      if (date1 > date2) {
        date1.setTime(parseInt((date2.getTime()+9*60*60*1000)/(12*60*60*1000))*(12*60*60*1000) - 9*60*60*1000);
        var tm1 = addZeros(date1.getFullYear(),4) + addZeros(date1.getMonth()+1,2) + addZeros(date1.getDate(),2) + addZeros(date1.getHours(),2) + addZeros(date1.getMinutes(),2);
        popup_text[win_num[i]] = "<table class=TB11 cellspacing=0><tr><td nowrap colspan=2><b>[모델자료 샘플링]</b></td></tr>";
      }
      else {    
        var tm1 = addZeros(date1.getFullYear(),4) + addZeros(date1.getMonth()+1,2) + addZeros(date1.getDate(),2) + addZeros(date1.getHours(),2) + addZeros(date1.getMinutes(),2);
        var dtm = (date2-date1)/(60*60*1000);
        popup_text[win_num[i]] = "<table class=TB11 cellspacing=0><tr><td nowrap colspan=2><b>[모델자료 샘플링]</b> (+" + dtm + "h)</td></tr>";
      }

      popup_text[win_num[i]] += "<tr><td nowrap style='border-bottom:1px solid black;' colspan=2>위·경도&nbsp;(" + point.lat.toFixed(1) + "°N, " + point.lon.toFixed(1) + "°E)</td></tr>";
      count[win_num[i]] = 0;
      var_text[win_num[i]] = new Array();

      //if (document.getElementById('img'+win_num[i]) != undefined && img_arr[win_num[i]].map.split(',')[0] != "X") {
      if (document.getElementById('nocht'+win_num[i]).style.display != "block" && img_arr[win_num[i]].map.split(',')[0] != "X") {
        d[win_num[i]] = img_arr[win_num[i]].api.split('/');
        for (var j=0; j<d[win_num[i]].length; j++) {   
          var grp   = d[win_num[i]][j].split(',')[0];
          var menu1 = d[win_num[i]][j].split(',')[1];
          var menu2 = d[win_num[i]][j].split(',')[2];
          var mdl = d[win_num[i]][j].split(',')[3];
          if (cht_area == "E10") {
            if (mdl == "GDAPS")          mdl = "GDAPS_1H";
            else if (mdl == "GDAPS_KIM") mdl = "KIM_1H";
            else if (mdl == "ECMWF_H")   mdl = "ECMWF_1H10G1";
          }

          if (grp == "VAR") {
            var vrtc  = d[win_num[i]][j].split(',')[4];
          }

          var url = "http://afs.kma.go.kr/afsiwa/iwa/api/iwaImgUrlApi/retMdlSampleDataUrl.kajx?";
          if (grp != "VAR") {
            url += "analTime="+tm1+"&foreTime="+tm2+"&menuGrpCd="+grp+"&menu01="+menu1+"&menu02="+menu2+"&menu03="+mdl+"&location="+point.lon+","+point.lat;
          }
          else {
            url += "analTime="+tm1+"&foreTime="+tm2+"&menuGrpCd="+grp+"&menu01="+menu1+"&menu02="+menu2+"&menu03="+mdl+"&vrtcLayrCd="+vrtc+"&location="+point.lon+","+point.lat;
          }
          console.log(url);

          var_text[win_num[i]][j] = "";
          get_api_result(point,win_num[i],j);
        }  
      }
    }

    function get_api_result(point,id,k) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", url, true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState != 4 || xhr.status != 200) return;
        else {
          var responseObject = JSON.parse(xhr.responseText);
          //console.log(responseObject);

          if (responseObject.data.result != null && responseObject.data.result.length > 0) {
            for (var i=0; i<responseObject.data.result.length; i++) {
              if (k == 0 && i == 0) {
                var_text[id][k] += "<tr><td nowrap colspan=2><b>[" + responseObject.data.result[i].wthrDataNm + "]</b></tr></td>";
              }
              var_text[id][k] += "<tr><td nowrap><b>" + responseObject.data.result[i].mdlVarNm + "&nbsp;</b></td><td nowrap>: &nbsp;<font color=blue>";
              if (responseObject.data.result[i].graph[0][1] != "NaN") var_text[id][k] += responseObject.data.result[i].graph[0][1].toFixed(1) + responseObject.data.result[i].mdlVarUnit + "</font></td></tr>";
              else var_text[id][k] += responseObject.data.result[i].graph[0][1] + "</font></td></tr>"
            }
          }
          else {
            var_text[id][k] += "<tr><td nowrap colspan=2>자료를 불러오지 못했습니다.</td></tr>";
          }

          count[id]++;
          if (count[id] == d[id].length) {
            for (var j=0; j<d[id].length; j++) {   
              popup_text[id] += var_text[id][j];
            }
            popup_text[id] += "</table>";
            var dxdy = fnImgOffset(id);

            if (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1) {
              var point2 = map[id].latLngToContainerPoint(L.latLng([point.lat, point.lon]));
            }
            else {
              var img2 = document.getElementById('img'+id);
              if (cht_area == "NHEM" && (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1)) var point2 = pixel_to_LatLon_ster(img2,point,id,0);
              else if (cht_area == "WORLD" && (img_arr[id].type.indexOf("afs") != -1 || img_arr[id].type.indexOf("ana") != -1)) var point2 = pixel_to_LatLon_eqdc(img2,point,id,0);
              else var point2 = pixel_to_LatLon(img2,point,id,0);
            }

            if (point2 != undefined) { 
              var dd = 5 + document.getElementById('menu').offsetHeight + 10 + document.getElementById('cht_select1').offsetHeight + document.getElementById('tm_select1').offsetHeight;
              document.getElementById('popupText'+id).innerHTML = popup_text[id];
              document.getElementById('popupBox'+id).style.position = 'absolute';
              document.getElementById('RedDot'+id).style.position = 'absolute';
              document.getElementById('popupBox'+id).style.top = parseFloat(point2.y + dxdy.dy + dd + 8) + "px";
              document.getElementById('popupBox'+id).style.left = parseFloat(point2.x + dxdy.dx + 18) + "px";
              document.getElementById('popupBox'+id).style.visibility = 'visible';
              document.getElementById('RedDot'+id).style.top = parseFloat(point2.y + dxdy.dy + dd) + "px";
              document.getElementById('RedDot'+id).style.left = parseFloat(point2.x + dxdy.dx + 5) + "px";
              document.getElementById('RedDot'+id).style.visibility = 'visible';

              if ( (navigator.appName == 'Netscape' && navigator.userAgent.search('Trident') != -1) || (navigator.userAgent.toLowerCase().indexOf("msie") != -1) ) {
                document.getElementById('popupBox'+id).style.top = parseFloat(point2.y + dxdy.dy + dd + 8 + 5) + "px";
                document.getElementById('RedDot'+id).style.top = parseFloat(point2.y + dxdy.dy + dd + 5) + "px";
              }
            }
            else {
              document.getElementById('popupBox'+id).style.visibility = 'hidden';
              document.getElementById('RedDot'+id).style.visibility = 'hidden';
            }
          }
        }
      };
      xhr.send();
    }
  }
  else if (ext_mode == "ruler") {
    rulerClicked(id);
  }
  else if (ext_mode != 0) {
    var mdl = img_arr[id].api.split('/')[0].split(',')[3];
    if (cht_area == "E10") {
      if (mdl == "GDAPS")          mdl = "GDAPS_1H";
      else if (mdl == "GDAPS_KIM") mdl = "KIM_1H";
      else if (mdl == "ECMWF_H")   mdl = "ECMWF_1H10G1";
    }

    if (ext_mode == "skew") {
      height = 900;
    }
    else if (ext_mode == "crss_sct") {
      height = 1000;
    }
    else if (ext_mode == "mto") {
      height = 900;
    }
    else if (ext_mode == "lmto") {
      height = 800;
    }

    if (ext_mode == "skew") {
      window.open("/cht_new/cht_skew.php?mode="+ext_mode+"&tm_fc="+tm_arr[id]+"&tm_ef="+tm_arr[0]+"&model="+mdl+"&lat="+point.lat+"&lon="+point.lon, 
                "", "location=yes,left=30,top=30,width=1400,height="+height+",scrollbars=yes,resizable=yes");
    }
    else if (ext_mode == "crss_sct") {
      if (img_arr[id].type.indexOf("afs") == -1 && img_arr[id].type.indexOf("ana") == -1) {
        window.open("http://172.29.76.90/cht_new/cht_skew.php?mode="+ext_mode+"&tm_fc="+tm_arr[id]+"&tm_ef="+tm_arr[0]+"&model="+mdl+"&lat="+lat1+"&lon="+lon1+"&lat2="+lat2+"&lon2="+lon2+"&zoom_x=0000000&zoom_y=0000000", 
                  "", "location=yes,left=30,top=30,width=1400,height="+height+",scrollbars=yes,resizable=yes");
      }
      else {
        if (cht_area == "E10" || cht_area == "TP") {
          window.open("http://172.29.76.90/cht_new/cht_skew.php?mode="+ext_mode+"&tm_fc="+tm_arr[id]+"&tm_ef="+tm_arr[0]+"&model="+mdl+"&lat="+lat1+"&lon="+lon1+"&lat2="+lat2+"&lon2="+lon2+"&map="+cht_area+"&zoom_x="+zoom_x+"&zoom_y="+zoom_y, 
                  "", "location=yes,left=30,top=30,width=1400,height="+height+",scrollbars=yes,resizable=yes");
        }
        else {
          window.open("http://172.29.76.90/cht_new/cht_skew.php?mode="+ext_mode+"&tm_fc="+tm_arr[id]+"&tm_ef="+tm_arr[0]+"&model="+mdl+"&lat="+lat1+"&lon="+lon1+"&lat2="+lat2+"&lon2="+lon2+"&zoom_x="+zoom_x+"&zoom_y="+zoom_y, 
                  "", "location=yes,left=30,top=30,width=1400,height="+height+",scrollbars=yes,resizable=yes");
        }
      }
    }
    else {
      window.open("/cht_new/cht_skew.php?mode="+ext_mode+"&tm_fc="+tm_arr[id]+"&tm_ef="+tm_arr[0]+"&model="+mdl+"&lat="+point.lat+"&lon="+point.lon, 
                "", "location=yes,left=30,top=30,width=1400,height="+height+",scrollbars=yes,resizable=yes");
    }
  }

  return;
}

// popupBox 숨기기
function hidePopup() {
  for (var i=1; i<=ncht_max; i++) {
    document.getElementById('RedDot'+i).style.visibility = 'hidden';
    document.getElementById('popupBox'+i).style.visibility = 'hidden';
    document.getElementById('Highlight'+i).style.visibility = 'hidden';
  }
}

// 일기도 화면별 offset 조정(popupBox 위치 조정용)
function fnImgOffset(id) {
  var dx = 0;
  var dy = 0;
  var dd;
  var dxdy = new Object();
  if (id == 2 || id == 3) {
    dd = document.getElementById('cht_table1').offsetWidth;
    dx += dd + 10;
  }
  if (id == 3) {
    dd = document.getElementById('cht_table2').offsetWidth;
    dx += dd + 10;
  }
  if (id == 5 || id == 6) {
    dd = document.getElementById('cht_table4').offsetWidth;
    dx += dd + 10;
  }
  if (id == 6) {
    dd = document.getElementById('cht_table5').offsetWidth;
    dx += dd + 10;
  }
  if (id == 8 || id == 9) {
    dd = document.getElementById('cht_table7').offsetWidth;
    dx += dd + 10;
  }
  if (id == 9) {
    dd = document.getElementById('cht_table8').offsetWidth;
    dx += dd + 10;
  }
  if (id == 4 || id == 5 || id == 6 || id == 7 || id == 8 || id == 9) {
    dd = document.getElementById('cht_table1').offsetHeight;
    dy += dd + document.getElementById('cht_select4').offsetHeight + document.getElementById('tm_select4').offsetHeight;
  }
  if (id == 7 || id == 8 || id == 9) {
    dd = document.getElementById('cht_table4').offsetHeight;
    dy += dd + document.getElementById('cht_select7').offsetHeight + document.getElementById('tm_select7').offsetHeight;
  }

  dxdy.dx = dx;
  dxdy.dy = dy;
  return dxdy;
}

// 지도 축소
function unzoom_area(w) {
  if (w == 0) {
    var n = area_info.findIndex(function(x){return x.area == cht_area});
    gis_center = area_info[n].center_origin;

    for (var i=1; i<=ncht_max; i++) {
      if (document.getElementById("map"+i).style.display == 'block') {
        map[i].setView(gis_center, 0, {animate:false});
        calcZoomArea(null, i);
        break;
      }
    }
  }
  else if (w == 1) {
    zoom_level--;
    if (zoom_level < 0) {
      zoom_level = 0;
    }

    for (var i=1; i<=ncht_max; i++) {
      if (document.getElementById("map"+i).style.display == 'block') {
        map[i].setView(gis_center, zoom_level, {animate:false});
        calcZoomArea(null, i);
        break;
      }
    }
  }
}

// 지도 중심 위치 변경
function fn_CtrlSubmit() {
  var v = parseInt(document.getElementById("map_zoom").value);
  zoom_level = v;
  var center = {};
  center.lng = parseFloat(document.getElementById("center_lon").value);
  center.lat = parseFloat(document.getElementById("center_lat").value);
  for (var i=1; i<=ncht_max; i++) {
    if (document.getElementById("map"+i).style.display == 'block') {
      map[i].setView(center, zoom_level, {animate:false});
      calcZoomArea(null, i);
      break;
    }
  }
}

// 지도 중심위치 조정(zoom 초기화)
function fnZoomReset()
{
  for (var i=1; i<=ncht_max; i++) {
    if (document.getElementById("map"+i).style.display == 'block') {
      var center = map[i].getCenter();
      document.getElementById("center_lon").value = center.lng.toFixed(2);
      document.getElementById("center_lat").value = center.lat.toFixed(2);
      document.getElementById("map_zoom").value = map[i].getZoom();
      break;
    }
  }
}

// 지도 중심위치 조정(zoom 변경)
function fnZoomCtrl(i)
{
  var v = parseInt(document.getElementById("map_zoom").value);
  v += i;
  if (v > 7) v = 7;
  else if (v < 0) v = 0;
  document.getElementById("map_zoom").value = v;
}

// 주요지점 옵션 생성
function fnInitAwsStn() {
  var url = host + "/fgd/nwp_new/nwp_stn_lib.php?mode=1";
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

    var select_element = document.createElement("select");
    select_element.setAttribute('onchange', 'fnStnList(this.value);');
    select_element.style.height = "20px";
    for (var i=0; i<reg_arr.length; i++) {
      var opt_element = document.createElement("option");
      opt_element.value = reg_arr[i].reg_name;
      opt_element.innerText = reg_arr[i].reg_name;
      select_element.appendChild(opt_element); 
    }
    document.getElementById("zoom_stn1").appendChild(select_element); 

    var select_element = document.createElement("select");
    select_element.id = "select_stn";
    select_element.style.height = "20px";
    document.getElementById("zoom_stn2").appendChild(select_element); 
    fnStnList(0);
    //select_element.classList.add("checkbox-style");
  };
  xhr.send();
}

// 주요지점 옵션 생성2
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

// 지점 위경도 가져오기
function fnStnLatLon() {
  ajaxStn++;
  var curAjaxNum = ajaxStn;
  var url = host + "/cht_new/cht_skew_lib.php?mode=2&stn_id=" + document.getElementById("select_stn").value;
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

        document.getElementById('center_lat').value = parseFloat(l.split(',')[0]).toFixed(2);
        document.getElementById('center_lon').value = parseFloat(l.split(',')[1]).toFixed(2);
      });
    }

    fn_CtrlSubmit();
  };
  xhr.send();
}

// 지도 크기 변경
function doSize(opt)
{
  if (gis_size == document.getElementById("size").value) {
    tm_move('+0H', 0);
    return;
  }
  gis_size = document.getElementById("size").value;

  for (var i=1; i<=ncht_max; i++) {
    removeImg(null, i);
    map_init(cht_area, i);
  }

  tm_move('+0H', 0);
}

// API 로딩하기(+24H)
function loadImage(moving) {
  var ntime = 8;
  if (cht_area == "E10") ntime = 24;

  var ncht = 0;
  var cnt = 0;
  var urls = [];

  for (var i=1; i<=window_xy; i++) {
    if (img_arr[win_num[i]] == undefined) continue;

    if (img_arr[win_num[i]].type.indexOf("afs") != -1 || img_arr[win_num[i]].type.indexOf("ana") != -1) ncht++;
    else continue;

    var mdl = img_arr[win_num[i]].api.split(',')[3];

    urls[win_num[i]] = [];
    for (var j=1; j<=ntime; j++) {
      var YY = tm_arr[0].substring(0,4);
      var MM = tm_arr[0].substring(4,6);
      var DD = tm_arr[0].substring(6,8);
      var HH = tm_arr[0].substring(8,10);
      var MI = tm_arr[0].substring(10,12);
      var date_ef = new Date(YY, MM-1, DD, HH, MI);
      var date = new Date;
      if (moving < 0) date.setTime(date_ef.getTime() - tm_itv*j*60*60*1000);
      else date.setTime(date_ef.getTime() + tm_itv*j*60*60*1000);
      var tm = addZeros(date.getFullYear(),4) + addZeros(date.getMonth()+1,2) + addZeros(date.getDate(),2) + addZeros(date.getHours(),2) + addZeros(date.getMinutes(),2);

      urls[win_num[i]][j] = host + "/cht_new/cht_multiv_gis_lib.php?mode=1&tm_ef=" + tm + "&tm_fc=" + tm_arr[win_num[i]] + "&dir1=" + img_arr[win_num[i]].dir + "&img_name=" + img_arr[win_num[i]].img_name;
      urls[win_num[i]][j] += "&zoom_x=" + zoom_x + "&zoom_y=" + zoom_y + "&zoom_level=" + zoom_level;
      urls[win_num[i]][j] += "&mdl=" + mdl + "&area=" + cht_area + "&type=" + img_arr[win_num[i]].type + "&save=" + document.getElementById('save').value + "&host=api&load=1";
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

  for (var i=1; i<=window_xy; i++) {
    if (img_arr[win_num[i]] == undefined) continue;

    if (img_arr[win_num[i]].type.indexOf("afs") == -1 && img_arr[win_num[i]].type.indexOf("ana") == -1) continue;
    for (var j=1; j<=ntime; j++) {
      get_cgi(urls[win_num[i]][j], i, j);
    }
  }

  function get_cgi(url, i, j) {
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
          document.getElementById('loadingbar').style.minWidth = parseFloat(cnt/(ncht*ntime)*100).toFixed(1) + "%";
          document.getElementById('loadingnum').innerText = "로딩 진행상황(" + parseFloat(cnt/(ncht*ntime)*100).toFixed(1) + "%)";
          if (cnt == ncht*ntime) {
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
    xhr.timeout = 30000;
    xhr.overrideMimeType("application/x-www-form-urlencoded; charset=euc-kr");
    xhr.onreadystatechange = function () {
      if (xhr.readyState != 4 || xhr.status != 200) return;
      cnt++;
      document.getElementById('loadingbar').style.minWidth = parseFloat(cnt/(ncht*ntime)*100).toFixed(1) + "%";
      document.getElementById('loadingnum').innerText = "로딩 진행상황(" + parseFloat(cnt/(ncht*ntime)*100).toFixed(1) + "%)";
      if (cnt == ncht*ntime) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    };
    xhr.ontimeout = function () {
      console.log('ajax timeout');
      cnt++;
      if (cnt == ncht*ntime) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.onerror = function () {
      console.log('ajax error');
      cnt++;
      if (cnt == ncht*ntime) {
        document.getElementById("loading").style.display = "none";
        document.getElementById("loadingStatus").style.display = "none";
      }
    }
    xhr.send();
  }

}