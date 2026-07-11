/* ============================================================
   J2 RFX機能モックアップ（Supplier Portal）— 共通レイアウト JS（自己完結版）
   ------------------------------------------------------------
   実サイト対照済み supplier-portal/assets/layout.js の header/sidebar を内包し、
   RFX メニュー・モーダル/検索バインド・openModal/closeModal を追加。
   document.write / @import を使わず、パス問題を回避。
   ・親フォルダのページ（BHW_*, eProcurement_*）へのリンクは ../ 付き。
   ・RFX 画面（同フォルダ）へのリンクは相対のまま。
   ============================================================ */
(function (global) {
  var LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAASIAAABHCAYAAACj8ErrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTExRjJFODdGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTExRjJFODhGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTFGMkU4NUZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTFGMkU4NkZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDa8k4AAA36SURBVHja7F1pkBXVFT7DwCDIMsgiEEsHsriBDPxI0GBUNmMCOFFLCSkVSUzEDRMrBamEkqVIUAs1btlcY1RABBwniWLUKSQpIcQMsrkQQQSMQmTYmWGZnI8+b+hpX793u19v773zVX3S9px3+3af26fvPffcc0uampooIFQwN1K0KHE5X8ccQPHiAHMU8zVSKPIL5zDHMocyz2Z2YDYwtzJrmX9gvumhvLOYs5jDmO2Y7zHnMB9rfpHVEKkxUigElczZzIsNZB9h3sRszCL3ZeZKZqc0f5vMvCtMQ3Q9c0NID2sIc6ahIXqS+UQMCu0siuqmxkiRR8C7cq0H+QeYt2aRQQ/qAjn+lLlNDB6JEYOh2tw6pBtaKcYgDJR7kN0kDyIOfCDGB8aoRo2RogBxi3xw33b5+wCbEQK+zVwlQzN0XMqYE5jTWoVYSRiMpgBZn0Nd6gKuSzaie7taxtg7ZFxcI/+vUCQd+5i/YV7CPF2MyXwX2QkZyvmm7XibdFAOMV+xnT/2TrTWZx4KJsu/U+RBa89IkS/4I/N2+YCmgB7MUmZ7ab92fDVDWf1sx6sc5aVwJv7TSp97qMZIe0aKfMJ0snxEO1z+/mSac90zlNfTdrzHdrzTdtxNDZEaI4XCjmyz3vvSnNuTQb6N7fiA7fiIU1ANkRojhcIUlWnOvZ9B3j6139F23N4pE6aPaBezi8/fnuoYU+aK85mlISsJ5T/OHO1ijAD1GSnyFei0XJ3m/KsZfvOR7bjcxShtDdMQnZ7Db9cxdwdUj54uVjwMIG7qCuYCNUaKAsQPSBzLNuxlzs3wm7fo+KzaQLLi/jCrfJZN5t/H/ouAxoBY0RQMKlzKqpfrVNnOudWlril6LGd2ZpYxqzPIzZY69mdul3P7mUMD1IVSGSS/yNyVpi1PzfK705hHbfJXMXsxP7Oduxqy6iMKDpjGXCL+H/SMXlSfkaIAgHVmC+nzSzTWkizPyIAPHT2muXKui+3v83AQ5BIPDPNO8flbdNX+LMd95N+NaXxOGGdWMRfJObelHr3JitqMCmOYv5bjFcyRZM0SuA3TgDtlmNbfNkzDb85gbk5448Rzv4p5ndS/lTgtn2P+nnlQ399IfTffY15D1gJV6AZxOs+Iz7Ixx3e6mqzARueQ7GviRsmGrsx/ML/iOL9T3pOVQRuiXFDZPFYMxhDFgYnMh+UYvZ1hUmcTY4T1c2/YxtJBLo/pIL0tE4ySRpYJpfIVu9zl79DjCOb/1EaEjjJ5F77l8vflZEU3+1mVgHfrKTFydhyS9vyyxzaIBbKDyZoxg+/oIeaWZomEjEErA/YRxcWJtrqtZnY38Bmd5rjfyoDrVO7Bz1VuUN4Mg3Kq1a8SCe820MVcn2U/mKasI8zLwrgX9REFC6zPuVGO+8mQq3MWn1FJHt1fW+aPDeRGO2ZGFMEDU+A3G8hhCF3hsewZ0oOx47AM/xYa/B5t/lIZvRiF8KghisYYdRJjtC/P722gdLNNcL42hVCByZETQtDFbcypjnNHmd8XP255GpY62ghCWRbLsBFZKL6uhigZxmiIOA0P5/l9dfMg21WbQag4KQRdYJ3ZvS52AuvMdrqwv032Hkc7gaF6QA1RvMao0PCpB9nt2gRChZfn+4mh3PQA6lVpeE4NkcI3MNuxw1BWI8XDxXLDoT4WmC6NsF5b0pzLGo6ihkjhBRhazjKQe5r5H31coQIxZ3cayD1Ksp4rIkwjy6fkPJcRmhhN4RUI3MRawhsy9IRu0McUCX5JVtzddS5/h3P5Ng/lYeeOE3zUw56f/nnmuczLyJoRxmzxMjVEiqCBCFgEb86TFwDT9Mg7k4qsXpDmi6gIBxh2TRBdYGX8mTLKSUVWV4u+TPFmQPVaITSGGiKFX9RSfBsTKFriZfIW6Zw4qI9IoVDEDu0RKfKxzSKoslyGgFhHtTvB9UVmhR5yjCn3/QWmC0R4d5ZhInSxRw2RIgrAP9TWQO5pCiaW6GSylgsgRQriUfpSy1zIAKaxsRIcPo5qGTLmEjwKv9dIAzlMVS9I806hvljmchFZ2UbtQEwPpt5fYD5LLXM5e4WpI/qxgIx1L7k33NcgspaOOG0IDNF6slbc14gujmQtWRe9NrNMFn0GyRSq5Br1Bongkr7otd6wrFzvY7Asnj3kI0ndR8xJolM/1x5veJ1a229KmTcyt3io5w7mj5glPuvpJdlgrrqokUWvXrFRnkvrTNfQHpEFbImCaed++igSoYv7yZpK9gvkxbqPrDCC71J4uw6ngG2T50ovwQuw9OK3ZO2AOjaBwzb0gB4kayreL9Bresimi7XphNRZrUYoSTiPrFxOYwMq7wwZro0Jsc4Ypqz0YYTswDBuccJcJbivNTkaITuwHm2F25C32HtETiM0RcbvQWON2pisGCP+ljYBl9tWykXysL8FXDayDiJosF0AZSGZHKLWJxewLtrT8ZTIy9QQpTdCWC2PhaonhqAAALM8JaRIhyEhNfwUUO5zousglzv0Crie2OoZq9zXxaiLERHo4nnRxfZiN0RuRmioWOx2ahsiQ09pmCYNv5asvdkxfENK296isx9S5q2PUx8CpPK9NMHPAnl9fk6fT88aFTDDN89QF9goAtHb8PnsE13AiF1P2VOUIJwBS4XGNZ8pwlmz7pLGNYWJcn6obOsTNYp91myRQVnQyxVZ7vEvhvUaHOCsmRPvMGcyrxTezlzmsYwG5kkxzZotMSgL2wqNzlBGV+brhvUaWKypYrUnlCzAIVqVReao9GIWZJCpl3L+ZXDNn4RwH4idGU/WWi9kN5wvnCPDTtTNNF4ICfEviUEXo6VHkwmHxNf2YgYZbJqAWcD1BteclDooJkOkRih5mGEgg+x+rxjINRoamSpquf1xrsB1R4pvx22BKYIXb/ZQ5gUx6GKagQz2Mfu7gdx+8Xdlw5Wp965YDJEaoeShv/QWMgH7o830UOZScolTcThLhwd4H3eT2ar1J5jvGpY5IGJdYJufbOEH6PXd6aHMvzI3ZZFpJ73iojBEfozQVnlRukTAzUVqiMYZyCwi7/ujmfSevhHgfTxsKIch5rOGshUJ1MU88r6ObImBzLHE/q3VCKU1QheSlWEQX+zSCOrZswgN0eiAGrITJlPfAwO6B2yZvM2DvGm+nx4Foou1BjKVhW6IcjVC+NJppsFwgNXaZxvI7fTROzD5cPQN6D4+9ijvJX1uR/K5kt0jehk+410+dGGy7XufQjZEaoSSDdMeyeKE90AbPMp7MSylEemi0lAurMRrX0gZoiYfP4YV25Tghv5MQEYI05RIh3okwrrvocJHRczXh28UEfRRb3jZkEBd9In5+h0KvUcE3JejEcLurI3agQlNP3GijarhGHokoRJ2Q4RArDVZLOc9efaQd8m/c9QIJQonJqAOTaqGY+iYNEOE1bC1AYwlk4gSNUIKG47aPlLFjri3QW9wG5ql+1J0KUAFIAp3gwzd1AjF01ONC1tVBc3YF/P1N7oZomJBytikjFBNgRqhJKYeMd2LHWuW1oWoe4V5HNQw5gchXP9gsRsiJx4t0AbqxRkZVapS03gaJNLapE0zVJgal7IwdaGpYgsf5xjK7Y7QEL9N1krubBiu6gsdb5GZ435EmJVQQ1T4GGco906EdUJKDJMtiZG7ulxVGCqQQmW1gdw10kNVQ6TwDKSTqDKUrY24bosMZLAUZI6qMXQsMJDpxvyVGiKFVyBJ1/yAG2OQQP6egwZyE5i/oNyd7oiDm6nNIi0eNxwq38r8aQDX+xJZuY3UEBUwEDF8E1m7kZg6qiH7z4jruYP5iKEsDEi1NGAvwA4e2JECM6JwkN+izSMtsGPtnwxl75KP1qk+dIHe+UvM98jKM94MnTXLX8B3Yt9yGGt2KshazuI17mtqTPdwB1mb7nU1kB1FVprS1+RFgI9pvaNX1Yms7aIHyXMYIecU2fEzssJXTCKtLycrfe+rzIWiC4RZNDqG1VjviQXOw0QfrrpQQ5TfhuiOAMp5isySiYWBz8haVFztwZUwnFrOph2QF6A96fqxXPCJ9FJMk7fBdlwsTGG/DPE860KHZsWNVWRlJ4gTiGafksPv28nXV41Q7sC22bNy+H17v7rw2yM6JeAH0DsBSuhB8aenALZRNPE8a+RrtjcB94xcyIhlmU26CWXcwMTA4YB626EbojcKUAG/S0g9MKauC/kaSDg2npK18BNOUKQWRYT7yWoPYsU0soJO8U50i+KCOjQrLiCcH87h71AyV59jH3k4m5Fu5mDAZTdS5v24FC2xUHRxP5lN7XtBAzmyb3rpEb1LwSUdzzY0iXKoNjABSu8tL2EYgEMYsxvYheEFij/tg0l9sScWgueuJSsyfJDPshAiUEuWM7yaNPWHV2Bv+kmiC/SgEek+IAddvC4GrsbpEjA1RJ1FiZsiuHk4vKKYckVyrnKKf1El1njV+/jdf0n2hHIBUs5+TN52mTDBKMN2syHH66DhzhFiqHYeWTmx+orhxpR/GzGsDdI+kd5jswzxVsnH008CtJeyPNsUvOptr2G5RGa+u4s8tJVcgN/PFiLZ/rnyAU/pAuEiZdLrtOviQ5su3s+ki5JjG8gfv6laSm7mul1iOBAUlVoe4ObYrBPLPV3Gu3UU/aZ1pkjlDN5o66HVkUJRRFAfkUKhUEOkUCgUaogUCoUaIoVCoUg3+1GIka1J34GkQpuiQg1RfrysKfTz+IJfmAf31FOboqKYYZ++z8v6u5xP8nR9Nuj0vaLooD4ihUIRO/4vwAAwKetmICuyxQAAAABJRU5ErkJggg==";

  var HEADER_HTML = '<nav class="header">' +
    '<div class="logo-area"><a href="../BHW_MainMenu.html" style="display:flex;align-items:center;"><img src="data:image/png;base64,' + LOGO_B64 + '" alt="J2 Jienie" style="height:35px;"></a></div>' +
    '<div class="nav-panel">' +
      '<a href="../BHW_MainMenu.html" class="home-top"><svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z"/></svg><span>トップページ</span></a>' +
      '<div class="menu-top">' +
        '<div class="nav-item" id="navNoticeBtn"><svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg><span class="icon-number">8</span><div>お知らせ</div></div>' +
        '<div class="login-info">' +
          '<div class="avatar"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/></svg></div>' +
          '<div class="user-name"><div class="lbl">会社コード</div><div>NSK001</div></div>' +
          '<div class="user-name"><div class="lbl">株式会社NSKシステムズ</div><div>本社 営業部</div></div>' +
          '<div class="user-name"><div class="lbl">担当者名</div><div>受注太郎</div></div>' +
          '<div class="setting-user" id="settingUserBtn"><svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-3.5c0-.6-.05-1.18-.14-1.74l2-1.56-2-3.46-2.36.96a7.9 7.9 0 0 0-1.5-.87L15 2h-4l-.4 2.83c-.55.23-1.05.52-1.5.87l-2.36-.96-2 3.46 2 1.56c-.09.56-.14 1.14-.14 1.74s.05 1.18.14 1.74l-2 1.56 2 3.46 2.36-.96c.45.35.95.64 1.5.87L11 22h4l.4-2.83c.55-.23 1.05-.52 1.5-.87l2.36.96 2-3.46-2-1.56c.09-.56.14-1.14.14-1.74z"/></svg><span class="caret">&#9662;</span>' +
            '<div class="dropdown-panel" id="userDropdownPanel">' +
              '<a href="#" data-nav="プロフィール（パスワードの再設定）画面（BHW_Profile）">パスワードの再設定</a>' +
              '<div class="dp-divider"></div>' +
              '<a href="#" data-nav="ログアウト（eProcurement_Logout）">ログアウト</a>' +
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
      // 1. 見積案件照会
      '<li class="nav-group"><a href="#" class="menu-item" title="見積案件照会">' +
        '<svg viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zM224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24z"/></svg>' +
        '<span class="menu-label">見積案件照会</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="../eProcurement_EstimateSupplier_All.html">すべて</a></li>' +
          '<li><a href="#" data-nav="見積案件照会_回答前（eProcurement_EstimateSupplier_BeforeAnswer）">回答前</a></li>' +
          '<li><a href="#" data-nav="見積案件照会_回答済み（eProcurement_EstimateSupplier_AfterAnswer）">回答済み</a></li>' +
        '</ul></li>' +
      // 2. 受注案件照会
      '<li class="nav-group"><a href="#" class="menu-item" title="受注案件照会">' +
        '<svg viewBox="0 0 448 512"><path d="M436 160H12c-6.6 0-12-5.4-12-12v-36c0-26.5 21.5-48 48-48h48V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h128V12c0-6.6 5.4-12 12-12h40c6.6 0 12 5.4 12 12v52h48c26.5 0 48 21.5 48 48v36c0 6.6-5.4 12-12 12zM12 192h424c6.6 0 12 5.4 12 12v260c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V204c0-6.6 5.4-12 12-12z"/></svg>' +
        '<span class="menu-label">受注案件照会</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="受注案件照会_すべて（eProcurement_Supplier_All）">すべて</a></li>' +
          '<li><a href="#" data-nav="受注案件照会_受注（eProcurement_Supplier_AcceptingOrder）">受注</a></li>' +
          '<li><a href="#" data-nav="受注案件照会_未納品（eProcurement_Supplier_WaitingDelivery）">未納品</a></li>' +
          '<li><a href="#" data-nav="受注案件照会_納品済み（eProcurement_Supplier_CompletedDelivery）">納品済み</a></li>' +
          '<li><a href="#" data-nav="受注案件照会_検収完了（eProcurement_Supplier_CompletedAcceptance）">検収完了</a></li>' +
        '</ul></li>' +
      // 3. 請求一覧
      '<li class="nav-group"><a href="#" class="menu-item" title="請求一覧">' +
        '<svg viewBox="0 0 512 512"><path d="M256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm12 400h-24v-24c-30 0-56-24-56-56h32c0 16 12 24 24 24h48c8 0 16-8 16-24 0-8-4-16-16-20l-48-16c-24-8-40-28-40-52 0-30 26-56 56-56v-24h24v24c30 0 56 24 56 56h-32c0-16-12-24-24-24h-48c-8 0-16 8-16 24 0 8 4 16 16 20l48 16c24 8 40 28 40 52 0 30-26 56-56 56v24z"/></svg>' +
        '<span class="menu-label">請求一覧</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="請求一覧_すべて（eProcurement_Invoice_List_All）">すべて</a></li>' +
          '<li><a href="#" data-nav="請求一覧_請求確認（eProcurement_Invoice_List_Confirmation）">請求確認</a></li>' +
          '<li><a href="#" data-nav="請求一覧_請求確認完了（eProcurement_Invoice_List_Confirmation_Completed）">請求確認完了</a></li>' +
        '</ul></li>' +
      // 4. システム管理
      '<li class="nav-group"><a href="#" class="menu-item" title="システム管理">' +
        '<svg viewBox="0 0 512 512"><path d="M507.7 109.1c-2.2-9-13.5-12.1-20.1-5.5l-74.4 74.4-67.9-11.3-11.3-67.9 74.4-74.4c6.6-6.6 3.4-17.9-5.7-20.2-47.4-11.7-99.5.9-136.6 37.9-39.6 39.6-50.5 97.1-34 147.2L18.7 402.8c-25 25-25 65.5 0 90.5s65.5 25 90.5 0l213.2-213.2c50.1 16.7 107.5 5.7 147.4-34.2 37.1-37.1 49.7-89.3 37.9-136.8zM64 472c-13.3 0-24-10.7-24-24s10.7-24 24-24 24 10.7 24 24-10.7 24-24 24z"/></svg>' +
        '<span class="menu-label">システム管理</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="../BHW_MainMenu.html">システム管理</a></li>' +
          '<li><a href="#" data-nav="会社情報画面（BHW_CompanyInfo）">会社情報</a></li>' +
          '<li><a href="#" data-nav="担当者情報画面（BHW_UserInfo）">担当者情報</a></li>' +
          '<li><a href="#" data-nav="取扱品目カテゴリ画面（BHW_CategoryInfo）">取扱品目カテゴリ</a></li>' +
          '<li><a href="#" data-nav="納品可能地域画面（BHW_DeliveryLocationInfo）">納品可能地域</a></li>' +
          '<li><a href="#" data-nav="取引バイヤ管理画面（BHW_BuyerInfo）">取引バイヤ管理</a></li>' +
        '</ul></li>' +
      // 5. その他
      '<li class="nav-group"><a href="#" class="menu-item" title="その他">' +
        '<svg viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zM224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24z"/></svg>' +
        '<span class="menu-label">その他</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="支払通知画面（eProcurement_Supplier_PaymentManagement）">支払通知</a></li>' +
        '</ul></li>' +
      // 6. カタログ管理
      '<li class="nav-group"><a href="#" class="menu-item" title="カタログ管理">' +
        '<svg viewBox="0 0 512 512"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.7-5.4-.6-11.2-5.5-14zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>' +
        '<span class="menu-label">カタログ管理</span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="#" data-nav="カタログ商品検索（CMS08・別タブ）">カタログ商品検索</a></li>' +
          '<li><a href="#" data-nav="商品登録・情報管理（CMS26・別タブ）">商品登録・情報管理</a></li>' +
        '</ul></li>' +
      // 7. 調達案件(RFX) — 新設
      '<li class="nav-group" id="rfxNavGroup"><a href="#" class="menu-item active" title="調達案件(RFX)">' +
        '<svg viewBox="0 0 24 24"><path d="M3 3h2v18H3V3zm4 11h3v7H7v-7zm5-7h3v14h-3V7zm5 4h3v10h-3V11z"/></svg>' +
        '<span class="menu-label">調達案件(RFX)<span class="mi-new">NEW</span></span><span class="mi-chevron">&#9662;</span></a>' +
        '<ul class="submenu">' +
          '<li><a href="index.html">RFX モックアップ一覧</a></li>' +
          '<li><a href="eProcurement_RFX_Supplier_ProjectList.html">参加案件一覧</a></li>' +
          '<li><a href="eProcurement_RFX_QA_Supplier.html">Q&amp;A掲示板</a></li>' +
          '<li><a href="eProcurement_RFX_SupplierResponse_phase1.html">RFI/RFP回答・提出</a></li>' +
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
    if (nb) nb.addEventListener('click', function () {
      var tg = document.getElementById('Notification');
      if (tg) tg.scrollIntoView({ behavior: 'smooth', block: 'start' });
      else window.location.href = '../BHW_MainMenu.html#Notification';
    });
  }

  function bindBackToTop() {
    var b = document.getElementById('backToTopBtn');
    if (b) b.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  // RFX 画面用: モーダル / 検索トグル
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

  function init() {
    replacePlaceholder('layout-header', HEADER_HTML);
    replacePlaceholder('layout-sidebar', SIDEBAR_HTML);
    replacePlaceholder('layout-fab', BACKTOTOP_HTML);
    bindSidebar(); bindHeader(); bindBackToTop();
    bindModals(); bindSearch(); bindDataNavToasts();
  }

  global.JienieLayout = { init: init, toast: toast, openModal: openModal, closeModal: closeModal, bindDataNavToasts: bindDataNavToasts };
})(window);
