# 使用指南

## 1. 链路

```text
麦克风 → OBS「麦克风/辅助音频」→ LocalVocal 音频滤镜 → whisper.cpp（本地 CPU）
      → 文本源 LocalVocal Subtitles → 当前场景画布 → 编码器 → 直播 / 录制文件
```

字幕是 **OBS 文本源**，不是桌面浮窗，也不是浏览器源；因此录播文件与直播画面天然一致。

## 2. 安装可选项

| 环境变量 | 默认 | 作用 |
| --- | --- | --- |
| <code>CAPTION_MODEL_URL</code> | Whisper small q5 | 换模型下载地址 |
| <code>CAPTION_MODEL_SHA256</code> | small q5 的 sha256 | 换模型必须同步改校验值 |
| <code>CAPTION_CACHE_DIR</code> | <code>~/.cache/obs-localvocal-arch</code> | 下载缓存目录 |
| <code>CAPTION_RAW_BASE</code> | 本仓库 main 的 raw 地址 | piped install 时取辅助脚本的地址 |
| <code>OBS_BIN</code> | <code>/usr/bin/obs</code> | 自定义 OBS 可执行文件 |
| <code>XDG_CONFIG_HOME</code> / <code>XDG_DATA_HOME</code> / <code>XDG_BIN_HOME</code> | 各自默认值 | 用户级安装位置 |

示例：离线/内网复用缓存：

```bash
CAPTION_CACHE_DIR=/mnt/share/obs-cache ./install.sh
```

示例：换更小更快的模型（仍须多语言、非 <code>.en</code>）：

```bash
CAPTION_MODEL_URL=https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base-q5_1.bin \
CAPTION_MODEL_SHA256=422f1ae452ade6f30a004d7e5c6a43195e4433bc370bf23fac9cc591f01a8898 \
./install.sh
```

换模型后，<code>obs-captions-setup</code> 默认仍指向 <code>ggml-small-q5_1.bin</code>；若文件名不同，用 <code>CAPTION_MODEL</code> 指定：

```bash
CAPTION_MODEL="$HOME/.local/share/obs-localvocal/models/ggml-base-q5_1.bin" obs-captions-setup
```

> 注意：<code>ggml-tiny.en</code> / <code>ggml-model-whisper-tiny-en</code> 是英文专用模型，中文会乱；必须选不带 <code>.en</code> 的多语言模型。

## 3. 自动配置参数

<code>obs-captions-setup</code> 读取以下环境变量：

| 变量 | 默认 | 说明 |
| --- | --- | --- |
| <code>CAPTION_LANG</code> | <code>zh</code> | Whisper 输入语言；固定 zh 更稳 |
| <code>CAPTION_TRANSLATE</code> | 关 | 设为 <code>1</code> 开启 Whisper「翻译成英语」 |
| <code>CAPTION_FONT</code> | <code>Noto Sans CJK SC</code> | 字体家族 |
| <code>CAPTION_SIZE</code> | 按分辨率缩放（1080p→72） | 字号 |
| <code>CAPTION_MODEL</code> | small q5 路径 | 外部模型文件 |

滤镜关键设置（可在 OBS「滤镜」面板里改）：

| 键 | 值 / 含义 |
| --- | --- |
| <code>whisper_model_path</code> | <code>!!!external!!!</code>，告诉插件用外部模型 |
| <code>whisper_model_path_external</code> | 本地 <code>.bin</code> 绝对路径 |
| <code>whisper_language_select</code> | <code>zh</code>；默认是 <code>en</code>，必须改 |
| <code>subtitle_sources</code> | <code>LocalVocal Subtitles</code> |
| <code>partial_group</code> | <code>true</code> 流式半句；**不是** <code>partial_transcription</code> |
| <code>partial_latency</code> | 1100ms，越小越跟嘴但越容易抖动 |
| <code>segment_duration</code> | 7000ms，切分长度 |
| <code>buffered_output</code> / <code>buffer_num_lines</code> / <code>buffer_num_chars_per_line</code> | 多行缓冲输出；默认关闭/2 行/30 字 |
| <code>vad_threshold</code> | 0.65，静音检测阈值 |
| <code>translate</code> | Whisper 翻译到英文；默认 false |
| <code>caption_to_stream</code> | 平台字幕轨；默认 false（可见字幕不依赖它） |
| <code>subtitle_save_srt</code> | 导出 SRT；默认 false |
| <code>backend_device</code> | <code>-1</code> 让插件自选；本机实测 CPU 即可实时 |

## 4. 改样式与位置

最快：在 OBS 来源列表选中 <code>LocalVocal Subtitles</code> → 「属性」改字体、字号、颜色、描边、换行；在预览里拖到底部。

用脚本重设：

```bash
CAPTION_FONT="Noto Serif CJK SC" CAPTION_SIZE=64 obs-captions-setup
```

1080p 实测位置：<code>positionX=960</code>、<code>positionY=920</code>、<code>bounds 1500×230</code>、<code>OBS_BOUNDS_NONE</code>、居中对齐；字幕底边留约 48px，不贴边。脚本按当前画布宽高自动缩放。

## 5. 屏幕画面一起播

1. 当前场景里加「屏幕采集(PipeWire)」/「窗口采集」/「视频采集设备」等。
2. 把 <code>LocalVocal Subtitles</code> 拖到来源列表顶部（越靠上越盖在画面上）。
3. 若字幕被裁掉，重跑 <code>obs-captions-setup</code> 或手动调 y。

Wayland / PipeWire 注意：OBS 33 的 <code>pipewire-screen-capture-source</code> 会向 xdg-desktop-portal 申请授权；无人值守或 app ID 冲突时日志出现：

```text
Failed to register with host portal ... Connection already associated with an application ID
[pipewire] Failed to start screencast, denied or cancelled by user
==== Shutting down ==================================================
```

这不是插件崩溃，是授权被拒后 OBS 正常关闭。解决：

- 首次启动在桌面**手动点允许**；
- 临时只用字幕/摄像头时，用不带屏幕采集的场景集合（<code>scripts/install-scene-template.sh</code> 可导入一个）；
- 不要 <code>kill -9</code> OBS，正常退出会保存滤镜。

## 6. 直播、录制、平台字幕

- **可见字幕**：直接「开始直播 / 开始录制」，文本源随画面编码，观众与录播文件都看得到。
- **平台字幕轨（可选）**：在滤镜属性勾 <code>caption_to_stream</code>；这依赖平台支持 OBS 的 caption text 输出，与可见字幕是两回事。
- **SRT（可选）**：勾 <code>subtitle_save_srt</code>，用于后期；不影响直播画面。

## 7. 翻译 / 其它语言

- 同语言中文（默认）：<code>CAPTION_LANG=zh</code>、<code>translate=false</code>。
- 说中文出英文：<code>CAPTION_TRANSLATE=1 obs-captions-setup</code>（Whisper 内置翻译，不是大模型翻译）。
- 说英文出英文字幕：<code>CAPTION_LANG=en obs-captions-setup</code>。
- 日/韩等：改 <code>CAPTION_LANG</code> 为对应 whisper 语言码，并确保模型是多语言版。

## 8. 隐私与性能

- 音频只在本地送进 whisper.cpp；<code>obs-websocket</code> 带随机密码，配置文件 600。
- OBS 的 WebSocket 可能绑定所有网卡；若在公共网络，请防火墙阻止 4455，或仅在可信网络使用。
- small q5 约 181MB、CPU 16 核可实时；tiny q5 约 31MB 更快但准确率低；large 模型 CPU 可能跟不上。
- 延迟主要来自 <code>partial_latency</code> 与 <code>segment_duration</code>，不是网络。

## 9. 故障排查清单

1. <code>obs-captions-doctor</code>：检查滤镜/文本源/场景项/WS。
2. 日志 <code>~/.config/obs-studio/logs/</code> 里应有 <code>plugin loaded successfully (version 0.6.2)</code>、<code>Loading whisper model from ...</code>、<code>Whisper model loaded</code>。
3. 没加载插件：确认用 <code>obs-captions</code> 启动；确认路径是 <code>~/.config/obs-studio/plugins/obs-localvocal/bin/64bit/obs-localvocal.so</code>；<code>env -u LD_LIBRARY_PATH ldd -r</code> 无 <code>not found</code>。
4. 没字：麦克风是否静音、是否选错输入、滤镜是否启用、<code>whisper_language_select</code> 是否还是 <code>en</code>、模型路径是否存在。
5. 字是方块：装 CJK 字体，或改 <code>CAPTION_FONT</code>。
6. WebSocket 连不上：OBS 是否重启、<code>config.json</code> 是否 <code>server_enabled=true</code>、端口是否被占。
7. 重启后滤镜消失：OBS 只在正常退出时序列化滤镜；重跑 <code>obs-captions-setup</code> 即可。
8. OBS 启动后自己退出：看本节第 5 条 PipeWire 授权。
9. ABI 不匹配：本方案针对 <code>libobs.so.30</code>（OBS 33）；升级 OBS 后需重新核对 NEEDED。

## 10. 卸载

```bash
./uninstall.sh
```

只删用户级插件、模型、辅助脚本和启动器；不会动系统包、不会动 OBS 场景集合。场景里的滤镜/文本源请手动删除，或保留以便重装后继续使用。obs-websocket 配置备份形如 <code>config.json.bak.&lt;时间戳&gt;</code>，需要时手动还原。
