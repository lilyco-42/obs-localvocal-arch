# Changelog

## v0.2.0 — 2026-11-13

- 多语言文档：README + QUICKSTART 译为 12 种语言（中/英/日/韩/西/法/德/俄/巴葡/阿/印地/波兰），每页带 12 项语言切换器。
- 新增 `obs-captions-help`：`--list` 列语言、`<代码>` 打印本地化入门；按 `CAPTION_UI_LANG` / `LANG` 自动识别，未匹配兜底英文。
- 安装器末尾引导与 PATH 提示改为本地化输出；安装 `lib/lang.mjs` / `lib/help.mjs` 并加入语法门禁。
- `CAPTION_LANG` 接受语言名 / locale / 别名（`chinese` → `zh`、`ja-JP` → `ja`），`auto` 转为空值触发自动检测。
- 新增 `docs/I18N.md`（i18n 范围、码表、加语言流程）与 `docs/TRANSLATION.md`（多语言识别、中译英、字体/RTL）。
- 修正 11 个翻译页「中文」链接、`docs/i18n/README.md` 索引链接；卸载脚本同步删除 `obs-captions-help`。

## v0.1.0 — 2026-11-13

- 初始发布：obs-localvocal 0.6.2 的 Arch/CachyOS 用户级安装器。
- 校验官方 .deb、ICU70、中文 Whisper 模型；补 OpenBLAS，<code>ldd -r</code> 门禁。
- Node 内置 WebSocket 的 obs-websocket 5 客户端；幂等创建滤镜与底部中文字幕源。
- 启动包装器、自检、可选场景模板、卸载脚本。
- 中文 README / QUICKSTART / GUIDE / ARCHITECTURE 与端到端出字截图。
