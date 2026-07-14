/* ============================================================
   J2 RFX機能モックアップ（Provider Portal）— 共通レイアウト JS（自己完結版）
   ------------------------------------------------------------
   buyer-portal / supplier-portal の RFX モックアップと同一の実サイト準拠
   header/sidebar/logo を内包し、NAV のみ Provider Portal 用に差し替える。
   document.write / @import は使わずパス問題を回避。
   ============================================================ */
(function (global) {
  var LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAASIAAABHCAYAAACj8ErrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTExRjJFODdGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTExRjJFODhGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTFGMkU4NUZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTFGMkU4NkZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDa8k4AAA36SURBVHja7F1pkBXV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";

  var HEADER_HTML = '<nav class="header">' +
    '<div class="logo-area"><a href="#" data-nav="トップページ（Provider Home）" style="display:flex;align-items:center;"><img src="data:image/png;base64,' + LOGO_B64 + '" alt="J2 Jienie" style="height:35px;"></a></div>' +
    '<div class="nav-panel">' +
      '<a href="#" data-nav="トップページ（Provider Home）" class="home-top"><svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z"/></svg><span>トップページ</span></a>' +
      '<div class="menu-top">' +
        '<div class="nav-item" id="navNoticeBtn"><svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg><span class="icon-number">2</span><div>お知らせ</div></div>' +
        '<div class="login-info">' +
          '<div class="avatar"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/></svg></div>' +
          '<div class="user-name"><div class="lbl">Provider（システム管理者）</div><div>ジーニーラボ株式会社</div></div>' +
          '<div class="user-name"><div class="lbl">担当者名</div><div>山田健一</div></div>' +
          '<div class="setting-user" id="settingUserBtn"><svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-3.5c0-.6-.05-1.18-.14-1.74l2-1.56-2-3.46-2.36.96a7.9 7.9 0 0 0-1.5-.87L15 2h-4l-.4 2.83c-.55.23-1.05.52-1.5.87l-2.36-.96-2 3.46 2 1.56c-.09.56-.14 1.14-.14 1.74s.05 1.18.14 1.74l-2 1.56 2 3.46 2.36-.96c.45.35.95.64 1.5.87L11 22h4l.4-2.83c.55-.23 1.05-.52 1.5-.87l2.36.96 2-3.46-2-1.56c.09-.56.14-1.14.14-1.74z"/></svg><span class="caret">&#9662;</span>' +
            '<div class="dropdown-panel" id="userDropdownPanel">' +
              '<a href="#" data-nav="プロフィール設定（Provider）">プロフィール設定</a>' +
              '<div class="dp-divider"></div>' +
              '<a href="#" data-nav="ログアウト">ログアウト</a>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</div></nav>';

  var SIDEBAR_HTML = '<aside id="wrapper-sidebar">' +
    '<div class="sidebar-top">' +
      '<button class="toggle-sidebar-burger" id="toggleSidebarBtn" title="メニューを開く">&#9776;</button>' +
      '<button class="toggle-sidebar-x" id="closeSidebarBtn" title="メニューを閉じる">&times;</button>' +
    '</div><ul>' +
      // 1. マスタ管理
      '<li class="nav-group"><a href="#" class="menu-item" title="マスタ管理">' +
        '<svg viewBox="0 0 24 24"><path d="M4 4h7v7H4V4zm9 0h7v7h-7V4zM4 13h7v7H4v-7zm9 0h7v7h-7v-7z"/></svg>' +
        '<span class="menu-label">マスタ管理</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="商品カテゴリマスタ（Master_Category）">商品カテゴリ</a></li>' +
          '<li><a href="#" data-nav="単位マスタ（Master_Unit）">単位マスタ</a></li>' +
          '<li><a href="#" data-nav="通貨マスタ（Master_Currency）">通貨マスタ</a></li>' +
        '</ul></li>' +
      // 2. メール設定
      '<li class="nav-group"><a href="#" class="menu-item" title="メール設定">' +
        '<svg viewBox="0 0 24 24"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>' +
        '<span class="menu-label">メール設定</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="メールテンプレート管理（Mail_TemplateManagement）">メールテンプレート管理</a></li>' +
        '</ul></li>' +
      // 3. ジョブ管理
      '<li class="nav-group"><a href="#" class="menu-item" title="ジョブ管理">' +
        '<svg viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 10V6h-2v7h6v-2h-4z"/></svg>' +
        '<span class="menu-label">ジョブ管理</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="スケジュールジョブ一覧（Schedule_JobList）">スケジュールジョブ一覧</a></li>' +
        '</ul></li>' +
      // 4. 監査ログ
      '<li class="nav-group"><a href="#" class="menu-item" title="監査ログ">' +
        '<svg viewBox="0 0 24 24"><path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h10v2H4v-2zm0 5h10v2H4v-2z"/></svg>' +
        '<span class="menu-label">監査ログ</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="操作ログ照会（AuditLog_List）">操作ログ照会</a></li>' +
        '</ul></li>' +
      // 5. RFX設定 — 新設
      '<li class="nav-group open" id="rfxNavGroup"><a href="#" class="menu-item active" title="RFX設定">' +
        '<svg viewBox="0 0 24 24"><path d="M3 3h2v18H3V3zm4 11h3v7H7v-7zm5-7h3v14h-3V7zm5 4h3v10h-3V11z"/></svg>' +
        '<span class="menu-label">RFX設定<span class="mi-new">NEW</span></span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="index.html">RFX モックアップ一覧</a></li>' +
          '<li><a href="eProcurement_RFX_ProviderSettings.html">RFXシステム設定</a></li>' +
        '</ul></li>' +
    '</ul></aside>';

  var BACKTOTOP_HTML = '<div class="back-to-top" id="backToTopBtn"><svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg></div>';

  var toastEl = null, toastTimer = null;
  function toast(msg) {
    if (!toastEl) toastEl = document.getElementById('mockToast');
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('show'); }, 2400);
  }
  function replacePlaceholder(id, html) { var el = document.getElementById(id); if (el) el.outerHTML = html; }

  function bindDataNavToasts() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      if (el.dataset.navBound) return; el.dataset.navBound = '1'; el.style.cursor = 'pointer';
      el.addEventListener('click', function (e) { e.preventDefault(); toast('実際の画面では「' + el.getAttribute('data-nav') + '」へ遷移します'); });
    });
  }

  function bindSidebar() {
    var t = document.getElementById('toggleSidebarBtn'), c = document.getElementById('closeSidebarBtn');
    if (t) t.addEventListener('click', function () { document.body.classList.add('sidebar-open'); });
    if (c) c.addEventListener('click', function () { document.body.classList.remove('sidebar-open'); });
    document.querySelectorAll('#wrapper-sidebar li.nav-group').forEach(function (li) {
      var head = li.querySelector('a.menu-item');
      head.addEventListener('click', function (e) {
        e.preventDefault();
        if (!document.body.classList.contains('sidebar-open')) {
          var f = li.querySelector('.submenu a'); var fh = f ? f.getAttribute('href') : null;
          if (fh && fh !== '#') { window.location.href = fh; return; }
          toast('実際の画面では「' + (f ? f.getAttribute('data-nav') : head.getAttribute('title')) + '」へ遷移します');
          return;
        }
        var wasOpen = li.classList.contains('open');
        document.querySelectorAll('#wrapper-sidebar li.nav-group').forEach(function (o) { o.classList.remove('open'); });
        if (!wasOpen) li.classList.add('open');
      });
    });
    document.querySelectorAll('#wrapper-sidebar .submenu a').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href = a.getAttribute('href');
        if (href && href !== '#') return;
        e.preventDefault(); toast('実際の画面では「' + a.getAttribute('data-nav') + '」へ遷移します');
      });
    });
  }

  function bindHeader() {
    var sb = document.getElementById('settingUserBtn'), up = document.getElementById('userDropdownPanel');
    if (sb && up) {
      sb.addEventListener('click', function (e) { e.stopPropagation(); up.classList.toggle('show'); });
      document.addEventListener('click', function () { up.classList.remove('show'); });
      up.addEventListener('click', function (e) { e.stopPropagation(); });
    }
    var nb = document.getElementById('navNoticeBtn');
    if (nb) nb.addEventListener('click', function () { toast('実際の画面では「お知らせ一覧」へ遷移します'); });
  }

  function bindBackToTop() {
    var b = document.getElementById('backToTopBtn');
    if (b) b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  function openModal(id) { var m = document.getElementById(id); if (m) m.classList.add('open'); }
  function closeModal(id) { var m = document.getElementById(id); if (m) m.classList.remove('open'); }
  function bindModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (ov) {
      if (ov.dataset.mbound) return; ov.dataset.mbound = '1';
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.classList.remove('open'); });
      ov.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { ov.classList.remove('open'); }); });
    });
    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      if (btn.dataset.mbound) return; btn.dataset.mbound = '1';
      btn.addEventListener('click', function () { openModal(btn.getAttribute('data-open-modal')); });
    });
  }
  function bindSearch() {
    document.querySelectorAll('.toggle-detail').forEach(function (t) {
      if (t.dataset.sbound) return; t.dataset.sbound = '1';
      t.addEventListener('click', function () {
        t.classList.toggle('open');
        var tgt = document.querySelector(t.getAttribute('data-target'));
        if (tgt) tgt.classList.toggle('open');
      });
    });
  }

  function init() {
    replacePlaceholder('layout-header', HEADER_HTML);
    replacePlaceholder('layout-sidebar', SIDEBAR_HTML);
    replacePlaceholder('layout-fab', BACKTOTOP_HTML);
    bindSidebar(); bindHeader(); bindBackToTop();
    bindModals(); bindSearch(); bindDataNavToasts();
  }

  global.JienieLayout = { init: init, toast: toast, openModal: openModal, closeModal: closeModal, bindDataNavToasts: bindDataNavToasts };
})(window);
