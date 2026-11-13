# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](README.md)


> Inne języki: uruchom `obs-captions-help <kod>` (np. `obs-captions-help pl`), aby wyświetlić ten szybki start w swoim języku; `obs-captions-help --list` wypisuje wszystkie kody. Zobacz też dostępne tylko po chińsku [i18n 说明](../../I18N.md) oraz [字幕翻译](../../TRANSLATION.md).
Napisy w języku **chińskim** w czasie rzeczywistym na dole sceny OBS w Arch / CachyOS / pokrewnych systemach Linux. Instalacja na poziomie użytkownika: bez sudo, bez AUR, bez kompilacji.

## Szybki start w 30 sekund

Uruchom te cztery polecenia po kolei (przy pierwszym uruchomieniu około 300 MB pobierania).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **Instalacja** — weryfikuje i rozpakowuje oficjalny plik `.deb` 0.6.2, dodaje brakujące biblioteki ICU70 / OpenBLAS i pobiera wielojęzyczny model Whisper.
2. **Zamknij OBS całkowicie**, a następnie uruchom go ponownie przez wrapper, aby wtyczka została faktycznie wczytana.
3. **W drugim terminalu** — tworzy lub aktualizuje filtr audio i źródło tekstu napisów na dole ekranu (idempotentnie, można powtarzać).
4. **Powiedz coś po chińsku** do mikrofonu i uruchom autotest. `VERIFY_OK` oznacza, że wszystko jest gotowe.

## Co to robi

- Wszystko zostaje w katalogu użytkownika: wtyczka trafia do `~/.config/obs-studio/plugins/obs-localvocal/`, katalog `/usr` nie jest zmieniany.
- Rozpoznawanie działa lokalnie na CPU przez whisper.cpp — dźwięk nie opuszcza komputera.
- Filtr jest podpięty do wejścia mikrofonu z `whisper_language_select=zh` i `partial_group=true`, więc cząstkowy tekst pojawia się po około 1,1 s.
- Napisy to zwykłe źródło tekstu OBS (`text_ft2_source_v2`): na dole, wyśrodkowane, białe litery z czarnym obrysem, dopasowane do rozdzielczości sceny.
- Ponieważ jest to źródło w scenie, widzą je zarówno widzowie transmisji, jak i plik nagrania — bez źródła przeglądarki i okna zawsze na wierzchu.

## Wymagania

- OBS 33.x (musi istnieć `/usr/lib/libobs.so.30`)
- Arch / CachyOS / rodzina Arch, x86_64
- `node >= 22` (wbudowany WebSocket), `curl`, `patchelf`, `sha256sum`
- Czcionka CJK, np. `noto-fonts-cjk`

## Dokumentacja

[Szybki start](QUICKSTART.md) · [Pełny przewodnik: ustawienia, styl, tłumaczenie, SRT, rozwiązywanie problemów](../../GUIDE.md) · [Jak i dlaczego instalujemy w ten sposób](../../ARCHITECTURE.md)

## Licencja

GPL-2.0, tak jak projekt źródłowy. To repozytorium **nie hostuje plików binarnych**: wtyczka, model i biblioteki zgodności są pobierane podczas instalacji i weryfikowane przez sha256. Zobacz `THIRD_PARTY.md`.
