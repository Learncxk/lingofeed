# LingoFeed — TikTok for Words 🚀

刷推文一样背单词。通过阅读 → 填空 → 拼写 三个阶段，像刷社交媒体一样自然地掌握雅思词汇。

## 一键部署（免费、永久）

### 方案 A：Vercel（推荐，2 分钟）

```bash
# 1. 安装 Vercel CLI
npx vercel login          # 浏览器打开，用 GitHub 登录
npx vercel --prod         # 一键部署 → 得到 https://lingofeed.vercel.app
```

以后每次修改代码，运行 `npx vercel --prod` 自动更新。

### 方案 B：Netlify Drop（无需命令行）

```bash
npm run build             # 生成 out/ 文件夹
```

打开 https://app.netlify.com/drop，把 `out/` 文件夹拖进去 → 立刻获得公开 URL。

### 方案 C：GitHub Pages

```bash
npm run build             # 生成 out/
npx gh-pages -d out       # 推送到 GitHub Pages
```

## 本地开发

```bash
npm run dev     # http://localhost:3001
```

## 项目结构

```
src/
├── app/          页面 + 布局 + 全局样式 + 动画
├── components/   3 种卡片组件
└── store/        Zustand 状态 + Mock 数据
```
