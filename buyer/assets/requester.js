/*
  requester.js — JS dung chung cho cac trang danh sach 購買取引案件照会.
  Goi JienieRequester.init() SAU JienieLayout.init().
  Cac hanh vi mo phong: and/or, mo/dong 詳細条件, sort order, mo/dong 明細 tung case,
  全ての明細を開く/閉じる, submit form -> toast.
*/
(function (global) {
  function init() {
    var toast = (global.JienieLayout && global.JienieLayout.toast) || function () {};

    // ---- and/or couple button ----
    document.querySelectorAll('.couple-btn button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    // ---- Toggle 詳細条件 (mac dinh dong, giong queries.isOpenCollapse:false that) ----
    var searchToggle = document.getElementById('searchCollapseToggle');
    var searchOptions = document.getElementById('searchOptions');
    if (searchToggle && searchOptions) {
      searchToggle.addEventListener('click', function () {
        var open = searchOptions.classList.toggle('show');
        searchToggle.classList.toggle('open', open);
        var t = searchToggle.querySelector('.toggle-text');
        if (t) t.textContent = open ? '詳細条件を省略' : '詳細条件を追加';
      });
    }

    // ---- Sort order toggle ----
    document.querySelectorAll('.sort-order-btn button').forEach(function (btn) {
      btn.addEventListener('click', function () {
        btn.parentElement.querySelectorAll('button').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
      });
    });

    // ---- Toggle tung案件 (giong toggleDetail() that) ----
    function setToggleState(btn, isOpen) {
      var card = btn.closest('.anken-card');
      var detail = card.querySelector('.anken-detail');
      if (detail) { detail.style.display = isOpen ? 'block' : 'none'; }
      btn.classList.toggle('is-open', isOpen);
      var arrow = btn.querySelector('.toggle-arrow');
      var label = btn.querySelector('.toggle-label');
      if (arrow) arrow.textContent = isOpen ? '∧' : '∨';
      if (label) label.textContent = isOpen ? '明細を閉じる' : '明細を開く';
      // Bar luon nam cuoi card khi mo (giong ItemSkeleton co 2 collapse-line)
      var line = btn.closest('.collapse-line');
      if (isOpen && detail && line) { card.appendChild(line); }
    }
    document.querySelectorAll('.anken-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        setToggleState(btn, !btn.classList.contains('is-open'));
      });
    });

    // ---- 全ての明細を開く/閉じる (giong collapseItems() that, cac nut dong bo) ----
    var collapseAllBtns = document.querySelectorAll('.btn-collapse-all');
    var allOpen = false;
    collapseAllBtns.forEach(function (cBtn) {
      cBtn.addEventListener('click', function () {
        allOpen = !allOpen;
        document.querySelectorAll('.anken-toggle').forEach(function (btn) { setToggleState(btn, allOpen); });
        collapseAllBtns.forEach(function (b) {
          b.innerHTML = allOpen ? '<span class="ico">▲</span>　全ての明細を閉じる' : '<span class="ico">▼</span>　全ての明細を開く';
        });
      });
    });

    // ---- すべてチェック (tab 検収) ----
    var checkAll = document.getElementById('checkAllAnken');
    if (checkAll) {
      checkAll.addEventListener('change', function () {
        document.querySelectorAll('.anken-check').forEach(function (c) { c.checked = checkAll.checked; });
      });
    }

    // ---- Submit form -> toast ----
    var form = document.getElementById('searchForm');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        toast('実際の画面では検索条件で再取得した一覧が表示されます');
      });
    }
  }

  global.JienieRequester = { init: init };
})(window);
