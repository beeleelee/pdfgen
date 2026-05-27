# pdfgen — AI 驱动的 PDF 生成器

通过自然语言对话生成 PDF 文档，支持简历、发票、信件等多种模板。前端 React + Vite，后端 Express，LLM Agent 自动填充模板并调用 Playwright 渲染 PDF。

## 快速开始

```bash
cp .env.example .env   # 编辑 .env 填入 API Key
npm install
npm run playwright:install   # 下载 Chromium（首次使用 PDF 前运行）
npm run dev                  # 启动开发服务器
```

浏览器打开 `http://localhost:5173`，在聊天框中描述你想要的文档即可。

## 技术架构

单仓模式：Vite React 前端 + Express 后端，两个独立的 TypeScript 配置。

- **开发**：`npm run dev` 同时启动 Vite（:5173）和 tsx watch（:3001），Vite 代理 `/api/*` → `:3001`
- **生产**：`npm run build` 构建前端 → `npm start` Express 托管 `dist/`

## 目录结构

```
src/                 # React 前端
  App.tsx            入口 — 单栏居中布局
  components/
    Chat.tsx         聊天输入框 + 消息列表 + PDF 链接
  index.css          Tailwind + 自定义样式
  main.tsx           React 挂载点

server/              # Express 后端
  index.ts           入口 — 挂载路由
  routes/
    chat.ts          POST /api/chat — streamText → SSE 流式响应
    pdf.ts           GET /api/pdf/:id — 返回已生成的 PDF
    render-test.ts   POST /api/render-test — 调试用模板渲染
  agents/
    tools.ts         render_pdf 工具定义（模板查找、Zod 校验、React SSR、Playwright PDF）
    system-prompt.ts LLM 系统提示词
  templates/         React 组件 + Zod schema + 模板注册表
    theme.ts         设计令牌（颜色、字体、间距、渐变）
    resume.tsx       简历模板
    invoice.tsx      发票模板
    letter.tsx       信件模板
    registry.ts      模板注册表
  pdf/
    generator.ts     PDF 存储与 Playwright 生成
  lib/
    llm.ts           模型选择（OpenAI / Ollama 切换）
```

## 命令列表

| 命令 | 作用 |
|---|---|
| `npm run dev` | 同时启动 Vite 前端 + Express 后端（开发模式） |
| `npm run typecheck` | TypeScript 类型检查（两个 tsconfig） |
| `npm run build` | Vite 生产构建 |
| `npm start` | Express 生产部署（`NODE_ENV=production`） |
| `npm run playwright:install` | 下载 Chromium（生成 PDF 需要） |

## LLM 配置

设置 `LLM_PROVIDER` 环境变量切换模型提供商：

### OpenAI 兼容（默认）

适用于 DeepSeek、Doubao（火山引擎）、OpenAI 等任意兼容 OpenAI Chat API 的服务。

```env
LLM_PROVIDER=openai
OPENAI_API_KEY=sk-xxxx
OPENAI_MODEL=deepseek-v4-pro
OPENAI_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
```

### Ollama（本地）

```env
LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434/api
OLLAMA_MODEL=llama3.1
```

推荐模型：`llama3.1`、`mistral`、`qwen2.5`、`phi-4`

## 模板

### 简历 (Resume)

支持字段：姓名、职位、联系方式（邮箱/电话/GitHub/位置）、个人优势、项目经历、工作经历、教育经历、技能、证书

- 自动检测中文内容，使用中文标签（个人优势、项目经历、至今、业绩等）
- 高科技设计风格：
  - 深色渐变头部（海军蓝 → 深蓝），白色文字
  - 点阵网格背景
  - 渐变色下划线（蓝 → 青）作为章节标题装饰
  - 时间轴式经历块（蓝色竖线 + 圆点标记）
  - 轮廓式技能标签（透明背景 + 彩色边框）
  - 成就标签使用青色徽章样式
- 段落以 `\n` 或 `\n\n` 分隔，渲染为独立段落块（无额外行间距）

### 发票 (Invoice)

支持字段：发票号、日期、收发方信息、明细行、小计/税率/总计、备注

### 信件 (Letter)

支持字段：日期、收件人、主题、正文、结束语、签名、发件人

## 设计系统

设计令牌集中定义于 `server/templates/theme.ts`：

| 令牌 | 值 |
|---|---|
| 主色 | `#1e40af` |
| 强调色 | `#2563eb` |
| 科技青 | `#06b6d4` |
| 深色头部渐变 | `linear-gradient(135deg, #0f172a, #1e3a5f)` |
| 下划线渐变 | `linear-gradient(90deg, #3b82f6, #06b6d4)` |
| 字体 | Inter（无衬线）、Georgia（衬线）、JetBrains Mono（等宽） |
| 字号 | 9px ~ 30px |
| 间距 | 4px ~ 32px |

## AI SDK v6 注意事项

- **服务端**：`streamText({ model, messages, system, tools })` → `result.pipeUIMessageStreamToResponse(res)` 发送 SSE 流
- **客户端**：`useChat` 从 `@ai-sdk/react` 导入（非 `ai/react`），使用 `DefaultChatTransport`、`sendMessage({ text })`、`status`、`messages[N].parts`
- **工具定义**：使用 `inputSchema`（非 `parameters`），`tool()` 为透传标识函数
- **消息 parts 数组**：工具调用类型为 `tool-<name>`（如 `tool-render_pdf`）

## 环境变量

| 变量 | 说明 | 默认值 |
|---|---|---|
| `PORT` | 后端监听端口 | `3001` |
| `LLM_PROVIDER` | 模型提供商（openai / ollama） | `openai` |
| `OPENAI_API_KEY` | OpenAI 兼容 API 密钥 | — |
| `OPENAI_MODEL` | OpenAI 兼容模型名称 | `deepseek-v4-pro` |
| `OPENAI_BASE_URL` | OpenAI 兼容 API 地址 | — |
| `OLLAMA_BASE_URL` | Ollama 服务地址 | `http://localhost:11434/api` |
| `OLLAMA_MODEL` | Ollama 模型名称 | `llama3.1` |
