/* ============================================================
   JienieTour — RFX機能モックアップ用 汎用ガイドツアー（自動生成型）
   ------------------------------------------------------------
   ・各画面の見出し（.section > .section-head / .form-section > .form-section-header）から
     ツアーのステップを自動生成し、ハイライト＋吹き出しで案内する。
   ・ページに専用ツアー（#btnTour）が既にある場合は何もしない。
   ・フローティングの「🧭 ガイドツアー」ボタンを左下に追加。初回アクセス時（セッション単位）は自動起動。
   ・依存なし（vanilla JS）。共通アセットとして各RFX画面から読み込む。
   参照: phase_scope.md「画面ガイド機能（WalkMe類似）」= Phase 2 候補。本実装はモックアップ上の
        プレビュー（プロトタイプ）であり、Phase 1 の機能スコープには含めない。
   ============================================================ */
(function () {
  function ready(fn) {
    if (document.readyState !== 'loading') fn();
    else document.addEventListener('DOMContentLoaded', fn);
  }

  ready(function () {
    if (window.__j2TourInit) return;
    if (document.getElementById('btnTour') || document.getElementById('j2TourBtn')) return;

    var root = document.getElementById('wrapper-content') || document.body;

    function clean(headEl) {
      var c = headEl.cloneNode(true);
      c.querySelectorAll('.sec-actions, .role-note, button, a, .badge-p2, .badge-new, .badge-wip, .status-badge, .new-badge, .phase-tag').forEach(function (x) { x.remove(); });
      return c.textContent.trim().replace(/\s+/g, ' ');
    }
    function hintText(container) {
      var h = container.querySelector('.section-body .muted, .form-section-body .note, .section-body p, .form-section-body p, .section-body .alert, .form-section-body .info-banner');
      if (!h) return '';
      return h.textContent.trim().replace(/\s+/g, ' ');
    }

    var steps = [];
    var titleEl = root.querySelector('.page-title-row') || root.querySelector('.page-title');
    if (titleEl) {
      var introEl = root.querySelector('.page-content .alert, .info-banner, .page-desc');
      var intro = introEl ? introEl.textContent.trim().replace(/\s+/g, ' ') : 'この画面の主な操作をご案内します。';
      if (intro.length > 170) intro = intro.slice(0, 167) + '…';
      steps.push({ el: titleEl, title: 'この画面について', body: intro });
    }

    root.querySelectorAll('.section, .form-section').forEach(function (sec) {
      var head = sec.querySelector('.section-head, .form-section-header');
      if (!head) return;
      var t = clean(head);
      if (!t) return;
      var body = hintText(sec) || ('「' + t + '」の入力・確認を行うエリアです。');
      if (body.length > 170) body = body.slice(0, 167) + '…';
      steps.push({ el: sec, title: t, body: body });
    });

    var act = root.querySelector('.form-foot .btn-primary, .footer-bar .btn-primary, .form-actions .btn-primary, #btnSave, button[type="submit"].btn-primary, .action-bar');
    if (act) {
      var actEl = act.closest('.form-foot, .footer-bar, .form-actions, .action-bar') || act;
      steps.push({ el: actEl, title: '主な操作', body: '送信・保存・確定などの主要な操作はここから実行します。実行前に内容をご確認ください。' });
    }

    if (steps.length < 2) return;
    window.__j2TourInit = true;

    var css = ''
      + '.j2tour-btn{position:fixed;left:20px;bottom:20px;z-index:4000;display:inline-flex;align-items:center;gap:6px;'
      + 'padding:9px 15px;border-radius:24px;border:1px solid #cbd5e1;background:#fff;color:#345bd4;font-weight:bold;'
      + 'font-size:.82rem;cursor:pointer;box-shadow:0 4px 14px rgba(15,23,42,.18);font-family:inherit;}'
      + '.j2tour-btn:hover{background:#eef3ff;}'
      + '#j2tourMask{position:fixed;inset:0;z-index:4998;display:none;}#j2tourMask.show{display:block;}'
      + '#j2tourSpot{position:fixed;border-radius:8px;box-shadow:0 0 0 9999px rgba(15,23,42,.62);z-index:4999;'
      + 'pointer-events:none;display:none;transition:top .25s,left .25s,width .25s,height .25s;}#j2tourSpot.show{display:block;}'
      + '#j2tourPop{position:fixed;z-index:5001;width:332px;max-width:calc(100vw - 32px);background:#fff;border-radius:12px;'
      + 'box-shadow:0 16px 44px rgba(0,0,0,.34);padding:16px 18px;display:none;font-family:inherit;}#j2tourPop.show{display:block;}'
      + '#j2tourPop .tp-step{font-size:.72rem;font-weight:bold;color:#345bd4;letter-spacing:.05em;}'
      + '#j2tourPop .tp-title{font-size:1.02rem;font-weight:bold;margin:4px 0 7px;color:#1e293b;}'
      + '#j2tourPop .tp-body{font-size:.84rem;color:#444;line-height:1.65;}'
      + '#j2tourPop .tp-foot{display:flex;align-items:center;gap:8px;margin-top:15px;}'
      + '#j2tourPop .tp-skip{margin-right:auto;background:none;border:none;color:#888;cursor:pointer;font-size:.8rem;text-decoration:underline;padding:0;}'
      + '#j2tourPop .tp-btn{padding:7px 15px;border-radius:7px;font-size:.82rem;font-weight:bold;cursor:pointer;border:1px solid transparent;}'
      + '#j2tourPop .tp-btn.ghost{background:#fff;color:#345bd4;border-color:#cbd5e1;}'
      + '#j2tourPop .tp-btn.solid{background:#345bd4;color:#fff;}'
      + '#j2tourPop .tp-btn.solid:hover{background:#28489f;}';
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

    var btn = document.createElement('button');
    btn.id = 'j2TourBtn'; btn.type = 'button'; btn.className = 'j2tour-btn'; btn.textContent = '🧭 ガイドツアー';
    document.body.appendChild(btn);

    var mask = document.createElement('div'); mask.id = 'j2tourMask';
    var spot = document.createElement('div'); spot.id = 'j2tourSpot';
    var pop = document.createElement('div'); pop.id = 'j2tourPop';
    pop.innerHTML = '<div class="tp-step" id="j2tpStep"></div><div class="tp-title" id="j2tpTitle"></div>'
      + '<div class="tp-body" id="j2tpBody"></div><div class="tp-foot">'
      + '<button type="button" class="tp-skip" id="j2tpSkip">スキップ</button>'
      + '<button type="button" class="tp-btn ghost" id="j2tpPrev">戻る</button>'
      + '<button type="button" class="tp-btn solid" id="j2tpNext">次へ</button></div>';
    document.body.appendChild(mask);
    document.body.appendChild(spot);
    document.body.appendChild(pop);

    var i = 0;
    function clamp(v, a, b) { return Math.min(Math.max(v, a), b); }
    function place() {
      var s = steps[i];
      var y = window.scrollY + s.el.getBoundingClientRect().top - 90;
      window.scrollTo({ top: Math.max(0, y), behavior: 'smooth' });
      setTimeout(function () {
        var r = s.el.getBoundingClientRect(), pad = 6;
        spot.style.top = (r.top - pad) + 'px';
        spot.style.left = (r.left - pad) + 'px';
        spot.style.width = (r.width + pad * 2) + 'px';
        spot.style.height = (r.height + pad * 2) + 'px';
        document.getElementById('j2tpStep').textContent = 'STEP ' + (i + 1) + ' / ' + steps.length;
        document.getElementById('j2tpTitle').textContent = s.title;
        document.getElementById('j2tpBody').textContent = s.body;
        document.getElementById('j2tpPrev').style.visibility = i === 0 ? 'hidden' : 'visible';
        document.getElementById('j2tpNext').textContent = (i === steps.length - 1) ? '完了' : '次へ';
        pop.classList.add('show');
        var pw = pop.offsetWidth, ph = pop.offsetHeight, vw = window.innerWidth, vh = window.innerHeight, gap = 12, top, left;
        if (r.bottom + gap + ph <= vh - 8) { top = r.bottom + gap; left = clamp(r.left, 8, vw - pw - 8); }
        else if (r.top - gap - ph >= 8) { top = r.top - gap - ph; left = clamp(r.left, 8, vw - pw - 8); }
        else if (r.right + gap + pw <= vw - 8) { left = r.right + gap; top = clamp(r.top, 8, vh - ph - 8); }
        else if (r.left - gap - pw >= 8) { left = r.left - gap - pw; top = clamp(r.top, 8, vh - ph - 8); }
        else { left = vw - pw - 16; top = vh - ph - 16; }
        pop.style.top = top + 'px';
        pop.style.left = left + 'px';
      }, 300);
    }
    function start() { i = 0; mask.classList.add('show'); spot.classList.add('show'); place(); }
    function end() { mask.classList.remove('show'); spot.classList.remove('show'); pop.classList.remove('show'); try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
    function next() { if (i < steps.length - 1) { i++; place(); } else { end(); } }
    function prev() { if (i > 0) { i--; place(); } }

    btn.addEventListener('click', start);
    document.getElementById('j2tpNext').addEventListener('click', next);
    document.getElementById('j2tpPrev').addEventListener('click', prev);
    document.getElementById('j2tpSkip').addEventListener('click', end);
    mask.addEventListener('click', end);
    document.addEventListener('keydown', function (e) {
      if (!mask.classList.contains('show')) return;
      if (e.key === 'Escape') end();
      else if (e.key === 'ArrowRight' || e.key === 'Enter') next();
      else if (e.key === 'ArrowLeft') prev();
    });
    window.addEventListener('resize', function () { if (mask.classList.contains('show')) place(); });

    var KEY = 'j2tour_seen_' + location.pathname.split('/').pop();
    try { if (sessionStorage.getItem(KEY) !== '1') setTimeout(start, 650); } catch (e) {}
  });
})();
