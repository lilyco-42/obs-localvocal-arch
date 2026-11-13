# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> Andere Sprachen: Mit `obs-captions-help <Code>` (z. B. `obs-captions-help de`) wird dieser Schnellstart in deiner Sprache ausgegeben; `obs-captions-help --list` zeigt alle Codes. Siehe auch die nur auf Chinesisch verfügbaren [i18n 说明](../../I18N.md) und [字幕翻译](../../TRANSLATION.md).
**Chinesische** Echtzeit-Untertitel am unteren Rand der OBS-Leinwand unter Arch / CachyOS / ähnlichen Linux-Systemen. Installation im Benutzerverzeichnis: kein sudo, kein AUR, kein Kompilieren.

## 30-Sekunden-Schnellstart

Führe diese vier Befehle der Reihe nach aus (beim ersten Mal etwa 300 MB Download).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **Installieren** — prüft und entpackt das offizielle 0.6.2-`.deb`, ergänzt fehlende ICU70-/OpenBLAS-Bibliotheken und lädt das mehrsprachige Whisper-Modell.
2. **OBS vollständig beenden** und über den Wrapper neu starten, damit das Plugin wirklich geladen wird.
3. **In einem zweiten Terminal** — Audiоfilter und Untertitel-Textquelle am unteren Rand anlegen bzw. aktualisieren (idempotent, beliebig oft ausführbar).
4. **Chinesisch ins Mikrofon sprechen** und anschließend den Selbsttest starten. `VERIFY_OK` bedeutet: alles ist eingerichtet.

## Was es tut

- Alles bleibt im Benutzerverzeichnis: Das Plugin liegt in `~/.config/obs-studio/plugins/obs-localvocal/`, `/usr` bleibt unberührt.
- Die Erkennung läuft lokal auf der CPU über whisper.cpp — das Audio verlässt den Rechner nicht.
- Der Filter hängt an der Mikrofon-Eingabe, mit `whisper_language_select=zh` und `partial_group=true`; Teiltext erscheint nach etwa 1,1 s.
- Untertitel sind eine normale OBS-Textquelle (`text_ft2_source_v2`): unten zentriert, weißer Text mit schwarzer Kontur, passend zur Canvas-Auflösung.
- Da es eine Szenenquelle ist, sehen es Zuschauer im Livestream und im aufgezeichneten Video gleichermaßen — ohne Browserquelle oder Always-on-Top-Fenster.

## Voraussetzungen

- OBS 33.x (`/usr/lib/libobs.so.30` muss vorhanden sein)
- Arch / CachyOS / Arch-Familie, x86_64
- `node >= 22` (eingebautes WebSocket), `curl`, `patchelf`, `sha256sum`
- Eine CJK-Schrift, z. B. `noto-fonts-cjk`

## Dokumentation

[Schnellstart](QUICKSTART.md) · [Vollständige Anleitung: Einstellungen, Gestaltung, Übersetzung, SRT, Fehlersuche](../../GUIDE.md) · [Wie und warum so installiert wird](../../ARCHITECTURE.md)

## Lizenz

GPL-2.0, wie das Upstream-Projekt. Dieses Repository enthält **keine Binärdateien**: Plugin, Modell und Kompatibilitätsbibliotheken werden bei der Installation geladen und per sha256 geprüft. Siehe `THIRD_PARTY.md`.
