#!/usr/bin/env bash
# Optional: install a clean scene collection with no PipeWire screen-capture source.
set -euo pipefail
REPO_DIR="$(cd "$(dirname "$0")/.." 2>/dev/null && pwd || true)"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
RAW_BASE="${CAPTION_RAW_BASE:-https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main}"
HELPER_TEMPLATE="$DATA_HOME/obs-captions/templates/realtime-captions.scene.json"
TEMPLATE="$HELPER_TEMPLATE"
if [[ ! -f "$TEMPLATE" && -n "$REPO_DIR" && -f "$REPO_DIR/templates/realtime-captions.scene.json" ]]; then
  TEMPLATE="$REPO_DIR/templates/realtime-captions.scene.json"
fi
if [[ ! -f "$TEMPLATE" ]]; then
  TEMPLATE="$(mktemp)"
  curl -fsSL "$RAW_BASE/templates/realtime-captions.scene.json" -o "$TEMPLATE"
fi
MODEL="${CAPTION_MODEL:-$DATA_HOME/obs-localvocal/models/ggml-small-q5_1.bin}"
SCENES="$CONFIG_HOME/obs-studio/basic/scenes"
DEST="$SCENES/实时字幕.json"
mkdir -p "$SCENES"
if [[ -f "$DEST" ]]; then cp -a "$DEST" "$DEST.bak.$(date +%s)"; fi
sed "s|@MODEL_PATH@|$MODEL|g" "$TEMPLATE" > "$DEST"
echo "SCENE_TEMPLATE_INSTALLED $DEST"
echo "请在 OBS 菜单「场景集合」选择「实时字幕」，然后重启 OBS 或执行 obs-captions-setup。"
