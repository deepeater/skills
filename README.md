# deepeater-skills

食悟 AI 项目的团队 skill 集合。

每个 skill 都是独立的，参考 lark-cli 的设计模式，按领域分拆。

## 安装全部 skill

```bash
# 一键安装所有 skill
npx skills add deepeater/team-skills -y -g
```

## 单独安装某个 skill

```bash
npx skills add ./deepeater-wiki -g -y # 项目知识库与方向对齐
npx skills add ./deepeater-pm -g -y   # 产品设计、PRD、功能评审、MVP 边界
```

## 安装后验证

```bash
npx skills list -g | grep deepeater
```

## 检查版本

每个 skill 独立使用自己的 `package.json.version` 管理版本。

```bash
# 对比当前仓库版本和已安装版本
node scripts/check-updates.js

# 从 GitHub main 分支读取最新版本再对比
node scripts/check-updates.js --remote
```

## Skill 列表

| Skill                    | 说明                     |
|--------------------------|------------------------|
| deepeater-wiki           | 独立项目基线、方向对齐、飞书知识库只读检索 |
| deepeater-pm             | 产品设计、PRD、功能评审、MVP 边界 |
