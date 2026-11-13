# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> 다른 언어: 터미널에서 `obs-captions-help <언어 코드>`(예: `obs-captions-help ko`)를 실행하면 해당 언어의 빠른 시작을 볼 수 있습니다. `obs-captions-help --list`로 전체 목록을 확인하세요. 중국어 전용 [i18n 说明](../../I18N.md), [字幕翻译](../../TRANSLATION.md)도 참고하세요.
Arch / CachyOS 계열 Linux에서 OBS 화면 하단에 **중국어** 실시간 자막을 표시합니다. 사용자 영역 설치: sudo 없음, AUR 없음, 컴파일 없음.

## 30초 빠른 시작

아래 네 명령을 순서대로 실행하세요. 첫 실행 시 약 300MB를 내려받습니다.

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **설치** — 공식 0.6.2 `.deb`를 검증 후 압축 해제하고, 부족한 ICU70 / OpenBLAS를 보충한 뒤 다국어 Whisper 모델을 받습니다.
2. **OBS를 완전히 종료**한 다음 래퍼로 다시 실행합니다(플러그인은 프로세스 시작 시에만 로드됩니다).
3. **다른 터미널에서** — 오디오 필터와 하단 자막 텍스트 소스를 생성/갱신합니다(여러 번 실행해도 중복되지 않음).
4. **마이크에 중국어로 말한 뒤** 자가 점검을 실행합니다. `VERIFY_OK`가 나오면 준비 완료입니다.

## 무엇을 하나요

- 모두 사용자 영역에 설치됩니다. 플러그인은 `~/.config/obs-studio/plugins/obs-localvocal/`에 놓이고 `/usr`은 건드리지 않습니다.
- 음성 인식은 whisper.cpp로 CPU에서 로컬 실행되며, 오디오는 외부로 전송되지 않습니다.
- 마이크 입력에 필터를 붙이고 `whisper_language_select=zh`, `partial_group=true`로 약 1.1초 만에 중간 결과가 흘러나옵니다.
- 자막은 일반 OBS 텍스트 소스(`text_ft2_source_v2`)입니다. 하단 중앙, 흰 글자 + 검은 외곽선, 캔버스 해상도에 맞춰 자동 배치됩니다.
- 장면 안의 소스이므로 방송 시청자와 녹화 파일 모두에 똑같이 보입니다. 브라우저 소스나 항상 위 창이 필요 없습니다.

## 요구 사항

- OBS 33.x (`/usr/lib/libobs.so.30` 필요)
- Arch / CachyOS 계열, x86_64
- `node >= 22`(내장 WebSocket), `curl`, `patchelf`, `sha256sum`
- CJK 글꼴(예: `noto-fonts-cjk`)

## 문서

[빠른 시작](QUICKSTART.md) · [전체 가이드: 설정, 스타일, 번역, SRT, 문제 해결](../../GUIDE.md) · [왜 이렇게 설치하는가](../../ARCHITECTURE.md)

## 라이선스

상류와 동일한 GPL-2.0. 이 저장소는 **바이너리를 포함하지 않습니다**. 플러그인, 모델, 호환 라이브러리는 설치 시 내려받고 sha256으로 검증합니다. 자세한 내용은 `THIRD_PARTY.md`.
