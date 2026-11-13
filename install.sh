#!/usr/bin/env bash
# obs-localvocal 0.6.2 user-level installer for Arch / CachyOS / Arch-like Linux.
# No sudo, no AUR, no system package modification.
set -euo pipefail

VERSION="0.6.2"
DEB_URL="https://github.com/royshil/obs-localvocal/releases/download/0.6.2/obs-localvocal-0.6.2-x86_64-linux-gnu-generic.deb"
DEB_SHA="6b487d640b993f9593bd76e770c5c3acb84d0f731960b25bb3061be9cabe58cf"
ICU_URL="https://archive.ubuntu.com/ubuntu/pool/main/i/icu/libicu70_70.1-2_amd64.deb"
ICU_SHA="58a154f6307289813da2276f900498ef536ae7c0522d2cf31a3c3c5cf62dfd9a"
MODEL_NAME="ggml-small-q5_1.bin"
MODEL_URL="${CAPTION_MODEL_URL:-https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-small-q5_1.bin}"
MODEL_SHA="${CAPTION_MODEL_SHA256:-ae85e4a935d7a567bd102fe55afc16bb595bdb618e11b2fc7591bc08120411bb}"
RAW_BASE="${CAPTION_RAW_BASE:-https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main}"

HOME_DIR="${HOME:?HOME 未设置}"
CONFIG_HOME="${XDG_CONFIG_HOME:-$HOME/.config}"
DATA_HOME="${XDG_DATA_HOME:-$HOME/.local/share}"
BIN_DIR="${XDG_BIN_HOME:-$HOME/.local/bin}"
CACHE_DIR="${CAPTION_CACHE_DIR:-$HOME/.cache/obs-localvocal-arch}"
PLUGIN_DIR="$CONFIG_HOME/obs-studio/plugins/obs-localvocal"
LIB_DIR="$PLUGIN_DIR/bin/64bit/obs-localvocal"
MODEL_DIR="$DATA_HOME/obs-localvocal/models"
HELPER_DIR="$DATA_HOME/obs-captions"
WS_CFG="$CONFIG_HOME/obs-studio/plugin_config/obs-websocket/config.json"
REPO_DIR="$(cd "$(dirname "$0")" 2>/dev/null && pwd || true)"
TMP_DIR="$(mktemp -d "${TMPDIR:-/tmp}/obs-localvocal-arch.XXXXXX")"
trap 'rm -rf "$TMP_DIR"' EXIT

die() { echo "ERROR: $*" >&2; exit 1; }
need() { command -v "$1" >/dev/null 2>&1 || die "缺少命令：$1（Arch 包名：$2）"; }
check_sha() {
  local file="$1" sha="$2"
  [[ -z "$sha" ]] && return 0
  printf '%s  %s\n' "$sha" "$file" | sha256sum -c - >/dev/null 2>&1
}
download() {
  local url="$1" out="$2" sha="$3"
  mkdir -p "$(dirname "$out")"
  if [[ -s "$out" ]] && check_sha "$out" "$sha"; then
    echo "CACHE_HIT  $(basename "$out")"
    return 0
  fi
  echo "DOWNLOAD   $(basename "$out")"
  curl -fL --retry 3 --connect-timeout 20 -o "$out.part" "$url" || die "下载失败：$url"
  check_sha "$out.part" "$sha" || die "SHA256 校验失败：$url（期望 $sha）"
  mv "$out.part" "$out"
}
extract_deb() {
  local deb="$1" dest="$2"
  rm -rf "$dest"; mkdir -p "$dest"
  if command -v dpkg-deb >/dev/null 2>&1; then
    dpkg-deb -x "$deb" "$dest"
  else
    ( cd "$dest" && ar x "$deb" && tar -xf data.tar.* )
  fi
}
asset() {
  local rel="$1" dest="$2"
  mkdir -p "$(dirname "$dest")"
  if [[ -n "$REPO_DIR" && -f "$REPO_DIR/$rel" ]]; then
    cp -a "$REPO_DIR/$rel" "$dest"
  else
    curl -fsSL --retry 3 "$RAW_BASE/$rel" -o "$dest" || die "无法取得 $rel（检查 CAPTION_RAW_BASE，或 git clone 后运行 ./install.sh）"
  fi
}

echo "== obs-localvocal $VERSION 用户级安装 =="
echo "插件: $PLUGIN_DIR"
echo "模型: $MODEL_DIR/$MODEL_NAME"
echo "命令: $BIN_DIR"

for pair in "curl:curl" "ar:binutils" "tar:tar" "patchelf:patchelf" "sha256sum:coreutils" "node:nodejs" "openssl:openssl"; do
  need "${pair%%:*}" "${pair##*:}"
done
[[ -f /usr/lib/libobs.so.30 ]] || echo "WARN: 未找到 /usr/lib/libobs.so.30；本方案针对 OBS 33.x"
node -e 'if (typeof WebSocket !== "function") process.exit(1)' || die "需要 Node >= 22（内置 WebSocket）"
if command -v fc-match >/dev/null 2>&1; then
  fc-match -f '%{family}\n' 'Noto Sans CJK SC' | head -n1 | grep -qi 'Noto Sans CJK' || echo "WARN: 未检测到 Noto Sans CJK SC，中文可能显示方块；建议安装 noto-fonts-cjk"
fi

mkdir -p "$PLUGIN_DIR/bin/64bit" "$PLUGIN_DIR/data" "$LIB_DIR" "$MODEL_DIR" "$HELPER_DIR/templates" "$BIN_DIR" "$CACHE_DIR"

DEB_FILE="$CACHE_DIR/obs-localvocal-0.6.2-generic.deb"
ICU_FILE="$CACHE_DIR/libicu70_70.1-2_amd64.deb"
OB_FILE="$CACHE_DIR/openblas.pkg.tar.zst"
MODEL_FILE="$MODEL_DIR/$MODEL_NAME"

download "$DEB_URL"   "$DEB_FILE"   "$DEB_SHA"
download "$ICU_URL"   "$ICU_FILE"   "$ICU_SHA"
download "$MODEL_URL" "$MODEL_FILE" "$MODEL_SHA"

echo "== 解包官方 .deb =="
extract_deb "$DEB_FILE" "$TMP_DIR/deb"
cp -a "$TMP_DIR/deb/usr/lib/x86_64-linux-gnu/obs-plugins/obs-localvocal.so" "$PLUGIN_DIR/bin/64bit/"
cp -a "$TMP_DIR/deb/usr/lib/x86_64-linux-gnu/obs-plugins/obs-localvocal/." "$LIB_DIR/"
cp -a "$TMP_DIR/deb/usr/share/obs/obs-plugins/obs-localvocal/." "$PLUGIN_DIR/data/"
[[ -f "$PLUGIN_DIR/data/locale/zh-CN.ini" ]] || die "解包缺少 locale/zh-CN.ini"

echo "== 补 ICU70 =="
extract_deb "$ICU_FILE" "$TMP_DIR/icu"
cp -a "$TMP_DIR/icu"/usr/lib/x86_64-linux-gnu/libicu*.so.70* "$LIB_DIR/"
[[ -e "$LIB_DIR/libicuuc.so.70" ]] || die "libicuuc.so.70 未就位"

echo "== 补 OpenBLAS =="
OB_URL="$(pacman -Sp openblas 2>/dev/null | head -n1 || true)"
if [[ -z "$OB_URL" ]]; then OB_URL="https://archlinux.org/packages/extra/x86_64/openblas/download/"; fi
download "$OB_URL" "$OB_FILE" ""
echo "OPENBLAS_SHA256 $(sha256sum "$OB_FILE" | awk '{print $1}')"
mkdir -p "$TMP_DIR/ob"
mapfile -t OB_MEMBERS < <(tar -tf "$OB_FILE" | grep -E 'libopenblas.*\.so' || true)
if (( ${#OB_MEMBERS[@]} == 0 )); then die "OpenBLAS 包里没找到 libopenblas*.so"; fi
tar -xf "$OB_FILE" -C "$TMP_DIR/ob" "${OB_MEMBERS[@]}"
find "$TMP_DIR/ob" -name 'libopenblas*.so*' -exec cp -a {} "$LIB_DIR/" \;
[[ -e "$LIB_DIR/libopenblas.so.0" ]] || die "libopenblas.so.0 未就位"

echo "== 修 RPATH 并校验动态库 =="
for so in "$LIB_DIR"/*.so*; do
  [[ -f "$so" && ! -L "$so" ]] && patchelf --set-rpath '$ORIGIN' "$so" || true
done
patchelf --set-rpath '$ORIGIN/obs-localvocal' "$PLUGIN_DIR/bin/64bit/obs-localvocal.so" || true
MISS="$(env -u LD_LIBRARY_PATH ldd -r "$PLUGIN_DIR/bin/64bit/obs-localvocal.so" 2>&1 | grep -E 'not found|undefined symbol' || true)"
if [[ -n "$MISS" ]]; then die "动态库校验失败：$MISS"; fi
echo "LDD_OK"

echo "== 安装启动器与自动配置脚本 =="
for mjs in obs-ws.mjs ws-config.mjs setup.mjs; do asset "lib/$mjs" "$HELPER_DIR/$mjs"; done
for b in obs-captions obs-captions-setup obs-captions-doctor; do asset "bin/$b" "$BIN_DIR/$b"; chmod 755 "$BIN_DIR/$b"; done
asset "templates/realtime-captions.scene.json" "$HELPER_DIR/templates/realtime-captions.scene.json"
node --check "$HELPER_DIR/obs-ws.mjs"
node --check "$HELPER_DIR/ws-config.mjs"
node --check "$HELPER_DIR/setup.mjs"
for b in obs-captions obs-captions-setup obs-captions-doctor; do bash -n "$BIN_DIR/$b"; done

echo "== 启用 obs-websocket（本机 4455，随机密码） =="
if [[ -f "$WS_CFG" ]]; then cp -a "$WS_CFG" "$WS_CFG.bak.$(date +%s)"; fi
node "$HELPER_DIR/ws-config.mjs" "$WS_CFG"
chmod 600 "$WS_CFG"

case ":$PATH:" in
  *":$BIN_DIR:"*) ;;
  *) printf '提示：把 %s 加入 PATH：export PATH="%s:$PATH"\n' "$BIN_DIR" "$BIN_DIR" ;;
esac

echo
echo "DONE. 接下来："
echo "  1) 完全退出正在运行的 OBS"
echo "  2) $BIN_DIR/obs-captions"
echo "  3) 另一个终端：$BIN_DIR/obs-captions-setup"
echo "  4) 说一句中文；用 $BIN_DIR/obs-captions-doctor 自检"
echo "  5) OBS 点「开始录制 / 开始直播」，字幕随画面输出"
