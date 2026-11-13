# Szybki start (3 minuty)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](QUICKSTART.md)


> Inne języki: uruchom `obs-captions-help <kod>` (np. `obs-captions-help pl`), aby wyświetlić ten szybki start w swoim języku; `obs-captions-help --list` wypisuje wszystkie kody. Zobacz też dostępne tylko po chińsku [i18n 说明](../../I18N.md) oraz [字幕翻译](../../TRANSLATION.md).
**Cel:** mówić po chińsku → napisy pojawiają się w czasie rzeczywistym na dole sceny OBS → widzowie widzą je na żywo i w nagraniu.

## 0. Przygotowanie

- OBS 33.x i `node >= 22`; dostępne `curl`, `patchelf`, `sha256sum`.
- Mikrofon, który już działa w OBS (Ustawienia → Dźwięk).
- Czcionka CJK, np. `noto-fonts-cjk`, inaczej napisy będą kwadratami.
- `sudo`, `yay` i kompilacja **nie są** potrzebne.

## 1. Instalacja

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

Ponowne uruchomienie jest bezpieczne: pliki o zgodnym sha256 są ponownie użyte z cache (`~/.cache/obs-localvocal-arch`). Na końcu pojawia się `DONE`.

## 2. Restart OBS

Najpierw **całkowicie zamknij** działający OBS — wtyczki wczytują się tylko przy starcie procesu. Potem uruchom go przez wrapper:

```bash
obs-captions
```

W logu `~/.config/obs-studio/logs/` sprawdź `plugin loaded successfully (version 0.6.2)` oraz `Loading whisper model from ...`.

## 3. Utwórz filtr i źródło napisów

```bash
obs-captions-setup
```

Zostaw OBS włączony i użyj drugiego terminala. Skrypt łączy się z lokalnym obs-websocket, znajduje bieżącą scenę i wejście mikrofonu, a następnie tworzy lub aktualizuje filtr `LocalVocal Transcription` i źródło tekstu `LocalVocal Subtitles`, umieszczając je na dole sceny. `SETUP_OK` oznacza koniec.

## 4. Mów i sprawdź

Powiedz do mikrofonu **„你好，欢迎来到我的直播间。”** Napisy najpierw pojawiają się jako tekst cząstkowy, potem stabilizują się w pełne zdanie. Następnie:

```bash
obs-captions-doctor
```

## 5. Transmisja lub nagrywanie

Wystarczy kliknąć „Rozpocznij nagrywanie” lub „Rozpocznij transmisję” w OBS. Jeśli przechwytujesz też ekran lub grę, przeciągnij `LocalVocal Subtitles` na początek listy źródeł, aby był nad obrazem.

## 6. Następnym razem

```bash
obs-captions          # uruchom OBS z wtyczką
obs-captions-setup    # opcjonalnie: idempotentnie odtwórz filtr
```

OBS zapisuje filtr w kolekcji scen tylko przy normalnym zamknięciu, więc po awarii lub `kill -9` filtr może zniknąć; przywraca go `obs-captions-setup`.

## Coś nie działa?

| Objaw | Co sprawdzić najpierw |
| --- | --- |
| Brak jakichkolwiek napisów | `obs-captions-doctor`; sprawdź, czy mikrofon nie jest wyciszony; uruchom `obs-captions-setup` ponownie |
| Wtyczka się nie wczytuje | Uruchamiaj przez `obs-captions`, nie `/usr/bin/obs`, i przeczytaj log |
| Kwadraty zamiast znaków | Zainstaluj `noto-fonts-cjk`, potem uruchom `obs-captions-setup` ponownie |
| Wysokie użycie CPU | Zmień na `ggml-tiny-q5_1` lub `ggml-base-q5_1`, zobacz przewodnik |
| Port 4455 niedostępny | Wymagany restart OBS; sprawdź `server_enabled=true` w `config.json` |

[Pełny przewodnik: ustawienia, styl, tłumaczenie, SRT, rozwiązywanie problemów](../../GUIDE.md) — ustawienia, styl, tłumaczenie, SRT i pełna lista problemów.
