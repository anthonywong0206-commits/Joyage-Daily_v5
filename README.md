# Joyage Daily 日記查看／修改／刪除修復版

## 修復重點
- 日記頁面可點擊日期查看紀錄
- 可新增指定日期日記
- 可修改日記內容及情緒
- 可刪除日記，刪除前有確認提示
- 修復 localStorage 修改後不同步問題
- 移除高風險 latest dependency
- 使用穩定 Vite 5 + React Plugin 4
- 減少手機 Safari 容易白屏的 runtime 依賴
- 保留概念圖風格、PWA、localStorage、月曆、分析及 IG Story PNG 匯出

## 更新方法
1. 解壓 ZIP
2. 用全部檔案覆蓋 GitHub repo
3. 刪除舊的 `package-lock.json`
4. 不要上載 `node_modules`
5. Commit + Push
6. Vercel 重新 Deploy，選 Clear Build Cache

## 本機測試
```bash
npm install
npm run dev
npm run build
```
