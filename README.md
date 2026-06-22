# 中峰网仲 · PC 版原型（React + Ant Design）

基于手机版小程序界面重构的 PC 端原型，使用 **React 19 + TypeScript + Vite + Ant Design v6**。
当前为**可点击原型**，全部数据为本地 Mock，不对接真实后端接口；不含管理后台。

## 技术栈

- React 19 + TypeScript
- Vite（构建/开发服务器）
- Ant Design v6（中文 locale `zh_CN`）
- react-router-dom v7（HashRouter）
- dayjs（日期，中文 locale）
- 简单登录态：React Context + localStorage（Mock）

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器（默认 http://localhost:5173）
npm run dev

# 生产构建（输出到 dist/）
npm run build

# 本地预览构建产物
npm run preview

# 代码检查（ESLint + TypeScript）
npm run lint
```

> 本压缩包已包含构建好的 `dist/` 目录，可直接用任意静态服务器托管（注意使用 HashRouter，无需额外的服务端路由配置）。

## 目录结构

```
src/
  App.tsx              # 路由（HashRouter，40+ 路由）
  auth.tsx             # 登录态 Context（Mock）
  theme.ts             # Ant Design 主题（主色 #2f6bff）
  mock/data.ts         # 全部 Mock 数据（服务/套餐/AI工具/仲裁案件/律师等）
  layouts/             # MainLayout（顶部导航）/ AiLayout / ConsoleLayout（左侧菜单）
  components/          # Logo / SecondaryNav / ChatPanel / ArbCasesView
  pages/
    Home / Login / EContract / Packages / PackageDetail
    ai/                # AI 法律工具箱（智能咨询、合同审查、案情分析、合同起草、
                       #   文书生成、大数据查询、仲裁咨询、律师服务、调解服务）
    arbitration/       # 仲裁咨询 / 在线立案（步骤表单）/ 我的仲裁（列表）/ 案件详情（时间轴）
    platform/          # 了解平台（企业/业务/场景/产品）
    console/           # 我的控制台（概览/订单/产品包A·B/我的仲裁/推广/资料/计费规则）
public/icons/          # 服务/平台/标签 SVG 图标
```

## 信息架构

- **顶部全局导航**：首页 / AI法律 / 电子合同 / 在线仲裁 / 产品套餐 / 了解平台
- **登录后**：右上角用户菜单 + 左侧工作台（AI 工具箱、我的控制台）
- 已移除小程序特有功能：微信一键登录、保存海报/分享进小程序、下拉刷新、底部 TabBar

## 登录说明（Mock）

- 验证码登录：任意手机号 + 验证码 **1234**
- 登录态保存在 localStorage，刷新保持；点击右上角用户菜单可退出
