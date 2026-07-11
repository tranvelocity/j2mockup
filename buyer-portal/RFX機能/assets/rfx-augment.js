/* ============================================================
   J2 RFX機能モックアップ — 共通レイアウト拡張（rfx-augment.js）
   ------------------------------------------------------------
   実共通レンダラ（../assets/layout.js の JienieLayout）に対し、RFX 画面用に:
     1. openModal / closeModal を追加（RFX画面の data-open-modal / data-close 用）
     2. init() をラップして: 親リンク補正（../）・RFXメニュー注入・モーダル/検索バインド
   実共通レンダラが先に定義した window.JienieLayout を拡張する。
   ============================================================ */
(function () {
  var L = window.JienieLayout;
  if (!L) { console.warn('[rfx-augment] JienieLayout 未ロード'); return; }
  var realInit = L.init;

  L.openModal = function (id) { var m = document.getElementById(id); if (m) m.classList.add('open'); };
  L.closeModal = function (id) { var m = document.getElementById(id); if (m) m.classList.remove('open'); };

  function bindModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (ov) {
      if (ov.dataset.mbound) return; ov.dataset.mbound = '1';
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.classList.remove('open'); });
      ov.querySelectorAll('[data-close]').forEach(function (b) { b.addEventListener('click', function () { ov.classList.remove('open'); }); });
    });
    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      if (btn.dataset.mbound) return; btn.dataset.mbound = '1';
      btn.addEventListener('click', function () { L.openModal(btn.getAttribute('data-open-modal')); });
    });
  }

  function bindSearch() {
    document.querySelectorAll('.toggle-detail').forEach(function (t) {
      if (t.dataset.sbound) return; t.dataset.sbound = '1';
      t.addEventListener('click', function () {
        t.classList.toggle('open');
        var tgt = document.querySelector(t.getAttribute('data-target'));
        if (tgt) tgt.classList.toggle('open');
        var cap = t.querySelector('.cap');
        if (cap) cap.textContent = t.classList.contains('open') ? '詳細条件を省略' : '詳細条件を追加';
      });
    });
    document.querySelectorAll('.couple-btn').forEach(function (cb) {
      if (cb.dataset.sbound) return; cb.dataset.sbound = '1';
      cb.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          cb.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
        });
      });
    });
  }

  // 実レンダラのリンクは buyer-portal/ 基準。RFX画面は buyer-portal/RFX機能/ にあるため
  // eProcurement_*.html への相対リンクを ../ で親フォルダへ補正する。
  function fixParentLinks() {
    document.querySelectorAll('.header a[href], #wrapper-sidebar a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      if (!href) return;
      if (href.charAt(0) === '#' || href.indexOf('../') === 0 || /^https?:/.test(href)) return;
      if (href.indexOf('eProcurement_RFX_') === 0 || href === 'index.html') return; // RFX ローカル
      if (/^eProcurement_/.test(href) || /^[A-Za-z0-9_]+\.html/.test(href)) a.setAttribute('href', '../' + href);
    });
  }

  // 新設メニュー「調達ソーシング(RFX)」をサイドバー末尾に追加（RFXは実ナビ未搭載の新機能）。
  function injectRfxMenu() {
    var ul = document.querySelector('#wrapper-sidebar > ul');
    if (!ul || document.getElementById('rfxNavGroup')) return;
    var li = document.createElement('li');
    li.className = 'nav-group'; li.id = 'rfxNavGroup';
    li.innerHTML =
      '<a href="#" class="menu-item active" title="調達ソーシング(RFX)">' +
        '<svg viewBox="0 0 24 24"><path d="M3 3h2v18H3V3zm4 11h3v7H7v-7zm5-7h3v14h-3V7zm5 4h3v10h-3V11z"/></svg>' +
        '<span class="menu-label">調達ソーシング(RFX)<span class="mi-new">NEW</span></span>' +
        '<span class="mi-chevron">&#9662;</span>' +
      '</a>' +
      '<ul class="submenu">' +
        '<li><a href="index.html">RFX モックアップ一覧</a></li>' +
        '<li><a href="eProcurement_RFX_ProjectList.html">調達案件一覧</a></li>' +
        '<li><a href="eProcurement_RFX_ProjectCreate_phase1.html">調達案件作成・設定</a></li>' +
        '<li><a href="eProcurement_RFX_ProjectDetail_phase1.html">案件詳細・進行状況</a></li>' +
        '<li><a href="eProcurement_RFX_RFICreate.html">RFI作成・送信</a></li>' +
        '<li><a href="eProcurement_RFX_RFPCreate_phase1.html">RFP作成・送信</a></li>' +
        '<li><a href="eProcurement_RFX_QA.html">Q&amp;A掲示板</a></li>' +
        '<li><a href="eProcurement_RFX_ScoreSheet_phase1.html">評価シート入力</a></li>' +
        '<li><a href="eProcurement_RFX_ScoreResult_phase1.html">評価結果・比較</a></li>' +
        '<li><a href="eProcurement_RFX_AwardRequest_phase1.html">Award確定申請</a></li>' +
        '<li><a href="eProcurement_RFX_AwardApproval.html">Award承認</a></li>' +
      '</ul>';
    ul.appendChild(li);
    // アコーディオン（実 bindSidebar は既存グループのみバインド済みのため、この新グループを個別に）
    var head = li.querySelector('a.menu-item');
    head.addEventListener('click', function (e) {
      e.preventDefault();
      if (!document.body.classList.contains('sidebar-open')) { window.location.href = 'index.html'; return; }
      var wasOpen = li.classList.contains('open');
      document.querySelectorAll('#wrapper-sidebar li.nav-group').forEach(function (o) { o.classList.remove('open'); });
      if (!wasOpen) li.classList.add('open');
    });
  }

  L.init = function () {
    realInit();
    fixParentLinks();
    injectRfxMenu();
    bindModals();
    bindSearch();
    if (L.bindDataNavToasts) L.bindDataNavToasts();
  };
})();
