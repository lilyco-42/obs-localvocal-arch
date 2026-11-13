# 빠른 시작(3분)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> 다른 언어: 터미널에서 `obs-captions-help <언어 코드>`(예: `obs-captions-help ko`)를 실행하면 해당 언어의 빠른 시작을 볼 수 있습니다. `obs-captions-help --list`로 전체 목록을 확인하세요. 중국어 전용 [i18n 说明](../../I18N.md), [字幕翻译](../../TRANSLATION.md)도 참고하세요.
**목표:** 중국어로 말하기 → OBS 화면 하단에 실시간 자막 표시 → 방송·녹화 시청자가 볼 수 있음.

## 0. 준비

- OBS 33.x와 `node >= 22`, `curl`, `patchelf`, `sha256sum` 사용 가능.
- OBS 설정 → 오디오에서 마이크가 정상 동작.
- `noto-fonts-cjk` 같은 CJK 글꼴(없으면 자막이 네모로 보입니다).
- `sudo` / `yay` / 컴파일은 **필요 없습니다**.

## 1. 설치

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

여러 번 실행해도 안전합니다. sha256이 일치하는 파일은 캐시(`~/.cache/obs-localvocal-arch`)에서 재사용됩니다. 끝나면 `DONE`이 출력됩니다.

## 2. OBS 재시작

실행 중인 OBS를 **완전히 종료**하세요. 플러그인은 프로세스 시작 시에만 로드됩니다. 그런 다음 래퍼로 실행합니다:

```bash
obs-captions
```

`~/.config/obs-studio/logs/` 로그에 `plugin loaded successfully (version 0.6.2)`와 `Loading whisper model from ...`이 있는지 확인하세요.

## 3. 필터와 자막 소스 만들기

```bash
obs-captions-setup
```

OBS는 켜 둔 채 다른 터미널에서 실행합니다. 로컬 obs-websocket에 접속해 현재 장면과 마이크 입력을 찾고, `LocalVocal Transcription` 필터와 `LocalVocal Subtitles` 텍스트 소스를 생성/갱신해 화면 하단에 배치합니다. `SETUP_OK`가 나오면 완료입니다.

## 4. 말하고 확인하기

마이크에 **“你好，欢迎来到我的直播间。”** 라고 말해 보세요. 자막이 먼저 중간 결과로 나타났다가 완전한 문장으로 정리됩니다. 이어서:

```bash
obs-captions-doctor
```

## 5. 방송·녹화하기

OBS에서 녹화 시작 또는 방송 시작을 누르면 됩니다. 화면이나 게임도 함께 송출한다면 `LocalVocal Subtitles`를 소스 목록 맨 위로 끌어 영상 위에 표시되게 하세요.

## 6. 다음 실행

```bash
obs-captions          # 플러그인과 함께 OBS 시작
obs-captions-setup    # 선택: 필터를 멱등하게 복원
```

OBS는 정상 종료할 때만 필터를 장면 컬렉션에 기록하므로, 비정상 종료나 `kill -9` 후에는 런타임 필터가 사라질 수 있습니다. `obs-captions-setup`으로 복구하세요.

## 문제가 생겼다면

| 증상 | 먼저 해볼 것 |
| --- | --- |
| 자막이 전혀 안 나옴 | `obs-captions-doctor` 실행, 마이크 음소거 확인, `obs-captions-setup` 재실행 |
| 플러그인이 로드되지 않음 | `/usr/bin/obs` 대신 `obs-captions`로 실행하고 로그 확인 |
| 글자가 네모로 보임 | `noto-fonts-cjk` 설치 후 `obs-captions-setup` 재실행 |
| CPU 사용량이 높음 | `ggml-tiny-q5_1` 또는 `ggml-base-q5_1`로 교체(가이드 참고) |
| 4455 포트 연결 실패 | OBS 재시작 필요, `config.json`의 `server_enabled=true` 확인 |

[전체 가이드: 설정, 스타일, 번역, SRT, 문제 해결](../../GUIDE.md) — 설정, 스타일, 번역, SRT, 전체 문제 해결 목록.
