/*
  datepicker.js — JienieDatepicker: thư viện chọn ngày (calendar popup) dùng chung cho các
  trang mockup J2. Tự chứa 100% (inject CSS, không CDN) để mockup chạy offline qua file://.
  COPY NGUYÊN VĂN từ projects/standard/mockup/buyer/assets/datepicker.js (bản gốc dùng chung).

  Giao diện mô phỏng datepicker của app J2 thật (vue datepicker):
    - Popup lịch dưới input, header điều hướng năm/tháng (select nhanh + nút ‹ ›)
    - Nhãn thứ tiếng Nhật 日月火水木金土 (chủ nhật đỏ, thứ bảy xanh)
    - Ngày hôm nay viền xanh, ngày đang chọn nền xanh #4169e1
    - Nút 今日 / クリア
    - Ghi giá trị format YYYY-MM-DD và bắn event input/change/blur
      (để logic validate/filter sẵn có của từng trang chạy như khi gõ tay)

  CÁCH DÙNG trong 1 trang mockup:
    <script src="assets/datepicker.js"></script>
    <script>
      JienieDatepicker.init('#dateFrom, #dateTo');          // theo selector
      // hoặc JienieDatepicker.attach(inputElement);        // theo element
    </script>
  Input vẫn cho phép gõ tay; mở lịch bằng click/focus vào input hoặc icon 📅.
*/
(function (global) {
  'use strict';

  var CSS = [
    'input.jdp-bound { background-image: url("data:image/svg+xml;charset=utf8,%3Csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27%234169e1%27%3E%3Cpath d=%27M19 4h-1V2h-2v2H8V2H6v2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z%27/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 8px center; background-size: 16px 16px; padding-right: 30px !important; }',
    '.jdp-pop { position: absolute; z-index: 3000; background: #fff; border: 1px solid #c9d4f2; border-radius: 6px; box-shadow: 0 6px 18px rgba(0,0,0,.25); width: 268px; font-family: Meiryo, "Helvetica Neue", Helvetica, Arial, sans-serif; font-size: 13px; color: #111; user-select: none; }',
    '.jdp-head { display: flex; align-items: center; justify-content: space-between; gap: 4px; padding: 8px 10px; border-bottom: 1px solid #eef1f7; }',
    '.jdp-head button { background: #fff; border: 1px solid #c9d4f2; color: #4169e1; border-radius: 4px; cursor: pointer; font-size: 13px; padding: 2px 8px; line-height: 1.4; }',
    '.jdp-head button:hover { background: #4169e1; color: #fff; }',
    '.jdp-head select { border: 1px solid #ccc; border-radius: 4px; padding: 2px 4px; font-size: 13px; background: #fff; cursor: pointer; }',
    '.jdp-grid { width: 100%; border-collapse: collapse; }',
    '.jdp-grid th { padding: 6px 0 4px; text-align: center; font-weight: bold; font-size: 12px; color: #555; }',
    '.jdp-grid th.jdp-sun { color: #d9534f; } .jdp-grid th.jdp-sat { color: #0074c1; }',
    '.jdp-grid td { text-align: center; padding: 1px; }',
    '.jdp-day { display: inline-flex; align-items: center; justify-content: center; width: 32px; height: 30px; border-radius: 4px; cursor: pointer; border: 1px solid transparent; }',
    '.jdp-day:hover { background: #edf1f6; }',
    '.jdp-day.jdp-other { color: #bbb; }',
    '.jdp-day.jdp-sun { color: #d9534f; } .jdp-day.jdp-sat { color: #0074c1; }',
    '.jdp-day.jdp-today { border-color: #4169e1; font-weight: bold; }',
    '.jdp-day.jdp-selected { background: #4169e1 !important; color: #fff !important; font-weight: bold; }',
    '.jdp-foot { display: flex; justify-content: space-between; padding: 6px 10px 8px; border-top: 1px solid #eef1f7; }',
    '.jdp-foot button { background: none; border: none; color: #4169e1; cursor: pointer; font-size: 12px; font-weight: bold; padding: 2px 6px; }',
    '.jdp-foot button:hover { text-decoration: underline; }'
  ].join('\n');

  var WEEK = ['日', '月', '火', '水', '木', '金', '土'];
  var pop = null;
  var currentInput = null;
  var viewY = 0, viewM = 0; // năm/tháng đang hiển thị (M: 0-11)

  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(y, m, d) { return y + '-' + pad(m + 1) + '-' + pad(d); }
  function todayStr() { var t = new Date(); return fmt(t.getFullYear(), t.getMonth(), t.getDate()); }
  function parse(v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec((v || '').trim());
    if (!m) return null;
    return { y: +m[1], m: +m[2] - 1, d: +m[3] };
  }

  function injectCss() {
    if (document.getElementById('jdp-style')) return;
    var st = document.createElement('style');
    st.id = 'jdp-style';
    st.textContent = CSS;
    document.head.appendChild(st);
  }

  function buildPop() {
    if (pop) return;
    pop = document.createElement('div');
    pop.className = 'jdp-pop';
    pop.style.display = 'none';
    pop.innerHTML =
      '<div class="jdp-head">' +
      '<button type="button" class="jdp-prev" title="前月">‹</button>' +
      '<span><select class="jdp-year"></select>　<select class="jdp-month"></select></span>' +
      '<button type="button" class="jdp-next" title="翌月">›</button>' +
      '</div>' +
      '<table class="jdp-grid"><thead><tr>' +
      WEEK.map(function (w, i) {
        return '<th class="' + (i === 0 ? 'jdp-sun' : (i === 6 ? 'jdp-sat' : '')) + '">' + w + '</th>';
      }).join('') +
      '</tr></thead><tbody class="jdp-body"></tbody></table>' +
      '<div class="jdp-foot">' +
      '<button type="button" class="jdp-today-btn">今日</button>' +
      '<button type="button" class="jdp-clear-btn">クリア</button>' +
      '</div>';
    document.body.appendChild(pop);

    // Year/Month selects
    var ySel = pop.querySelector('.jdp-year');
    var now = new Date().getFullYear();
    for (var y = now - 5; y <= now + 5; y++) {
      var op = document.createElement('option');
      op.value = y; op.textContent = y + '年';
      ySel.appendChild(op);
    }
    var mSel = pop.querySelector('.jdp-month');
    for (var m = 0; m < 12; m++) {
      var om = document.createElement('option');
      om.value = m; om.textContent = (m + 1) + '月';
      mSel.appendChild(om);
    }
    ySel.addEventListener('change', function () { viewY = +ySel.value; render(); });
    mSel.addEventListener('change', function () { viewM = +mSel.value; render(); });
    pop.querySelector('.jdp-prev').addEventListener('click', function () {
      viewM--; if (viewM < 0) { viewM = 11; viewY--; } render();
    });
    pop.querySelector('.jdp-next').addEventListener('click', function () {
      viewM++; if (viewM > 11) { viewM = 0; viewY++; } render();
    });
    pop.querySelector('.jdp-today-btn').addEventListener('click', function () {
      pick(todayStr());
    });
    pop.querySelector('.jdp-clear-btn').addEventListener('click', function () {
      pick('');
    });
    // Không đóng popup khi thao tác bên trong
    pop.addEventListener('mousedown', function (e) { e.stopPropagation(); });

    document.addEventListener('mousedown', function () { hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hide(); });
  }

  function render() {
    pop.querySelector('.jdp-year').value = viewY;
    pop.querySelector('.jdp-month').value = viewM;
    var body = pop.querySelector('.jdp-body');
    body.innerHTML = '';
    var selected = currentInput ? (currentInput.value || '').trim() : '';
    var tStr = todayStr();
    var first = new Date(viewY, viewM, 1);
    var startDow = first.getDay();
    var cursor = new Date(viewY, viewM, 1 - startDow); // bắt đầu từ chủ nhật của tuần chứa ngày 1
    for (var w = 0; w < 6; w++) {
      var tr = document.createElement('tr');
      for (var i = 0; i < 7; i++) {
        var td = document.createElement('td');
        var y = cursor.getFullYear(), mo = cursor.getMonth(), d = cursor.getDate();
        var ds = fmt(y, mo, d);
        var cls = 'jdp-day';
        if (mo !== viewM) cls += ' jdp-other';
        if (i === 0) cls += ' jdp-sun';
        if (i === 6) cls += ' jdp-sat';
        if (ds === tStr) cls += ' jdp-today';
        if (selected && ds === selected) cls += ' jdp-selected';
        td.innerHTML = '<span class="' + cls + '" data-date="' + ds + '">' + d + '</span>';
        td.querySelector('.jdp-day').addEventListener('click', function () {
          pick(this.getAttribute('data-date'));
        });
        tr.appendChild(td);
        cursor.setDate(cursor.getDate() + 1);
      }
      body.appendChild(tr);
    }
  }

  function pick(dateStr) {
    if (!currentInput) return;
    currentInput.value = dateStr;
    // Bắn event để logic validate/filter sẵn có của trang chạy như khi gõ tay
    ['input', 'change', 'blur'].forEach(function (type) {
      var ev = new Event(type, { bubbles: true });
      currentInput.dispatchEvent(ev);
    });
    hide();
  }

  function showFor(input) {
    if (input.disabled || input.readOnly) return;
    buildPop();
    currentInput = input;
    var p = parse(input.value) || parse(todayStr());
    viewY = p.y; viewM = p.m;
    // Bổ sung năm vào select nếu ngoài khoảng mặc định
    var ySel = pop.querySelector('.jdp-year');
    if (!ySel.querySelector('option[value="' + viewY + '"]')) {
      var op = document.createElement('option');
      op.value = viewY; op.textContent = viewY + '年';
      ySel.appendChild(op);
    }
    render();
    // Định vị dưới input (nếu sát đáy viewport thì hiện phía trên)
    var r = input.getBoundingClientRect();
    pop.style.display = 'block';
    var popH = pop.offsetHeight || 300;
    var top = r.bottom + window.scrollY + 4;
    if (r.bottom + popH + 8 > window.innerHeight && r.top - popH - 8 > 0) {
      top = r.top + window.scrollY - popH - 4;
    }
    pop.style.top = top + 'px';
    pop.style.left = Math.max(8, Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - 280)) + 'px';
  }

  function hide() {
    if (pop) pop.style.display = 'none';
    currentInput = null;
  }

  function attach(input) {
    if (!input || input.dataset.jdpBound) return;
    input.dataset.jdpBound = '1';
    injectCss();
    input.classList.add('jdp-bound');
    if (!input.getAttribute('placeholder')) input.setAttribute('placeholder', 'YYYY-MM-DD');
    input.setAttribute('autocomplete', 'off');
    input.addEventListener('mousedown', function (e) {
      // click vào input đang focus cũng mở lại lịch
      setTimeout(function () { showFor(input); }, 0);
      e.stopPropagation();
    });
    input.addEventListener('focus', function () { showFor(input); });
  }

  function init(selector) {
    document.querySelectorAll(selector).forEach(attach);
  }

  global.JienieDatepicker = { attach: attach, init: init };
})(window);
