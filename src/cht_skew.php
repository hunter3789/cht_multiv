<?
$tm_fc = $_REQUEST["tm_fc"];   if ($tm_fc == "") $tm_fc = "0";
$tm_ef = $_REQUEST["tm_ef"];   if ($tm_ef == "") $tm_ef = $tm_fc;
$model = $_REQUEST["model"];   if ($model == "") $model = "GDAPS";
$lat   = $_REQUEST["lat"];     if ($lat == "")  $lat = 38.;
$lon   = $_REQUEST["lon"];     if ($lon == "")  $lon = 126.;
$lat2  = $_REQUEST["lat2"];    if ($lat2 == "") $lat2 = 38.;
$lon2  = $_REQUEST["lon2"];    if ($lon2 == "") $lon2 = 130.;
$mode  = $_REQUEST["mode"];    if ($mode == "") $mode = "skew";
$map   = $_REQUEST["map"];     if ($map == "")  $map  = "EA_CHT";
$zoom_x = $_REQUEST["zoom_x"]; if ($zoom_x == "") $zoom_x = "0000000";
$zoom_y = $_REQUEST["zoom_y"]; if ($zoom_y == "") $zoom_y = "0000000";

if ($model == "ISEN-UMGL") $model = "GDAPS";

if ($mode == "crss_sct") $opt = $mode.",".$tm_fc.",".$tm_ef.",".$model.",".$lat.",".$lon.",".$lat2.",".$lon2.",".$map.",".$zoom_x.",".$zoom_y;
else $opt = $mode.",".$tm_fc.",".$tm_ef.",".$model.",".$lat.",".$lon;

if ($mode == "skew") $title = "통합분석-단열선도";
else if ($mode == "mto")  $title = "통합분석-연직시계열";
else if ($mode == "lmto") $title = "통합분석-연직바람장";
else if ($mode == "crss_sct")  $title = "연직단면도";
?>

<HTML>
<HEAD>
<title><?=$title?></title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR"/>
<meta http-equiv='X-UA-Compatible' content='IE=edge'/>
<style type='text/css'>
<!--
img {image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;}
.checkboxs {display: inline-block; width: 14px; height: 14px; margin: 3px 0 0 0;}
.checkbox2 {display: inline-block; width: 12px; height: 12px; margin: 0px 1 0 1; position: relative; top: 2px;}
.head  {font-family:'굴림','Verdana';   font-size:10pt; color: #222222;}
.ehead {font-family:'굴림체','Verdana'; font-size:11pt; color: #000000;}
.text1 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 8pt; color: #000000; Font-weight:bold;}
.text2 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 9pt; color: #000C65; font-weight:bold;}
.text3 {font-family:'맑은 고딕','굴림체','Verdana'; font-size: 9pt; color: #000000; height:14pt;}
.T02_Style01   {Border-Top: 1px solid #CCCCCC; Border-Bottom: 1px solid #CCCCCC; Border-collapse:collapse; Background-Color:#F1F1F1;}
.T02_Header01  {text-align:center; Background-Color:#FFECD2; Font-family:"맑은 고딕"; Font-size:14px; Font-weight:bold; letter-spacing:-1pt; Color:#3C48A1; Border-Right: 1px solid #CCCCCC;}
.T02_List01    {Padding:3 8 2 8; text-align:center; Background-Color:#FFF5E6;}
.T02_Title02   {Font-family:"맑은 고딕","굴림"; Font-size:12px; Font-weight:bold; Color:#3C48A1;}
.TimeBox       {Height:15px; Border: 0px solid #FFFFFF; Background-Color:transparent; Font-family:"Verdana"; Font-size:9pt; Color:#000C65; Font-weight:bold;}
.TextBox       {Height:14px; Width:48px; Border: 1px solid #F0F0F0; Font-family:"Verdana"; Font-size:7pt; Color:#000C65; Font-weight:bold;}
.Zoom {Font-family:"맑은 고딕"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; vertical-align:top; text-align:center; border-style:outset; border-width:1; border-color:#888888; Background-Color:transparent; cursor:hand;}
.TB08 {Height:19px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; text-align:center; border-style:outset; border-width:1; border-color:#888888; cursor:hand;}
.TB09 {width:37px; Height:16px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:1 0 0 1; Font-weight:bold; vertical-align:top; text-align:center; border-style:outset; border-width:1; border-color:#888888; cursor:hand; display:inline-block; line-height:16px;}
.TB10 {width:39px; Height:12px; Font-family:"Tahoma"; Font-size:11px; Color:#000C65; padding:2 0 0 1; Font-weight:bold; vertical-align:top; text-align:center;}
.TB11 {Font-size:13px; padding:0 0 0 0;}
.filter_point {font-family:'맑은 고딕'; font-size:10pt; color: #000000; font-weight:bold;}
.filter_small_point {font-family:'맑은 고딕'; font-size:8pt; color: #000000; font-weight:bold;}
.filter_point_white {font-family:'맑은 고딕'; font-size:10pt; color: #ffffff;}
.filter_point_white_b {font-family:'맑은 고딕'; font-size:10pt; color: #ffffff; font-weight:bold;}
.circle {background: rgba(153,217,234,0.8); border-radius: 50%; height: 20; width: 20;}
.marker-tip {color:red; font-weight:bold;}
.marker-interval {color:blue; font-weight:bold;}
._ku_LoadingBar {position:relative; top:50%; left:50%; width: 100px; height: 100px; background: url(../fgd/htdocs/images/loading.gif) no-repeat 96% 15%; z-index: 65535; opacity:1.0;}
-->
</style>

<link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>
<link rel="stylesheet" type="text/css" href="/fgd/htdocs/css/leaflet.css"/>

<!-- leaflet / proj4 -->
<script type="text/javascript" src="/fgd/htdocs/js/leaflet/leaflet-src.js"></script>
<script type="text/javascript" src="/fgd/htdocs/js/proj4/proj4.js"></script>
<script type="text/javascript" src="/cht_new/htdocs/js/proj4leaflet_modified.js"></script>
<script type="text/javascript" src="/cht_new/htdocs/js/L.Graticule.js"></script>

<script language="javascript" src="/sys/js/dateutil.js"></script>
<script language="javascript" src="/sys/js/popupCalendar.js"></script>
<script type="text/javascript" src="./cht_skew.js?<?=date('Ymdhis')?>"></script>

</HEAD>

<BODY onload='onLoad("<?=$opt?>");' onkeydown='var key = doKey(event,0); if (key == 0) return false;' onkeyup='var key = doKey(event,1); if (key == 0) return false;' onresize='fnBodyResize();' bgcolor=#ffffff topmargin=5 leftmargin=5 marginwidth=5 marginheight=5 style='overflow:hidden;'>
<!-- 메뉴 -->
<div id=menu style='position:relative; overflow:hidden; z-index:200;'>
<table cellpadding=0 cellspacing=0 border=0 width=100% class=T02_Style01 style='z-index:200;'>
<tr>
  <td nowrap class=T02_List01>
    <table border=0 cellpadding=0 cellspacing=0 align=left>
    <!-- 1번째 줄 -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr height=4></tr>
        <tr>
          <td>
            <table id=table_fc border=0 cellpadding=0 cellspacing=0 align=left>
              <tr>
                <td nowrap class=T02_Title02>&middot;&nbsp;발표시간(KST)&nbsp;</td>
                <td nowrap width=5></td>
                <td nowrap><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(1, 'fc');" value=' NOW '></td>

                <td nowrap width=5></td> 
                <td nowrap style='padding:0 0 0 2;'><input type="text" name="tmfc" id="tmfc" value="0" maxlength="16" class=TimeBox style="width:130px;" onkeypress="tm_input('fc');"></td>
                <td nowrap><a href="#" onclick="calendarPopup('tmfc', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
                <td nowrap width=5></td>
                <td nowrap class=TB09 onclick="tm_move('-12H', 'fc');" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-12H</td>
                <td nowrap width=2></td>
                <td nowrap class=TB09 onclick="tm_move('-6H', 'fc');" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-6H</td>
                <td nowrap width=2></td>
                <td nowrap class=TB09 onclick="tm_move('+6H', 'fc');" style="background-color:#ffebe5; width:30px; font-size:7pt;">+6H</td>
                <td nowrap width=2></td>
                <td nowrap class=TB09 onclick="tm_move('+12H', 'fc');" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+12H</td>

                <td nowrap width=15></td>
                <td nowrap>
                  <div id=table_mdl>
                    <div class=T02_Title02 style='position:relative; top:2px;'>&middot;&nbsp;모델:&nbsp;&nbsp;</div>
                    <div>
                      <select class=text3 style='height:20px;' name="model" id=model onchange="tm_move('+0H', 0);" > 
                        <option value="">모델 선택</option>
                        <option value="GDAPS_KIM">KIM</option>
                        <option value="GDAPS" selected>UM전구</option>
                        <option value="ECMWF_H">ECMWF</option>
                      </select>
                    </div>
                    <div style='min-width:15px;'></div>
                  </div>
                </td>

              </tr>
            </table>
          </td>

          <td nowrap class=T02_Title02>&middot;&nbsp;지점&nbsp;</td>
          <td nowrap width=5></td>
          <td nowrap class=text1>위도</td>
          <td nowrap width=4></td>
          <td nowrap><input class='text1 prevent-keydown' type="number" step="any" name="lat" id=lat autocomplete="off" value=37.8 style='IME-MODE: disabled; width:60px;'></td>
          <td nowrap width=5></td>
          <td nowrap class=text1>경도</td>
          <td nowrap width=4></td>
          <td nowrap><input class='text1 prevent-keydown' type="number" step="any" name="lon" id=lon autocomplete="off" value=128.4 style='IME-MODE: disabled; width:60px;'></td>
          <td nowrap width=5></td>
          <td nowrap><input class=TB08 style="width:35px; font-size:11px;" type="submit" value="변경" onclick="stn_id = 0; latlon = 0; tm_move('+0H', 0);"></td>

          <td>
            <table id=table_pnt2 border=0 cellpadding=0 cellspacing=0 align=left style='display:none;'>
              <tr>
              <td nowrap width=15></td>
              <td nowrap class=T02_Title02>&middot;&nbsp;지점2&nbsp;</td>
              <td nowrap width=5></td>
              <td nowrap class=text1>위도</td>
              <td nowrap width=4></td>
              <td nowrap><input class='text1 prevent-keydown' type="number" step="any" name="lat2" id=lat2 autocomplete="off" value=37.8 style='IME-MODE: disabled; width:60px;'></td>
              <td nowrap width=5></td>
              <td nowrap class=text1>경도</td>
              <td nowrap width=4></td>
              <td nowrap><input class='text1 prevent-keydown' type="number" step="any" name="lon2" id=lon2 autocomplete="off" value=128.4 style='IME-MODE: disabled; width:60px;'></td>
              <td nowrap width=5></td>
              <td nowrap><input class=TB08 style="width:35px; font-size:11px;" type="submit" value="변경" onclick="latlon = 0; tm_move('+0H', 0);"></td>
              </tr>
            </table>
          </td>

          <td>
            <table id=table_stn border=0 cellpadding=0 cellspacing=0 align=left>
              <tr>
              <td nowrap width=15></td>
              <td nowrap class=T02_Title02>&middot;&nbsp;대표 지점&nbsp;</td>
              <td nowrap width=5></td>
              <td nowrap> 
                <div style='display:flex;'>
                  <div id=tms_stn1></div>
                  <div style='width:2px;'></div>
                  <div id=tms_stn2></div>
                </div>
              </td>
              <td nowrap width=5></td>
              <td nowrap><input class=TB08 style="width:35px; font-size:11px;" type="submit" value="변경" onclick="stn_id = document.getElementById('select_stn').value; console.log(stn_id); tm_move('+0H', 0);"></td>
              </tr>
            </table>
          </td>

          <td nowrap width=15></td>
          <td>
            <div id=table_window class=T02_Title02 style='display:flex; white-space:nowrap;'>
              <div>
                &middot;&nbsp;표출&nbsp;
                <select id=window name=window onChange='doWindow(1);' class='text3 prevent-keydown'>
                  <option value=1 selected>1개창</option>
                  <option value=2>2개창</option>
                  <option value=3>3개창</option>
                </select>
              </div>

              <div style='min-width:2px;'></div>
              <div>
                <select id=size name=size onChange="tm_move('+0H', 0);" style='font-size:9pt;' class='text3 prevent-keydown'>
                  <option value=100 selected>원래 크기</option>
                  <option value=90>축소(90%)</option>
                  <option value=80>축소(80%)</option>
                  <option value=75>축소(75%)</option>
                  <option value=70>축소(70%)</option>
                  <option value=65>축소(65%)</option>
                  <option value=60>축소(60%)</option>
                  <option value=50>축소(50%)</option>
                </select>
              </div>

              <div style='min-width:15px;'></div>
              <div style='position:relative; top:1px;'><input type=checkbox class=checkboxs name=comp id=comp1 onclick='if (this.checked == 1) mdl_comp(1); else comp = 0;'></div>
              <div style='min-width:1px;'></div>
              <div><input type=button class=TB08 style='background-color:#ffffff;width:41px;height:18px;' value=' 비교1 ' title='KIM/UM 비교' onClick="mdl_comp(1);"></div>
              <div style='min-width:2px;'></div>
              <div style='position:relative; top:1px;'><input type=checkbox class=checkboxs name=comp id=comp2 onclick='if (this.checked == 1) mdl_comp(2); else comp = 0;'></div>
              <div style='min-width:1px;'></div>
              <div><input type=button class=TB08 style='background-color:#ffffff;width:41px;height:18px;' value=' 비교2 ' title='KIM/ECMWF 비교' onClick="mdl_comp(2);"></div>
              <div style='min-width:2px;'></div>
              <div style='position:relative; top:1px;'><input type=checkbox class=checkboxs name=comp id=comp3 onclick='if (this.checked == 1) mdl_comp(3); else comp = 0;'></div>
              <div style='min-width:1px;'></div>
              <div><input type=button class=TB08 style='background-color:#ffffff;width:41px;height:18px;' value=' 비교3 ' title='UM/ECMWF 비교' onClick="mdl_comp(3);"></div>
              <div style='min-width:2px;'></div>
              <div style='position:relative; top:1px;'><input type=checkbox class=checkboxs name=comp id=comp4 onclick='if (this.checked == 1) mdl_comp(4); else comp = 0;'></div>
              <div style='min-width:1px;'></div>
              <div><input type=button class=TB08 style='background-color:#ffffff;width:41px;height:18px;' value=' 비교4 ' title='KIM/UM/ECMWF 비교' onClick="mdl_comp(4);"></div>

              <div style='min-width:15px;'></div>
              <div><input type=button class=TB08 style="background-color:#ffffff;width:60px;height:18px;" value=' 전체변경 ' onclick="fn_btnClick('tm');"></div>
            </div>
          </td>

        </tr>
        </table>
      </td>
    </tr>

    <tr height=5>
    </tr>

    <!-- 2번째 줄 -->
    <tr>
      <td>
        <div style='display:flex; white-space:nowrap;'>  
          <div id=table_itv style='display:flex;'>
            <div class=T02_Title02>&middot;&nbsp;시간 간격&nbsp;</div>
            <div class=T02_Title02>
              <span class="radio-style">
                <input type="radio" id="tm01" name="tm_itv" onclick="tm_itv=1; tm_move('+0H', 0);" value="1"><label for="tm01" class=text1 style='position:relative; top:-3px; cursor:pointer;'>1시간</label>
              </span>
              <span class="radio-style">
                <input type="radio" id="tm02" name="tm_itv" onclick="tm_itv=3; tm_move('+0H', 0);" value="3"><label for="tm02" class=text1 style='position:relative; top:-3px; cursor:pointer;'>3시간</label>
              </span>
            </div>
          </div>

          <div id=table_ef style='display:flex;'>
            <div style='min-width:15px;'></div>
            <div class=T02_Title02>&middot;&nbsp;발효시간(KST)&nbsp;</div>
            <div style='width:5px;'></div>
            <div><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(1, 0);" value=' NOW '></div>

            <div style='width:5px;'></div> 
            <div style='padding:0 0 0 2;'><input type="text" name="tm0" id="tm0" value="0" maxlength="16" class=TimeBox style="width:130px; height:21px;" onkeypress="tm_input(0);"></div>
            <div><a href="#" onclick="calendarPopup('tm0', calPress);" onfocus=blur() style='position:relative; top:2px;'><img src='/images/calendar.gif' border=0></a></div>
            <div style='width:5px;'></div>
            <div class=TB09 onclick="tm_move('-24H', 0);" style="background-color:#c4e3ff; width:30px; font-size:7pt;">-24H</div>
            <div style='width:2px;'></div>
            <div class=TB09 onclick="tm_move('-12H', 0);" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-12H</div>
            <div style='width:2px;'></div>
            <div class=TB09 onclick="tm_move('-6H', 0);" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-6H</div>
            <div style='width:2px;'></div>
            <div class=TB09 onclick="tm_move('-3H', 0);" style="background-color:#f3fcff; width:30px; font-size:7pt;">-3H</div>
            <div style='width:2px;'></div>  
            <div id=tm_1hr style='display:flex;'>
              <div class=TB09 onclick="tm_move('-1H', 0);" style="background-color:#f3fcff; width:30px; font-size:7pt;">-1H</div>
              <div style='width:2px;'></div>
              <div class=TB09 onclick="tm_move('+1H', 0);" style="background-color:#fff4f1; width:30px; font-size:7pt;">+1H</div>
              <div style='width:2px;'></div>
            </div>
            <div class=TB09 onclick="tm_move('+3H', 0);" style="background-color:#fff4f1; width:30px; font-size:7pt;">+3H</div>
            <div style='width:2px;'></div>
            <div class=TB09 onclick="tm_move('+6H', 0);" style="background-color:#ffebe5; width:30px; font-size:7pt;">+6H</div>
            <div style='width:2px;'></div>
            <div class=TB09 onclick="tm_move('+12H', 0);" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+12H</div>
            <div style='width:2px;'></div>
            <div class=TB09 onclick="tm_move('+24H', 0);" style="background-color:#ffcfc5; width:30px; font-size:7pt;">+24H</div>
          </div>

          <div id=table_load style='display:flex; white-space:nowrap;'>
            <div style='display:none;'>
              <div style='width:18px;'></div>
              <div class=T02_Title02 style='display:flex; white-space:nowrap;'>
                &middot;&nbsp;위성 단열선도 비교&nbsp;
                <input type=checkbox class=checkbox2 id=sat onclick="tm_move('+0H', 0);">
              </div> 
            </div>

            <div style='width:15px;'></div>
            <div class=T02_Title02 style='display:flex; white-space:nowrap;'>
              &middot;&nbsp;로딩&nbsp;
              <div style='border:1px solid gray; border-radius:4px; width:18px; height:16px; background-color:#F3FCFF; font-size:10pt; color:blue;'>
                <i class='fas fa-spinner' style='cursor:hand; position:relative; top:2px; left:3px;' onClick='loadImage();' title='현재 발효시간부터 +24H까지의 이미지를 로딩합니다.'></i>
              </div>
              <div nowrap class=text1 title='자동로딩 기능 on/off 토글'>
                &nbsp;(<input type=checkbox class=checkbox2 id=autoload onclick='if (this.checked == 1) autoload = 1; else autoload = 0;'><label for="autoload" class=text1>자동</label>)
              </div>
            </div>
          </div>

          <div id=table_crss style='display:none; white-space:nowrap;'>
            <div style='width:15px;'></div>
            <div class=T02_Title02 style='display:flex; white-space:nowrap;'>
              &middot;&nbsp;표출 구간&nbsp;
              <div style='min-width:4px;'></div>
              <div>
                <select id=max_level onChange="tm_move('+0H', 0);" class='text3 prevent-keydown'>
                  <option value=1000 selected>1000hPa</option>
                </select>
              </div>

              <div style='min-width:2px;'>~</div>
              <div>
                <select id=min_level onChange="tm_move('+0H', 0);" style='font-size:9pt;' class='text3 prevent-keydown'>
                  <option value=100>100hPa</option>
                  <option value=150>150hPa</option>
                  <option value=200>200hPa</option>
                  <option value=250 selected>250hPa</option>
                  <option value=300>300hPa</option>
                  <option value=400>400hPa</option>
                  <option value=500>500hPa</option>
                  <option value=600>600hPa</option>
                  <option value=700>700hPa</option>
                  <option value=850>850hPa</option>
                  <option value=925>925hPa</option>
                </select>
              </div>
            </div>

            <div style='width:10px;'></div>
            <input type="checkbox" id="rain" onclick="tm_move('+0H', 0);" value="1">&nbsp;<label for="rain" class=text1 style="position:relative; top:1px; left:-4px; font-size:9pt;">강수 표출</label>
          </div>

        </div>
      </td>
    </tr>

    <!-- 3번째 줄 -->
    <tr>
      <td>
        <table id=table_tm border=0 cellpadding=0 cellspacing=0 align=left style='display:none;'>
        <tr height=4></tr>
        <tr>
          <td nowrap class=TB10 id=date0 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date1 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date2 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date3 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date4 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date5 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date6 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date7 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date8 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date9 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date10 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date11 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date12 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date13 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date14 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date15 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date16 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date17 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date18 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date19 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date20 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date21 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date22 style='line-height:14px;'></td>
          <td nowrap width=2></td>
          <td nowrap class=TB10 id=date23 style='line-height:14px;'></td>
          <td nowrap width=2></td>
        </tr>
        <tr>
          <td nowrap class=TB09 id=time0 onclick="javascript:tmbarClick(0);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time1 onclick="javascript:tmbarClick(1);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time2 onclick="javascript:tmbarClick(2);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time3 onclick="javascript:tmbarClick(3);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time4 onclick="javascript:tmbarClick(4);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time5 onclick="javascript:tmbarClick(5);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time6 onclick="javascript:tmbarClick(6);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time7 onclick="javascript:tmbarClick(7);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time8 onclick="javascript:tmbarClick(8);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time9 onclick="javascript:tmbarClick(9);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time10 onclick="javascript:tmbarClick(10);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time11 onclick="javascript:tmbarClick(11);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time12 onclick="javascript:tmbarClick(12);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time13 onclick="javascript:tmbarClick(13);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time14 onclick="javascript:tmbarClick(14);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time15 onclick="javascript:tmbarClick(15);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time16 onclick="javascript:tmbarClick(16);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time17 onclick="javascript:tmbarClick(17);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time18 onclick="javascript:tmbarClick(18);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time19 onclick="javascript:tmbarClick(19);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time20 onclick="javascript:tmbarClick(20);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time21 onclick="javascript:tmbarClick(21);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time22 onclick="javascript:tmbarClick(22);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 id=time23 onclick="javascript:tmbarClick(23);" style="background-color:#ffffff;"></td>
          <td nowrap width=2></td>
        </tr>
        </table>
      </td>
    </tr>

    </table>
  </td>
</tr>
</table>
</div>

<div style='position:relative; height:10px; z-index:200;'></div>
<!-- 바디 -->
<div id='skew_body' style='overflow:auto; display:flex;'>
  <div style='min-width:5px'></div>
  <div id=cht1>
    <div id=tm_select1>
      <table cellpadding=0 cellspacing=0>
        <tr>
          <td nowrap class=T02_Title02>&middot;&nbsp;모델&nbsp;</td>
          <td nowrap>
            <select class=text3 style='height:20px;' name="model" id=model1 onchange="comp=0; tm_move('+0H', 0);" > 
            <option value="GDAPS_KIM">KIM</option>
            <option value="GDAPS">UM전구</option>
            <option value="ECMWF_H">ECMWF</option>
            </select>
          </td>

          <td nowrap width=8></td>
          <td nowrap class=T02_Title02>&middot;&nbsp;발표시간&nbsp;</td>
          <td nowrap><input type=button class=TB08 style='background-color:#ffffff; text-align:middle;' onfocus=blur() onclick="tm_init(1, 1);" value=' NOW '></td>
          <td nowrap width=5></td>
          <td nowrap style='padding:0 0 0 2;'><input type=text name=tm1 id=tm1 value='0' maxlength=16 class=TimeBox style='width:130px;' onkeypress="tm_input(1);"></td>
          <td nowrap><a href='#' onclick="calendarPopup('tm1', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
          <td nowrap width=5></td>
          <td nowrap class=TB09 onclick="tm_move('-24H', 1);" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-24H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('-12H', 1);" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-12H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('+12H', 1);" style="background-color:#ffebe5; width:30px; font-size:7pt;">+12H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('+24H', 1);" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+24H</td>
        </tr>
      </table>
    </div>

    <div id=var_select1 style='display:none;'>
      <div style='min-height:4px;'></div>
      <div class=T02_Title02 style='display:flex; white-space:nowrap;'>
        &middot;&nbsp;표출&nbsp;
        <span class="radio-style">
          <input type="radio" id="var1_01" name="var1" onclick="mdl_comp(comp, -1);" value="DPDK" checked><label for="var1_01" class=text1 style='position:relative; top:-3px; cursor:pointer;'>습수</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var1_02" name="var1" onclick="mdl_comp(comp, -1);" value="EPOT"><label for="var1_02" class=text1 style='position:relative; top:-3px; cursor:pointer;'>상당온위</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var1_03" name="var1" onclick="mdl_comp(comp, -1);" value="PVEL"><label for="var1_03" class=text1 style='position:relative; top:-3px; cursor:pointer;'>P속도</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var1_04" name="var1" onclick="mdl_comp(comp, -1);" value="WSPD"><label for="var1_04" class=text1 style='position:relative; top:-3px; cursor:pointer;'>풍속</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var1_05" name="var1" onclick="mdl_comp(comp, -1);" value="CONV"><label for="var1_05" class=text1 style='position:relative; top:-3px; cursor:pointer;'>수렴/발산</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var1_06" name="var1" onclick="mdl_comp(comp, -1);" value="TD"><label for="var1_06" class=text1 style='position:relative; top:-3px; cursor:pointer;'>노점온도</label>
        </span>
      </div>
      <div style='min-height:4px;'></div>
    </div>

    <div id=nocht1 class=text2 style='color:#000; display:none;'><br>이미지가 없습니다.<br>발표시각과 발효시각을 확인해주세요.</div>
  </div>

  <div style='min-width:20px'></div>
  <div id=cht2>
    <div id=tm_select2>
      <table cellpadding=0 cellspacing=0>
        <tr>
          <td nowrap class=T02_Title02>&middot;&nbsp;모델&nbsp;</td>
          <td nowrap>
            <select class=text3 style='height:20px;' name="model" id=model2 onchange="comp=0; tm_move('+0H', 0);" > 
            <option value="GDAPS_KIM">KIM</option>
            <option value="GDAPS">UM전구</option>
            <option value="ECMWF_H">ECMWF</option>
            </select>
          </td>

          <td nowrap width=8></td>
          <td nowrap class=T02_Title02>&middot;&nbsp;발표시간&nbsp;</td>
          <td nowrap><input type=button class=TB08 style='background-color:#ffffff; text-align:middle;' onfocus=blur() onclick="tm_init(1, 2);" value=' NOW '></td>
          <td nowrap width=5></td>
          <td nowrap style='padding:0 0 0 2;'><input type=text name=tm2 id=tm2 value='0' maxlength=16 class=TimeBox style='width:130px;' onkeypress="tm_input(2);"></td>
          <td nowrap><a href='#' onclick="calendarPopup('tm2', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
          <td nowrap width=5></td>
          <td nowrap class=TB09 onclick="tm_move('-24H', 2);" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-24H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('-12H', 2);" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-12H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('+12H', 2);" style="background-color:#ffebe5; width:30px; font-size:7pt;">+12H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('+24H', 2);" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+24H</td>
        </tr>
      </table>
    </div>

    <div id=var_select2 style='display:none;'>
      <div style='min-height:4px;'></div>
      <div class=T02_Title02 style='display:flex; white-space:nowrap;'>
        &middot;&nbsp;표출&nbsp;
        <span class="radio-style">
          <input type="radio" id="var2_01" name="var2" onclick="tm_move('+0H', 0);" value="DPDK" checked><label for="var2_01" class=text1 style='position:relative; top:-3px; cursor:pointer;'>습수</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var2_02" name="var2" onclick="tm_move('+0H', 0);" value="EPOT"><label for="var2_02" class=text1 style='position:relative; top:-3px; cursor:pointer;'>상당온위</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var2_03" name="var2" onclick="tm_move('+0H', 0);" value="PVEL"><label for="var2_03" class=text1 style='position:relative; top:-3px; cursor:pointer;'>P속도</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var2_04" name="var2" onclick="tm_move('+0H', 0);" value="WSPD"><label for="var2_04" class=text1 style='position:relative; top:-3px; cursor:pointer;'>풍속</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var2_05" name="var2" onclick="tm_move('+0H', 0);" value="CONV"><label for="var2_05" class=text1 style='position:relative; top:-3px; cursor:pointer;'>수렴/발산</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var2_06" name="var2" onclick="tm_move('+0H', 0);" value="TD"><label for="var2_06" class=text1 style='position:relative; top:-3px; cursor:pointer;'>노점온도</label>
        </span>
      </div>
      <div style='min-height:4px;'></div>
    </div>

    <div id=nocht2 class=text2 style='color:#000; display:none;'><br>이미지가 없습니다.<br>발표시각과 발효시각을 확인해주세요.</div>
  </div>

  <div style='min-width:20px'></div>
  <div id=cht3>
    <div id=tm_select3>
      <table cellpadding=0 cellspacing=0>
        <tr>
          <td nowrap class=T02_Title02>&middot;&nbsp;모델&nbsp;</td>
          <td nowrap>
            <select class=text3 style='height:20px;' name="model" id=model3 onchange="comp=0; tm_move('+0H', 0);" > 
            <option value="GDAPS_KIM">KIM</option>
            <option value="GDAPS">UM전구</option>
            <option value="ECMWF_H">ECMWF</option>
            </select>
          </td>

          <td nowrap width=8></td>
          <td nowrap class=T02_Title02>&middot;&nbsp;발표시간&nbsp;</td>
          <td nowrap><input type=button class=TB08 style='background-color:#ffffff; text-align:middle;' onfocus=blur() onclick="tm_init(1, 3);" value=' NOW '></td>
          <td nowrap width=5></td>
          <td nowrap style='padding:0 0 0 2;'><input type=text name=tm3 id=tm3 value='0' maxlength=16 class=TimeBox style='width:130px;' onkeypress="tm_input(3);"></td>
          <td nowrap><a href='#' onclick="calendarPopup('tm1', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
          <td nowrap width=5></td>
          <td nowrap class=TB09 onclick="tm_move('-24H', 3);" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-24H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('-12H', 3);" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-12H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('+12H', 3);" style="background-color:#ffebe5; width:30px; font-size:7pt;">+12H</td>
          <td nowrap width=2></td>
          <td nowrap class=TB09 onclick="tm_move('+24H', 3);" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+24H</td>
        </tr>
      </table>
    </div>

    <div id=var_select3 style='display:none;'>
      <div style='min-height:4px;'></div>
      <div class=T02_Title02 style='display:flex; white-space:nowrap;'>
        &middot;&nbsp;표출&nbsp;
        <span class="radio-style">
          <input type="radio" id="var3_01" name="var3" onclick="tm_move('+0H', 0);" value="DPDK" checked><label for="var3_01" class=text1 style='position:relative; top:-3px; cursor:pointer;'>습수</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var3_02" name="var3" onclick="tm_move('+0H', 0);" value="EPOT"><label for="var3_02" class=text1 style='position:relative; top:-3px; cursor:pointer;'>상당온위</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var3_03" name="var3" onclick="tm_move('+0H', 0);" value="PVEL"><label for="var3_03" class=text1 style='position:relative; top:-3px; cursor:pointer;'>P속도</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var3_04" name="var3" onclick="tm_move('+0H', 0);" value="WSPD"><label for="var3_04" class=text1 style='position:relative; top:-3px; cursor:pointer;'>풍속</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var3_05" name="var3" onclick="tm_move('+0H', 0);" value="CONV"><label for="var3_05" class=text1 style='position:relative; top:-3px; cursor:pointer;'>수렴/발산</label>
        </span>
        &nbsp;
        <span class="radio-style">
          <input type="radio" id="var3_06" name="var3" onclick="tm_move('+0H', 0);" value="TD"><label for="var3_06" class=text1 style='position:relative; top:-3px; cursor:pointer;'>노점온도</label>
        </span>
      </div>
      <div style='min-height:4px;'></div>
    </div>

    <div id=nocht3 class=text2 style='color:#000; display:none;'><br>이미지가 없습니다.<br>발표시각과 발효시각을 확인해주세요.</div>
  </div>
</div>

<!-- 전체변경 -->
<div id='tmLayer' name='tmLayer' style='position:fixed; top:60px; left:580px; display:none; border:1px solid black; background-color:#ffffff; padding:10px; z-index:500;'>

    <div style='margin:0 0 5px 0;'>
        <table border=0 cellpadding=0 cellspacing=1>
          <tr>
            <td><span class='filter_point'>▶ 발표시간 전체 변경</span></td>
            <td width=5></td>
            <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="document.getElementById('tm0').value = document.getElementById('tmChg').value; tm_move('+0H', 0);" value=' 발효시간 동기화 '></td>
            <td>
            <span style='position:relative; left:150px;'>
                <a href='#' onclick='javascript:fn_btnClick("tm");'>
                <img src='/images/btn_icon_close.png' border='0' alt='닫기' title='닫기' style='border: 1px solid #999999;'>
                </a>
            </span>
            </td>
          </tr>
        </table>
    </div>

    <table border=0 cellpadding=0 cellspacing=0>
    <tr><td>
        <table border=0 cellpadding=0 cellspacing=0 bordercolor=#9d9c9c bordercolordark=#ffffff style='table-layout:fixed;'>
            <tr align=center class='filter_point_white_b'>
              <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(1, -1);" value=' NOW '></td>

              <td width=5></td> 
              <td style='padding:0 0 0 2;'><input type=text name=tmChg id=tmChg value=0 formatStr="yyyy.MM.dd.HH:mm" maxlength=16 class=TimeBox style="width:130px;" onkeypress="tm_input(-1);"></td>
              <td><a href=#  onclick="calendarPopup('tmChg', calPress);"  onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
              <td width=5></td>
              <td class=TB09 onclick="tm_move('-24H', -1);" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-24H</td>
              <td width=2></td>
              <td class=TB09 onclick="tm_move('-12H', -1);" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-12H</td>
              <td width=2></td>
              <td class=TB09 onclick="tm_move('-6H', -1);" style="background-color:#f3fcff; width:30px; font-size:7pt;">-6H</td>
              <td width=2></td>
              <td class=TB09 onclick="tm_move('+6H', -1);" style="background-color:#fff4f1; width:30px; font-size:7pt;">+6H</td>
              <td width=2></td>
              <td class=TB09 onclick="tm_move('+12H', -1);" style="background-color:#ffebe5; width:30px; font-size:7pt;">+12H</td>
              <td width=2></td>
              <td class=TB09 onclick="tm_move('+24H', -1);" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+24H</td>

            </tr>
        </table>
    </td></tr>
    </table>
</div>

<!-- 지도 -->
<div id='mapLayer' style='position:absolute; top:110px; right:25px; border:1px solid black; background-color:#ffffff; padding:0px; z-index:500;'>
  <div class=text1 onclick="map_toggle(this);" style="cursor:pointer; padding-left:4px; padding-right:4px; color:blue; text-align:right;">지도 숨기기</div> 
  <div id="map_container">
    <div class=text1 style="padding-left:4px;">지도를 클릭하여 단면의 위치를 조정할 수 있습니다.</div> 
    <div id="map" style='background-color:white;'></div>
  </div>
</div>

<!-- 로딩 바 -->
<div id=loading style='position:absolute; top:0px; left:0px; z-index:1000; width:100%; height:100%; background-color:#eeeeee; opacity:0.5; text-align:center; vertical-align:middle; display:none;'>
  <div class=_ku_LoadingBar></div>
</div>

<div id=loadingStatus style='position:absolute; top:65%; left:25%; width:50%; text-align:center; vertical-align:middle; display:none; opacity:1.0; z-index:1100;'>
  <div id=loadingnum style='position:relative; left:50px; font-size:10pt;' class=filter_point></div>
  <div id=loadingbar style='position:relative; left:50px; background-color:lightblue; height:25px; width:0%; border:1px solid black;'></div>
</div>

</html>