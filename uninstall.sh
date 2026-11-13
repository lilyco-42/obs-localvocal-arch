#!/usr/bin/env bash
# Remove the user-level install only. OBS scene collections are left untouched.
set -euo pipefail
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
BIN_DIR="${XDG_BIN_HOME:-$HOME/.local/bin}"
WS_DIR="$CONFIG_HOME/obs-studio/plugin_config/obs-websocket"

echo "将删除以下用户级文件（不会动系统包、不会动场景集合）："
echo "  $CONFIG_HOME/obs-studio/plugins/obs-localvocal"
echo "  $DATA_HOME/obs-localvocal"
echo "  $DATA_HOME/obs-captions"
echo "  $BIN_DIR/obs-captions*"
rm -rf "$CONFIG_HOME/obs-studio/plugins/obs-localvocal" "$DATA_HOME/obs-localvocal" "$DATA_HOME/obs-captions"
rm -f "$BIN_DIR/obs-captions" "$BIN_DIR/obs-captions-setup" "$BIN_DIR/obs-captions-doctor" "$BIN_DIR/obs-captions-help"
echo "DONE. 场景里的滤镜/文本源请在 OBS 中手动删除，或保留以便重装后继续使用。"
if compgen -G "$WS_DIR/config.json.bak.*" >/dev/null; then
  echo "obs-websocket 配置备份（需要时手动还原）："
  ls -1 "$WS_DIR"/config.json.bak.*
fi
