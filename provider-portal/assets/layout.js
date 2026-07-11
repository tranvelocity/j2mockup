/*
  layout.js — Header + Sidebar dung chung cho TAT CA trang mockup PROVIDER PORTAL.

  CACH DUNG TRONG 1 TRANG MOI: giong quy uoc buyer/supplier — 4 placeholder id giu nguyen:
   #layout-header / #wrapper > #layout-sidebar + main#wrapper-content / #layout-fab / #mockToast.

  NGUON THAT (source code, khong suy doan — CUNG 1 component Vue dung chung ca 3 portal):
  - Header: src-vbizhw-common/src/layouts/eProcurement/LoggedHeader.vue, nhanh Provider
    (companyDivisionCode != 20, isSupplierLogin=false):
      * KHONG co カート/比較表 (v-if roles['SHOPPING_CART']/['PRODUCTS_COMPARE'] — Provider
        khong co role nay), KHONG co khoi 会社コード 3-cot (chi Supplier, dong 79).
      * Co: logo, トップページ (HOME.TITLE), chuong お知らせ (MASTER_SETTING.LB_NOTICE, dong 52-63),
        khoi user 2 dong [組織名(organizationName)] [氏名(user.name)] (dong 88-102),
        banh rang dropdown: パスワードの再設定 / ログアウト (dong 123-141).
  - Sidebar: src-vbizhw-common/src/layouts/eProcurement/LoggedSidebar.vue, CHI nhom
    「マスタ管理」(id="a-menuMasterManagement", dong 384-458) la hien voi role Provider —
    cac nhom khac (requester/purchaser/estimateSupplier/...) gan role Buyer/Supplier nen
    Provider (demo full role Master) KHONG thay. Submenu THEO DUNG THU TU trong template:
      マスタ設定(MASTER_SETTING) / バイヤー切替(BUYER_SWITCH) / 案件設定(PROJECT_SETTING) /
      アップロード履歴(UPLOAD_HISTORY) / 権限管理(ROLE_MANAGEMENT) / マスタ照会設定
      (MASTER_VIEW_SETTING) / メールテンプレート設定 共通・個別(MAIL_TEMPLATE_SETTING_COMMON/
      PRIVATE) / 多言語設定(LANGUAGE_MANAGEMENT/MULTI_LANGUAGE_MANAGEMENT) /
      スケジュールジョブ一覧(SCHEDULE_JOB_LIST) / ログ監視ダッシュボード(LOG_MESSAGE_DASHBOARD).
    → 「RFX設定」la MUC MOI (NEW) duoc them cuoi nhom nay theo 02_要件定義書.md v0.9 §4.3:
      "既存 Masterメニュー拡張「RFX設定」サブメニュー追加". Day la MUC DUY NHAT co href THAT
      (trang nay) — cac muc con lai la data-nav toast vi day la mockup Provider Portal
      DAU TIEN cua du an (provider-supplier/ truoc do chi co sitemap.md, chua co assets/).
      Logo/トップページ cung dung data-nav toast (chua co eProcurement_Home tuong duong
      ben Provider) — tranh link gay khi chua co trang dich.

  LOGO: dung SVG chu "J2" ve tay (KHONG dung base64 PNG nhu buyer/supplier — tranh loi
  sao chep chuoi base64 dai). Mau/kich thuoc tuong duong logo J2 thuc.

  DEMO DATA (de xuat — Provider la nhan vien noi bo Jienie Lab, KHONG gan voi 1 client/supplier
  cu the nao, dung 02_要件定義書.md v0.9 §1.2: "ジーニーラボが運営するシステム管理者ロール"):
    組織名: ジーニーラボ株式会社, 氏名: 山田健一 (de xuat), role: Provider管理者（full access
    Master module）.
*/
(function (global) {
  // BASE: cac trang mockup Provider nam o 2 muc do sau khac nhau (goc provider-portal/ va
  // provider-portal/RFX機能/) nhung dung CHUNG 1 layout.js nay -> phai tinh prefix tuong doi
  // dung theo vi tri trang hien tai de sidebar khong bi gay link (bug da gap va sua voi
  // supplier-portal/RFX機能/, lan nay chu dong tinh truoc de khong lap lai).
  var BASE = window.location.pathname.indexOf('/RFX機能/') > -1 ? '../' : '';

  var LOGO_SVG = '<img src="' + BASE + 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAABHCAYAAACj8ErrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTExRjJFODdGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTExRjJFODhGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTFGMkU4NUZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTFGMkU4NkZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDa8k4AAA36SURBVHja7F1pkBXV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" alt="J2 Jienie">';

  var HEADER_HTML = '<nav class="header">' +
  '<div class="logo-area">' +
    '<a href="#" data-nav="トップページ（Provider Home）" style="display:flex;align-items:center;">' + LOGO_SVG + '</a>' +
  '</div>' +
  '<div class="nav-panel">' +
    '<a href="#" data-nav="トップページ（Provider Home）" class="home-top">' +
      '<svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z"/></svg>' +
      '<span>トップページ</span>' +
    '</a>' +
    '<div class="menu-top">' +
      '<div class="nav-item" id="navNoticeBtn" data-nav="お知らせ一覧（Provider Notification）">' +
        '<svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>' +
        '<span class="icon-number">3</span>' +
        '<div>お知らせ</div>' +
      '</div>' +
      '<div class="login-info">' +
        '<div class="avatar"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/></svg></div>' +
        '<div class="user-name">' +
          '<div>ジーニーラボ株式会社</div>' +
          '<div>山田健一</div>' +
        '</div>' +
        '<div class="setting-user" id="settingUserBtn">' +
          '<svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-3.5c0-.6-.05-1.18-.14-1.74l2-1.56-2-3.46-2.36.96a7.9 7.9 0 0 0-1.5-.87L15 2h-4l-.4 2.83c-.55.23-1.05.52-1.5.87l-2.36-.96-2 3.46 2 1.56c-.09.56-.14 1.14-.14 1.74s.05 1.18.14 1.74l-2 1.56 2 3.46 2.36-.96c.45.35.95.64 1.5.87L11 22h4l.4-2.83c.55-.23 1.05-.52 1.5-.87l2.36.96 2-3.46-2-1.56c.09-.56.14-1.14.14-1.74z"/></svg><span class="caret">&#9662;</span>' +
          '<div class="dropdown-panel" id="userDropdownPanel">' +
            '<a href="#" data-nav="パスワードの再設定画面">パスワードの再設定</a>' +
            '<div class="dp-divider"></div>' +
            '<a href="#" data-nav="ログアウト（eProcurement_Logout）">ログアウト</a>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
  '</div>' +
'</nav>';

  /* Sidebar Provider — CHI nhom "マスタ管理" (menuMasterManagement, LoggedSidebar.vue dong 384-458).
     Muc "RFX設定" la MOI (NEW), href THAT ve trang nay. Cac muc khac = data-nav toast. */
  var SIDEBAR_HTML = '<aside id="wrapper-sidebar">' +
    '<div class="sidebar-top">' +
      '<button class="toggle-sidebar-burger" id="toggleSidebarBtn" title="メニューを開く">&#9776;</button>' +
      '<button class="toggle-sidebar-x" id="closeSidebarBtn" title="メニューを閉じる">&times;</button>' +
    '</div>' +
    '<ul>' +
      '<li class="nav-group open">' +
        '<a href="#" class="menu-item active" title="マスタ管理">' +
          '<svg viewBox="0 0 512 512"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.7-5.4-.6-11.2-5.5-14zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>' +
          '<span class="menu-label">マスタ管理</span>' +
          '<span class="mi-chevron">&#9662;</span>' +
        '</a>' +
        '<ul class="submenu">' +
          '<li><a href="' + BASE + 'eProcurement_Settings_MasterManagement_MasterSetting.html">マスタ設定</a></li>' +
          '<li><a href="#" data-nav="バイヤー切替画面（eProcurement_Settings_MasterManagement_BuyerSwitch）">バイヤー切替</a></li>' +
          '<li><a href="#" data-nav="案件設定画面（eProcurement_Settings_MasterManagement_ProjectSetting）">案件設定</a></li>' +
          '<li><a href="#" data-nav="アップロード履歴画面（eProcurement_Settings_MasterManagement_UploadHistory）">アップロード履歴</a></li>' +
          '<li><a href="#" data-nav="権限管理画面（eProcurement_Authorization_RoleManagement）">権限管理</a></li>' +
          '<li><a href="#" data-nav="マスタ照会設定画面（eProcurement_Authorization_MasterPermission）">マスタ照会設定</a></li>' +
          '<li><a href="#" data-nav="メールテンプレート設定（共通）画面">メールテンプレート設定（共通）</a></li>' +
          '<li><a href="#" data-nav="メールテンプレート設定（個別）画面">メールテンプレート設定（個別）</a></li>' +
          '<li><a href="#" data-nav="多言語設定画面（eProcurement_Settings_MultiLanguage_Management）">多言語設定</a></li>' +
          '<li><a href="#" data-nav="スケジュールジョブ一覧画面（eProcurement_Settings_ScheduleJob_List）">スケジュールジョブ一覧</a></li>' +
          '<li><a href="#" data-nav="ログ監視ダッシュボード（LogMessage_Dashboard）">ログ監視ダッシュボード</a></li>' +
          '<li><a href="' + BASE + 'RFX機能/eProcurement_RFX_ProviderSettings.html">RFX設定<span class="new-tag">NEW</span></a></li>' +
        '</ul>' +
      '</li>' +
    '</ul>' +
  '</aside>';

  var BACKTOTOP_HTML = '<div class="back-to-top" id="backToTopBtn">' +
  '<svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>' +
'</div>';

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
        var wasOpen = li.classList.contains('open');
        document.querySelectorAll('#wrapper-sidebar li.nav-group').forEach(function (other) {
          other.classList.remove('open');
        });
        if (!wasOpen) li.classList.add('open');
      });
    });
    document.querySelectorAll('#wrapper-sidebar .submenu a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href !== '#') return; // co mockup that -> dieu huong binh thuong
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
  }

  function bindBackToTop() {
    var btn = document.getElementById('backToTopBtn');
    if (btn) btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Danh dau muc submenu dang active theo ten file cua trang hien tai (thay the cho
  // class="active" hardcode truoc day — vi 1 layout.js nay dung chung nhieu trang).
  function markActiveMenu() {
    var currentFile = window.location.pathname.split('/').pop();
    document.querySelectorAll('#wrapper-sidebar .submenu a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (href && href !== '#' && href.split('/').pop() === currentFile) {
        a.classList.add('active');
      }
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
    markActiveMenu();
  }

  global.JienieLayout = {
    init: init,
    toast: toast,
    bindDataNavToasts: bindDataNavToasts
  };
})(window);
