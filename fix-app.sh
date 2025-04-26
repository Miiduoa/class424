#!/bin/bash

# 顯示執行步驟
set -x

# 確保在正確目錄
cd "$(dirname "$0")"

# 清理舊的緩存和模組
echo "清理舊的緩存和模組..."
rm -rf .next
rm -rf node_modules
rm -f package-lock.json

# 安裝依賴
echo "安裝依賴..."
npm install

# 啟動開發伺服器
echo "啟動開發伺服器..."
npm run dev

# 完成
echo "修復完成!" 