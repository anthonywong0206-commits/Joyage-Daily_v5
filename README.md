# Joyage Daily 日記功能修復版（Build Safe）

## 修復內容
- 日記頁可點擊日期查看紀錄
- 可在指定日期新增日記
- 可修改現有日記內容
- 可修改情緒
- 可刪除日記紀錄
- 修復 localStorage 更新不同步
- 修復手機版彈窗 overflow / 白屏風險
- 修復 Vercel `Cannot find module 'tailwindcss'`：此版本使用純 CSS，不再需要 Tailwind PostCSS plugin

## 更新方法
1. 解壓 ZIP。
2. 將所有檔案完整覆蓋到你的 GitHub repo 根目錄。
3. 刪除舊的 `package-lock.json`。
4. 不要上載 `node_modules`。
5. 本機測試：

```bash
npm install
npm run dev
npm run build
```

## Vercel 設定
- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`
- Redeploy 前請選擇 Clear Build Cache。
