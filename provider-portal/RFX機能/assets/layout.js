/* ============================================================
   J2 共通レイアウト JS — RFX機能モックアップ用共有アセット
   header / sidebar / toast / back-to-top を描画。
   ★ 2026-07 更新: staging（https://demo.staging.jienie.com/eProcurement/Home）の
     実 header/sidebar に合わせて再構成。buyer-portal と同一内容（NAVはportalで分岐）。
   ============================================================ */
window.JienieLayout = (function () {
  var cfg = Object.assign({
    portal: 'buyer',
    company: 'ジーニーソリューションズ株式会社　本社 総務部',
    org: '本社 総務部',
    user: '依頼裕三',
    activeNav: 'rfx'
  }, window.J2_CONFIG || {});

  var NAV = {
    buyer: [
      { id:'purchase', ico:'📋', label:'購買取引案件照会',       href:'#' },
      { id:'contract', ico:'📄', label:'契約情報照会',           href:'#' },
      { id:'payment',  ico:'💴', label:'支払管理案件照会',       href:'#' },
      { id:'catalog',  ico:'🔍', label:'カタログ品購入',         href:'#' },
      { id:'docreg',   ico:'📑', label:'契約書・請求書情報登録', href:'#' },
      { id:'closing',  ico:'📅', label:'締め処理管理',           href:'#' },
      { id:'monthly',  ico:'📥', label:'月次明細管理',           href:'#' },
      { id:'download', ico:'⬇️', label:'ダウンロードセンター',   href:'#' },
      { id:'handover', ico:'👥', label:'案件引継ぎ',             href:'#' },
      { id:'rfx',      ico:'📊', label:'調達ソーシング(RFX)',    href:'eProcurement_RFX_ProjectList.html', isNew:true }
    ],
    supplier: [
      { id:'deal',     ico:'📋', label:'取引状況照会',   href:'#' },
      { id:'estimate', ico:'💬', label:'見積回答',       href:'#' },
      { id:'invoice',  ico:'💴', label:'請求管理',       href:'#' },
      { id:'company',  ico:'🏢', label:'自社情報管理',   href:'#' },
      { id:'rfx',      ico:'📊', label:'調達案件(RFX)',  href:'eProcurement_RFX_Supplier_ProjectList.html', isNew:true }
    ],
    provider: [
      { id:'master',   ico:'🗂️', label:'マスタ管理',   href:'#' },
      { id:'mail',     ico:'✉️', label:'メール設定',   href:'#' },
      { id:'schedule', ico:'⏱️', label:'ジョブ管理',   href:'#' },
      { id:'log',      ico:'📜', label:'監査ログ',     href:'#' },
      { id:'rfx',      ico:'📊', label:'RFX設定',      href:'eProcurement_RFX_ProviderSettings.html', isNew:true }
    ]
  };

  function h(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }

  function renderHeader() {
    var acts = '';
    if (cfg.portal === 'buyer') {
      acts += '<a class="hdr-act" data-nav="カート（/CatalogMall/Cart）"><span class="ic">🛒</span><span class="hdr-badge">0</span><span>カート ¥0</span></a>';
      acts += '<a class="hdr-act" data-nav="比較表（/CatalogMall/ProductsCompare）"><span class="ic">🗂️</span><span class="hdr-badge">10</span><span>比較表</span></a>';
    }
    acts += '<a class="hdr-act" data-nav="お知らせ一覧"><span class="ic">🔔</span><span class="hdr-badge">3</span><span>お知らせ</span></a>';
    acts += '<a class="hdr-act" data-nav="ヘルプ（HelpDeskList）"><span class="ic">❓</span><span>ヘルプ</span></a>';

    h('layout-header',
      '<a class="hdr-logo" data-nav="トップページ"><span class="lg-j2">J2</span><span class="lg-name">Jienie</span><span class="lg-ver">2.0</span></a>' +
      '<a class="hdr-home" data-nav="トップページ（/eProcurement/Home）"><span>🏠</span><span>トップページ</span></a>' +
      '<div class="hdr-spacer"></div>' +
      '<div class="hdr-actions">' + acts + '</div>' +
      '<div class="hdr-user" data-nav="ユーザーメニュー"><span class="avatar">👤</span>' +
        '<div><div class="u-org">' + (cfg.org || '') + '</div><div class="u-name">' + cfg.user + '</div></div></div>' +
      '<span class="hdr-gear" data-nav="設定メニュー">⚙</span>');
  }

  function renderSidebar() {
    var items = '<button class="sb-toggle" id="sbToggle" title="メニュー">☰</button>';
    items += (NAV[cfg.portal] || NAV.buyer).map(function (n) {
      var isLink = n.href && n.href !== '#';
      return '<a class="sb-item ' + (n.id === cfg.activeNav ? 'active' : '') + '" href="' + n.href + '" ' +
        (isLink ? '' : 'data-nav="' + n.label + '（未実装メニュー）"') + '>' +
        '<span class="sb-ico">' + n.ico + '</span>' +
        '<span class="sb-txt">' + n.label + (n.isNew ? ' <span class="sb-new">NEW</span>' : '') + '</span>' +
        '<span class="sb-caret">▼</span></a>';
    }).join('');
    h('layout-sidebar', items);

    if (!document.getElementById('sbBackdrop')) {
      var bd = document.createElement('div'); bd.id = 'sbBackdrop';
      document.body.appendChild(bd);
      bd.addEventListener('click', collapseSidebar);
    }
    var tgl = document.getElementById('sbToggle');
    if (tgl) tgl.addEventListener('click', toggleSidebar);
  }

  function toggleSidebar() {
    var sb = document.getElementById('layout-sidebar');
    var bd = document.getElementById('sbBackdrop');
    var tgl = document.getElementById('sbToggle');
    var open = sb.classList.toggle('expanded');
    if (bd) bd.classList.toggle('show', open);
    if (tgl) tgl.textContent = open ? '✕' : '☰';
  }
  function collapseSidebar() {
    var sb = document.getElementById('layout-sidebar');
    var bd = document.getElementById('sbBackdrop');
    var tgl = document.getElementById('sbToggle');
    sb.classList.remove('expanded');
    if (bd) bd.classList.remove('show');
    if (tgl) tgl.textContent = '☰';
  }

  function renderFab() {
    h('layout-fab', '<button class="fab-top" title="トップへ戻る">↑</button>');
    var b = document.querySelector('#layout-fab .fab-top');
    if (b) b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  var toastTimer = null;
  function toast(msg) {
    var t = document.getElementById('mockToast');
    if (!t) return;
    t.textContent = msg; t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function bindNav() {
    document.querySelectorAll('[data-nav]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        var href = el.getAttribute('href');
        if (href && href !== '#') return;
        e.preventDefault();
        toast('実際の画面では「' + el.getAttribute('data-nav') + '」へ遷移します');
      });
    });
  }

  function openModal(id) { var m = document.getElementById(id); if (m) m.classList.add('open'); }
  function closeModal(id) { var m = document.getElementById(id); if (m) m.classList.remove('open'); }
  function bindModals() {
    document.querySelectorAll('.modal-overlay').forEach(function (ov) {
      ov.addEventListener('click', function (e) { if (e.target === ov) ov.classList.remove('open'); });
      ov.querySelectorAll('[data-close]').forEach(function (btn) { btn.addEventListener('click', function () { ov.classList.remove('open'); }); });
    });
    document.querySelectorAll('[data-open-modal]').forEach(function (btn) {
      btn.addEventListener('click', function () { openModal(btn.getAttribute('data-open-modal')); });
    });
  }

  function bindSearch() {
    document.querySelectorAll('.toggle-detail').forEach(function (t) {
      t.addEventListener('click', function () {
        t.classList.toggle('open');
        var tgt = document.querySelector(t.getAttribute('data-target'));
        if (tgt) tgt.classList.toggle('open');
        var cap = t.querySelector('.cap');
        if (cap) cap.textContent = t.classList.contains('open') ? '詳細条件を省略' : '詳細条件を追加';
      });
    });
    document.querySelectorAll('.couple-btn').forEach(function (cb) {
      cb.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          cb.querySelectorAll('button').forEach(function (x) { x.classList.remove('active'); });
          b.classList.add('active');
        });
      });
    });
  }

  function init() {
    renderHeader();
    renderSidebar();
    renderFab();
    bindNav();
    bindModals();
    bindSearch();
  }

  return { init: init, toast: toast, openModal: openModal, closeModal: closeModal };
})();
