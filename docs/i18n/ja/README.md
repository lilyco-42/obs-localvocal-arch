# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> 他の言語：ターミナルで `obs-captions-help <言語コード>`（例 `obs-captions-help ja`）を実行すると、その言語のクイックスタートを表示できます。`obs-captions-help --list` で全言語を一覧できます。中国語のみの [i18n 说明](../../I18N.md) と [字幕翻译](../../TRANSLATION.md) も参照してください。
Arch / CachyOS 系 Linux で、OBS 画面下部に**中国語**のリアルタイム字幕を表示します。ユーザー領域へのインストールのみ：sudo 不要、AUR 不要、コンパイル不要。

## 30 秒クイックスタート

次の 4 つのコマンドを順に実行します（初回は約 300MB をダウンロードします）。

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **インストール** — 公式 0.6.2 の `.deb` を検証して展開し、不足する ICU70 / OpenBLAS を補い、多言語 Whisper モデルを取得します。
2. **OBS を完全に終了**してから、ラッパー経由で起動し直します（プラグインは起動時にのみ読み込まれます）。
3. **別ターミナルで** — 音声フィルタと画面下部の字幕テキストソースを作成／更新します（何度実行しても重複しません）。
4. **マイクに向かって中国語を話し**、セルフチェックを実行します。`VERIFY_OK` が出れば準備完了です。

## 何をするか

- すべてユーザー領域：プラグインは `~/.config/obs-studio/plugins/obs-localvocal/` に配置され、`/usr` は変更しません。
- 認識は whisper.cpp により CPU 上でローカル実行。音声が外部に送信されることはありません。
- マイク入力にフィルタを装着し、`whisper_language_select=zh` と `partial_group=true` により約 1.1 秒で途中経過が流れます。
- 字幕は通常の OBS テキストソース（`text_ft2_source_v2`）。下部中央、白文字＋黒縁取り、キャンバス解像度に合わせて自動配置。
- シーン内のソースなので、配信の視聴者にも録画ファイルにも同じように映ります（ブラウザソースや最前面ウィンドウは不要）。

## 動作要件

- OBS 33.x（`/usr/lib/libobs.so.30` が必要）
- Arch / CachyOS 系、x86_64
- `node >= 22`（内蔵 WebSocket）、`curl`、`patchelf`、`sha256sum`
- CJK フォント（例：`noto-fonts-cjk`）

## ドキュメント

[クイックスタート](QUICKSTART.md) · [詳細ガイド：設定・見た目・翻訳・SRT・トラブル対応](../../GUIDE.md) · [なぜこの方法でインストールするのか](../../ARCHITECTURE.md)

## ライセンス

上流と同じ GPL-2.0。本リポジトリは**バイナリを同梱しません**。プラグイン・モデル・互換ライブラリはインストール時に取得し、sha256 で検証します。詳細は `THIRD_PARTY.md`。
