# @deepeater/team

食悟 AI 项目专用知识库检索与沉淀 skill。

## 简介

本 skill 用于配合 lark-cli 从飞书知识库「食悟 AI项目-Agent专用」中查找、读取、汇总、更新团队投喂给 AI 的项目知识。

## 依赖

本 skill 依赖以下 skill 和工具：

- **Skills**:
  - `lark-wiki` - 飞书知识库管理
  - `lark-doc` - 飞书文档读取和维护

- **命令行工具**:
  - `lark-cli` - 飞书 CLI 工具

## 安装

```bash
# 全局安装
npx skills add deepeater/team -y -g

# 项目级安装
npx skills add deepeater/team -y
```

## 知识库

固定知识库名称：**食悟 AI项目-Agent专用**

推荐一级目录：
1. 项目整体方向决策
2. 产品研发
3. 市场营销
4. 运营支持
5. 团队协作与项目管理

## 触发场景

当用户提到以下任一意图时使用本 skill：

- 查询、总结、核对「食悟 AI」项目知识
- 查找团队投喂给 AI 的资料、决策、需求、会议结论、研发方案、营销素材或运营 SOP
- 向「食悟 AI项目-Agent专用」知识库新增、更新、整理、归档文档
- 基于知识库内容生成 PRD、研发拆解、运营方案、营销文案、决策备忘录、项目周报

## License

MIT
