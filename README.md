# Joyage Daily

「把每天的情緒，好好記下來。」純前端情緒記帳本 App。

## 功能
- React 18 + Vite + Tailwind CSS
- Framer Motion 動畫
- Recharts 統計圖表
- localStorage 儲存情緒日記
- 情緒月曆、補記、編輯
- IG Story / 分析圖片 PNG 匯出及手機分享
- PWA：可加入手機主畫面
- 純前端靜態版，不使用 Firebase / Backend / Database Server

## 本機安裝
```bash
npm install
npm run dev
```

## 建置
```bash
npm run build
```

## Vercel 部署
1. 將所有檔案上載到 GitHub Repository。
2. Vercel 新增 Project，選擇該 Repository。
3. Framework Preset 選 Vite。
4. Build Command：`npm run build`
5. Output Directory：`dist`
6. Deploy。

## GitHub Pages 部署
```bash
npm run build
```
把 `dist` 內容部署到 GitHub Pages。`vite.config.js` 已使用 `base: './'`，適合 GitHub Pages。
