#!/bin/bash
set -e

DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$DIR"

echo "=== 安装 deepeater skill 集合 ==="

SKILLS=(
  deepeater-wiki
  deepeater-pm
)

for skill in "${SKILLS[@]}"; do
  if [ -d "$skill" ] && [ -f "$skill/SKILL.md" ]; then
    echo "→ 安装 $skill ..."
    npx skills add "./$skill" -g -y
  else
    echo "⚠ 跳过 $skill （SKILL.md 不存在）"
  fi
done

echo ""
echo "=== 安装完成 ==="
echo "验证: npx skills list -g | grep deepeater"
