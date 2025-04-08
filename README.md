# AI 智能分析问卷系统

一个基于 React 和 GPT-4 的智能问卷分析系统，提供实时心理健康评估和建议。

## 功能特点

- 🎯 智能问卷填写
- 🤖 GPT-4 驱动的实时分析
- 💡 流式响应显示
- 🎨 粒子动画背景
- 📱 响应式设计
- 🔄 支持重新生成分析
- 🎯 自定义分析要求

## 技术栈

- React 18
- React Router v6
- Marked (Markdown 渲染)
- CSS3 动画
- Canvas 粒子效果
- GPT-4 API

## 快速开始

### 环境要求

- Node.js >= 14.0.0
- npm >= 6.0.0

### 安装

1. 克隆项目
```bash
git clone [项目地址]
```

2. 安装依赖
```bash
cd ai-survey-analysis
npm install
```

3. 创建配置文件
```bash
cp src/config.example.json src/config.json
```

### 配置

在 `src/config.json` 中配置以下内容：

```json
{
  "api": {
    "base_url": "你的API地址",
    "secret_key": "你的API密钥"
  },
  "app": {
    "dev_mode": false
  }
}
```

### 运行

```bash
# 开发环境
npm run dev

# 生产构建
npm run build
```

## 项目结构

```
src/
├── components/         # 组件
│   ├── AIFeedback/    # AI分析反馈组件
│   └── QuestionForm/  # 问卷表单组件
├── pages/             # 页面
│   ├── Home/         # 首页
│   └── Result/       # 结果页
├── Function/          # 功能模块
│   └── AIAnalysis.js  # AI分析逻辑
└── config.json        # 配置文件
```

## 主要功能说明

### 问卷填写
- 支持多种题型
- 实时表单验证
- 开发模式支持快速填写

### AI 分析
- 流式响应显示
- Markdown 格式化输出
- 支持自定义分析要求
- 可重新生成分析结果

### 用户界面
- 粒子动画背景
- 赛博朋克风格设计
- 响应式布局适配
- 流畅的过渡动画

## 开发说明

### 开发模式
在 config.json 中设置 `dev_mode: true` 可以启用开发模式：
- 快速填写表单
- 测试数据自动填充
- 调试信息输出

### 自定义分析
可以通过以下方式自定义分析：
1. 修改 AIAnalysis.js 中的提示词
2. 在界面中输入额外的分析要求
3. 调整 Markdown 渲染配置

## 部署

### 生产环境部署
1. 执行生产构建
```bash
npm run build
```

2. 将 dist 目录部署到服务器

### 环境变量
可以通过环境变量覆盖配置：
- `VITE_API_BASE_URL`
- `VITE_API_SECRET_KEY`

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

## 联系方式

- 作者：[帅臻]
- 邮箱：[1155157194@link.cuhk.edu.hk]
- GitHub：[https://github.com/family99chen]

## 致谢

- OpenAI GPT-4
- React 社区

## 更新日志

### v1.0.0
- 初始版本发布
- 基础功能实现
- UI 完善
```
