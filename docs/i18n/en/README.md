# obs-localvocal-arch

[中文](../../../README.md) · [English](README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> Other languages: run `obs-captions-help <code>` (e.g. `obs-captions-help en`) to print this quick start in your language; `obs-captions-help --list` lists all codes. See the Chinese-only [i18n 说明](../../I18N.md) and [字幕翻译](../../TRANSLATION.md).
Real-time **Chinese** captions at the bottom of your OBS canvas on Arch / CachyOS / Arch-like Linux. User-level install: no sudo, no AUR, no compiling.

## 30-second quick start

Run these four commands in order (about 300 MB of downloads on first run).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **Install** — verifies and unpacks the official 0.6.2 `.deb`, adds the missing ICU70 / OpenBLAS libraries, downloads the multilingual Whisper model.
2. **Quit OBS completely**, then relaunch it through the wrapper so the plugin actually loads.
3. **In a second terminal** — create/update the audio filter and the bottom caption text source (idempotent, safe to re-run).
4. **Speak Chinese** into your microphone, then run the self-check. `VERIFY_OK` means everything is wired up.

## What it does

- Everything is user-level: plugin files land in `~/.config/obs-studio/plugins/obs-localvocal/`, `/usr` is untouched.
- Recognition runs locally on CPU through whisper.cpp — your audio never leaves the machine.
- The filter is attached to your microphone input with `whisper_language_select=zh` and `partial_group=true`, so partial lines stream out after roughly 1.1 s.
- Captions are a normal OBS text source (`text_ft2_source_v2`): bottom-centred, white text with black outline, positioned and sized from your canvas resolution.
- Because it is a scene source, stream viewers and the recording both show it — no browser source, no always-on-top window.

## Requirements

- OBS 33.x (`/usr/lib/libobs.so.30` must exist)
- Arch / CachyOS / Arch-like, x86_64
- `node >= 22` (built-in WebSocket), `curl`, `patchelf`, `sha256sum`
- A CJK font, e.g. `noto-fonts-cjk`

## Documentation

[Quick start](QUICKSTART.md) · [Full guide: settings, styling, translation, SRT, troubleshooting](../../GUIDE.md) · [How and why it is installed this way](../../ARCHITECTURE.md)

## License

GPL-2.0, same as upstream. This repository ships **no binaries**: the plugin, the model and the compatibility libraries are downloaded at install time and pinned by sha256. See `THIRD_PARTY.md`.
