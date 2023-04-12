<!DOCTYPE HTML>
<HTML>
<HEAD>
<title>�ϱ⵵ �м�</title>
<meta http-equiv="Content-Type" content="text/html; charset=EUC-KR"/>
<meta http-equiv='X-UA-Compatible' content='IE=edge'/>

<link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>
<link rel="stylesheet" type="text/css" href="/fgd/htdocs/css/leaflet.css"/>
<link rel="stylesheet" href="./style.css?<?=date('Ymdhis')?>"/>

<script type="text/javascript" src="/fgd/htdocs/js/leaflet/leaflet-src.js"></script>
<script type="text/javascript" src="/fgd/htdocs/js/proj4/proj4.js"></script>
<script type="text/javascript" src="./htdocs/js/es6-promise.auto.min.js"></script>
<script type="text/javascript" src="./htdocs/js/styledLayerControl.js"></script>
<script type="text/javascript" src="./htdocs/js/proj4leaflet_modified.js?<?=date('Ymdhis')?>"></script>
<script type="text/javascript" src="./htdocs/js/L.Graticule.js"></script>
<script type="text/javascript" src="./htdocs/js/dom-to-image.js"></script>
<script type="text/javascript" src="./htdocs/js/L.Map.Sync.js"></script>

<script language="javascript" src="/sys/js/dateutil.js"></script>
<script language="javascript" src="/sys/js/popupCalendar.js"></script>
<script type="text/javascript" src="./cht_multiv_gis.js?<?=date('Ymdhis')?>"></script>

</HEAD>

<BODY onload='onLoad("<?=$cht_mode?>");' onkeydown='var key = doKey(event,0); if (key == 0) return false;' onkeyup='var key = doKey(event,1); if (key == 0) return false;' onresize='fnBodyResize();' bgcolor=#ffffff topmargin=5 leftmargin=5 marginwidth=5 marginheight=5 style='overflow:hidden;'>
<!-- ��Ƽ��� �޴� -->
<div id=menu style='position:relative; overflow:hidden; z-index:2000;'>
<table cellpadding=0 cellspacing=0 border=0 width=100% class=T02_Style01 style='z-index:200;'>
<tr>
  <td class=T02_List01>
    <table border=0 cellpadding=0 cellspacing=0 align=left>
    <!-- 1��° �� -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left style='white-space:nowrap;'>
        <tr>
          <td class=T02_Title02>&middot;&nbsp;��ȿ�ð�(Valid)&nbsp;</td>
          <td style='min-width:5px;'></td>
          <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(1, 0);" value=' NOW '></td>

          <td style='min-width:5px;'></td> 
          <td style='padding:0 0 0 2;'><input type="text" name="tm0" id="tm0" value="0" maxlength="16" class=TimeBox style="width:130px;" onkeypress="tm_input(0);"></td>
          <td><a href="#" onclick="calendarPopup('tm0', calPress);" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
          <td style='min-width:5px;'></td>
          <td class=TB09 onclick="tm_move('-24H', 0);" style="background-color:#c4e3ff; min-width:30px; font-size:7pt;">-24H</td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('-12H', 0);" style="background-color:#d4f3ff; min-width:30px; font-size:7pt;">-12H</td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('-6H', 0);" style="background-color:#e5f8ff; min-width:30px; font-size:7pt;">-6H</td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('-3H', 0);" style="background-color:#f3fcff; min-width:30px; font-size:7pt;">-3H</td>
          <td>
            <table id=tm_1hr border=0 cellpadding=0 cellspacing=0 align=left style="display:none;"> 
              <tr>
                <td style='min-width:2px;'></td>
                <td class=TB09 onclick="tm_move('-1H', 0);" style="background-color:#f3fcff; min-width:30px; font-size:7pt;">-1H</td>
                <td style='min-width:2px;'></td>
                <td class=TB09 onclick="tm_move('+1H', 0);" style="background-color:#fff4f1; min-width:30px; font-size:7pt;">+1H</td>
              </tr>
            </table>
          </td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('+3H', 0);" style="background-color:#fff4f1; min-width:30px; font-size:7pt;">+3H</td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('+6H', 0);" style="background-color:#ffebe5; min-width:30px; font-size:7pt;">+6H</td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('+12H', 0);" style="background-color:#ffdfd5; min-width:30px; font-size:7pt;">+12H</td>
          <td style='min-width:2px;'></td>
          <td class=TB09 onclick="tm_move('+24H', 0);" style="background-color:#ffcfc5; min-width:30px; font-size:7pt;">+24H</td>

          <td style='min-width:10px;'></td> 
          <td><select id=window name=window onChange='doWindow(1);' class='text3 prevent-keydown'>
            <option value='1,1'>1x1��â</option>
            <option value='1,2' selected>1x2��â</option>
            <option value='1,3'>1x3��â</option>
            <option value='2,1'>2x1��â</option>
            <option value='2,2'>2x2��â</option>
            <option value='2,3'>2x3��â</option>
            <option value='3,1'>3x1��â</option>
            <option value='3,2'>3x2��â</option>
            <option value='3,3'>3x3��â</option>
          </select></td>
  
          <td style='min-width:4px;'></td> 
          <td><select id=size name=size onChange="doSize(1);" class='text3 prevent-keydown'>
            <option value=150>Ȯ��(150%)</option>
            <option value=140>Ȯ��(140%)</option>
            <option value=130>Ȯ��(130%)</option>
            <option value=120>Ȯ��(120%)</option>
            <option value=110>Ȯ��(110%)</option>
            <option value=100>���� ũ��</option>
            <option value=95>���(95%)</option>
            <option value=90 selected>���(90%)</option>
            <option value=80>���(80%)</option>
            <option value=75>���(75%)</option>
            <option value=70>���(70%)</option>
            <option value=65>���(65%)</option>
            <option value=60>���(60%)</option>
            <option value=55>���(55%)</option>
            <option value=50>���(50%)</option>
          </select></td>

          <td style='min-width:4px;'></td> 
          <td><select id=theme name=theme onChange='doTheme();' class='text3 prevent-keydown' style="width:100px;">
          </select></td>

          <td style='min-width:6px;'></td> 
          <td>
            <input type=button class=TB08 style="background-color:#ffffff;width:60px;" name=tmfc value=' ��ü���� ' onclick="fn_btnClick('tm');">
          </td>
          <td style='min-width:2px;'></td>
          <td>
            <input type=button class=TB08 style="background-color:#ffffff;width:60px;" name=extra value=' �ΰ���� ' onClick="fn_btnClick('extra');">
          </td>

          <td class=T02_Title02>&nbsp;&nbsp;&middot;&nbsp;ǥ��</td>
          <td style='min-width:5px;'></td>
          <td>
            <input type=button class=TB08 style="background-color:#ffffff;width:38px;" name=total value=' ��ü ' onClick="unzoom_area(0);">
          </td>
          <td style='min-width:2px;'></td>
          <td>
            <input type=button class=TB08 style="background-color:#ffffff;width:38px;" name=reduce value=' ��� ' onClick="unzoom_area(1);">
          </td>
          <td style='min-width:2px;'></td>
          <td>
            <input type=button class=TB08 style="background-color:#ffffff;width:38px;" name=ctrl value=' ���� ' onClick="fn_btnClick('ctrl');">
          </td>

          <td class=T02_Title02>&nbsp;&nbsp;&middot;&nbsp;�ε�</td>
          <td style='min-width:5px;'></td>
          <td style='font-size:10pt; color:blue;'>
            <div style='border:1px solid gray; border-radius:4px; width:18px; height:16px; background-color:#F3FCFF;'>
              <i class='fas fa-spinner' style='cursor:pointer; position:relative; top:-1px;' onClick='loadImage();' title='���� ��ȿ�ð����� +24H������ �̹����� �ε��մϴ�.'></i>
            </div>
          <td class=text1 style='font-weight:bold;' title='�ڵ��ε� ��� on/off ���'>&nbsp;(<input type=checkbox class=checkbox2 id=autoload onclick='if (this.checked == 1) autoload = 1; else autoload = 0;'><label for="autoload" class="text1">�ڵ�</label>)</td>

        </tr>
        </table>
      </td>
    </tr>

    <!-- 2��° �� -->
    <tr>
      <td>
        <table border=0 cellpadding=0 cellspacing=0 align=left>
        <tr height=4></tr>
        <tr>
          <td rowspan=2 style='min-width:3px; border-left:1px solid red; border-top:0px solid red; border-bottom:0px solid red;'></td>
          <td rowspan=2 style='min-width:3px;'>
          <td colspan=15 class=text1>
            <div style='text-align:left; font-weight:bold;'>    
              <label for=lat>&middot; ����: </label><input type=text class=TextBox id=lat value='0.00' readonly=readonly title='����'>
              <label for=lon>&middot; �浵: </label><input type=text class=TextBox id=lon value='0.00' readonly=readonly title='�浵'>
            </div>
            <div style='height:2px;'></div>
          </td>
          <td rowspan=2 style='min-width:3px;'></td>
          <td rowspan=2 style='min-width:3px; border-right:1px solid red; border-top:0px solid red; border-bottom:0px solid red;'></td>

          <td rowspan=2 style='min-width:6px;'></td>
<?
          for ($i=0; $i<24; $i++) {
            echo "          <td class=TB10 id=date".$i." style='line-height:14px;'></td>\n";
            echo "          <td style='min-width:2px;'></td>\n";
          }
?>
        </tr>
        <tr>
          <td style='min-width:12px;'><input type=checkbox class=checkboxs name=comp id=comp1 onclick='if (this.checked == 1) mdl_comp(1); else comp = 0;'></td>
          <td style='min-width:1px;'></td>
          <td style='min-width:41px;'><input type=button class=TB08 style='background-color:#ffffd0;width:41px;height:17px;' name=comp1 value=' ��1 ' title='KIM/UM ��' onClick='mdl_comp(1);'></td>
          <td style='min-width:3px;'></td>
          <td style='min-width:12px;'><input type=checkbox class=checkboxs name=comp id=comp2 onclick='if (this.checked == 1) mdl_comp(2); else comp = 0;'></td>
          <td style='min-width:1px;'></td>
          <td style='min-width:41px;'><input type=button class=TB08 style='background-color:#ffffd0;width:41px;height:17px;' name=comp2 value=' ��2 ' title='KIM/ECMWF ��' onClick='mdl_comp(2);'></td>
          <td style='min-width:3px;'></td>
          <td style='min-width:12px;'><input type=checkbox class=checkboxs name=comp id=comp3 onclick='if (this.checked == 1) mdl_comp(3); else comp = 0;'></td>
          <td style='min-width:1px;'></td>
          <td style='min-width:41px;'><input type=button class=TB08 style='background-color:#ffffd0;width:41px;height:17px;' name=comp3 value=' ��3 ' title='UM/ECMWF ��' onClick='mdl_comp(3);'></td>
          <td style='min-width:3px;'></td>
          <td style='min-width:12px;'><input type=checkbox class=checkboxs name=comp id=comp4 onclick='if (this.checked == 1) mdl_comp(4); else comp = 0;'></td>
          <td style='min-width:1px;'></td>
          <td style='min-width:41px;'><input type=button class=TB08 style='background-color:#ffffd0;width:41px;height:17px;' name=comp4 value=' ��4 ' title='KIM/UM/ECMWF ��' onClick='mdl_comp(4);'></td>

<?
          for ($i=0; $i<24; $i++) {
            echo "          <td class=TB09 id=time".$i." onclick=\"javascript:tmbarClick(".$i.");\" style=\"min-width:39px;\"></td>\n";
            echo "          <td style='min-width:2px;'></td>\n";
          }
?>
        </tr>
        </table>
      </td>
    </tr>
    </table>

  </td>
</tr>
</table>
</div>

<!-- ��Ƽ��� �ٵ� -->
<div id='cht_body' style='overflow:auto;'>
<?
// ��Ƽ��� ���� ����
$ncht_max = 9;
$ncht = $ncht_max;

$rows = 3; //2�ٷ� ǥ��
for ($j=0; $j<$rows; $j++) {
  echo "  <table border=0 cellspacing=0 cellpadding=0>\n";
  echo "    <tr>\n";
  for ($i=1; $i<=$ncht_max/$rows; $i++) {
    $k = intval($j*$ncht_max/$rows+$i);
    echo "      <td>\n";

    echo "        <div style='min-height:5px;'></div>\n";
    echo "        <div id=cht_select".$k.">\n";
    echo "          <table border=0 cellspacing=0 cellpadding=0>\n";
    echo "            <tr valign=top>\n";
    echo "              <td class=T02_Title02>&nbsp;&middot;&nbsp;�ϱ⵵&nbsp;&nbsp;</td>\n";
    echo "              <td>\n";
    echo "                <select id=b".$k." onChange='doCht(1, ".$k.");' class='text3 prevent-keydown'></select>\n";
    echo "              </td>\n";
    echo "              <td style='min-width:5px;'></td>\n";
    echo "              <td>\n";
    echo "                <select id=c".$k." onChange='doCht(2, ".$k.");' class='text3 prevent-keydown'></select>\n";
    echo "              </td>\n";
    echo "              <td style='min-width:5px;'></td>\n";
    echo "              <td>\n";
    echo "                <select id=mdl".$k." onChange='doChtVal(".$k.", -1);' class='text3 prevent-keydown'></select>\n";
    echo "              </td>\n";
    echo "            </tr>\n";
    echo "          </table>\n";
    echo "        </div>\n";

    echo "      </td>\n";
    echo "      <td style='min-width:10px;'></td>\n";
  }
  echo "    </tr>\n";

  echo "    <tr>\n";
  for ($i=1; $i<=$ncht_max/$rows; $i++) {
    $k = intval($j*$ncht_max/$rows+$i);
    echo "      <td>\n";

    echo "        <div id=tm_select".$k.">\n";
    echo "          <table cellpadding=0 cellspacing=0>\n";
    echo "            <tr height=5></tr>\n";
    echo "            <tr>\n";
    echo "              <td class=T02_Title02>&nbsp;&middot;&nbsp;��ǥ�ð�&nbsp;&nbsp;</td>\n";
    echo "              <td ><input type=button class=TB08 style='background-color:#ffffff; text-align:middle;' onfocus=blur() onclick=\"tm_init(1, ".$k.");\" value=' NOW '></td>\n";
    echo "              <td style='min-width:5px;'></td>\n";
    echo "              <td style='padding:0 0 0 2;'><input type=text name=tm".$k." id=tm".$k." value='0' maxlength=16 class=TimeBox style='width:130px;' onkeypress=\"tm_input(".$k.");\"></td>\n";
    echo "              <td><a href='#' onclick=\"calendarPopup('tm".$k."', calPress);\" onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>\n";
    echo "              <td style='min-width:5px;'></td>\n";
    echo "              <td class=TB09 onclick=\"tm_move('-24H', ".$k.");\" style=\"background-color:#d4f3ff; width:30px; font-size:7pt;\">-24H</td>\n";
    echo "              <td style='min-width:2px;'></td>\n";
    echo "              <td class=TB09 onclick=\"tm_move('-12H', ".$k.");\" style=\"background-color:#e5f8ff; width:30px; font-size:7pt;\">-12H</td>\n";
    echo "              <td style='min-width:2px;'></td>\n";
    echo "              <td class=TB09 onclick=\"tm_move('-6H', ".$k.");\" style=\"background-color:#f3fcff; width:30px; font-size:7pt;\">-6H</td>\n";
    echo "              <td style='min-width:2px;'></td>\n";
    echo "              <td class=TB09 onclick=\"tm_move('+6H', ".$k.");\" style=\"background-color:#fff4f1; width:30px; font-size:7pt;\">+6H</td>\n";
    echo "              <td style='min-width:2px;'></td>\n";
    echo "              <td class=TB09 onclick=\"tm_move('+12H', ".$k.");\" style=\"background-color:#ffebe5; width:30px; font-size:7pt;\">+12H</td>\n";
    echo "              <td style='min-width:2px;'></td>\n";
    echo "              <td class=TB09 onclick=\"tm_move('+24H', ".$k.");\" style=\"background-color:#ffdfd5; width:30px; font-size:7pt;\">+24H</td>\n";
    echo "            </tr>\n";
    echo "          </table>\n";
    echo "        </div>\n";

    echo "      </td>\n";
    echo "      <td style='min-width:10px;'></td>\n";
  }
  echo "    </tr>\n";

  echo "    <tr valign=top>\n";
  for ($i=1; $i<=$ncht_max/$rows; $i++) {
    $k = intval($j*$ncht_max/$rows+$i);
    echo "      <td>\n";

    echo "        <div id=cht_table".$k.">\n";
    echo "          <table>\n";
    echo "            <tr height=4></tr>\n";
    echo "            <tr valign=top>\n";
    echo "              <td id=cht".$k."><div id=nocht".$k." style='display:none;'>�̹����� �����ϴ�.<br>��ǥ�ð��� ��ȿ�ð��� Ȯ�����ּ���.</div><div class=map id=map".$k."></div></td>\n";
    echo "            </tr>\n";
    echo "          </table>\n";
    echo "        </div>\n";

    echo "      </td>\n";
    echo "      <td style='min-width:10px;'></td>\n";
  }

  echo "    </tr>\n";
  echo "  </table>\n";
}

echo "\n";
for ($i=1; $i<=$ncht_max; $i++) {
  //���� �̹���
  echo "  <div id=hidden".$i." style='position:absolute; left:0px; top:0px; visibility:hidden; z-index:-1;'></div>\n";
  //���� ��ġ
  echo "  <div class=pop id=RedDot".$i." style='position:absolute; z-index:1999; visibility:hidden; color:red; font-size:8px; text-shadow: -1px -1px #000000, 1px 1px #000000, -1px 1px #000000, 1px -1px #000000;'>��</div>\n";
  //���̾� �˾� ����
  echo "  <div class=pop id=popupBox".$i." style='position:absolute; background-color:white; z-index:1999; visibility:hidden; border:1px solid black; padding:4px; padding-top:0px;'>\n";
  echo "    <a href='javascript:void(0)' onclick=\"hidePopup();\" style='float:right; text-decoration:none; color:black;'>��</a><br>\n";
  echo "    <div id=popupText".$i."></div>\n";
  echo "  </div>\n";
  //���̶���Ʈ
  echo "  <div class='circle pop' id=Highlight".$i." style='position:absolute; visibility:hidden; z-index:1999;'></div>\n";
}

?>

  <div id="screenshot" class=screen-pop style="position:absolute; top:100px; left:100px; z-index:1000; background:lightgray; display:none; text-align:center; overflow:auto;">
    <div style="height:8px;"></div>
    <div class=screen-pop-header style="display:flex;">
      <div style="width:20px;"></div>
      <div class=text2 style="color:black; position:relative; top:2px;">��ũ���� ��� �̹���(�巡�׷� â �̵�)</div>
      <button style="margin-left:auto; height:20px; width:70px; cursor:pointer;" onclick="document.getElementById('screenshot').style.display='none';">�ݱ�(ESC)</button>
      <div style="width:20px;"></div>
    </div>
    <div style="height:8px;"></div>
    <div><img id="capture_img"></div>
  </div>
</div>
<!-- ��Ƽ��� �ٵ� �� -->

<!-- ��ü���� -->
<div id='tmLayer' name='tmLayer' style='position:fixed; top:75px; left:510px; display:none; border:1px solid black; background-color:#ffffff; padding:10px; z-index:9999;'>

    <div style='margin:0 0 5px 0;'>
        <table border=0 cellpadding=0 cellspacing=1>
          <tr>
            <td><span class='filter_point'>�� ��ǥ�ð� ��ü ����</span></td>
            <td style='min-width:5px;'></td>
            <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="document.getElementById('tm0').value = document.getElementById('tmChg').value; tm_move('+0H', 0);" value=' ��ȿ�ð� ����ȭ '></td>
            <td>
            <span style='position:relative; left:210px;'>
                <a href='#' onclick='javascript:fn_btnClick("tm");'>
                <img src='/images/btn_icon_close.png' border='0' alt='�ݱ�' title='�ݱ�' style='border: 1px solid #999999;'>
                </a>
            </span>
            </td>
          </tr>
        </table>
    </div>

    <table border=0 cellpadding=0 cellspacing=0>
    <tr><td>
        <table border=0 cellpadding=0 cellspacing=0 style='table-layout:fixed;'>
            <tr align=center class='filter_point_white_b'>
              <td><input type=button class=TB08 style="background-color:#ffffff;" onfocus=blur() onclick="tm_init(1, -1);" value=' NOW '></td>

              <td style='min-width:5px;'></td> 
              <td style='padding:0 0 0 2;'><input type=text name=tmChg id=tmChg value=0 formatStr="yyyy.MM.dd.HH:mm" maxlength=16 class=TimeBox style="width:130px;" onkeypress="tm_input(-1);"></td>
              <td><a href=#  onclick="calendarPopup('tmChg', calPress);"  onfocus=blur()><img src='/images/calendar.gif' border=0></a></td>
              <td style='min-width:5px;'></td>
              <td class=TB09 onclick="tm_move('-24H', -1);" style="background-color:#d4f3ff; width:30px; font-size:7pt;">-24H</td>
              <td style='min-width:2px;'></td>
              <td class=TB09 onclick="tm_move('-12H', -1);" style="background-color:#e5f8ff; width:30px; font-size:7pt;">-12H</td>
              <td style='min-width:2px;'></td>
              <td class=TB09 onclick="tm_move('-6H', -1);" style="background-color:#f3fcff; width:30px; font-size:7pt;">-6H</td>
              <td style='min-width:2px;'></td>
              <td class=TB09 onclick="tm_move('+6H', -1);" style="background-color:#fff4f1; width:30px; font-size:7pt;">+6H</td>
              <td style='min-width:2px;'></td>
              <td class=TB09 onclick="tm_move('+12H', -1);" style="background-color:#ffebe5; width:30px; font-size:7pt;">+12H</td>
              <td style='min-width:2px;'></td>
              <td class=TB09 onclick="tm_move('+24H', -1);" style="background-color:#ffdfd5; width:30px; font-size:7pt;">+24H</td>

            </tr>
        </table>
    </td></tr>
    </table>

    <div class='filter_point' style='margin:10px 5px 5px 0;'>
        <table border=0 cellpadding=0 cellspacing=1 style='table-layout:fixed;'>
          <tr class='filter_point'>
            <td colspan=5>�� �� ��ü ����</td>
            <td style='min-width:10px;'></td>
            <td colspan=9>�� ���� ����(GIS)</td>
          </tr>
          <tr height=2></tr>
          <tr>
            <td style='min-width:50px;'><input type=button class=Zoom style="background-color:#ffffff;width:50px;" value="KIM" onClick="mdl_chg('KIM');"></td>
            <td style='min-width:1px;'></td>
            <td style='min-width:50px;'><input type=button class=Zoom style="background-color:#ffffff;width:50px;" value="UM" onClick="mdl_chg('UM');"></td>
            <td style='min-width:1px;'></td>
            <td style='min-width:50px;'><input type=button class=Zoom style="background-color:#ffffff;width:50px;" value="ECMWF" onClick="mdl_chg('ECMWF');"></td>
            <td style='min-width:1px;'0></td>
            <td style='min-width:50px;'><input type=button class=Zoom style="background-color:#ffffff;width:80px;" value="�ѹݵ�(1�ð�)" onClick="area_chg('E10');"></td>
            <td style='min-width:1px;'></td>
            <td style='min-width:50px;'><input type=button class=Zoom style="background-color:#ffffff;width:55px;" value="���ƽþ�" onClick="area_chg('EA_CHT');"></td>
            <td style='min-width:1px;'></td>
            <td style='min-width:50px;'><input type=button class=Zoom style="background-color:#ffffff;width:55px;" value="��ǳ����" onClick="area_chg('TP');"></td>
            <td style='min-width:1px;'></td>
            <td style='min-width:45px;'><input type=button class=Zoom style="background-color:#ffffff;width:45px;" value="�Ϲݱ�" onClick="area_chg('NHEM');"></td>
            <td style='min-width:1px;'></td>
            <td style='min-width:45px;'><input type=button class=Zoom style="background-color:#ffffff;width:45px;" value="������" onClick="area_chg('WORLD');"></td>
          </tr>
        </table>
    </div>

    <div style='height:5px;'></div>
    <div class='filter_small_point' style='margin:0px 5px 5px 2px;'>
        <table border=0 cellpadding=0 cellspacing=1 style='table-layout:fixed;'>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'>* Ű���� ����(����Ű)</td>
            </tr>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'>&nbsp;(1. ��ȿ�ð� �̵�)</td>
            <td style='font-size:11px;' id='hotkey'>&nbsp;&nbsp;&nbsp;�� : -3H, &nbsp;�� : +3H, &nbsp;�� : -6H, &nbsp;�� : +6H</td>
            </tr>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'>&nbsp;(2. ��ǥ�ð� ��ü ����)</td>
            <td style='font-size:11px;'>&nbsp;&nbsp;&nbsp;Page Down : -12H, &nbsp;Page Up : +12H</td>
            </tr>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'>&nbsp;(3. �� ��ü ����)</td>
            <td style='font-size:11px;'>&nbsp;&nbsp;&nbsp;K : KIM, &nbsp;U : UM, &nbsp;E : ECMWF</td>
            </tr>
        </table>
    </div>
</div>

<!-- �ΰ����  -->
<div id='extraLayer' name='extraLayer' style='position:fixed; top:75px; left:710px; display:none; border:1px solid black; background-color:#ffffff; padding:10px; z-index:9999;'>

    <div class='filter_point' style='margin:0 0 5px 0;'>
        �� �ΰ���� ����
        <span style='position:relative; top:5px; left:250px;'>
            <a href='#' onclick='javascript:fn_btnClick("extra");'>
            <img src='/images/btn_icon_close.png' border='0' alt='�ݱ�' title='�ݱ�' style='border: 1px solid #999999;'>
            </a>
        </span>
    </div>

    <div style='height:5px; min-width:378px;'></div>
    <table border=0 cellpadding=0 cellspacing=0>
    <tr><td>
        <table border=0 cellpadding=0 cellspacing=1 bordercolor=#9d9c9c bordercolordark=#ffffff style='table-layout:fixed;'>
            <tr align=center class='filter_point_white_b'>
            <td><input type=button class=Zoom style="background-color:#aaffaa;width:85px;" id=zoom_input value=' ��� ���� '     onClick="ext_sel('zoom');"></td>
            <td style='min-width:1px;'></td>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=skew_input value=' �ܿ����� off '  onClick="ext_sel('skew');"></td>
            <td style='min-width:1px;'></td>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=mto_input  value=' �����ð迭 off ' onClick="ext_sel('mto');"></td>
            <td style='min-width:1px;'></td>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=mdl_input  value=' �ڷ���ø� off ' onClick="ext_sel('mdl');"></td>
            </tr>

            <tr align=center class='filter_point_white_b'>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=crss_input value=' �����ܸ鵵 off ' onClick="ext_sel('crss_sct');"></td>
            <td style='min-width:1px;'></td>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=hlt_input  value=' ���̶���Ʈ off '  onClick="ext_sel('hlt');"></td>
            <td style='min-width:1px;'></td>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=lmto_input  value=' �����ٶ��� off '  onClick="ext_sel('lmto');"></td>
            <td style='min-width:1px;'></td>
            <td><input type=button class=Zoom style="background-color:#ffffff;width:85px;" id=ruler_input value=' �Ÿ���� off '  onClick="ext_sel('ruler');"></td>
            </tr>
        </table>
    </td></tr>
    </table>
    <div style='height:5px;'></div>
    <div class='filter_small_point' style='margin:0px 5px 5px 2px;'>
        <table border=0 cellpadding=0 cellspacing=1 bordercolor=#9d9c9c bordercolordark=#ffffff style='table-layout:fixed;'>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'>* Ű���� ���� - </td>
            <td style='font-size:11px;'>1 : ��� ����, 2 : �ܿ�����, 3 : �����ð迭, 4 : �ڷ���ø�</td>
            </tr>
            <tr class='filter_small_point'>
            <td></td>
            <td style='font-size:11px;'>5 : �����ܸ鵵, 6 : ���̶���Ʈ, 7 : �����ٶ���(UM����)</td>
            </tr>
            <tr class='filter_small_point'>
            <td></td>
            <td style='font-size:11px;'>8 : �Ÿ����, L : �ε�, ctrl + L : �ڵ��ε� on/off</td>
            </tr>
        </table>
    </div>
    <div style='height:5px;'></div>
    <div class='filter_small_point' style='margin:0px 5px 5px 2px;'>
        <table border=0 cellpadding=0 cellspacing=1 bordercolor=#9d9c9c bordercolordark=#ffffff style='table-layout:fixed;'>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'><input type=checkbox id=save onclick="save_sel();" value='1' checked='checked'>&nbsp;�ӽ� �̹��� ���� ��� (�̹��� ������ �߸� ������ ��� üũ����)</td>
            </tr>
            <tr class='filter_small_point'>
            <td style='font-size:11px;'><input type=checkbox id=next checked>&nbsp;ù��° �̹����� �´� �ð� �̵� (Ű���� ���� �� ��)</td>
            </tr>
        </table>
    </div>
</div>

<!-- Ȯ�� ���� ���� ���̾�  -->
<div id='ctrlLayer' style='position:fixed; top:75px; left:750px; display:block; border:1px solid black; background-color:#ffffff; padding:10px; z-index:9999; display:none;'>
  <div class='filter_point' style='margin:0 0 5px 0; display:flex;'>
    �� Ȯ�� ���� ����
    <div style='width:20px;'></div>
    <div style='position:relative; top:-1px; display:flex;'>
      <input type=button onclick='fnZoomReset()' class='Zoom' style="background-color:#ffffff;width:50px;" value=" �ʱ�ȭ ">
      <div style='width:2px;'></div>
      <input type=button onclick='fn_CtrlSubmit()' class='Zoom' style="background-color:#aaffaa;width:40px;" value=" ���� ">
      <div style='width:2px;'></div>
      <input type=button onclick="fn_btnClick('ctrl')" class='Zoom' style="background-color:#ffffff;width:40px;" value=" �ݱ� ">
    </div>
  </div>

  <div style='height:5px; min-width:374px;'></div>
  <div style='display:flex;'>�ܷ����� �߽� ���浵�� �Է��Ͽ� ��ġ�� �������ּ���.</div>
  <div style='height:10px;'></div>
  <div style='display:flex;'>
    - �ܷ���:
    <div style='width:8px;'></div>
    <div onclick='fnZoomCtrl(-1);' style='cursor:pointer;'><i class="fas fa-minus"></i></div>
    <div style='width:4px;'></div>
    <div style='position:relative; top:-1px;'><input type=text class=TextBox style='height:19px; width:25px; text-align:center;' id=map_zoom value='0' readonly=readonly></div>
    <div style='width:4px;'></div>
    <div onclick='fnZoomCtrl(1);' style='cursor:pointer;'><i class="fas fa-plus"></i></div>

    <div style='width:10px;'></div>
    /<div style='width:8px;'></div>�߽�����:
    <div style='width:8px;'></div>
    <div style='position:relative; top:-1px;'><input type=text class='TextBox prevent-keydown' style='height:19px; width:50px;' id=center_lat value='0.00' title='����'></div>
    <div style='width:10px;'></div>
    /<div style='width:8px;'></div>�߽ɰ浵:
    <div style='width:8px;'></div>
    <div style='position:relative; top:-1px;'><input type=text class='TextBox prevent-keydown' style='height:19px; width:50px;' id=center_lon value='0.00' title='�浵'></div>
  </div>
  <div style='height:6px;'></div>
  <div style='display:flex;'>
    - AWS ���� ���� �߽���ġ ����
  </div>
  <div style='height:4px;'></div>
  <div style='display:flex;'>
    <div style='width:4px;'></div>
    <div id=zoom_stn1 class='select-style'></div>
    <div style='width:4px;'></div>
    <div id=zoom_stn2 class='select-style'></div>
    <div style='width:4px;'></div>
    <div onclick="fnStnLatLon();"><button style='height:20px; width:30px;'>����</button></div>
  </div>

  <div style='height:20px;'></div>
  <div class='filter_point' style='margin:0 0 5px 0; display:flex;'>
    �� GIS �� �̹��� ����
    <div style='width:10px;'></div>
    <div style='position:relative; top:-1px; display:flex;'>
      <input type=button onclick='api_chg("API");' class='Zoom' style="background-color:#ffffff;width:75px;" value=" �̹�����GIS ">
      <div style='width:4px;'></div>
      <input type=button onclick='api_chg("IMG");' class='Zoom' style="background-color:#ffffff;width:75px;" value=" GIS���̹��� ">
    </div>
  </div>
</div>

<!-- �ε� �� -->
<div id=loading style='position:absolute; top:0px; left:0px; z-index:1000; width:100%; height:100%; background-color:#eeeeee; opacity:0.5; text-align:center; vertical-align:middle; display:none;'>
  <div class=_ku_LoadingBar></div>
</div>

<div id=loadingStatus style='position:absolute; top:65%; left:25%; width:50%; text-align:center; vertical-align:middle; display:none; opacity:1.0; z-index:1100;'>
  <div id=loadingnum style='position:relative; left:50px; font-size:10pt;' class=filter_point></div>
  <div id=loadingbar style='position:relative; left:50px; background-color:lightblue; height:25px; width:0%; border:1px solid black;'></div>
  <div id=loadingText style='position:relative; left:50px; font-size:10pt;' class=filter_point>�ڵ��ε� ����� OFF �Ͻ÷��� Ctrl+L Ȥ�� ���� ��� �޴��� �ڵ��ε� üũ�ڽ��� �������ּ���.</div>
</div>

<!-- �������� -->
<div id='notice' style='position:absolute; top:300px; left:400px; width:500px; border:1px solid black; background-color:#ffffff; padding:10px; z-index:99; display:none;'>

    <div class='filter_point' style='margin:0 0 5px 0; display:flex;'>
        �� ��������
        <div style='margin-left:auto;'>
          <button class=TB08 style='height:20px; width:70px; font-weight:normal;' onclick="document.getElementById('notice').style.display='none';">�ݱ�(ESC)</button>
        </div>
        <div style='min-width:2px;'></div>
    </div>

    <div style='height:5;'></div>
    <div class='filter_point' style='margin:0px 5px 5px 2px; font-weight:normal;'>
        �ش� �������� � ���� �����Դϴ�. (���� ������: 2021.12.31.)<br>
        '�ϱ⵵ �м� > ��ü���� > �������� > �ѹݵ�(1�ð�)'�� �����Ͽ� Ȱ�����ֽñ� �ٶ��ϴ�.<br>
        �� KIM, UM �𵨵� �Բ� ����
    </div>
</div>

</BODY>
</HTML>