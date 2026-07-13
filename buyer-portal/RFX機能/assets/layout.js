/* ============================================================
   J2 RFX機能モックアップ — 共通レイアウト JS（シム）
   ------------------------------------------------------------
   実サイト対照済みの共通レンダラ（buyer-portal/assets/layout.js：実ロゴ・
   実ヘッダー・実サイドバー9メニュー）をそのまま読み込み、続けて RFX 用の
   拡張（rfx-augment.js：RFXメニュー追加・親リンク補正・モーダル/検索バインド・
   openModal/closeModal）を読み込む。
   → RFX 各画面は従来どおり <script src="assets/layout.js"> のままで、
     実物と同じ header/sidebar/style になる（各HTMLの改修不要）。
   ※ parser 実行時 document.write で同期挿入するため、後続の JienieLayout.init()
     が呼ばれる時点で window.JienieLayout は定義済み。
   ============================================================ */
document.write('<script src="../assets/layout.js"><\/script>');
document.write('<script src="assets/rfx-augment.js"><\/script>');
document.write('<script src="assets/tour.js"><\/script>');
