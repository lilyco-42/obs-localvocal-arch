# 快速入门（3 分钟）


[中文](QUICKSTART.md) · [English](i18n/en/QUICKSTART.md) · [日本語](i18n/ja/QUICKSTART.md) · [한국어](i18n/ko/QUICKSTART.md) · [Español](i18n/es/QUICKSTART.md) · [Français](i18n/fr/QUICKSTART.md) · [Deutsch](i18n/de/QUICKSTART.md) · [Русский](i18n/ru/QUICKSTART.md) · [Português (Brasil)](i18n/pt-BR/QUICKSTART.md) · [العربية](i18n/ar/QUICKSTART.md) · [हिन्दी](i18n/hi/QUICKSTART.md) · [Polski](i18n/pl/QUICKSTART.md) · [i18n 说明](I18N.md) · [字幕翻译](TRANSLATION.md)
目标：说中文 → OBS 画面下方实时出中文字幕 → 开始直播/录制后观众可见。

> 其它语言：终端运行 `obs-captions-help <语言码>`（如 `obs-captions-help en`）查看对应语言快速入门；`obs-captions-help --list` 列出全部。详见 [i18n 说明](I18N.md) 与 [字幕翻译](TRANSLATION.md)。

## 0. 准备

- Arch / CachyOS / Arch-like Linux，x86_64
- OBS 33.x（确认 <code>/usr/lib/libobs.so.30</code> 存在）
- 已装 <code>curl ar tar patchelf sha256sum node openssl</code>；Node 需要 ≥ 22（用到内置 <code>WebSocket</code>）
- 中文字体，例如 <code>noto-fonts-cjk</code>（缺字体会显示方块）
- 麦克风在 OBS「设置 → 音频」里能正常收音

不需要 <code>sudo</code>，不需要 <code>yay</code>，不需要编译。

## 1. 安装

```bash
curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh | bash
```

或者先 clone：

```bash
git clone https://github.com/lilyco-42/obs-localvocal-arch.git
cd obs-localvocal-arch
./install.sh
```

脚本会：

1. 下载并校验官方 <code>obs-localvocal-0.6.2-x86_64-linux-gnu-generic.deb</code>（94MB）
2. 解到 <code>~/.config/obs-studio/plugins/obs-localvocal/</code>
3. 补 ICU70 与 OpenBLAS 兼容库，<code>ldd -r</code> 全解析才继续
4. 下载并校验中文模型 <code>ggml-small-q5_1.bin</code>（181MB）
5. 装 <code>obs-captions</code>、<code>obs-captions-setup</code>、<code>obs-captions-doctor</code>
6. 备份并启用 obs-websocket（本机 4455，随机密码，配置文件 600）

看到 <code>DONE</code> 即成功。重复执行是安全的，已下载且校验通过的文件会复用缓存。

## 2. 重启 OBS

**先完全退出已经开着的 OBS**（插件只在进程启动时加载）。然后：

```bash
obs-captions
```

如果 <code>~/.local/bin</code> 不在 PATH：

```bash
export PATH="$HOME/.local/bin:$PATH"
obs-captions
```

想指定场景集合：

```bash
obs-captions --collection 你的集合名 --profile 你的配置名
```

确认日志里出现：

```text
[obs-localvocal] plugin loaded successfully (version 0.6.2)
Loading whisper model from /home/你的用户名/.local/share/obs-localvocal/models/ggml-small-q5_1.bin
```

日志在 <code>~/.config/obs-studio/logs/</code>。

## 3. 自动配置

保持 OBS 开着，另开终端：

```bash
obs-captions-setup
```

它会连本机 WebSocket，找到当前场景和麦克风，创建/更新：

- 滤镜 <code>LocalVocal Transcription</code>（<code>transcription_filter_audio_filter</code>）
- 文本源 <code>LocalVocal Subtitles</code>（<code>text_ft2_source_v2</code>）
- 按当前画布分辨率把文本源放到底部居中

看到 <code>SETUP_OK</code> 和一段 JSON 摘要即可。重复执行不会建重复源。

## 4. 说话测试

对着麦克风说：**「你好，欢迎来到我的直播间。」**

字幕会先出现半句（例如「你好」「欢迎来到」），再稳定成整句。实测识别序列：

```text
你好 → 欢迎来到我的直播间。 → 今天我们来测试 → 今天我们来测试实时中文字幕。
```

自检：

```bash
obs-captions-doctor
```

输出 <code>VERIFY_OK</code> 表示滤镜、文本源、场景项都在且启用。

## 5. 进入直播 / 录制

直接点 OBS 的「开始录制」或「开始直播」。字幕文本源是场景的一部分，会被编码进画面，**不需要浏览器源、不需要置顶窗口、不需要额外插件**。

若你还要把游戏/桌面画面一起播：在 OBS 里给当前场景加「屏幕采集(PipeWire)」或「窗口采集」，并保证字幕文本源在来源列表上方（盖在画面上）。Wayland 首次会弹系统授权窗口，请点允许；无人值守授权被拒时 OBS 可能退出，见 GUIDE 的「PipeWire 授权」章节。

## 6. 下次开机 / 重启 OBS

```bash
obs-captions          # 启动带插件的 OBS
obs-captions-setup    # 可选；若上次配置没保存，幂等重建
```

OBS 只在**正常退出时**把滤镜写进场景集合文件；直接 <code>kill -9</code> 或崩溃后可能丢运行态滤镜，所以 <code>obs-captions-setup</code> 是官方兜底。想从干净场景开始，可选执行：

```bash
./scripts/install-scene-template.sh
```

然后在 OBS「场景集合」菜单选择「实时字幕」。

## 出问题？

| 现象 | 先做 |
| --- | --- |
| 完全没字 | <code>obs-captions-doctor</code>；确认没点麦克风静音；重跑 <code>obs-captions-setup</code> |
| OBS 没加载插件 | 用 <code>obs-captions</code> 而不是 <code>/usr/bin/obs</code> 启动；看日志 |
| 字是方块 | 装 <code>noto-fonts-cjk</code> 后重跑 <code>obs-captions-setup</code> 或改字体 |
| CPU 占用高 | 换 <code>ggml-tiny-q5_1</code> 模型，见 GUIDE |
| 4455 连不上 | 确认 OBS 已重启、配置文件 <code>server_enabled=true</code>、没被防火墙拦 |

完整排障：<code>docs/GUIDE.md</code>。
