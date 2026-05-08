---
name: deepeater-team
description: "食悟 AI 项目专用知识库检索与沉淀 skill。用于配合 lark-cli 从飞书知识库「食悟 AI项目-Agent专用」中查找、读取、汇总、更新团队投喂给 AI 的项目知识；依赖 lark-wiki 定位知识空间与节点，依赖 lark-doc 读取和维护文档内容。适用于项目方向决策、产品研发、市场营销、运营支持、团队协作与项目管理相关问题。"
metadata:
  requires:
    skills: ["lark-wiki", "lark-doc"]
    bins: ["lark-cli"]
  knowledgeBaseName: "食悟 AI项目-Agent专用"
  Version: "2026.05.06"
---

# deepeater-team

这是「食悟 AI」项目的团队知识库 skill。触发后，优先从飞书知识库「食悟 AI项目-Agent专用」检索和读取信息，再结合用户问题输出答案、摘要、引用依据或沉淀建议。

## 依赖

- 必须按需使用 `lark-wiki`：定位知识空间、列出节点、进入分类目录、解析 wiki URL / token / node。
- 必须按需使用 `lark-doc`：读取文档内容、按关键词/章节局部读取、创建或更新知识文档。
- 使用任何 `lark-cli` 操作前，遵守对应 skill 的前置要求，尤其是 `lark-shared` 认证与权限处理。
- 读取文档统一使用 `lark-cli docs +fetch --api-version v2`。

## 知识库

固定知识库名称：

```text
食悟 AI项目-Agent专用
```

推荐一级目录：

1. 项目整体方向决策
2. 产品研发
3. 市场营销
4. 运营支持
5. 团队协作与项目管理

用户若写「时长营销」，按「市场营销」理解。

## 触发场景

当用户提到以下任一意图时使用本 skill：

- 查询、总结、核对「食悟 AI」项目知识。
- 查找团队投喂给 AI 的资料、决策、需求、会议结论、研发方案、营销素材或运营 SOP。
- 向「食悟 AI项目-Agent专用」知识库新增、更新、整理、归档文档。
- 基于知识库内容生成 PRD、研发拆解、运营方案、营销文案、决策备忘录、项目周报。
- 用户明确提到 `deepeater-project`、食悟 AI 项目知识库、Agent 专用知识库。

## 检索流程

1. 明确问题意图，判断最可能的一级目录。
2. 用 `lark-wiki` 查找知识空间「食悟 AI项目-Agent专用」；如果用户提供了 wiki URL 或 token，优先解析该目标。
3. 列出或搜索相关节点，优先匹配：
   - 用户给出的文档标题、关键词、人名、日期、版本号。
   - 对应一级目录下的子文档。
   - 最近更新或最接近问题语义的文档。
4. 用 `lark-doc` 的 `docs +fetch --api-version v2` 读取候选文档。大文档优先使用局部读取：
   - 先取 outline / simple。
   - 再按 keyword / section 拉取相关章节。
   - 只有必要时读取 full。
5. 输出答案时区分：
   - 知识库已明确记录的事实。
   - 基于多份文档综合得出的推断。
   - 未在知识库中找到、需要人工确认的信息。
6. 如果结果来自多个文档，列出文档标题或节点路径作为依据；不要编造未读过的来源。

## 分类选择

- 项目整体方向决策：战略方向、定位、商业模式、边界取舍、关键会议结论、里程碑、原则。
- 产品研发：需求、PRD、交互、技术方案、数据结构、模型/AI 能力、实验、Bug、版本计划。
- 市场营销：品牌表达、渠道策略、增长实验、内容素材、用户画像、竞品、投放、活动。
- 运营支持：客服话术、商家/用户运营 SOP、审核规则、数据看板口径、日常支持流程。
- 团队协作与项目管理：人员分工、项目节奏、周报、例会纪要、风险清单、跨团队协作。

若问题跨多个分类，先读最相关分类，再补读关联分类。不要为了全面而无差别读取大量文档。

## 沉淀与更新

当用户要求把新内容投喂到知识库：

1. 先判断应归入哪个一级目录。
2. 如果已有同主题文档，优先追加或局部更新；不要重复创建近似文档。
3. 如果没有合适文档，再创建新文档并放入对应目录。
4. 新文档建议使用以下结构：
   - 背景
   - 结论 / 当前共识
   - 关键依据
   - 待确认问题
   - 更新时间
   - 相关链接
5. 更新文档时保留原始上下文，明确新增内容来源和日期。

## 输出规范

- 先给结论，再给依据；对项目执行类问题给出可行动的下一步。
- 引用知识库内容时，标明来源文档标题或路径。
- 信息不足时，直接说明缺口，并建议应该补充到哪个分类。
- 对决策类问题，输出「已知事实 / 推断 / 风险 / 建议」。
- 对研发类问题，输出「需求背景 / 当前方案 / 影响范围 / 待办」。
- 对营销或运营类问题，输出「目标 / 受众 / 动作 / 素材或话术 / 验证指标」。

## 常用命令形态

以下只是形态示例，实际参数以 `lark-wiki`、`lark-doc` skill 和 `lark-cli --help` 为准：

```bash
lark-cli wiki spaces list --format json
lark-cli wiki nodes list --space-id "<space_id>" --parent-node-token "<node_token>" --format json
lark-cli docs +fetch --api-version v2 --doc "<doc_url_or_token>" --detail simple
lark-cli docs +fetch --api-version v2 --doc "<doc_url_or_token>" --scope keyword --keyword "<keyword>"
lark-cli docs +update --api-version v2 --doc "<doc_url_or_token>" --command append --content "<p>...</p>"
```


