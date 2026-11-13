# 字幕翻译与多语言识别

本页讲「字幕内容」的语言；「文档与命令」的语言见 [I18N.md](I18N.md)。两者独立，别混。

## 1. 三个概念

| 概念 | 由谁决定 | 默认 | 说明 |
| --- | --- | --- | --- |
| 文档/帮助语言 | `CAPTION_UI_LANG` / `LANG` | 跟随系统，兜底英文 | 只影响你读的文字，见 [I18N.md](I18N.md) |
| 识别语言（同语言字幕） | `CAPTION_LANG` → 滤镜 `whisper_language_select` | `zh` | 说中文出中文字幕，说英文出英文字幕 |
| 翻译字幕 | `CAPTION_TRANSLATE=1` → 滤镜 `translate` | 关 | Whisper 内置「译成英语」，**只有英语输出** |

用户原始需求是「说中文 → 画面下方实时中文字幕」，属于第二行：**同语言字幕，不是翻译**。仓库名里的 arch 指发行版，不是翻译。

## 2. 主流国家语言 → Whisper 语言码

`obs-captions-setup` 现在接受语言名、locale 与语言码，自动归一成 Whisper 语言码（实现见 `lib/lang.mjs`，由 `lib/setup.mjs` 调用 `resolveCaptionLanguage()`）。示例：

```bash
CAPTION_LANG=zh obs-captions-setup           # 中文（默认）
CAPTION_LANG=zh-CN obs-captions-setup        # 同上
CAPTION_LANG=chinese obs-captions-setup      # 同上
CAPTION_LANG=ja-JP obs-captions-setup        # 日语
CAPTION_LANG=english obs-captions-setup      # 英语
CAPTION_LANG=auto obs-captions-setup         # 自动检测（写空值，见第 4 节）
```

| 你说 / 想出的文字 | 推荐 `CAPTION_LANG` | 也接受 | 字体建议 |
| --- | --- | --- | --- |
| 中文 | `zh` | `zh-CN` / `zh_Hans` / `chinese` / `中文` | `noto-fonts-cjk` |
| English | `en` | `en-US` / `en-GB` / `english` | 系统默认 |
| 日本語 | `ja` | `ja-JP` / `japanese` / `日本語` | `noto-fonts-cjk` |
| 한국어 | `ko` | `ko-KR` / `korean` | `noto-fonts-cjk` |
| Español | `es` | `es-ES` / `spanish` | 系统默认 |
| Français | `fr` | `fr-FR` / `french` | 系统默认 |
| Deutsch | `de` | `de-DE` / `german` | 系统默认 |
| Русский | `ru` | `ru-RU` / `russian` | `noto-fonts` |
| Português | `pt` | `pt-BR` / `pt_PT` / `portuguese` | 系统默认 |
| العربية | `ar` | `ar-SA` / `arabic` | `noto-fonts-arabic` |
| हिन्दी | `hi` | `hi-IN` / `hindi` | `noto-fonts-devanagari` |
| Polski | `pl` | `pl-PL` / `polish` | 系统默认 |
| Italiano / Nederlands / Türkçe / Tiếng Việt / ภาษาไทย / Bahasa Indonesia | `it` / `nl` / `tr` / `vi` / `th` / `id` | 对应 `-xx` 与英文语言名 | 泰语/越南语需相应字体 |

其它 2–3 字母代码（如 `uk` / `cs` / `sv`）会原样传给 whisper.cpp；完整列表以 whisper.cpp 的 `whisper_lang_id` 支持表为准。

> 模型必须是**多语言版**：`ggml-small-q5_1.bin`、`ggml-base-q5_1.bin`、`ggml-tiny-q5_1.bin` 都可以；带 `.en` 的英文专用模型（如 `ggml-tiny.en.bin`）说中文会乱码。

## 3. 中译英（Whisper 内置翻译）

```bash
CAPTION_TRANSLATE=1 obs-captions-setup
```

这会把滤镜的 `translate` 设为 true：**说中文，字幕显示英文**。它不是大模型翻译，速度仍然实时，但中文观众会看不到中文字幕。若要「中文 + 英文双行」，当前上游滤镜不直接支持，需要两个滤镜/两个文本源或外部翻译链路，超出本项目范围。

关掉翻译：不带该变量重跑 `obs-captions-setup` 即可（`overlay:false` 会整体重置设置）。

## 4. 自动检测语言

```bash
CAPTION_LANG=auto obs-captions-setup
```

上游源码 `src/transcription-filter.cpp` 里：`whisper_language_select` 为空时 `detect_language=true`，非空时 `detect_language=false`。所以 `auto` 会被转成**空字符串**而不是字面量 `auto`。代价：每片段多一次语言检测、中英混说时可能跳语言；固定 `zh` 更稳，也是本项目默认值。

## 5. 字体与 RTL

- CJK（中/日/韩）：`CAPTION_FONT="Noto Sans CJK SC"`，Arch 装 `noto-fonts-cjk`；缺字体显示方块。
- 阿拉伯语、希伯来语是 RTL；OBS 文本源对双向文本排版有限，可能出现标点/换行错位。建议先录 10 秒验证，再决定是否用外部排版层。
- 换字体：

```bash
CAPTION_FONT="Noto Sans Arabic" CAPTION_LANG=ar obs-captions-setup
```

样式、字号、位置参数见 [GUIDE.md](GUIDE.md#4-改样式与位置)。

## 6. 插件界面本身的语言

上游 0.6.2 自带 13 个 UI locale：`ar-SA de-DE en-GB en-US es-ES fr-FR hi-IN ja-JP ko-KR pl-PL pt-BR ru-RU zh-CN`（`~/.config/obs-studio/plugins/obs-localvocal/data/locale/`）。OBS 按系统语言加载对应 ini，改变的是**滤镜属性面板里的标签文字**，不是字幕内容，也不是设置键。中文系统 `LANG=zh_CN.UTF-8` 会看到「输入语言」「模型」「输出目的地」等。

本项目不改这些 ini：它们由官方 `.deb` 原样解包。若要修正上游翻译，请向上游提 PR。

## 7. 排障

| 现象 | 原因 | 处理 |
| --- | --- | --- |
| 中文说成乱码/英文 | 用了 `.en` 模型，或语言码还是默认 `en` | 换多语言模型 + `CAPTION_LANG=zh` 重跑 setup |
| 字幕全是方块 | 缺字体 | 装对应字体 + `CAPTION_FONT` |
| 中英混说跳字 | `auto` 检测抖动 | 固定 `zh` |
| 想要中译英但仍是中文 | 没带 `CAPTION_TRANSLATE=1` | 带变量重跑 `obs-captions-setup` |
| 想要中文+英文双语字幕 | 上游滤镜单输出 | 需两个文本源/外部翻译，当前不支持 |

配置键与参数完整说明见 [GUIDE.md](GUIDE.md#3-自动配置参数)。
