/* ============================================================
   J2 共通 datepicker — RFX機能モックアップ用共有アセット
   JienieDatepicker.init('<selector>') で対象 input にカレンダーを付与。
   ・input は readonly にしない。picker は YYYY-MM-DD を書き込み、
     input/change/blur イベントを発火するので既存 validate/filter が動く。
   ・📅 アイコンを input に自動付与。CDN 不使用・オフライン動作。
   ============================================================ */
window.JienieDatepicker = (function () {
  let pop = null, targetInput = null, viewY = 0, viewM = 0;

  function ensurePop() {
    if (pop) return pop;
    pop = document.createElement('div');
    pop.style.cssText = 'position:absolute;z-index:5000;background:#fff;border:1px solid #c4ccd8;border-radius:8px;box-shadow:0 8px 24px rgba(0,0,0,.18);padding:10px;width:250px;font-size:.8rem;display:none;font-family:Meiryo,sans-serif;';
    document.body.appendChild(pop);
    document.addEventListener('click', (e) => {
      if (pop.style.display === 'block' && !pop.contains(e.target) && e.target !== targetInput && !(targetInput && targetInput.parentNode && targetInput.parentNode.contains(e.target))) {
        pop.style.display = 'none';
      }
    });
    return pop;
  }

  function render() {
    const first = new Date(viewY, viewM, 1);
    const startDow = first.getDay();
    const days = new Date(viewY, viewM + 1, 0).getDate();
    let html = `<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px;">
      <button data-nav-cal="-1" style="border:none;background:#eef1f7;border-radius:4px;cursor:pointer;padding:3px 9px;">‹</button>
      <b>${viewY}年 ${viewM + 1}月</b>
      <button data-nav-cal="1" style="border:none;background:#eef1f7;border-radius:4px;cursor:pointer;padding:3px 9px;">›</button>
    </div><table style="width:100%;border-collapse:collapse;text-align:center;">
      <tr style="color:#888;">${['日','月','火','水','木','金','土'].map(d => `<th style="padding:3px;font-weight:normal;">${d}</th>`).join('')}</tr><tr>`;
    let cell = 0;
    for (let i = 0; i < startDow; i++) { html += '<td></td>'; cell++; }
    for (let d = 1; d <= days; d++) {
      if (cell % 7 === 0 && cell !== 0) html += '</tr><tr>';
      html += `<td data-day="${d}" style="padding:5px;cursor:pointer;border-radius:4px;">${d}</td>`;
      cell++;
    }
    html += '</tr></table>';
    pop.innerHTML = html;
    pop.querySelectorAll('[data-nav-cal]').forEach(b => b.addEventListener('click', (e) => {
      e.stopPropagation();
      viewM += parseInt(b.getAttribute('data-nav-cal'), 10);
      if (viewM < 0) { viewM = 11; viewY--; } else if (viewM > 11) { viewM = 0; viewY++; }
      render();
    }));
    pop.querySelectorAll('[data-day]').forEach(td => {
      td.addEventListener('mouseenter', () => td.style.background = '#eef1f7');
      td.addEventListener('mouseleave', () => td.style.background = '');
      td.addEventListener('click', (e) => {
        e.stopPropagation();
        const d = parseInt(td.getAttribute('data-day'), 10);
        const val = `${viewY}-${String(viewM + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        targetInput.value = val;
        ['input', 'change', 'blur'].forEach(ev => targetInput.dispatchEvent(new Event(ev, { bubbles: true })));
        pop.style.display = 'none';
      });
    });
  }

  function openFor(input) {
    targetInput = input;
    ensurePop();
    const base = input.value && /^\d{4}-\d{2}-\d{2}$/.test(input.value) ? new Date(input.value) : new Date();
    viewY = base.getFullYear(); viewM = base.getMonth();
    render();
    const r = input.getBoundingClientRect();
    pop.style.left = (window.scrollX + r.left) + 'px';
    pop.style.top = (window.scrollY + r.bottom + 4) + 'px';
    pop.style.display = 'block';
  }

  function init(selector) {
    document.querySelectorAll(selector).forEach(input => {
      if (input.dataset.dpBound) return;
      input.dataset.dpBound = '1';
      input.style.backgroundImage = 'none';
      // 📅 アイコンを付与（wrapper 化）
      const wrap = document.createElement('span');
      wrap.style.cssText = 'position:relative;display:inline-block;';
      input.parentNode.insertBefore(wrap, input);
      wrap.appendChild(input);
      const ico = document.createElement('span');
      ico.textContent = '📅';
      ico.style.cssText = 'position:absolute;right:8px;top:50%;transform:translateY(-50%);cursor:pointer;pointer-events:none;font-size:.9rem;';
      wrap.appendChild(ico);
      input.addEventListener('focus', () => openFor(input));
      input.addEventListener('click', () => openFor(input));
    });
  }

  return { init };
})();
