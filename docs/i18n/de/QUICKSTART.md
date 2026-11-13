# Schnellstart (3 Minuten)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> Andere Sprachen: Mit `obs-captions-help <Code>` (z. B. `obs-captions-help de`) wird dieser Schnellstart in deiner Sprache ausgegeben; `obs-captions-help --list` zeigt alle Codes. Siehe auch die nur auf Chinesisch verfügbaren [i18n 说明](../../I18N.md) und [字幕翻译](../../TRANSLATION.md).
**Ziel:** Chinesisch sprechen → Untertitel erscheinen in Echtzeit am unteren Rand der OBS-Leinwand → Zuschauer sehen sie im Stream und in der Aufnahme.

## 0. Vorbereitung

- OBS 33.x und `node >= 22`; `curl`, `patchelf`, `sha256sum` verfügbar.
- Ein Mikrofon, das in OBS bereits funktioniert (Einstellungen → Audio).
- Eine CJK-Schrift wie `noto-fonts-cjk`, sonst erscheinen die Untertitel als Kästchen.
- `sudo`, `yay` oder Kompilieren sind **nicht** nötig.

## 1. Installieren

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

Mehrfaches Ausführen ist unbedenklich: Downloads mit passender sha256 werden aus dem Cache (`~/.cache/obs-localvocal-arch`) wiederverwendet. Am Ende steht `DONE`.

## 2. OBS neu starten

Beende ein laufendes OBS **vollständig** — Plugins werden nur beim Prozessstart geladen. Starte es dann über den Wrapper:

```bash
obs-captions
```

Prüfe im Log unter `~/.config/obs-studio/logs/`, ob `plugin loaded successfully (version 0.6.2)` und `Loading whisper model from ...` erscheinen.

## 3. Filter und Untertitelquelle anlegen

```bash
obs-captions-setup
```

OBS geöffnet lassen und ein zweites Terminal nutzen. Das Skript verbindet sich mit dem lokalen obs-websocket, ermittelt aktuelle Szene und Mikrofon-Eingang und legt den Filter `LocalVocal Transcription` sowie die Textquelle `LocalVocal Subtitles` an bzw. aktualisiert sie — unten in der Leinwand platziert. `SETUP_OK` bedeutet fertig.

## 4. Sprechen und prüfen

Sprich **„你好，欢迎来到我的直播间。“** ins Mikrofon. Die Untertitel erscheinen zuerst als Teiltext und werden dann zu einem vollständigen Satz. Danach:

```bash
obs-captions-doctor
```

## 5. Streamen oder aufnehmen

Einfach in OBS „Aufnahme starten“ oder „Streaming starten“ drücken. Wenn du zusätzlich Bildschirm oder Spiel aufnimmst, ziehe `LocalVocal Subtitles` in der Quellenliste nach oben, damit sie über dem Video liegt.

## 6. Beim nächsten Mal

```bash
obs-captions          # OBS mit Plugin starten
obs-captions-setup    # optional: Filter idempotent wiederherstellen
```

OBS schreibt den Filter nur beim normalen Beenden in die Szenensammlung; nach einem Absturz oder `kill -9` kann er fehlen. `obs-captions-setup` stellt ihn wieder her.

## Etwas funktioniert nicht?

| Symptom | Zuerst probieren |
| --- | --- |
| Keine Untertitel | `obs-captions-doctor`; prüfen, ob das Mikrofon stumm ist; `obs-captions-setup` erneut ausführen |
| Plugin wird nicht geladen | Mit `obs-captions` statt `/usr/bin/obs` starten und Log prüfen |
| Kästchen statt Zeichen | `noto-fonts-cjk` installieren, dann `obs-captions-setup` erneut ausführen |
| Hohe CPU-Last | Auf `ggml-tiny-q5_1` oder `ggml-base-q5_1` wechseln, siehe Anleitung |
| Port 4455 nicht erreichbar | OBS muss neu gestartet werden; `server_enabled=true` in `config.json` prüfen |

[Vollständige Anleitung: Einstellungen, Gestaltung, Übersetzung, SRT, Fehlersuche](../../GUIDE.md) — Einstellungen, Gestaltung, Übersetzung, SRT und die vollständige Fehlersuche.
