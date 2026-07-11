/*
  layout.js — Header + Sidebar dung chung cho TAT CA trang mockup SUPPLIER PORTAL (BHW_*).

  CACH DUNG TRONG 1 TRANG MOI: giong hoan toan quy uoc buyer
  (xem projects/standard/mockup/buyer/assets/layout.js — 4 placeholder id giu nguyen:
   #layout-header / #wrapper > #layout-sidebar + main#wrapper-content / #layout-fab / #mockToast).

  NGUON THAT (source code, khong suy doan):
  - Header:  src-vbizhw-common/src/layouts/eProcurement/LoggedHeader.vue, nhanh
    isSupplierAccountCreated (login supplier BHW):
      * KHONG co カート / 比較表 / ヘルプ (cac muc do gated boi buyerSwitch.isCatalogPurchasing
        + role buyer, supplier khong co).
      * Co: logo (toDefautScreen → /eProcurement/supplier/manage), トップページ (HOME.TITLE),
        chuong お知らせ (MASTER_SETTING.LB_NOTICE, badge = noticeList.totalCount; click cuon
        toi #Notification neu dang o BHW_MainMenu — LoggedHeader.vue toDefautScreenAsNotification),
        khoi user 3 cot [会社コード(MASTER_SETTING.COMPANY_DISPLAYCODE) + companyGroupDisplayCode]
        [organizationName] [担当者名(MASTER_SETTING.LB_CONTACT_NAME) + user.name],
        banh rang dropdown: パスワードの再設定 (AUTHENTICATION_CHANGE_PASSWORD.TITLE →
        /eProcurement/supplier/profile) / ログアウト (COMMON_MULTI_LANG.HEADER_LOG_OUT).
      * Select 業務切替 chi hien khi user thuoc >=2 to chuc supplier
        (userOrgSwitchSupplier.length > 1) — demo 1 to chuc nen KHONG hien (theo dung v-if).
  - Sidebar: src-vbizhw-common/src/layouts/eProcurement/LoggedSidebar.vue, cac nhom hien
    voi supplier du role (demo: ST01+S001+SC004+S999+SB20+UR002+UR003, isSupplierActivated,
    isOpenSupplier=true, dang ky hoan tat) theo DUNG THU TU trong template:
      1. 見積案件照会 (ESTIMATE_SUPPLIER_AFTER_ANSWER.TITLE, icon file-invoice-dollar)
      2. 受注案件照会 (SUPPLIER_ACCEPTING_ORDER.TITLE, icon calendar-check)
      3. 請求一覧   (SUPPLIER_INVOICE_LIST.TITLE, icon parachute-box)
      4. システム管理 (COMMON_MULTI_LANG.SYSTEM_MANAGEMENT, icon wrench, role S999/SB20)
      5. その他     (COMMON_MULTI_LANG.SB_MENU_HISTORY_SENT_FAX, icon file-invoice-dollar)
      6. カタログ管理 (MASTER_SETTING.LB_CATALOG_ADMIN_CM, icon cogs, role UR002/UR003)
    Nhan submenu lay NGUYEN VAN tu src/locales/prod/ja.json (da doi chieu bang grep).
  - Icon: ve lai dang line-art don gian theo icon FontAwesome cung ten (calendar-check
    lay path that tu MainMenu.vue; cac icon khac xap xi — muc do mo phong giong buyer mockup).
  - Ten route trong data-nav lay tu projects/standard/mockup/provider-supplier/sitemap.md.

  DEMO DATA (de xuat, nhat quan voi mockup buyer + RFX):
    Supplier: 株式会社NSKシステムズ (trung voi supplier demo trong cac mockup RFX),
    会社コード NSK001 (de xuat — DB thuc luu companyGroupDisplayCode),
    to chuc: 本社 営業部, dam nhiem: 受注太郎 (de xuat).
*/
(function (global) {
  // Logo J2 (base64 lay nguyen goc tu src/assets/img/eProcurement/j2-logo-2.png — trung voi buyer mockup)
  var LOGO_B64 = "iVBORw0KGgoAAAANSUhEUgAAASIAAABHCAYAAACj8ErrAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTExRjJFODdGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MTExRjJFODhGQzU5MTFFOThFNzVCNzk4OEIwRjg0MkMiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDoxMTFGMkU4NUZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDoxMTFGMkU4NkZDNTkxMUU5OEU3NUI3OTg4QjBGODQyQyIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PkDa8k4AAA36SURBVHja7F1pkBXV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";

  var HEADER_HTML = `<nav class="header">
  <div class="logo-area">
    <!-- Logo → toDefautScreen: defaultScreenPath cua supplier = /eProcurement/supplier/manage (trang nay) -->
    <a href="BHW_MainMenu.html" style="display:flex;align-items:center;"><img src="data:image/png;base64,${LOGO_B64}" alt="J2 Jienie" style="height:35px;"></a>
  </div>
  <div class="nav-panel">
    <!-- HOME.TITLE — nguyen van ja.json -->
    <a href="BHW_MainMenu.html" class="home-top">
      <svg viewBox="0 0 24 24"><path d="M12 3l9 8h-3v9h-4v-6H10v6H6v-9H3l9-8z"/></svg>
      <span>トップページ</span>
    </a>
    <div class="menu-top">
      <!-- Chuong お知らせ (MASTER_SETTING.LB_NOTICE); badge = noticeList.totalCount (demo: 8).
           Click: cuon toi #Notification neu co tren trang (hanh vi that cua BHW_MainMenu) -->
      <div class="nav-item" id="navNoticeBtn">
        <svg viewBox="0 0 24 24"><path d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>
        <span class="icon-number">8</span>
        <div>お知らせ</div>
      </div>
      <div class="login-info">
        <div class="avatar"><svg viewBox="0 0 24 24"><path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 2c-4.42 0-8 2.24-8 5v2h16v-2c0-2.76-3.58-5-8-5z"/></svg></div>
        <!-- 3 khoi text theo LoggedHeader.vue (companyDivisionCode=20):
             会社コード=MASTER_SETTING.COMPANY_DISPLAYCODE / 担当者名=MASTER_SETTING.LB_CONTACT_NAME.
             Gia tri demo (de xuat): NSK001 / 本社 営業部 / 受注太郎 -->
        <div class="user-name"><div class="lbl">会社コード</div><div>NSK001</div></div>
        <div class="user-name"><div class="lbl">株式会社NSKシステムズ</div><div>本社 営業部</div></div>
        <div class="user-name"><div class="lbl">担当者名</div><div>受注太郎</div></div>
        <div class="setting-user" id="settingUserBtn">
          <svg viewBox="0 0 24 24"><path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zm7.4-3.5c0-.6-.05-1.18-.14-1.74l2-1.56-2-3.46-2.36.96a7.9 7.9 0 0 0-1.5-.87L15 2h-4l-.4 2.83c-.55.23-1.05.52-1.5.87l-2.36-.96-2 3.46 2 1.56c-.09.56-.14 1.14-.14 1.74s.05 1.18.14 1.74l-2 1.56 2 3.46 2.36-.96c.45.35.95.64 1.5.87L11 22h4l.4-2.83c.55-.23 1.05-.52 1.5-.87l2.36.96 2-3.46-2-1.56c.09-.56.14-1.14.14-1.74z"/></svg><span class="caret">&#9662;</span>
          <div class="dropdown-panel" id="userDropdownPanel">
            <!-- AUTHENTICATION_CHANGE_PASSWORD.TITLE → /eProcurement/supplier/profile (BHW_Profile) -->
            <a href="#" data-nav="プロフィール（パスワードの再設定）画面（BHW_Profile）">パスワードの再設定</a>
            <div class="dp-divider"></div>
            <a href="#" data-nav="ログアウト（eProcurement_Logout）">ログアウト</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</nav>`;

  /* Sidebar supplier — LoggedSidebar.vue, thu tu nhom & nhan submenu nguyen van ja.json.
     Cac trang dich chua co mockup → data-nav (route name theo sitemap provider-supplier). */
  var SIDEBAR_HTML = `<aside id="wrapper-sidebar">
    <div class="sidebar-top">
      <button class="toggle-sidebar-burger" id="toggleSidebarBtn" title="メニューを開く">&#9776;</button>
      <button class="toggle-sidebar-x" id="closeSidebarBtn" title="メニューを閉じる">&times;</button>
    </div>
    <ul>
      <!-- 1. 見積案件照会 (ESTIMATE_SUPPLIER_AFTER_ANSWER.TITLE) — role ST01/S001, icon FA file-invoice-dollar -->
      <li class="nav-group">
        <a href="#" class="menu-item" title="見積案件照会">
          <svg viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zM224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm0 80v-16c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8zm144 263.88V440c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-24.29c-11.29-.58-22.27-4.52-31.37-11.35-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73 3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19 0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39 0-24.52 19.05-44.44 42.67-45.07V232c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v24.29c11.29.58 22.27 4.51 31.37 11.35 3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19 0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39 0 24.53-19.05 44.44-42.67 45.07z"/></svg>
          <span class="menu-label">見積案件照会</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="eProcurement_EstimateSupplier_All.html">すべて</a></li>
          <li><a href="#" data-nav="見積案件照会_回答前（eProcurement_EstimateSupplier_BeforeAnswer）">回答前</a></li>
          <li><a href="#" data-nav="見積案件照会_回答済み（eProcurement_EstimateSupplier_AfterAnswer）">回答済み</a></li>
        </ul>
      </li>
      <!-- 2. 受注案件照会 (SUPPLIER_ACCEPTING_ORDER.TITLE) — role S001, icon FA calendar-check (path that tu MainMenu.vue) -->
      <li class="nav-group">
        <a href="#" class="menu-item" title="受注案件照会">
          <svg viewBox="0 0 448 512"><path d="M436 160H12c-6.627 0-12-5.373-12-12v-36c0-26.51 21.49-48 48-48h48V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h128V12c0-6.627 5.373-12 12-12h40c6.627 0 12 5.373 12 12v52h48c26.51 0 48 21.49 48 48v36c0 6.627-5.373 12-12 12zM12 192h424c6.627 0 12 5.373 12 12v260c0 26.51-21.49 48-48 48H48c-26.51 0-48-21.49-48-48V204c0-6.627 5.373-12 12-12zm333.296 95.947l-28.169-28.398c-4.667-4.705-12.265-4.736-16.97-.068L194.12 364.665l-45.98-46.352c-4.667-4.705-12.266-4.736-16.971-.068l-28.397 28.17c-4.705 4.667-4.736 12.265-.068 16.97l82.601 83.269c4.667 4.705 12.265 4.736 16.97.068l142.953-141.805c4.705-4.667 4.736-12.265.068-16.97z"/></svg>
          <span class="menu-label">受注案件照会</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="受注案件照会_すべて（eProcurement_Supplier_All）">すべて</a></li>
          <li><a href="#" data-nav="受注案件照会_受注(当初)（eProcurement_Supplier_TemporaryEstimate）">受注(当初)</a></li>
          <li><a href="#" data-nav="受注案件照会_受注（eProcurement_Supplier_AcceptingOrder）">受注</a></li>
          <li><a href="#" data-nav="受注案件照会_未納品（eProcurement_Supplier_WaitingDelivery）">未納品</a></li>
          <li><a href="#" data-nav="受注案件照会_納品済み（eProcurement_Supplier_CompletedDelivery）">納品済み</a></li>
          <li><a href="#" data-nav="受注案件照会_検収完了（eProcurement_Supplier_CompletedAcceptance）">検収完了</a></li>
        </ul>
      </li>
      <!-- 3. 請求一覧 (SUPPLIER_INVOICE_LIST.TITLE) — icon FA parachute-box -->
      <li class="nav-group">
        <a href="#" class="menu-item" title="請求一覧">
          <svg viewBox="0 0 512 512"><path d="M511.9 175c-9.1-75.6-78.4-132.4-158.3-158.7C390 55.7 416 116.9 416 192h28.1L327.5 321.5c-2.5-.6-4.8-1.5-7.5-1.5h-48V192h112C384 76.8 315.1 0 256 0S128 76.8 128 192h112v128h-48c-2.7 0-5 .9-7.5 1.5L67.9 192H96c0-75.1 26-136.3 62.4-175.7C78.5 42.7 9.2 99.5.1 175c-1.1 9.1 6.8 17 16 17h8.7l136 149.5c-3 5.5-4.8 11.7-4.8 18.5v112c0 22.1 17.9 40 40 40h120c22.1 0 40-17.9 40-40V360c0-6.8-1.8-13-4.8-18.5L487.2 192h8.7c9.2 0 17.1-7.9 16-17z"/></svg>
          <span class="menu-label">請求一覧</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="請求一覧_すべて（eProcurement_Invoice_List_All）">すべて</a></li>
          <li><a href="#" data-nav="請求一覧_請求確認（eProcurement_Invoice_List_Confirmation）">請求確認</a></li>
          <li><a href="#" data-nav="請求一覧_請求確認完了（eProcurement_Invoice_List_Confirmation_Completed）">請求確認完了</a></li>
        </ul>
      </li>
      <!-- 4. システム管理 (COMMON_MULTI_LANG.SYSTEM_MANAGEMENT) — role S999/SB20, icon FA wrench.
           Muc dau tien tro ve chinh trang nay (href that). 契約管理/署名者情報 chi hien voi SB20. -->
      <li class="nav-group">
        <a href="#" class="menu-item" title="システム管理">
          <svg viewBox="0 0 512 512"><path d="M507.73 109.1c-2.24-9.03-13.54-12.09-20.12-5.51l-74.36 74.36-67.88-11.31-11.31-67.88 74.36-74.36c6.62-6.62 3.43-17.9-5.66-20.16-47.38-11.74-99.55.91-136.58 37.93-39.64 39.64-50.55 97.1-34.05 147.2L18.74 402.76c-24.99 24.99-24.99 65.51 0 90.5 24.99 24.99 65.51 24.99 90.5 0l213.21-213.21c50.12 16.71 107.47 5.68 147.37-34.22 37.07-37.07 49.7-89.32 37.91-136.73zM64 472c-13.25 0-24-10.75-24-24 0-13.26 10.75-24 24-24s24 10.74 24 24c0 13.25-10.75 24-24 24z"/></svg>
          <span class="menu-label">システム管理</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="BHW_MainMenu.html">システム管理</a></li>
          <li><a href="#" data-nav="会社情報画面（BHW_CompanyInfo）">会社情報</a></li>
          <li><a href="#" data-nav="担当者情報画面（BHW_UserInfo）">担当者情報</a></li>
          <li><a href="#" data-nav="取扱品目カテゴリ画面（BHW_CategoryInfo）">取扱品目カテゴリ</a></li>
          <li><a href="#" data-nav="品名辞書登録画面（BHW_ProductNameInfo）">品名辞書登録</a></li>
          <li><a href="#" data-nav="納品可能地域画面（BHW_DeliveryLocationInfo）">納品可能地域</a></li>
          <li><a href="#" data-nav="許認可・認証・特許情報画面（BHW_VerificationInfo）">許認可・認証・特許情報</a></li>
          <li><a href="#" data-nav="振込口座情報画面（BHW_PaymentAccountInfo）※OpenSupplierのみ表示">振込口座情報</a></li>
          <li><a href="#" data-nav="取引バイヤ管理画面（BHW_BuyerInfo）">取引バイヤ管理</a></li>
          <li><a href="#" data-nav="PR情報画面（BHW_PublicRelations）">PR情報</a></li>
          <li><a href="#" data-nav="契約管理画面（BHW_ContractInfo）※SB20ロールのみ表示">契約管理</a></li>
          <li><a href="#" data-nav="署名者情報画面（BHW_SignerInfoView）※SB20ロールのみ表示">署名者情報</a></li>
        </ul>
      </li>
      <!-- 5. その他 (COMMON_MULTI_LANG.SB_MENU_HISTORY_SENT_FAX) — role SC004, icon FA file-invoice-dollar (giong nhom 1 theo source) -->
      <li class="nav-group">
        <a href="#" class="menu-item" title="その他">
          <svg viewBox="0 0 384 512"><path d="M377 105L279.1 7c-4.5-4.5-10.6-7-17-7H256v128h128v-6.1c0-6.3-2.5-12.4-7-16.9zM224 136V0H24C10.7 0 0 10.7 0 24v464c0 13.3 10.7 24 24 24h336c13.3 0 24-10.7 24-24V160H248c-13.2 0-24-10.8-24-24zM64 72c0-4.42 3.58-8 8-8h80c4.42 0 8 3.58 8 8v16c0 4.42-3.58 8-8 8H72c-4.42 0-8-3.58-8-8V72zm144 375.88V440c0 4.42-3.58 8-8 8h-16c-4.42 0-8-3.58-8-8v-24.29c-11.29-.58-22.27-4.52-31.37-11.35-3.9-2.93-4.1-8.77-.57-12.14l11.75-11.21c2.77-2.64 6.89-2.76 10.13-.73 3.87 2.42 8.26 3.72 12.82 3.72h28.11c6.5 0 11.8-5.92 11.8-13.19 0-5.95-3.61-11.19-8.77-12.73l-45-13.5c-18.59-5.58-31.58-23.42-31.58-43.39 0-24.52 19.05-44.44 42.67-45.07V232c0-4.42 3.58-8 8-8h16c4.42 0 8 3.58 8 8v24.29c11.29.58 22.27 4.51 31.37 11.35 3.9 2.93 4.1 8.77.57 12.14l-11.75 11.21c-2.77 2.64-6.89 2.76-10.13.73-3.87-2.43-8.26-3.72-12.82-3.72h-28.11c-6.5 0-11.8 5.92-11.8 13.19 0 5.95 3.61 11.19 8.77 12.73l45 13.5c18.59 5.58 31.58 23.42 31.58 43.39 0 24.53-19.05 44.44-42.67 45.07z"/></svg>
          <span class="menu-label">その他</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="支払通知画面（eProcurement_Supplier_PaymentManagement）">支払通知</a></li>
        </ul>
      </li>
      <!-- 6. カタログ管理 (MASTER_SETTING.LB_CATALOG_ADMIN_CM) — role UR002/UR003, icon FA cogs (xap xi bang 1 banh rang).
           Cac muc mo tab MallSupplier (target=_blank tren trang that). -->
      <li class="nav-group">
        <a href="#" class="menu-item" title="カタログ管理">
          <svg viewBox="0 0 512 512"><path d="M487.4 315.7l-42.6-24.6c4.3-23.2 4.3-47 0-70.2l42.6-24.6c4.9-2.8 7.1-8.6 5.5-14-11.1-35.6-30-67.8-54.7-94.6-3.8-4.1-10-5.1-14.8-2.3L380.8 110c-17.9-15.4-38.5-27.3-60.8-35.1V25.8c0-5.6-3.9-10.5-9.4-11.7-36.7-8.2-74.3-7.8-109.2 0-5.5 1.2-9.4 6.1-9.4 11.7V75c-22.2 7.9-42.8 19.8-60.8 35.1L88.7 85.5c-4.9-2.8-11-1.9-14.8 2.3-24.7 26.7-43.6 58.9-54.7 94.6-1.7 5.4.6 11.2 5.5 14L67.3 221c-4.3 23.2-4.3 47 0 70.2l-42.6 24.6c-4.9 2.8-7.1 8.6-5.5 14 11.1 35.6 30 67.8 54.7 94.6 3.8 4.1 10 5.1 14.8 2.3l42.6-24.6c17.9 15.4 38.5 27.3 60.8 35.1v49.2c0 5.6 3.9 10.5 9.4 11.7 36.7 8.2 74.3 7.8 109.2 0 5.5-1.2 9.4-6.1 9.4-11.7v-49.2c22.2-7.9 42.8-19.8 60.8-35.1l42.6 24.6c4.9 2.8 11 1.9 14.8-2.3 24.7-26.7 43.6-58.9 54.7-94.6 1.7-5.4-.6-11.2-5.5-14zM256 336c-44.1 0-80-35.9-80-80s35.9-80 80-80 80 35.9 80 80-35.9 80-80 80z"/></svg>
          <span class="menu-label">カタログ管理</span>
          <span class="mi-chevron">&#9662;</span>
        </a>
        <ul class="submenu">
          <li><a href="#" data-nav="カタログ商品検索（CMS08・別タブ）">カタログ商品検索</a></li>
          <li><a href="#" data-nav="商品登録・情報管理（CMS26・別タブ）">商品登録・情報管理</a></li>
          <li><a href="#" data-nav="商品情報更新ステータス（CMS23・別タブ）">商品情報更新ステータス</a></li>
          <li><a href="#" data-nav="一括アップロード結果参照（CMS14・別タブ）">一括アップロード結果参照</a></li>
        </ul>
      </li>
    </ul>
  </aside>`;

  var BACKTOTOP_HTML = `<div class="back-to-top" id="backToTopBtn">
  <svg viewBox="0 0 24 24"><path d="M12 4l-8 8h5v8h6v-8h5z"/></svg>
</div>`;

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
        if (!document.body.classList.contains('sidebar-open')) {
          // Thu gon: bam icon → chuyen thang toi muc dau tien (toFirstMenu() that trong LoggedSidebar.vue)
          var firstLink = li.querySelector('.submenu a');
          var firstHref = firstLink ? firstLink.getAttribute('href') : null;
          if (firstHref && firstHref !== '#') {
            window.location.href = firstHref;
            return;
          }
          var target = firstLink ? firstLink.getAttribute('data-nav') : (head.getAttribute('title') || '');
          toast('実際の画面では「' + target + '」へ遷移します');
          return;
        }
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
        if (href && href !== '#') return; // co mockup that → dieu huong binh thuong
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

    // Chuong お知らせ: cuon toi #Notification (toDefautScreenAsNotification — LoggedHeader.vue)
    var noticeBtn = document.getElementById('navNoticeBtn');
    if (noticeBtn) {
      noticeBtn.addEventListener('click', function () {
        var target = document.getElementById('Notification');
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
          window.location.href = 'BHW_MainMenu.html#Notification';
        }
      });
    }
  }

  function bindBackToTop() {
    var btn = document.getElementById('backToTopBtn');
    if (btn) btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
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
  }

  global.JienieLayout = {
    init: init,
    toast: toast,
    // Goi lai neu trang tu them phan tu [data-nav] SAU khi init()
    bindDataNavToasts: bindDataNavToasts
  };
})(window);
