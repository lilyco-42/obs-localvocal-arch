# بدء سريع (3 دقائق)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> لغات أخرى: نفّذ `obs-captions-help <رمز اللغة>` (مثال `obs-captions-help ar`) لعرض هذا الدليل السريع بلغتك؛ و`obs-captions-help --list` يسرد كل الرموز. راجع أيضًا [i18n 说明](../../I18N.md) و[字幕翻译](../../TRANSLATION.md)، وكلاهما بالصينية فقط.
**الهدف:** التحدث بالصينية ← ظهور الترجمة فورًا أسفل لوحة OBS ← رؤيتها من المشاهدين في البث والتسجيل.

## 0. قبل البدء

- OBS 33.x و`node >= 22`، مع توفّر `curl` و`patchelf` و`sha256sum`.
- ميكروفون يعمل أصلًا في OBS (الإعدادات ← الصوت).
- خط CJK مثل `noto-fonts-cjk`، وإلا ظهرت الترجمة مربعات.
- لا حاجة إلى `sudo` أو `yay` أو التجميع.

## 1. التثبيت

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

التكرار آمن: الملفات التي يطابق تجزئتها sha256 تُستخدم من الذاكرة المؤقتة (`~/.cache/obs-localvocal-arch`). تظهر `DONE` عند الانتهاء.

## 2. إعادة تشغيل OBS

أغلق OBS العامل **تمامًا** أولًا، فالإضافات تُحمَّل عند بدء العملية فقط. ثم شغّله عبر الغلاف:

```bash
obs-captions
```

تأكد في سجل `~/.config/obs-studio/logs/` من وجود `plugin loaded successfully (version 0.6.2)` و`Loading whisper model from ...`.

## 3. إنشاء المرشّح ومصدر الترجمة

```bash
obs-captions-setup
```

أبقِ OBS مفتوحًا واستخدم طرفية أخرى. يتصل السكربت بـ obs-websocket المحلي، ويجد المشهد الحالي وإدخال الميكروفون، ثم ينشئ أو يحدّث مرشّح `LocalVocal Transcription` ومصدر النص `LocalVocal Subtitles` ويضعه أسفل اللوحة. `SETUP_OK` تعني النجاح.

## 4. التحدث والتحقق

قل **«你好，欢迎来到我的直播间。»** تظهر الترجمة أولًا نصًا جزئيًا ثم تستقر جملة كاملة. ثم:

```bash
obs-captions-doctor
```

## 5. البث أو التسجيل

اضغط «بدء التسجيل» أو «بدء البث» في OBS فقط. إن كنت تلتقط الشاشة أو لعبة أيضًا، اسحب `LocalVocal Subtitles` إلى أعلى قائمة المصادر لتظهر فوق الفيديو.

## 6. في المرة القادمة

```bash
obs-captions          # تشغيل OBS مع الإضافة
obs-captions-setup    # اختياري: استعادة المرشّح بأمان
```

لا يكتب OBS المرشّح في مجموعة المشاهد إلا عند الخروج الطبيعي، لذا قد يضيع بعد انهيار أو `kill -9`؛ ويعيده `obs-captions-setup`.

## هل حدث خطأ؟

| العرض | أول ما تجربه |
| --- | --- |
| لا تظهر أي ترجمة | شغّل `obs-captions-doctor`، وتأكد أن الميكروفون غير مكتوم، ثم أعد `obs-captions-setup` |
| الإضافة غير محمّلة | شغّل عبر `obs-captions` لا `/usr/bin/obs`، واقرأ السجل |
| مربعات بدل الحروف | ثبّت `noto-fonts-cjk` ثم أعد `obs-captions-setup` |
| استهلاك معالج مرتفع | انتقل إلى `ggml-tiny-q5_1` أو `ggml-base-q5_1`، راجع الدليل |
| المنفذ 4455 لا يستجيب | يلزم إعادة تشغيل OBS، وتأكد من `server_enabled=true` في `config.json` |

[الدليل الكامل: الإعدادات والمظهر والترجمة وSRT وحل المشكلات](../../GUIDE.md) — الإعدادات، المظهر، الترجمة، SRT وقائمة حل المشكلات الكاملة.
