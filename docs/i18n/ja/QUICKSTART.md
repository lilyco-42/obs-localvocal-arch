# クイックスタート（3 分）

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> 他の言語：ターミナルで `obs-captions-help <言語コード>`（例 `obs-captions-help ja`）を実行すると、その言語のクイックスタートを表示できます。`obs-captions-help --list` で全言語を一覧できます。中国語のみの [i18n 说明](../../I18N.md) と [字幕翻译](../../TRANSLATION.md) も参照してください。
**目標：** 中国語で話す → OBS 画面下部にリアルタイムで字幕が出る → 配信・録画で視聴者に見える。

## 0. 準備

- OBS 33.x と `node >= 22`、`curl`、`patchelf`、`sha256sum` が利用可能であること。
- OBS の「設定 → 音声」でマイクが既に動作していること。
- `noto-fonts-cjk` などの CJK フォント（無いと字幕が豆腐になります）。
- `sudo` / `yay` / コンパイルは**不要**です。

## 1. インストール

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

何度実行しても安全です。sha256 が一致するダウンロードはキャッシュ（`~/.cache/obs-localvocal-arch`）から再利用されます。終了時に `DONE` と表示されます。

## 2. OBS を再起動

起動中の OBS を**完全に終了**してください（プラグインはプロセス起動時にのみ読み込まれます）。そのうえでラッパーから起動します：

```bash
obs-captions
```

`~/.config/obs-studio/logs/` のログに `plugin loaded successfully (version 0.6.2)` と `Loading whisper model from ...` が出ていることを確認します。

## 3. フィルタと字幕ソースを作成

```bash
obs-captions-setup
```

OBS を起動したまま、別のターミナルで実行します。ローカルの obs-websocket に接続し、現在のシーンとマイク入力を取得して、`LocalVocal Transcription` フィルタと `LocalVocal Subtitles` テキストソースを作成／更新し、画面下部に配置します。`SETUP_OK` で完了です。

## 4. 話して確認

マイクに向かって **「你好，欢迎来到我的直播间。」** と言います。字幕はまず途中経過として現れ、のちに一文として確定します。続けて：

```bash
obs-captions-doctor
```

## 5. 配信・録画する

OBS の「録画開始」「配信開始」を押すだけです。画面やゲームも同時に配信する場合は、`LocalVocal Subtitles` をソース一覧の最上部へドラッグして映像の上に重ねます。

## 6. 次回以降

```bash
obs-captions          # プラグイン付きで OBS を起動
obs-captions-setup    # 任意：フィルタを冪等に復元
```

OBS は正常終了時にのみフィルタをシーンコレクションへ書き出すため、クラッシュや `kill -9` の後は実行時フィルタが失われることがあります。`obs-captions-setup` で復元できます。

## 困ったとき

| 症状 | まず試すこと |
| --- | --- |
| 字幕がまったく出ない | `obs-captions-doctor` を実行。マイクがミュートでないか確認し、`obs-captions-setup` を再実行 |
| プラグインが読み込まれない | `/usr/bin/obs` ではなく `obs-captions` で起動し、ログを確認 |
| 文字が豆腐（□）になる | `noto-fonts-cjk` を入れ、`obs-captions-setup` を再実行 |
| CPU 使用率が高い | `ggml-tiny-q5_1` か `ggml-base-q5_1` に変更（ガイド参照） |
| 4455 番に接続できない | OBS の再起動が必要。`config.json` の `server_enabled=true` を確認 |

[詳細ガイド：設定・見た目・翻訳・SRT・トラブル対応](../../GUIDE.md) — 設定・見た目・翻訳・SRT・トラブル対応の一覧。
