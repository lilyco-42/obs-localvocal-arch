# Quick start (3 minutes)

[中文](../../QUICKSTART.md) · [English](QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> Other languages: run `obs-captions-help <code>` (e.g. `obs-captions-help en`) to print this quick start in your language; `obs-captions-help --list` lists all codes. See the Chinese-only [i18n 说明](../../I18N.md) and [字幕翻译](../../TRANSLATION.md).
**Goal:** speak Chinese → captions appear in real time at the bottom of the OBS canvas → viewers see them when you go live or record.

## 0. Before you start

- OBS 33.x and `node >= 22`; `curl`, `patchelf`, `sha256sum` available.
- A microphone that already works in OBS (Settings → Audio).
- A CJK font such as `noto-fonts-cjk`, otherwise captions render as empty boxes.
- `sudo` / `yay` / compiling are **not** needed.

## 1. Install

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

Repeat runs are safe: downloads that already match their sha256 are reused from the cache (`~/.cache/obs-localvocal-arch`). The script prints `DONE` when finished.

## 2. Restart OBS

Quit the running OBS **completely** first — plugins are only loaded when the process starts. Then launch it through the wrapper:

```bash
obs-captions
```

Confirm the log in `~/.config/obs-studio/logs/` contains `plugin loaded successfully (version 0.6.2)` and `Loading whisper model from ...`.

## 3. Create the filter and caption source

```bash
obs-captions-setup
```

Keep OBS running and use another terminal. The script connects to the local obs-websocket, finds the current scene and the microphone input, then creates or updates the `LocalVocal Transcription` filter and the `LocalVocal Subtitles` text source and places it at the bottom of the canvas. `SETUP_OK` means done.

## 4. Speak and verify

Say **“你好，欢迎来到我的直播间。”** Captions first appear as partial text and then settle into a complete sentence. Then:

```bash
obs-captions-doctor
```

## 5. Go live or record

Just press Start Recording or Start Streaming in OBS. If you also capture your screen or a game, drag `LocalVocal Subtitles` to the top of the source list so it draws above the video.

## 6. Next time

```bash
obs-captions          # start OBS with the plugin
obs-captions-setup    # optional, restore the filter idempotently
```

OBS only serialises the filter into the scene collection when it exits normally, so a crash or `kill -9` can lose the runtime filter; `obs-captions-setup` puts it back.

## Something wrong?

| Symptom | First thing to try |
| --- | --- |
| No captions at all | `obs-captions-doctor`; check the mic is not muted; re-run `obs-captions-setup` |
| Plugin not loaded | Start with `obs-captions`, not `/usr/bin/obs`, and read the log |
| Boxes instead of characters | Install `noto-fonts-cjk`, then re-run `obs-captions-setup` |
| High CPU usage | Switch to `ggml-tiny-q5_1` or `ggml-base-q5_1`, see the guide |
| Port 4455 unreachable | OBS must be restarted; check `server_enabled=true` in `config.json` |

[Full guide: settings, styling, translation, SRT, troubleshooting](../../GUIDE.md) — settings, styling, translation, SRT and the full troubleshooting list.
