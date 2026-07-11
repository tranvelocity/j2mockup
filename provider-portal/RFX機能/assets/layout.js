/* ============================================================
   J2 共通レイアウト JS — RFX機能モックアップ用共有アセット
   JienieLayout.init() で header / sidebar / fab / toast を描画。
   data-nav 属性の要素には自動で遷移トースト（実画面遷移の代替）を bind。
   ・PORTAL / ACTIVE_NAV は各ページの <script> で上書き可。
   ============================================================ */
window.JienieLayout = (function () {
  // ページ側で window.J2_CONFIG を定義して上書き可能
  const cfg = Object.assign({
    portal: 'buyer',          // buyer | supplier | provider
    company: 'ジーニーソリューションズ株式会社　本社 総務部',
    user: '依頼裕三',
    activeNav: 'rfx'
  }, window.J2_CONFIG || {});

  const NAV = {
    buyer: [
      { id: 'home',    ico: '🏠', label: 'ホーム',            href: '#' },
      { id: 'search',  ico: '🔍', label: '横串検索',          href: '#' },
      { id: 'catalog', ico: '📦', label: 'カタログ',          href: '#' },
      { id: 'order',   ico: '🧾', label: '発注管理',          href: '#' },
      { id: 'estimate',ico: '💬', label: '見積依頼',          href: '#' },
      { id: 'rfx',     ico: '📊', label: '調達ソーシング(RFX)', href: 'eProcurement_RFX_ProjectList.html' },
      { id: 'invoice', ico: '💴', label: '請求管理',          href: '#' },
      { id: 'master',  ico: '⚙️', label: 'マスタ管理',        href: '#' }
    ],
    supplier: [
      { id: 'home',    ico: '🏠', label: 'ホーム',        href: '#' },
      { id: 'deal',    ico: '🧾', label: '取引状況',      href: '#' },
      { id: 'estimate',ico: '💬', label: '見積回答',      href: '#' },
      { id: 'rfx',     ico: '📊', label: '調達案件(RFX)', href: 'eProcurement_RFX_Supplier_ProjectList.html' },
      { id: 'company', ico: '🏢', label: '自社情報管理',  href: '#' }
    ],
    provider: [
      { id: 'home',    ico: '🏠', label: 'ダッシュボード', href: '#' },
      { id: 'master',  ico: '🗂️', label: 'マスタ管理',     href: '#' },
      { id: 'rfx',     ico: '📊', label: 'RFX設定',        href: 'eProcurement_RFX_ProviderSettings.html' },
      { id: 'schedule',ico: '⏱️', label: 'ジョブ管理',     href: '#' },
      { id: 'log',     ico: '📜', label: '監査ログ',       href: '#' }
    ]
  };

  const PORTAL_LABEL = { buyer: 'Buyer Portal', supplier: 'Supplier Portal', provider: 'Provider Portal' };

  function h(id, html) { const el = document.getElementById(id); if (el) el.innerHTML = html; }

  function renderHeader() {
    h('layout-header', `
      <button class="hdr-burger" id="sbToggle" title="メニュー">☰</button>
      <div class="hdr-logo">Jienie<span>2.0</span><span class="badge-mall">${PORTAL_LABEL[cfg.portal]}</span></div>
      <div class="hdr-spacer"></div>
      <div class="hdr-user">
        <div style="text-align:right">
          <div class="hdr-company">${cfg.company}</div>
          <div class="hdr-name">${cfg.user} 様</div>
        </div>
        <span class="hdr-icon">${cfg.user ? cfg.user.charAt(0) : '👤'}</span>
      </div>`);
  }

  function renderSidebar() {
    const items = (NAV[cfg.portal] || NAV.buyer).map(n => `
      <a class="sb-item ${n.id === cfg.activeNav ? 'active' : ''}" href="${n.href}" ${n.href === '#' ? 'data-nav="' + n.label + '（未実装メニュー）"' : ''}>
        <span class="sb-ico">${n.ico}</span><span class="sb-txt">${n.label}</span>
      </a>`).join('');
    h('layout-sidebar', items);
    const sb = document.getElementById('layout-sidebar');
    const tgl = document.getElementById('sbToggle');
    if (tgl && sb) {
      tgl.addEventListener('click', () => {
        sb.classList.toggle('expanded');
        tgl.textContent = sb.classList.contains('expanded') ? '✕' : '☰';
      });
    }
  }

  function renderFab() {
    h('layout-fab', `<button class="fab-top" title="トップへ戻る">↑</button>`);
    const b = document.querySelector('#layout-fab .fab-top');
    if (b) b.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  let toastTimer = null;
  function toast(msg) {
    const t = document.getElementById('mockToast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
  }

  function bindNav() {
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        // href が実在（'#' 以外）ならそのまま遷移させる
        const href = el.getAttribute('href');
        if (href && href !== '#') return;
        e.preventDefault();
        toast(`実際の画面では「${el.getAttribute('data-nav')}」へ遷移します`);
      });
    });
  }

  // --- modal helpers ---
  function openModal(id) { const m = document.getElementById(id); if (m) m.classList.add('open'); }
  function closeModal(id) { const m = document.getElementById(id); if (m) m.classList.remove('open'); }
  function bindModals() {
    document.querySelectorAll('.modal-overlay').forEach(ov => {
      ov.addEventListener('click', e => { if (e.target === ov) ov.classList.remove('open'); });
      ov.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', () => ov.classList.remove('open')));
    });
    document.querySelectorAll('[data-open-modal]').forEach(btn => {
      btn.addEventListener('click', () => openModal(btn.getAttribute('data-open-modal')));
    });
  }

  // --- search box helpers ---
  function bindSearch() {
    document.querySelectorAll('.toggle-detail').forEach(t => {
      t.addEventListener('click', () => {
        t.classList.toggle('open');
        const tgt = document.querySelector(t.getAttribute('data-target'));
        if (tgt) tgt.classList.toggle('open');
        const cap = t.querySelector('.cap');
        if (cap) cap.textContent = t.classList.contains('open') ? '詳細条件を省略' : '詳細条件を追加';
      });
    });
    document.querySelectorAll('.couple-btn').forEach(cb => {
      cb.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
        cb.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      }));
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

  return { init, toast, openModal, closeModal };
})();
