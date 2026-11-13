# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> لغات أخرى: نفّذ `obs-captions-help <رمز اللغة>` (مثال `obs-captions-help ar`) لعرض هذا الدليل السريع بلغتك؛ و`obs-captions-help --list` يسرد كل الرموز. راجع أيضًا [i18n 说明](../../I18N.md) و[字幕翻译](../../TRANSLATION.md)، وكلاهما بالصينية فقط.
ترجمة **صينية** فورية أسفل لوحة OBS على Arch / CachyOS وتوزيعات Linux المشابهة. تثبيت على مستوى المستخدم: بلا sudo، بلا AUR، بلا تجميع.

## بدء سريع في 30 ثانية

نفّذ هذه الأوامر الأربعة بالترتيب (نحو 300 ميغابايت تنزيل في المرة الأولى).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **التثبيت** — يتحقق من حزمة `.deb` الرسمية 0.6.2 ويفكّها، ويضيف مكتبتَي ICU70 / OpenBLAS الناقصتين، وينزّل نموذج Whisper متعدد اللغات.
2. **أغلق OBS تمامًا** ثم أعد تشغيله عبر الغلاف `obs-captions` كي تُحمَّل الإضافة فعلًا.
3. **في طرفية ثانية** — يُنشئ أو يحدّث مرشّح الصوت ومصدر نص الترجمة أسفل الشاشة (قابل للتكرار بلا تكرار للمصادر).
4. **تحدّث بالصينية** في الميكروفون ثم نفّذ الفحص الذاتي. ظهور `VERIFY_OK` يعني أن كل شيء جاهز.

## ماذا يفعل

- كل شيء داخل مجلد المستخدم: الإضافة في `~/.config/obs-studio/plugins/obs-localvocal/` ولا يُمسّ `/usr`.
- التعرّف يعمل محليًا على المعالج عبر whisper.cpp — الصوت لا يغادر جهازك.
- يُربط المرشّح بإدخال الميكروفون مع `whisper_language_select=zh` و`partial_group=true`، فيظهر النص الجزئي بعد نحو 1.1 ثانية.
- الترجمة مصدر نص عادي في OBS (`text_ft2_source_v2`): أسفل الوسط، نص أبيض بحدود سوداء، بحجم وموضع تلقائيين حسب دقة اللوحة.
- ولأنه مصدر داخل المشهد، يراه المشاهدون في البث المباشر وفي الملف المسجّل معًا — دون مصدر متصفح أو نافذة دائمة الأعلى.

## المتطلبات

- OBS 33.x (يجب وجود `/usr/lib/libobs.so.30`)
- Arch / CachyOS / عائلة Arch، بنية x86_64
- `node >= 22` (WebSocket مدمج)، `curl`، `patchelf`، `sha256sum`
- خط CJK مثل `noto-fonts-cjk`

## التوثيق

[بدء سريع](QUICKSTART.md) · [الدليل الكامل: الإعدادات والمظهر والترجمة وSRT وحل المشكلات](../../GUIDE.md) · [كيف ولماذا يُثبَّت بهذه الطريقة](../../ARCHITECTURE.md)

## الرخصة

GPL-2.0 كما في المشروع الأصلي. هذا المستودع **لا يستضيف أي ملفات ثنائية**: الإضافة والنموذج ومكتبات التوافق تُنزَّل وقت التثبيت وتُتحقَّق بـ sha256. راجع `THIRD_PARTY.md`.
