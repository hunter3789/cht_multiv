<?

$mode = $_REQUEST["mode"];

if(empty($mode) && $mode != "0") {
  printf("###error");
  return;
}

$tm_ef = $_REQUEST["tm_ef"];
$tm_fc = $_REQUEST["tm_fc"];
$img_name = $_REQUEST["img_name"];
$dir1 = $_REQUEST["dir1"];
$type = $_REQUEST["type"];
$save = $_REQUEST["save"];
$zoom_x = $_REQUEST["zoom_x"];
$zoom_y = $_REQUEST["zoom_y"];
$zoom_level = $_REQUEST["zoom_level"];
$mdl = $_REQUEST["mdl"];
$area = $_REQUEST["area"]; 
$host = $_REQUEST["host"]; 
$load = $_REQUEST["load"]; 

if ($area == "") $area = "EA_CHT";

Header("Content-Type: text/plain");

// 시간 정보 조회(최신 수치모델 발표 시각)
if ($mode == "0") {

  $itv = 12;
  $nt = time();
  $nt = intval($nt / ($itv * 60 * 60)) * $itv * 60 * 60;

  for ($k = 0; $k < 4; $k++) {
    if (nwp_file($nt, $nt, "GDAPS_KIM")) break;
    else $nt -= 12*60*60;
  }

  echo date("YmdHi",$nt);

}
// 일기도 이미지 파일명 조회
else if ($mode == "1") {

  $fn1 = substr($img_name, 1, strlen($img_name) - 1);
  $chk = 0;

  $nt_ef = mktime(substr($tm_ef,8,2),0,0,substr($tm_ef,4,2),substr($tm_ef,6,2),substr($tm_ef,0,4)) - 9*60*60;
  $nt_fc = mktime(substr($tm_fc,8,2),0,0,substr($tm_fc,4,2),substr($tm_fc,6,2),substr($tm_fc,0,4)) - 9*60*60;

  if ($img_name != "") {
    if ($type == "fct0") {
      $dir2 = $dir1.date("Ym", $nt_ef)."/".date("d", $nt_ef);
      $src = $dir2."/".$fn1.date("YmdH",$nt_ef).".gif";
      if(file_exists($src) == false) $src = $dir2."/".$fn1.date("YmdH",$nt_ef).".png";
      if(file_exists($src) == false) {
        $src = "@no nwp data";
      }
    }
    else if (!strstr($type, "afs") && !strstr($type, "ana")) {
      if ($nt_ef < $nt_fc) {
        $src = "@no nwp data";
      }
      else {
        if ($area == "E10") {
          if (strstr($img_name, "rmir") || strstr($img_name, "rmwv")) {
            if ($nt_ef - $nt_fc > 12*60*60) $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
          }
          else $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
        }

        $dir2 = $dir1.date("Ym", $nt_fc)."/".date("d", $nt_fc);
        $src = $dir2."/".$fn1."s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".gif";
        if(file_exists($src) == false) $src = $dir2."/".$fn1."s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc).".png";
        if(file_exists($src) == false) {
          if(file_exists($dir2) != false) {
            if($dp = opendir($dir2)) {
              while($fn2 = readdir($dp)) {
                if(strstr($fn2, $fn1)){
                  $p = explode("_", $fn2);
                  $n = count($p);

                  $src = $dir2."/";
                  for ($j=0; $j<=$n-3; $j++) {
                    if ($j == $n-3) {
                      $src .= $p[$j];
                    }
                    else {
                      $src .= $p[$j]."_";
                    }
                  }
                  if(!strcmp(substr($p[$n - 2], 0, 1), "s")){
                    $src .= "_s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60))); 
                  }
                  else if(!strcmp(substr($p[$n - 2], 0, 1), "h")){
                    $src .= "_h".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60))); 
                  }
                  else {
                    $src .= "_".$p[$n - 2]; 
                  }
                  $src .= "_".date("YmdH",$nt_fc).substr($fn2, strlen($fn2)-4, strlen($fn2));
                  $chk = 1;
                  break;
                }
              }
              //폴더는 존재하고, 파일 없을 시 오류 수정
              if ($chk == 0) {
                $src = "@no nwp data";                
              }
            }
          }
          else {
            $src = "@no nwp data";
          }
        }
      }
    }
    else {
      // 구름모의 영상
      if (strstr($img_name, "radm")) $opt = "radm";
      else $opt = $type;

      if ($nt_ef < $nt_fc || strstr($type, "ana")) {
        $nt_fc = intval(($nt_ef + 9*60*60) / (12*60*60)) * (12*60*60) - 9*60*60;
        $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);

        if ($nwp_chk != 1 && $load != 1) {
          if ($area == "E10") {
            if ($opt == "afsx" || $opt == "afs2x") {
              $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
            }
          }
          $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);
        }

        if (($area != "E10" && ($opt == "afsk" || $opt == "afs2k")) || (strstr($type, "ana") && $nt_ef+9*60*60 > time())) {
          $nwp_chk = 0;
        }

        if ($nwp_chk != 1 || $nt_ef < $nt_fc) {
          $src = "@no nwp data";
        }
        else {
          $img_dir1 = "/fct/www/ROOT/img/cht/";
          $img_dir2 = "/img/cht/";

          if (strstr($img_name, "surfce")) {
            if ($mdl == "GDAPS") $img_name = "gdps_lc40_wtem2_wsfc_";
            else if ($mdl == "ECMWF_H") $img_name = "ecmw_lc20_wtem2_wsfc_";
            else if ($mdl == "GDAPS_KIM") $img_name = "kim_gdps_lc40_wtem2_wsfc_";
          }

          $fname = $img_name.date("YmdH",$nt_ef)."_area=".$area."_zoomx=".$zoom_x."_zoomy=".$zoom_y."_gis=1.png";
          if (file_exists($img_dir1.$fname)) $flag = 1;

          if ($flag == 1 && $save == 1) {
            $src = $img_dir2.$fname;
          }
          else {
            $src  = "/cgi-bin/url/nph-map_ana_img?cht_name=".$img_name."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdH",$nt_ef)."&flag=0&curl=1&save=1";
            $src .= "&zoom_x=".$zoom_x."&zoom_y=".$zoom_y."&map=".$area."&gis=1";

            if (strstr($type, "ana")) {
              if (strstr($img_name, "wtem2")) {
                if (strstr($img_name, "wsfc")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=SFC";
                else if (strstr($img_name, "wt00")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=1000";
                else if (strstr($img_name, "wt92")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=925";
                else if (strstr($img_name, "wt85")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=850";
                else if (strstr($img_name, "wt70")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=700";
                else if (strstr($img_name, "wt50")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=500";
                else if (strstr($img_name, "wt30")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=300";
                else if (strstr($img_name, "wt20")) $src .= "&layer=AG&cht_mode=ana2&obs=jun&gts=200";
              }
              else if (strstr($img_name, "lgt")) {
                $src .= "&layer=RL&cht_mode=ana0&border=1";
              }
              else if (strstr($img_name, "rdr")) {
                $src .= "&layer=R&cht_mode=ana0";
              }
              else if (strstr($img_name, "sat")) {
                $sat = explode("_", $img_name);
                $src .= "&layer=S&cht_mode=ana0&sat=";
                for ($j=1; $j<count($sat)-1; $j++) {
                  if ($j != 1) $src .= "_";
                  $src .= $sat[$j];
                }
              }
            }
            else {
              if ($area == "NHEM" || $area == "WORLD") {
                if (strstr($img_name, "wtem2")) $src .= "&layer=AR&cht_mode=ana2";
                else $src .= "&layer=A&cht_mode=ana";
              }
              else if ($area == "E10" && ($opt == "afsx" || $opt == "afs2x")) {
                $src .= "&layer=A&cht_mode=ana3";
              }
              else {
                if (strstr($img_name, "wtem2")) $src .= "&layer=AR&cht_mode=ana2";
                else $src .= "&layer=A&cht_mode=ana";
              }
            }
          }
        }
      }
      else {
        $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);

        if ($nwp_chk != 1 && $load != 1) {
          if ($area == "E10") {
            if ($opt == "afsx" || $opt == "afs2x") {
              $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
            }
            else if ($mdl == "ECMWF_H") {
              if ($nt_ef - $nt_fc >= 144*60*60) {
                $nt_ef -= ($nt_ef-$nt_fc)%(6*60*60);
              }
              else if ($nt_ef - $nt_fc >= 90*60*60) {
                $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
              }
            }
            else if ($opt == "radm") {
              if ($nt_ef - $nt_fc > 12*60*60) $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
            }
          }
          else $nt_ef -= 3*60*60;
          $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);
        }

        if ($area != "E10" && ($opt == "afsk" || $opt == "afs2k")) {
          $nwp_chk = 0;
        }

        if ($nwp_chk != 1) {
          $src = "@no nwp data";
        }
        else {
          $img_dir1 = "/fct/www/ROOT/img/cht/";
          $img_dir2 = "/img/cht/";
          $fname = $img_name."s".sprintf("%03d",intval(($nt_ef-$nt_fc)/(60*60)))."_".date("YmdH",$nt_fc)."_area=".$area."_zoomx=".$zoom_x."_zoomy=".$zoom_y."_gis=1.png";
          if (file_exists($img_dir1.$fname)) $flag = 1;

          if ($flag == 1 && $save == 1) {
            $src = $img_dir2.$fname;
          }
          else {
            $src  = "/cgi-bin/url/nph-map_ana_img?cht_name=".$img_name."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdH",$nt_ef)."&flag=0&curl=1&save=1";
            $src .= "&zoom_x=".$zoom_x."&zoom_y=".$zoom_y."&map=".$area."&gis=1";
            if ($area == "NHEM" || $area == "WORLD") $src .= "&layer=A";
            else $src .= "&layer=A";

            if ($area == "E10" && ($opt == "afsx" || $opt == "afs2x")) {
              $src .= "&cht_mode=fct2";
            }
          }
        }
      }
    }
  }

  echo $src;
}
// 범례 이미지 파일명 조회
else if ($mode == "2") {

  $fn1 = substr($img_name, 1, strlen($img_name) - 1);
  $chk = 0;

  $nt_ef = mktime(substr($tm_ef,8,2),0,0,substr($tm_ef,4,2),substr($tm_ef,6,2),substr($tm_ef,0,4)) - 9*60*60;
  $nt_fc = mktime(substr($tm_fc,8,2),0,0,substr($tm_fc,4,2),substr($tm_fc,6,2),substr($tm_fc,0,4)) - 9*60*60;

  if ($img_name != "") {
    // 구름모의 영상
    if (strstr($img_name, "radm")) $opt = "radm";
    else $opt = $type;

    if ($nt_ef < $nt_fc) {
      $nt_fc = intval(($nt_ef + 9*60*60) / (12*60*60)) * (12*60*60) - 9*60*60;
      $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);

      if ($nwp_chk != 1 && $load != 1) {
        if ($area == "E10") {
          if ($opt == "afsx" || $opt == "afs2x") {
            $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
          }
        }
        $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);
      }

      if ($nwp_chk != 1 || $nt_ef < $nt_fc || $opt == "radm") {
        $src = "@no nwp data";
      }
      else {
        $img_dir1 = "/fct/www/ROOT/img/legend/";
        $img_dir2 = "/img/legend/";

        if (strstr($img_name, "surfce")) {
          if ($mdl == "GDAPS") $img_name = "gdps_lc40_wtem2_wsfc_";
          else if ($mdl == "ECMWF_H") $img_name = "ecmw_lc20_wtem2_wsfc_";
          else if ($mdl == "GDAPS_KIM") $img_name = "kim_gdps_lc40_wtem2_wsfc_";
        }

        if ($area == "E10") {
          $fname = $img_name."m".date("m",$nt_fc)."_".$area.".png";
        }
        else {
          $fname = $img_name."m".date("m",$nt_fc).".png";
        }

        if (file_exists($img_dir1.$fname)) $flag = 1;

        if ($flag == 1 && $save == 1) {
          $src = $img_dir2.$fname;
        }
        else {
          $src  = "/cgi-bin/url/nph-map_ana_img?cht_name=".$img_name."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdH",$nt_ef)."&flag=0&curl=1&save=1";
          $src .= "&zoom_x=".$zoom_x."&zoom_y=".$zoom_y."&map=".$area."&gis=1&legend_only=1";

          if ($area == "NHEM" || $area == "WORLD") {
            if (strstr($img_name, "wtem2")) $src .= "&layer=AR&cht_mode=ana2";
            else $src .= "&layer=A&cht_mode=ana";
          }
          else if ($area == "E10" && ($opt == "afsx" || $opt == "afs2x")) {
            $src .= "&layer=A&cht_mode=ana3";
          }
          else {
            if (strstr($img_name, "wtem2")) $src .= "&layer=AR&cht_mode=ana2";
            else $src .= "&layer=A&cht_mode=ana";
          }
        }
      }
    }
    else {
      $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);

      if ($nwp_chk != 1 && $load != 1) {
        if ($area == "E10") {
          if ($opt == "afsx" || $opt == "afs2x") {
            $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
          }
          else if ($mdl == "ECMWF_H") {
            if ($nt_ef - $nt_fc >= 144*60*60) {
              $nt_ef -= ($nt_ef-$nt_fc)%(6*60*60);
            }
            else if ($nt_ef - $nt_fc >= 90*60*60) {
              $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
            }
          }
          else if ($opt == "radm") {
            if ($nt_ef - $nt_fc > 12*60*60) $nt_ef -= ($nt_ef-$nt_fc)%(3*60*60);
          }
        }
        else $nt_ef -= 3*60*60;
        $nwp_chk = nwp_file($nt_fc+9*60*60, $nt_ef+9*60*60, $mdl, $opt, $area);
      }

      if ($nwp_chk != 1 || $opt == "radm") {
        $src = "@no nwp data";
      }
      else {
        $img_dir1 = "/fct/www/ROOT/img/legend/";
        $img_dir2 = "/img/legend/";

        if ($area == "E10") {
          $fname = $img_name."m".date("m",$nt_fc)."_".$area.".png";
        }
        else {
          $fname = $img_name."m".date("m",$nt_fc).".png";
        }

        if (file_exists($img_dir1.$fname)) $flag = 1;

        if ($flag == 1 && $save == 1) {
          $src = $img_dir2.$fname;
        }
        else {
          $src  = "/cgi-bin/url/nph-map_ana_img?cht_name=".$img_name."&tm_fc=".date("YmdH",$nt_fc)."&tm=".date("YmdH",$nt_ef)."&flag=0&curl=1&save=1";
          $src .= "&zoom_x=".$zoom_x."&zoom_y=".$zoom_y."&map=".$area."&gis=1&legend_only=1";
          if ($area == "NHEM" || $area == "WORLD") $src .= "&layer=A";
          else $src .= "&layer=A";

          if ($area == "E10" && ($opt == "afsx" || $opt == "afs2x")) {
            $src .= "&cht_mode=fct2";
          }
        }
      }
    }
  }

  echo $src;
}


//=====================
// 수치모델 자료 존재여부 체크 //2019.12.05. 이창재
//=====================
function nwp_file($tm, $tm_ef, $model, $opt, $area)
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

  if ($opt != "radm") {
    if ($area == "E10" && ($opt != "afsx" && $opt != "afs2x")) {
      if ($opt == "afsxx" || $opt == "afs2xx") {
        return 0;
      }

      if ($model == "GDAPS") $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_hkor_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
      else if ($model == "ISEN-UMGL") $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/gdps_isen_".$YY.$MM.$DD.$HH."_".$ft.".grib2";
      else if ($model == "ECMWF" || $model == "ECMWF_H" || $model == "ECMWF_1H10G1") $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
      else if ($model == "KIM"   || $model == "GDAPS_KIM") {
        if ($opt == "afs2") $fname = "/ARCV/GRIB/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/kim_g128_hkor_unis_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else $fname = "/ARCV/GRIB/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/kim_g128_hkor_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
      }
    }
    else if ($opt == "afs2" || $opt == "afs2x" || $opt == "afs2xx" || $opt == "afs2k" || $opt == "ana2") { //단일면
      if ($model == "GDAPS") {
        if ($nt >= $nt1)      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_v070_ergl_unis_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else if ($nt >= $nt2) $fname = "/ARCV/GRIB/MODL/GDPS/N768/".$YY.$MM."/".$DD."/g768_v070_ergl_unis_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else if ($nt >= $nt3) $fname = "/ARCV/GRIB/MODL/GDPS/N512/".$YY.$MM."/".$DD."/g512_v070_ergl_unis_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else                  $fname = "/ARCV/GRIB/MODL/GDPS/N320/".$YY.$MM."/".$DD."/g320_v050_ergl_unis_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
      }
      else if ($model == "ISEN-UMGL")                      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/gdps_isen_".$YY.$MM.$DD.$HH."_".$ft.".grib2";
      else if ($model == "ECMWF" || $model == "ECMWF_H")   $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e025_v025_nhem_h".$ft.".".$tm.".gb1";
      else if ($model == "KIM"   || $model == "GDAPS_KIM") $fname = "/ARCV/RAWD/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/".$HH."/ERLY/FCST/post/sfc.ft".$ft.".nc";
      else if ($model == "ECMWF_1H10G1")                   $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
    }
    else {
      if ($model == "GDAPS") {
        if ($nt >= $nt1)      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/g128_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else if ($nt >= $nt2) $fname = "/ARCV/GRIB/MODL/GDPS/N768/".$YY.$MM."/".$DD."/g768_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else if ($nt >= $nt3) $fname = "/ARCV/GRIB/MODL/GDPS/N512/".$YY.$MM."/".$DD."/g512_v070_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
        else                  $fname = "/ARCV/GRIB/MODL/GDPS/N320/".$YY.$MM."/".$DD."/g320_v050_ergl_pres_h".$ft.".".$YY.$MM.$DD.$HH.".gb2";
      }
      else if ($model == "ISEN-UMGL")                      $fname = "/ARCV/GRIB/MODL/GDPS/N128/".$YY.$MM."/".$DD."/gdps_isen_".$YY.$MM.$DD.$HH."_".$ft.".grib2";
      else if ($model == "ECMWF" || $model == "ECMWF_H")   $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e025_v025_nhem_h".$ft.".".$tm.".gb1";
      else if ($model == "KIM"   || $model == "GDAPS_KIM") $fname = "/ARCV/RAWD/MODL/GDPS/NE36/".$YY.$MM."/".$DD."/".$HH."/ERLY/FCST/post/prs.ft".$ft.".nc";
      else if ($model == "ECMWF_1H10G1")                   $fname = "/ARCV/GRIB/MODL/ECMW/T127/".$YY.$MM."/".$DD.$HH."/e010_v025_hfp_asia_h".$ft.".".$tm.".gb1";
    }
  }
  else {
    if ($model == "GDAPS")                             $fname = "/C4N2_DATA/NWP/APPM/".$YY.$MM."/".$DD."/RDTB_gdps_gkompsat2_".$YY.$MM.$DD.$HH."_f".$ft.".dat";
    else if ($model == "KIM" || $model == "GDAPS_KIM") $fname = "/C4N2_DATA/NWP/APPM/".$YY.$MM."/".$DD."/RDTB_kimgdps_gkompsat2_".$YY.$MM.$DD.$HH."_f".$ft.".dat";
  }

  if (file_exists($fname) || $opt == "ana0") {
    return 1;
  }
  else {
    return 0;
  }
}
?>