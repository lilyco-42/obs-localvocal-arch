# obs-localvocal-arch

<p align="center"><img src="assets/screenshot.png" alt="实测：中文语音在 OBS 画面下方出字" width="720"></p>

**在 Arch / CachyOS / Arch-like Linux 上，用户级安装（无需 sudo、无需 AUR）把 <code>obs-localvocal 0.6.2</code> 跑起来：说中文 → OBS 画面下方实时出现中文字幕 → 直播/录制时观众可见。**

本仓库不是上游插件的副本，而是一套**可复现的安装器 + 自动配置脚本 + 中文使用指南**。插件二进制在运行时从官方 Release 下载；中文 Whisper 模型从 HuggingFace 下载；所有文件都装到用户目录，不污染 <code>/usr</code>。

- 上游：<https://github.com/royshil/obs-localvocal> （GPL-2.0，0.6.2）
- 实测环境：CachyOS / OBS 33.0.1 / OBS WebSocket 5.7.6 / Wayland + PipeWire / AMD CPU（无 NVIDIA）
- 效果：本地 CPU 识别，不上传声音；<code>partial_group</code> 先出半句再出整句，约 1.1s 延迟
- 证据：见 <code>docs/ARCHITECTURE.md</code> 与本页截图

---

## 30 秒快速入门

```bash
# 1. 安装（约 300MB 下载；会备份并启用本机 obs-websocket）
curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh | bash

# 2. 完全退出正在运行的 OBS，然后用包装器重启
obs-captions

# 3. 另开一个终端，自动加滤镜 + 底部字幕文本源
obs-captions-setup

# 4. 对着麦克风说一句中文；自检
obs-captions-doctor
```

如果终端提示找不到命令，把 <code>~/.local/bin</code> 加入 PATH：

```bash
export PATH="$HOME/.local/bin:$PATH"
```

然后正常点 OBS 的「开始录制」或「开始直播」：字幕是场景里的一个文本源，会随画面一起编码，**观众和录播文件都能看到**。

> 更完整步骤见 <code>docs/QUICKSTART.md</code>；参数、改样式、换模型、翻译、SRT、排障见 <code>docs/GUIDE.md</code>；为什么这么装见 <code>docs/ARCHITECTURE.md</code>。

---

## 它做了什么

| 步骤 | 落到哪里 |
| --- | --- |
| 解官方 <code>.deb</code> | <code>~/.config/obs-studio/plugins/obs-localvocal/{bin/64bit,data}</code> |
| 补 Arch 缺的 <code>libicuuc.so.70</code> / <code>libopenblas.so.0</code> | 同上插件私有库目录，<code>$ORIGIN</code> RPATH |
| 下载中文 <code>ggml-small-q5_1.bin</code>（181MB） | <code>~/.local/share/obs-localvocal/models/</code> |
| 启动包装器 | <code>~/.local/bin/obs-captions</code> |
| 启用并随机设置 obs-websocket 密码 | <code>~/.config/obs-studio/plugin_config/obs-websocket/config.json</code>（chmod 600） |
| 幂等创建滤镜/文本源 | <code>~/.local/share/obs-captions/setup.mjs</code> |

滤镜挂在「麦克风/辅助音频」上，设置 <code>whisper_language_select=zh</code>、外部模型路径、<code>subtitle_sources=LocalVocal Subtitles</code>、<code>partial_group=true</code>；文本源用 <code>Noto Sans CJK SC</code> 72 号白字黑描边，自动放在当前场景底部。

---

## 目录

```text
install.sh                        # 一键用户级安装
uninstall.sh                      # 卸载（不动系统包）
bin/obs-captions                  # OBS 启动包装器
bin/obs-captions-setup            # 自动配置滤镜 + 字幕源
bin/obs-captions-doctor           # 连接 OBS 自检
lib/obs-ws.mjs                    # obs-websocket 5 客户端（Node 内置 WebSocket）
lib/ws-config.mjs                 # 生成/开启本机 WS 配置
lib/setup.mjs                     # 幂等配置逻辑
scripts/install-scene-template.sh # 可选：导入干净的无屏幕采集场景集合
templates/realtime-captions.scene.json # 可选场景模板
docs/QUICKSTART.md                # 快速入门
docs/GUIDE.md                     # 使用指南 / 参数 / 排障
docs/ARCHITECTURE.md              # 原理、ABI、缺库、持久化、实测证据
assets/screenshot.png             # 中文语音端到端出字截图
```

## 适用与不适用

- ✅ OBS 33.x（需要 <code>libobs.so.30</code>）、Arch/CachyOS/Arch-like、x86_64、有麦克风输入
- ✅ 无 root 密码、不想用 AUR、不想编译源码
- ❌ OBS 30/31/32 或未来 ABI 变更版本（<code>libobs.so.30</code> 不匹配）
- ❌ 需要「中译英」翻译字幕：本方案默认同语言中文；可开启 Whisper 的 <code>translate</code> 输出英文，见 GUIDE
- ❌ 想把字幕单独作为平台字幕轨：默认关；可见字幕已经烧进画面，见 GUIDE

## 许可与致谢

安装脚本与文档采用 **GPL-2.0**（与上游一致）。本仓库**不托管**上游二进制；运行时下载的文件各自遵守其许可证，见 <code>THIRD_PARTY.md</code>。

上游作者与项目：<https://github.com/royshil/obs-localvocal>；模型：<https://huggingface.co/ggerganov/whisper.cpp>；OBS：<https://obsproject.com>。
