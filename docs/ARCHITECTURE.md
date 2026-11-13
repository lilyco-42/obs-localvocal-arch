# 原理与实测记录

## 为什么不是 <code>pacman -S</code> / <code>yay -S</code>

- 目标机器无免密 sudo，<code>pacman -S</code> / AUR 助手装不了系统包。
- AUR RPC 精确查询 <code>obs-localvocal</code> / <code>-bin</code> / <code>-git</code> 均无结果；<code>localvocal</code>、<code>obs whisper</code>、<code>obs transcription</code>、<code>live captions</code> 搜索也为 0。
- 上游 Linux Release 只有 Ubuntu 22.04 的 <code>.deb</code>（generic / amd / nvidia），没有通用 tar、没有 Arch 包；构建脚本硬查 <code>apt-get</code>（issue #62），issue #212 有人编译成功但 OBS 不显示插件。
- 因此采用**用户级等价解包**：OBS 33 的 Legacy User Plugin Root 是 <code>$XDG_CONFIG_HOME/obs-studio/plugins/%module%/bin/64bit/&lt;Plugin&gt;.so</code> + <code>data/</code>，正好可以放解包结果。

## 选型（build vs buy）

| 项目 | 结果 |
| --- | --- |
| <code>royshil/obs-localvocal</code> 0.6.2 | ✅ 采用：原生 OBS 音频滤镜，自动文本源，whisper.cpp 100 语言含中文，自带 zh-CN.ini，GPL-2.0 |
| <code>abb128/LiveCaptions</code> | ❌ AUR 最好装，但 README 明确 English only，中文会乱码；桌面浮窗非 OBS 源 |
| <code>niyongsheng/AudioScript</code> | ❌ 中文强，但要 Tauri/pnpm 构建 + 模型，浮窗非 OBS 源 |
| <code>Sharrnah/whispering</code> | ❌ 需自建 websocket → 浏览器源链路 |
| 自研 | ❌ 已有成熟原生滤镜，没必要 |

## ABI 与缺库

官方 generic <code>.deb</code> 的 <code>obs-localvocal.so</code>：

```text
NEEDED  libobs.so.30, libobs-frontend-api.so.30, libQt6*.so.6, libcurl.so.4,
        libonnxruntime.so.1.20.1, libicuuc.so.70, libwhisper.so.1,
        libggml.so, libggml-base.so, libopenblas.so.0
RUNPATH $ORIGIN/obs-localvocal
```

本机 OBS 33.0.1 提供 <code>libobs.so.30</code>；<code>.deb</code> 自带 onnxruntime/whisper/ggml/Qt 依赖。只缺两项：

| 缺库 | 来源 | 处理 |
| --- | --- | --- |
| <code>libicuuc.so.70</code> | Ubuntu jammy <code>libicu70_70.1-2_amd64.deb</code> | 系统 ICU 78 符号版本不兼容，抽 <code>libicu*.so.70*</code> 到插件私有目录 |
| <code>libopenblas.so.0</code> | Arch <code>extra/openblas</code>（或 CachyOS znver4 包） | <code>pacman -Sp openblas</code> 下载后解 <code>libopenblas.so.0.3</code> |

对私有目录里的所有真实 <code>.so</code> 执行 <code>patchelf --set-rpath '$ORIGIN'</code>；主插件保留 <code>$ORIGIN/obs-localvocal</code>。验收：

```bash
env -u LD_LIBRARY_PATH ldd -r ~/.config/obs-studio/plugins/obs-localvocal/bin/64bit/obs-localvocal.so
# rc=0，无 not found / undefined symbol
```

## 文件校验值（0.6.2）

| 文件 | SHA-256 |
| --- | --- |
| <code>obs-localvocal-0.6.2-x86_64-linux-gnu-generic.deb</code> | <code>6b487d640b993f9593bd76e770c5c3acb84d0f731960b25bb3061be9cabe58cf</code> |
| <code>libicu70_70.1-2_amd64.deb</code> | <code>58a154f6307289813da2276f900498ef536ae7c0522d2cf31a3c3c5cf62dfd9a</code> |
| <code>ggml-small-q5_1.bin</code> | <code>ae85e4a935d7a567bd102fe55afc16bb595bdb618e11b2fc7591bc08120411bb</code> |

OpenBLAS 是滚动发行包，不写死版本；脚本打印实际下载包的 sha256 供核对。

## 为什么需要 obs-websocket 引导

插件能自动建文本源，但源码里 <code>create_obs_text_source_if_needed()</code> 只在 <code>OBS_FRONTEND_EVENT_SCENE_COLLECTION_CHANGED</code> 回调触发。更稳的做法是：

1. 通过 obs-websocket 预建 <code>text_ft2_source_v2</code> 文本源并加入当前场景；
2. 在「麦克风/辅助音频」上创建 <code>transcription_filter_audio_filter</code>，把 <code>subtitle_sources</code> 指向它；
3. <code>SetSceneItemTransform</code> 放到底部。

协议：Hello(op0) → Identify(op1，密码 <code>base64(sha256(base64(sha256(password+salt))+challenge))</code>) → Identified(op2) → Request(op6)/RequestResponse(op7)，需 <code>Sec-WebSocket-Protocol: obswebsocket.json</code>。Node ≥22 自带全局 <code>WebSocket</code>，无需 npm 依赖。

### 持久化坑

实测 <code>SetCurrentSceneCollection</code> 不会立刻把 WS 创建的滤镜写进场景 JSON；只有 <code>kill -TERM</code> 让 OBS **正常退出**时，<code>AuxAudioDevice1.filters</code> 才出现完整对象。因此：

- 安装器提供场景模板；
- 同时提供 <code>obs-captions-setup</code> 作为每次启动后的幂等兜底（<code>GetSourceFilterList</code> 判断后 Create 或 Set，<code>GetInputList</code> 判断后 CreateInput，再 SetTransform）。

## 实测证据（2026-11-13，CachyOS / OBS 33.0.1）

- 日志：<code>[obs-localvocal] plugin loaded successfully (version 0.6.2)</code>；<code>Loading whisper model from .../ggml-small-q5_1.bin</code>；<code>Whisper model loaded: ... AVX512 = 1 | AVX512_VBMI = 1 | AVX512_VNNI = 1 | OPENMP = 1 | REPACK = 1</code>。
- WS 回读：滤镜 <code>enabled=true</code>、<code>zh</code>、<code>partial_group=true</code>、<code>subtitle_sources=LocalVocal Subtitles</code>；文本源 <code>Noto Sans CJK SC</code> 72、白字黑描边；场景项 <code>pos 960/920</code>、<code>bounds 1500×230</code>。
- 端到端：中文 TTS「你好，欢迎来到我的直播间。今天我们来测试实时中文字幕。」注入 null-sink monitor，OBS 采集后文本源依次出现 <code>你好</code> / <code>欢迎来到我的直播间。</code> / <code>今天我们来测试</code> / <code>今天我们来测试实时中文字幕。</code>；含流式中间态，识别准确。
- 画面：1280×720 场景截图底部白色像素 5307，bbox <code>(643,627,1089,671)</code>，底边留白 48px；见 <code>assets/screenshot.png</code>。
- 直播/录制：字幕是场景文本源，随 OBS 输出编码，不需要浏览器源或置顶窗口。

## PipeWire portal 退出问题

带 <code>pipewire-screen-capture-source</code> 且带 <code>RestoreToken</code> 的场景，在无人值守时出现：

```text
Failed to register with host portal QDBusError("org.freedesktop.portal.Error.Failed",
  "Could not register app ID: Connection already associated with an application ID")
[pipewire] Failed to start screencast, denied or cancelled by user
==== Shutting down ==================================================
Number of memory leaks: 1
```

对应 OBS 源码 <code>plugins/linux-pipewire/screencast-portal.c:227</code>。重启 <code>xdg-desktop-portal</code> 不解决；把源 <code>enabled=false</code> 也不完全阻止 session。最终用**完全不含该源的默认场景集合**规避，并把带屏幕采集的原集合保留为可选。这不是本插件的问题。
