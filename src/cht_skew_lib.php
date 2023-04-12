<?

$mode = $_REQUEST["mode"];

if(empty($mode) && $mode != "0") {
  printf("###error");
  return;
}

$tm_ef = $_REQUEST["tm_ef"];
$tm_fc = $_REQUEST["tm_fc"];
$save = $_REQUEST["save"];
$mdl = $_REQUEST["mdl"];
$lat = $_REQUEST["lat"];
$lon = $_REQUEST["lon"];
$lat2 = $_REQUEST["lat2"];
$lon2 = $_REQUEST["lon2"];
$stn_id = $_REQUEST["stn_id"];
$sat = $_REQUEST["sat"];
$cht_mode = $_REQUEST["cht_mode"];
$varname = $_REQUEST["varname"];
$map   = $_REQUEST["map"];
$zoom_x = $_REQUEST["zoom_x"];
$zoom_y = $_REQUEST["zoom_y"];
$min_level = $_REQUEST["min_level"];  if ($min_level == "") $min_level = "250";
$max_level = $_REQUEST["max_level"];  if ($max_level == "") $max_level = "1000";
$rain = $_REQUEST["rain"];            if ($rain == "") $rain = "0";

Header("Content-Type: text/plain");

if ($mdl == "ISEN-UMGL") $mdl = "GDAPS";

// 시간 정보 조회(최신 수치모델 발표 시각)
if ($mode == "0") {

  $itv = 12;
  $nt = time();
  $nt = intval($nt / ($itv * 60 * 60)) * $itv * 60 * 60;

  for ($k = 0; $k < 4; $k++) {
    if ($mdl == "ECMWF_1H10G1") {
      if (nwp_file($nt, $nt, "ECMWF_1H10G1")) break;
      else $nt -= 12*60*60;
    }
    else {
      if (nwp_file($nt, $nt, "GDAPS")) break;
      else $nt -= 12*60*60;
    }
  }

  echo date("YmdHi",$nt);

}
// 일기도 이미지 파일명 조회
else if ($mode == "1") {

  $fn1 = substr($img_name, 1, strlen($img_name) - 1);
  $chk = 0;

  $nt_ef = mktime(substr($tm_ef,8,2),0,0,substr($tm_ef,4,2),substr($tm_ef,6,2),substr($tm_ef,0,4)) - 9*60*60;
  $nt_fc = mktime(substr($tm_fc,8,2),0,0,substr($tm_fc,4,2),substr($tm_fc,6,2),substr($tm_fc,0,4)) - 9*60*60;

  if ($sat == 1) {
    if (($nt_ef + 9*60*60) > (time() - 30*60)) {
      $src = "@no nwp data";
      echo $src;
      return;
    }
  }

  if ($cht_mode == "crss_sct" && $nt_ef < $nt_fc) {
    $nt_fc = intval(($nt_ef + 9*60*60) / (12*60*60)) * (12*60*60) - 9*60*60;
  }

  $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl);

  if ($nwp_chk != 1) {
    $src = "@no nwp data";
  }
  else {
    $img_dir1 = "/fct/www/ROOT/img/skew/";
    $img_dir2 = "/img/skew/";

    if ($cht_mode == "skew") {
      if ($sat == 1) {
        if ($stn_id != 0) $fname = "skew_".$mdl."_sat_stn=".$stn_id."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
        else $fname = "skew_".$mdl."_sat_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
      }
      else {
        if ($stn_id != 0) $fname = "skew_".$mdl."_stn=".$stn_id."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
        else $fname = "skew_".$mdl."_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
      }
    }
    else if ($cht_mode == "mto") {
      if ($stn_id != 0) $fname = "mto_".$mdl."_stn=".$stn_id."_".date("YmdH",$nt_fc).".png";
      else $fname = "mto_".$mdl."_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_".date("YmdH",$nt_fc).".png";
    }
    else if ($cht_mode == "lmto") {
      if ($stn_id != 0) $fname = "lmto_stn=".$stn_id."_".date("YmdH",$nt_fc).".png";
      else $fname = "lmto_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_".date("YmdH",$nt_fc).".png";
    }
    else if ($cht_mode == "crss_sct") {
      $fname = "crss_sct_".$mdl."_lon=".sprintf("%.2f",$lon)."_lat=".sprintf("%.2f",$lat)."_lon2=".sprintf("%.2f",$lon2)."_lat2=".sprintf("%.2f",$lat2);
      $fname .= "_varname=".$varname."_min=".$min_level."_max=".$max_level."_rain=".$rain."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
      //if ($varname != "") $fname .= "_varname=".$varname."_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
      //else $fname .= "_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
    }
    if (file_exists($img_dir1.$fname)) $flag = 1;

    if ($flag == 1 && $save == 1) {
      $src = $img_dir2.$fname;
    }
    else {
      if ($cht_mode == "crss_sct") {
        $src = "/cgi-bin/url/nph-crss_sct_img?model=".$mdl."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdH",$nt_ef)."&lat=".sprintf("%.2f",$lat)."&lon=".sprintf("%.2f",$lon);
        $src .= "&lat2=".sprintf("%.2f",$lat2)."&lon2=".sprintf("%.2f",$lon2)."&varname=".$varname."&min=".$min_level."&max=".$max_level."&rain=".$rain;
      }
      else {
        $src = "/cgi-bin/url/nph-skew_img?model=".$mdl."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdH",$nt_ef)."&mode=2&cht_mode=".$cht_mode;
        if ($stn_id != 0) $src .= "&stn_id=".$stn_id;
        else $src .= "&lat=".sprintf("%.2f",$lat)."&lon=".sprintf("%.2f",$lon);
        if ($sat == 1 && $cht_mode == "skew") $src .= "&sat=".$sat;
      }
    }
  }

  echo $src;
}
// 지점 정보 조회
else if ($mode == "2") {
  // DB 연결
  $mode_login = 2;  // AFS
  $login_php = "../../include/tb_login.php";
  require( $login_php );
  $dbconn = TB_Login($mode_login);

  $tm = date("YmdHi",time());
  $sz = "
    select lat, lon
    from comis.stn_aws
    where tm_st <= to_date(?,'yyyymmddhh24mi')
    and tm_ed > to_date(?,'yyyymmddhh24mi')
    and stn_id = :stn_id";
  $stmt = odbc_prepare($dbconn, $sz);
  $exec = odbc_execute($stmt, array($tm,$tm,$stn_id));
  while($rs = odbc_fetch_array($stmt)) {
    echo $rs[LAT].",".$rs[LON]."\n";
  }

  odbc_close($dbconn);
}



//=====================
// 수치모델 자료 존재여부 체크 //2019.12.05. 이창재
//=====================
function nwp_file($tm, $tm_ef, $model, $opt)
{
  $nt = $tm;  
  $nt1 = mktime(0,0,0,6,7,2018) + 9*60*60;
  $nt2 = mktime(0,0,0,7,1,2016) + 9*60*60;
  $nt3 = mktime(0,0,0,6,1,2011) + 9*60*60;
  $ft = sprintf("%03d", intval(($tm_ef - $tm)/(60*60)));

  $tm = date("YmdHi",$tm-9*60*60);

  $YY          = substr($tm, 0, 4);
  $MM          = substr($tm, 4, 2);
  $DD          = substr($tm, 6, 2);
  $HH          = substr($tm, 8, 2);
  $MI          = substr($tm, 10, 2);

  if ($model == "GDAPS" || $model == "UM" || $model == "ISEN-UMGL") {
    if ($nt >= $nt1) $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
    else if ($nt >= $nt2) $fname = "/ARCV/GRIB/MODL/GDPS/N768/".$YY.$MM."/".$DD."/g768_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
    else if ($nt >= $nt3) $fname = "/ARCV/GRIB/MODL/GDPS/N512/".$YY.$MM."/".$DD."/g512_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
    else $fname = "/ARCV/GRIB/MODL/GDPS/N320/".$YY.$MM."/".$DD."/g320_v050_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
  }
  else if ($model == "ECMWF" || $model == "ECMWF_H")   $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e025_v025_nhem_h".$ft.".".$tm.".gb1";
  else if ($model == "KIM"   || $model == "GDAPS_KIM") $fname = "/ARCV/RAWD/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/".$HH."/ERLY/FCST/post/prs.ft".$ft.".nc";
  else if ($model == "ECMWF_1H10G1")                   $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
  else if ($model == "GDAPS_1H")                       $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_hkor_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
  else if ($model == "KIM_1H")                         $fname = "/ARCV/GRIB/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/kim_g128_hkor_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";

  if (file_exists($fname)) {
    return 1;
  }
  else {
    return 0;
  }
}
?>