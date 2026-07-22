/*
  layout.js — Header (top menu) + Sidebar dung chung cho TAT CA trang mockup Buyer Portal.

  CACH DUNG TRONG 1 TRANG MOI:
  1) Trong <head>, sau <title>, them:
       <link rel="stylesheet" href="assets/layout.css">
     roi <style> chi chua CSS RIENG cua trang do (khong lap lai CSS header/sidebar).

  2) Trong <body>, dat dung 4 placeholder nay (id phai giu nguyen):
       <div id="layout-header"></div>
       <div id="wrapper">
         <div id="layout-sidebar"></div>
         <main id="wrapper-content">
           ... noi dung RIENG cua trang ...
         </main>
       </div>
       <div id="layout-fab"></div>
       <div id="mockToast"></div>

  3) Cuoi <body>, truoc </body>:
       <script src="assets/layout.js"></script>
       <script>
         JienieLayout.init();
         // ... JS rieng cua trang (vd: validate form, carousel, modal...) ...
         // Dung JienieLayout.toast('...') neu can hien toast dieu huong nhu cac nut khac.
       </script>

  JienieLayout.init() se:
    - Chen HTML header/sidebar/back-to-top vao 3 placeholder tren.
    - Gan toggle sidebar (hamburger <-> X), accordion mo/dong tung nhom menu.
    - Gan dropdown user (profile/logout), notice bell (cuon toi #Notification neu co
      tren trang, neu khong co se dieu huong sang ../共通/eProcurement_Home.html#Notification).
    - Gan toast dieu huong dung chung cho MOI phan tu co attribute [data-nav="..."]
      (ca phan tu do trang rieng tao ra, vi init() chay sau khi noi dung trang da co san).
    - Gan back-to-top.

  DA SUA (doi chieu 3 screenshot production that - thu gon/mo rong dong/mo rong mo 1 nhom):
    - Sidebar ban dau thieu han 1 nhom menu "契約書・請求書情報登録" (giua カタログ品購入 va
      締め処理管理). Nguon that: LoggedSidebar.vue dong 508-535, icon FontAwesome "file-invoice",
      label tu i18n key COMMON_MULTI_LANG.PAYMENT_APPLICATION_INPUT.

  DA SUA LAN 2 (doi chieu TRUC TIEP DOM trang that https://demo.staging.jienie.com/eProcurement/Home
  bang JS, 2026-07-05):
    - BO nut hamburger khoi header (desktop that khong co - nut trong header chi hien mobile).
      Hamburger ☰ mau xanh #4169e1 nam TRONG sidebar (hang tren cung); khi mo rong doi thanh ✕
      o goc phai tren sidebar. Header GIU NGUYEN khi sidebar mo (bo logic an nav-panel cu).
    - Sidebar mo rong la OVERLAY 296px de len content (content margin-left co dinh 84px).
    - Submenu "契約書・請求書情報登録" that (do tu DOM) la: 請求書支払 / 定期支払
      (khong phai 業務委託契約書/工事請求書/建物賃貸借契約書 nhu ban truoc).
    - Cart trong header: [icon gio hang + ¥0] tren 1 hang, chu カート o duoi.
    - Ten user can trai (khong phai can phai), co caret ▾ canh banh rang.
    - Icon sidebar that (FontAwesome): calendar-check, receipt, file-invoice-dollar,
      magnifying-glass, file-invoice, calculator, download, download, user-group, ellipsis-vertical.
*/
(function (global) {
  var HEADER_HTML = `<nav class="header">
  <div class="logo-area">
    <a href="../共通/eProcurement_Home.html" style="display:flex;align-items:center;"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAABHCAYAAACj8ErrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTExRjJFODdGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTExRjJFODhGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTFGMkU4NUZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTFGMkU4NkZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDa8k4AAA36SURBVHja7F1pkBXV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" alt="J2 Jienie" style="height:35px;"></a>
  </div>
  <div class="nav-panel">
    <a href="../共通/eProcurement_Home.html" class="home-top">
      <svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z"/></svg>
      <span>トップページ</span>
    </a>
    <div class="menu-top">
      <div class="nav-item" data-nav="ショッピングカート画面（CatalogMall_Shopping_Cart）">
        <div class="cart-row"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABwAAAAcCAYAAAByDd+UAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjI2RUFCNjBCOUJEMTFFOUIwMjVDQUMwMUY2NDNEQUIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjI2RUFCNjFCOUJEMTFFOUIwMjVDQUMwMUY2NDNEQUIiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoyMjZFQUI1RUI5QkQxMUU5QjAyNUNBQzAxRjY0M0RBQiIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoyMjZFQUI1RkI5QkQxMUU5QjAyNUNBQzAxRjY0M0RBQiIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/Pgk2SpgAAAJ5SURBVHjatJZdiIxRGMffnR3rQsl360KJfLUTaTYlhJRLF4RcyEa5lKQthVzYkrjDSsuN5CtJWFwo2VU+ZmTtytKSr0Kz025CWez6PfV/6zS97zvvjJmnfp33PHPe+Z9znuc8563JZDJ3PM9bCH3wEq7CDS+mpdNprxRLQB1MhsWwFa5Dm1clM8GVMAEWwW74CdtgbbUEzQbgCRyF/fJtrIZgMsB3V+0KaIF+yKnNO/3v5QjWkDSFvjpta22Rd4c0gZzIO3wteO4luX6FCZr1QAOsh48wEabBSTiv1ZlvCjQqNLURkxyEvYgeT4QMeK52LDyCdrgo3ynYDutgGbyCVv7MwjMJ5mhMTsm3Tys9ls1mN4cJdqudX0p8EM3Dax4/W1h4PgMHdeS+wa4wwS61CyqRmYjaah/DzIqusIjNhU9hSeOfzXHQAcM6Qku0+kFnXKP6fY5vOtTDQ+e8W7zbEhEz8rd1BN7BB/W/qO8zpPi4PpvAH6c/Wu92JiMELVOXw004rNVugkNwzxn3zPrEaafvIBsP0DTha1K/VaWzM1FEsFJxXGo7wwTeVF2Q1U1VEelwi3eQvVD85sGoMsWsOp22igaXo0qbb3aIZ1VgS8/CFrZ0JFlkYLcErX1bhpBl9C2ErkVdT4VxtIv4NjRX6hMjyp6qXR1jcmXfh66NUQWp15b2KJHimt2rO9iF/rhb+gPWwAWYIUq1E3bg4wp6+taZDSkYX6LYAKvrKvZNE2R/4b3KU69/iAuThnNn/7cBfsMVfhsuNWlca9dNfh9WhYyxOnsOLsGecrLUtZTz3BBjTOp/BZv1ifhAqwiyFl1jltlHggb8E2AAfLK6aRlqfwkAAAAASUVORK5CYII=" alt="cart" width="22" height="22"><span>¥0</span></div>
        <span class="icon-number">0</span>
        <div>カート</div>
      </div>
      <div class="nav-item" data-nav="商品比較画面（CatalogMall_Products_Compare）">
        <svg viewBox="0 0 24 24"><path d="M3 3h8v8H3V3zm10 0h8v8h-8V3zM3 13h8v8H3v-8zm10 0h8v8h-8v-8z"/></svg>
        <span class="icon-number">9</span>
        <div>比較表</div>
      </div>
      <div class="nav-item" id="navNoticeBtn">
        <svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        <span class="icon-number">3</span>
        <div>お知らせ</div>
      </div>
      <div class="nav-item" data-nav="ヘルプデスク一覧画面（eProcurement_HelpManagement_HelpDeskList）">
        <svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 17h-2v-2h2v2zm2.07-7.75-.9.92A3.4 3.4 0 0 0 13 14h-2v-.5c0-.83.34-1.58.9-2.14l1.24-1.26c.36-.36.58-.86.58-1.42a2.5 2.5 0 0 0-5 0H7a5 5 0 0 1 10 0c0 .99-.4 1.89-1.07 2.55z"/></svg>
        <div>ヘルプ</div>
      </div>
      <div class="login-info">
        <div class="avatar"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/></svg></div>
        <div class="user-name">
          <div style="font-size:80%">本社 総務部</div>
          <div>依頼裕三</div>
        </div>
        <div class="setting-user" id="settingUserBtn">
          <svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-3.5c0-.6-.05-1.18-.14-1.74l2-1.56-2-3.46-2.36.96a7.9 7.9 0 0 0-1.5-.87L15 2h-4l-.4 2.83c-.55.23-1.05.52-1.5.87l-2.36-.96-2 3.46 2 1.56c-.09.56-.14 1.14-.14 1.74s.05 1.18.14 1.74l-2 1.56 2 3.46 2.36-.96c.45.35.95.64 1.5.87L11 22h4l.4-2.83c.55-.23 1.05-.52 1.5-.87l2.36.96 2-3.46-2-1.56c.09-.56.14-1.14.14-1.74z"/></svg><span class="caret">&#9662;</span>
          <div class="dropdown-panel" id="userDropdownPanel">
            <a href="#" data-nav="プロフィール設定画面（eProcurement_ProfileSetting）">プロフィール設定</a>
            <div class="dp-divider"></div>
            <a href="#" data-nav="ログアウト（eProcurement_Logout）">ログアウト</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>`;

  var SIDEBAR_HTML = `<aside id="wrapper-sidebar">
    <div class="sidebar-top">
      <button class="toggle-sidebar-burger" id="toggleSidebarBtn" title="メニューを開く">&#9776;</button>
      <button class="toggle-sidebar-x" id="closeSidebarBtn" title="メニューを閉じる">&times;</button>
    </div>
    <ul>
      <li class="nav-group">
        <a href="#" class="menu-item" title="購買取引案件照会">
          <svg viewBox="0 0 24 24"><path d="M19 4h-5.18C13.4 2.84 12.3 2 11 2S8.6 2.84 8.18 4H3v18h18V4h-2zM11 4a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 16H6V6h2v2h8V6h2v14z"/></svg>
          <span class="menu-label">購買取引案件照会</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="../購買取引案件照会/eProcurement_Requester_EstimateApplicationApplicantList.html">見積依頼・見積回答</a></li>
          <li><a href="../購買取引案件照会/eProcurement_Requester_All.html">すべて</a></li>
          <li><a href="#" data-nav="購買取引案件_発注済み（eProcurement_Requester_Ordered）">発注</a></li>
          <li><a href="#" data-nav="購買取引案件_検収待ち（eProcurement_Requester_WaitingAcceptance）">検収</a></li>
          <li><a href="#" data-nav="購買取引案件_検収完了（eProcurement_Requester_FinishedAcceptance）">検収完了</a></li>
          <li><a href="#" data-nav="検収バーコード入力（eProcurement_Requester_AcceptanceInput）">検収（バーコード）</a></li>
          <li><a href="#" data-nav="購買取引案件_下書き一覧（eProcurement_Requester_OpportunityDraft）">一時保存</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="契約情報照会">
          <svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v16l1.5-1.5L6 21l1.5-1.5L9 21l1.5-1.5L12 21l1.5-1.5L15 21l1.5-1.5L18 21l1.5-1.5L21 21V5a2 2 0 0 0-2-2zM7 7h10v2H7V7zm0 4h10v2H7v-2z"/></svg>
          <span class="menu-label">契約情報照会</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="契約情報_すべて（eProcurement_Settings_Contract_All）">すべて</a></li>
          <li><a href="#" data-nav="契約情報_承認待ち（eProcurement_Settings_Contract_Pending_Approval）">契約申請</a></li>
          <li><a href="#" data-nav="契約情報_承認済み（eProcurement_Settings_Contract_Approved）">契約中</a></li>
          <li><a href="#" data-nav="契約情報_満了（eProcurement_Settings_Contract_Finished）">契約満了</a></li>
          <li><a href="#" data-nav="契約情報_下書き（eProcurement_Settings_Contract_Draft）">一時保存</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="支払管理案件照会">
          <svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v16l4-4h12a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM11 7h2v2h-2zm0 4h2v6h-2z"/></svg>
          <span class="menu-label">支払管理案件照会</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="支払管理案件_すべて（eProcurement_Payment_List_All）">すべて</a></li>
          <li><a href="#" data-nav="支払管理案件_確認待ち（eProcurement_Payment_List_Confirmation）">支払確認</a></li>
          <li><a href="#" data-nav="支払管理案件_確認完了（eProcurement_Payment_List_Confirmation_Completed）">支払確認完了</a></li>
          <li><a href="#" data-nav="支払管理案件_下書き（eProcurement_PaymentApplication_Management_Temporary_Save）">一時保存</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="カタログ品購入">
          <svg viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 1 0-.7.7l.27.28v.79l5 4.99L20.49 19zm-6 0A4.5 4.5 0 1 1 14 9.5 4.5 4.5 0 0 1 9.5 14z"/></svg>
          <span class="menu-label">カタログ品購入</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="商品検索画面（CatalogMall_Catalogue_Entry）">商品から探す</a></li>
          <li><a href="#" data-nav="マイカタログ画面（CatalogMall_My_Catalog）">マイカタログを見る</a></li>
          <li><a href="#" data-nav="定期購入エントリ画面（CatalogMall_Subscription_Entry）">定期購入通知から探す</a></li>
          <li><a href="#" data-nav="購入履歴画面（CatalogMall_History_Entry）">購入履歴から探す</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="契約書・請求書情報登録">
          <svg viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
          <span class="menu-label">契約書・請求書情報登録</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="請求書支払入力画面（eProcurement_PaymentApplication_Input）">請求書支払</a></li>
          <li><a href="#" data-nav="定期支払（契約登録）入力画面（eProcurement_Contract_Info_Register_Input）">定期支払</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="締め処理管理">
          <svg viewBox="0 0 24 24"><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM7 7h2v2H7zm0 4h2v2H7zm0 4h2v2H7zm4-8h6v2h-6zm0 4h6v2h-6zm0 4h6v2h-6z"/></svg>
          <span class="menu-label">締め処理管理</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="支払通知画面（eProcurement_Settings_PaymentClosing_PaymentClosingExecute）">支払通知</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="月次明細管理">
          <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          <span class="menu-label">月次明細管理</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="月次明細ダウンロード画面（eProcurement_Settings_PaymentClosing_MonthlyDownloadAnkenDetail）">月次明細ダウンロード</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="ダウンロードセンター">
          <svg viewBox="0 0 24 24"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
          <span class="menu-label">ダウンロードセンター</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="ダウンロードセンター_新規（eProcurement_ReportCenter_Home）">新しいダウンロード</a></li>
          <li><a href="#" data-nav="ダウンロードセンター_履歴（eProcurement_ReportCenter_DownloadHistory）">ダウンロード履歴</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="案件引継ぎ">
          <svg viewBox="0 0 24 24"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05C17.66 13.9 19 15.7 19 16.5V19h5v-2.5c0-2.33-3.67-3.5-8-3.5z"/></svg>
          <span class="menu-label">案件引継ぎ</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="依頼者情報変更画面（eProcurement_AnkenHangover_RequesterInfoChangeInput）">依頼者情報変更</a></li>
        </ul>
      </li>
      <li class="nav-group">
        <a href="#" class="menu-item" title="その他">
          <svg viewBox="0 0 24 24"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          <span class="menu-label">その他</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="取引不可サプライヤ一覧（non_Tradeable_Suppliers_List）">取引不可サプライヤ一覧</a></li>
          <li><a href="#" data-nav="FAX送信履歴（eProcurement_Requester_HistorySentFax）">FAX・Email送信状況</a></li>
        </ul>
      </li>
    </ul>
  </aside>`;

  var BACKTOTOP_HTML = `<div class="back-to-top" id="backToTopBtn">
  <svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>
</div>`;

  var toastEl = null;
  var toastTimer = null;
  function toast(msg) {
    if (!toastEl) toastEl = document.getElementById('mockToast');
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }

  function replacePlaceholder(id, html) {
    var el = document.getElementById(id);
    if (!el) return;
    el.outerHTML = html;
  }

  function bindDataNavToasts() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      if (el.dataset.navBound) return;
      el.dataset.navBound = '1';
      el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) {
        e.preventDefault();
        toast('実際の画面では「' + el.getAttribute('data-nav') + '」へ遷移します');
      });
    });
  }

  function bindSidebar() {
    var toggleBtn = document.getElementById('toggleSidebarBtn');
    var closeBtn = document.getElementById('closeSidebarBtn');
    if (toggleBtn) toggleBtn.addEventListener('click', function () {
      document.body.classList.add('sidebar-open');
    });
    if (closeBtn) closeBtn.addEventListener('click', function () {
      document.body.classList.remove('sidebar-open');
    });

    document.querySelectorAll('#wrapper-sidebar li.nav-group').forEach(function (li) {
      var head = li.querySelector('a.menu-item');
      head.addEventListener('click', function (e) {
        e.preventDefault();
        if (!document.body.classList.contains('sidebar-open')) {
          // Che do thu gon (chi icon): bam se chuyen thang toi muc dau tien trong submenu
          // (giong phuong thuc toFirstMenu() that trong LoggedSidebar.vue)
          var firstLink = li.querySelector('.submenu a');
          var firstHref = firstLink ? firstLink.getAttribute('href') : null;
          if (firstHref && firstHref !== '#') {
            window.location.href = firstHref;
            return;
          }
          var target = firstLink ? firstLink.getAttribute('data-nav') : (head.getAttribute('title') || '');
          toast('実際の画面では「' + target + '」へ遷移します');
          return;
        }
        var wasOpen = li.classList.contains('open');
        document.querySelectorAll('#wrapper-sidebar li.nav-group').forEach(function (other) {
          other.classList.remove('open');
        });
        if (!wasOpen) li.classList.add('open');
      });
    });
    document.querySelectorAll('#wrapper-sidebar .submenu a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        // Neu submenu da co trang mockup rieng (href that) thi dieu huong binh thuong
        var href = a.getAttribute('href');
        if (href && href !== '#') return;
        e.preventDefault();
        toast('実際の画面では「' + a.getAttribute('data-nav') + '」へ遷移します');
      });
    });
  }

  function bindHeader() {
    var settingBtn = document.getElementById('settingUserBtn');
    var userPanel = document.getElementById('userDropdownPanel');
    if (settingBtn && userPanel) {
      settingBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        userPanel.classList.toggle('show');
      });
      document.addEventListener('click', function () { userPanel.classList.remove('show'); });
      userPanel.addEventListener('click', function (e) { e.stopPropagation(); });
    }

    var noticeBtn = document.getElementById('navNoticeBtn');
    if (noticeBtn) {
      noticeBtn.addEventListener('click', function () {
        var target = document.getElementById('Notification');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = '../共通/eProcurement_Home.html#Notification';
        }
      });
    }
  }

  function bindBackToTop() {
    var btn = document.getElementById('backToTopBtn');
    if (btn) btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  function init() {
    replacePlaceholder('layout-header', HEADER_HTML);
    replacePlaceholder('layout-sidebar', SIDEBAR_HTML);
    replacePlaceholder('layout-fab', BACKTOTOP_HTML);
    bindSidebar();
    bindHeader();
    bindBackToTop();
    bindDataNavToasts();
  }

  global.JienieLayout = {
    init: init,
    toast: toast,
    // Goi lai ham nay neu trang tu them phan tu [data-nav] SAU khi da goi init()
    // (vi du: render động 1 danh sach sau khi fetch xong).
    bindDataNavToasts: bindDataNavToasts
  };
})(window);
