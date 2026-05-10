# deepeater-skills

食悟 AI 项目的团队 skill 集合。

每个 skill 都是独立的，参考 lark-cli 的设计模式，按领域分拆。

## 安装全部 skill

```bash
# 一键安装所有 skill
bash install.sh
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

## Skill 列表

| Skill                    | 说明                     |
|--------------------------|------------------------|
| deepeater-wiki           | 独立项目基线、方向对齐、飞书知识库只读检索 |
| deepeater-pm             | 产品设计、PRD、功能评审、MVP 边界 |
