<?
// 입력값 확인
$cht_mode = $_REQUEST["cht_mode"]; if ($cht_mode == "") $cht_mode = "multiv";
if ($cht_mode == "multiv") {
  $cht_id = "multiv";
  $url = "/cht_new/cht_multiv_gis.php";
  $title = "일기도 분석";
}
else if ($cht_mode == "swc") {
  $cht_id = "swc";
  $url = "/cht_new/cht_swc_gis.php";
  $title = "유사사례 비교(시범)";
}
else if ($cht_mode == "gts") {
  $cht_id = "gts";
  $url = "/gts/gts_plot_gis.php";
  $title = "GTS 자료조회 PLUS";
}
else if ($cht_mode == "skew") {
  $cht_id = "skew";
  $url = "/fgd/nwp_new/nwp_stn.php?mode=skew";
  $title = "단열선도(1시간)";
}
else if ($cht_mode == "mme") {
  $cht_id = "mme";
  $url = "http://naru.kma.go.kr:20080/~rnd005/multi_index3.php";
  $title = "다중모델앙상블(MME)";
}
else if ($cht_mode == "nwp_stn") {
  $cht_id = "nwp_stn";
  $url = "/fgd/nwp_new/nwp_stn.php";
  $title = "수치모델 지점값 비교검증";
}
else if ($cht_mode == "gis") {
  $cht_id = "gis";
  $url = "/cht_new/cht_multiv_gis.php";
  $title = "일기도 분석";
}
else if ($cht_mode == "type") {
  $cht_id = "type";
  $url = "http://172.29.121.203:20080/~eps/STRK/typh22.html";
  $title = "앙상블 태풍 경로";
}
?>
<!DOCTYPE html>
<html lang="ko">
  <head>
    <title><?=$title?></title>
    <meta charset="EUC-KR">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
    <link href="/lsp/htdocs/images/favicon.ico" rel="shortcut icon" type="image/x-icon">
    <link href="/cht_new/htdocs/css/style.css" rel="stylesheet">
    <link href="/cht_new/htdocs/css/portal.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="/lsp/htdocs/css/fontawesome/css/all.css"/>

  </head>
  <body onkeydown='parent.content.doKey(event,0); if(event.ctrlKey && event.keyCode != 116) return false;' onkeyup='parent.content.doKey(event,1); if(event.ctrlKey && event.keyCode != 116) return false;'>
    <div id="left_switch" class="switch close-switch hideshow" onclick="fnShowHideLeftMenu()" onmouseover="fnShowSwitch()" onmouseout="fnHideSwitch()"></div>

    <div id="left_menu" class="left-menu main">
      <div class="left-item">
        <h3 id="main_title" onmouseover="fnShowSwitch()" onmouseout="fnHideSwitch()">
          <div style='height:10px;'></div>  
          <div style='font-size:15px; color:#222; font-weight:bold;'>&middot;&nbsp;일기도 분석<br>&nbsp;&nbsp;종합포털</div>
        </h3>
        <!-- 표출 메뉴 -->
        <div id="menu1" name="menu" style="display:block;">
          <div style='height:4px;'></div>
          <div style='font-size:8pt; margin:4px; color:#222222;'>Developed by ChangJae Lee, KMA</div>
          <div style='height:4px; border-bottom:1px solid red;'></div>

          <div class="nodrop-menu">
            <a name="menu_list" target="content" href="/cht_new/cht_multiv_gis.php" onclick="document.title = this.innerText; dropdown(event); fn_clk_menu(this);" id="multiv">
              일기도 분석
              <span style='display:inline-block; width:5px;'></span>
              <i class="fas fa-external-link-alt" title="새 창" onclick="view_tab('/cht_new/cht_portal.php'); event.stopPropagation(); return false;"></i>
            </a>
          </div>
          <hr>
          <div class="nodrop-menu">
            <a name="menu_list" target="content" href="/cht_new/cht_swc_gis.php" onclick="document.title = this.innerText; dropdown(event); fn_clk_menu(this);" id="swc">
              유사사례 비교(시범)
              <span style='display:inline-block; width:5px;'></span>
              <i class="fas fa-external-link-alt" title="새 창" onclick="view_tab('/cht_new/cht_portal.php?cht_mode=swc'); event.stopPropagation(); return false;"></i>
            </a>
          </div>
          <hr>
          <div class="nodrop-menu">
            <a name="menu_list" target="content" href="/gts/gts_plot_gis.php" onclick="document.title = this.innerText; dropdown(event); fn_clk_menu(this);" id="gts">
              GTS 자료조회 PLUS
              <span style='display:inline-block; width:5px;'></span>
              <i class="fas fa-external-link-alt" title="새 창" onclick="view_tab('/cht_new/cht_portal.php?cht_mode=gts'); event.stopPropagation(); return false;"></i>
            </a>
          </div>
          <hr>
          <div class="nodrop-menu">
            <a name="menu_list" target="content" href="/fgd/nwp_new/nwp_stn.php" onclick="document.title = this.innerText; dropdown(event); fn_clk_menu(this);" id="nwp_stn">
              수치모델 지점값 비교검증
              <span style='display:inline-block; width:1px;'></span>
              <i class="fas fa-question-circle" title="도움말" onclick="view_win('http://172.29.121.203:20080/~ftd/dokuwiki/doku.php?id=manual:nwp_stn'); event.stopPropagation(); return false;"></i>
              <span style='display:inline-block; width:1px;'></span>
              <i class="fas fa-external-link-alt" title="새 창" onclick="view_tab('/cht_new/cht_portal.php?cht_mode=nwp_stn'); event.stopPropagation(); return false;"></i>
            </a>
          </div>
          <hr>

          <div style='height:20px;'></div>
          <div style='font-size:8pt; margin:4px; color:#222222;'>Other Links</div>
          <div style='height:4px; border-bottom:1px solid red;'></div>

          <div class="nodrop-menu">
            <a name="menu_list" target="content" href="http://172.29.121.203:20080/~eps/STRK/typh22.html" onclick="document.title = this.innerText; dropdown(event); fn_clk_menu(this);" id="type">
              앙상블 태풍 경로
              <span style='display:inline-block; width:5px;'></span>
              <i class="fas fa-external-link-alt" title="새 창" onclick="view_tab('/cht_new/cht_portal.php?cht_mode=type'); event.stopPropagation(); return false;"></i>
            </a>
          </div>
          <hr>
          <div class="nodrop-menu">
            <a name="menu_list" target="content" href="http://naru.kma.go.kr:20080/~rnd005/multi_index3.php" onclick="document.title = this.innerText; dropdown(event); fn_clk_menu(this);" id="mme">
              다중모델앙상블
              <span style='display:inline-block; width:5px;'></span>
              <i class="fas fa-external-link-alt" title="새 창" onclick="view_tab('/cht_new/cht_portal.php?cht_mode=mme'); event.stopPropagation(); return false;"></i>
            </a>
          </div>
          <hr>

          <div class="bottom-link">
            <div style='border:1px solid black; border-radius:2px; font-weight:bold; cursor:pointer; text-align:center; margin:4px;' onclick='fnTitleChg();'>
              <i class="fas fa-edit" title="새 창"></i>
              페이지 제목 변경
            </div>
            <div style='height:4px;'></div>
            <div style='font-size:8pt; margin:4px; color:#D8AF1D;'>Special thanks to JK and JW</div>
          </div>

        </div>
        <!-- //조회 선택시 표출 메뉴 -->
       </div>
    </div>

    <iframe class="main body" id="content" name="content" src="<?=$url?>" width="100%" height="100%" scrolling="yes" title="메인화면"></iframe>

    <script type="text/javascript">
      var selected_menuId = "<?=$cht_id?>";

      // content 영역 표출
      function load_menu(menuId)
      {
        document.getElementById(menuId).click();
      }

      function contentOnLoad()
      {
        document.getElementById("content").style.display = "block";
        document.getElementById(selected_menuId).setAttribute("class", "active");
      }

      // LeftMenu 이벤트
      function dropdown(e)
      {
        var dropSelector = document.querySelectorAll(".dropdown-menu h4");
        var active = "active";

        if(e.target.parentNode.classList.contains(active))
        {
          for (var i = 0; i < dropSelector.length; i++)
          {
            dropSelector[i].parentNode.classList.remove(active);
          }
        }
        else
        {
          for (var i = 0; i < dropSelector.length; i++)
          {
            dropSelector[i].parentNode.classList.remove(active);
          }
          e.target.parentNode.classList.add(active);
        }
      }

      // LeftMenu 클릭시 이벤트
      function fn_clk_menu(elmt)
      {
        var menu_list = document.getElementsByName("menu_list");

        for(var idx=0; idx<menu_list.length; idx++)
        {
          menu_list[idx].removeAttribute("class");
        }
        elmt.setAttribute("class", "active");
        selected_menuId = elmt.getAttribute("id");
      }

      contentOnLoad();

      // 참조용 대상 링크 팝업으로 호출
      function view_win(page, wd)
      {
        url = page;
        window.open(url,"","location=yes,left=30,top=30,width=" + wd + ",height=800,scrollbars=yes,resizable=yes");
      }

      // 참조용 대상 링크 탭으로 호출
      function view_tab(page, wd)
      {
        url = page;
        window.open(url,"_blank");
      }

      function fnShowSwitch()
      {
        //clearInterval(id);
        //document.getElementById("left_switch").style.zIndex = 11;
        document.getElementById("left_switch").classList.remove("hideshow");
        document.getElementById("left_switch").style.opacity = 1;
      }

      function fnHideSwitch()
      {
        //clearInterval(id);
        //document.getElementById("left_switch").style.zIndex = 9;
        document.getElementById("left_switch").classList.remove("hideshow");
        document.getElementById("left_switch").style.opacity = 0;
      }

      function fnShowHideLeftMenu()
      {
        if(document.getElementById("left_switch").className == "switch open-switch")
        {
          document.getElementById("left_menu").className = "left-menu main";
          document.getElementById("left_menu").style.display = "block";
          document.getElementById("content").className = "main body";
          document.getElementById("left_switch").className = "switch close-switch";
        }
        else
        {
          document.getElementById("left_menu").className = "left-menu main left-menu-hide";
          document.getElementById("left_menu").style.display = "none";
          document.getElementById("content").className = "main body left-menu-hide";
          document.getElementById("left_switch").className = "switch open-switch";
        }
      }

      // 탭 제목 변경
      function fnTitleChg()
      {
        var title = prompt("변경하고자 하는 제목을 입력해주세요.", document.title);

        if (title !== null && title != "") {
          document.title = title;
        }
      }
    </script>
  </body>
</html>
