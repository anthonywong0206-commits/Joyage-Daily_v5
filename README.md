# Joyage Daily 手機白屏修復版

## 修復重點
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
