# तेज़ शुरुआत (3 मिनट)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> अन्य भाषाएँ: टर्मिनल में `obs-captions-help <कोड>` (जैसे `obs-captions-help hi`) चलाएँ, तेज़ शुरुआत अपनी भाषा में मिल जाएगी; `obs-captions-help --list` सभी कोड दिखाता है। केवल चीनी में उपलब्ध [i18n 说明](../../I18N.md) और [字幕翻译](../../TRANSLATION.md) भी देखें।
**लक्ष्य:** चीनी में बोलें → OBS कैनवास के नीचे तुरंत सबटाइटल दिखे → लाइव और रिकॉर्डिंग में दर्शक उसे देखें।

## 0. शुरू करने से पहले

- OBS 33.x और `node >= 22`; `curl`, `patchelf`, `sha256sum` उपलब्ध हों।
- ऐसा माइक जो OBS में पहले से काम करता हो (सेटिंग्स → ऑडियो)।
- CJK फ़ॉन्ट जैसे `noto-fonts-cjk`, वरना अक्षर चौकोर दिखेंगे।
- `sudo`, `yay` या कंपाइल की ज़रूरत **नहीं** है।

## 1. इंस्टॉल

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

दोबारा चलाना सुरक्षित है: जिन फ़ाइलों का sha256 मेल खाता है वे कैश (`~/.cache/obs-localvocal-arch`) से ले ली जाती हैं। अंत में `DONE` दिखता है।

## 2. OBS रीस्टार्ट करें

पहले चल रहा OBS **पूरी तरह बंद** करें — प्लगइन प्रोसेस शुरू होने पर ही लोड होते हैं। फिर रैपर से खोलें:

```bash
obs-captions
```

`~/.config/obs-studio/logs/` के लॉग में `plugin loaded successfully (version 0.6.2)` और `Loading whisper model from ...` देखें।

## 3. फ़िल्टर और सबटाइटल सोर्स बनाएँ

```bash
obs-captions-setup
```

OBS खुला रखें और दूसरा टर्मिनल लें। स्क्रिप्ट लोकल obs-websocket से जुड़ती है, मौजूदा सीन और माइक इनपुट ढूँढती है, फिर `LocalVocal Transcription` फ़िल्टर और `LocalVocal Subtitles` टेक्स्ट सोर्स बनाती या अपडेट करती है और उसे कैनवास के नीचे रखती है। `SETUP_OK` का अर्थ है पूरा हुआ।

## 4. बोलें और जाँचें

माइक में कहें **“你好，欢迎来到我的直播间。”** सबटाइटल पहले अधूरे टेक्स्ट के रूप में आते हैं, फिर पूरा वाक्य बन जाते हैं। इसके बाद:

```bash
obs-captions-doctor
```

## 5. लाइव या रिकॉर्डिंग

OBS में बस “रिकॉर्डिंग शुरू करें” या “स्ट्रीमिंग शुरू करें” दबाएँ। अगर स्क्रीन या गेम भी कैप्चर कर रहे हैं, तो `LocalVocal Subtitles` को सोर्स सूची में सबसे ऊपर खींचें ताकि वह वीडियो के ऊपर दिखे।

## 6. अगली बार

```bash
obs-captions          # प्लगइन के साथ OBS खोलें
obs-captions-setup    # वैकल्पिक: फ़िल्टर दोबारा लगाएँ
```

OBS फ़िल्टर को सीन कलेक्शन में सामान्य रूप से बंद होने पर ही लिखता है, इसलिए क्रैश या `kill -9` के बाद फ़िल्टर गायब हो सकता है; `obs-captions-setup` उसे फिर लगा देता है।

## कुछ गड़बड़ है?

| लक्षण | पहले क्या करें |
| --- | --- |
| कोई सबटाइटल नहीं | `obs-captions-doctor` चलाएँ; माइक म्यूट न हो यह देखें; `obs-captions-setup` दोबारा चलाएँ |
| प्लगइन लोड नहीं हुआ | `/usr/bin/obs` के बजाय `obs-captions` से खोलें और लॉग पढ़ें |
| अक्षर चौकोर दिखते हैं | `noto-fonts-cjk` इंस्टॉल करें, फिर `obs-captions-setup` दोबारा चलाएँ |
| CPU बहुत ज़्यादा | `ggml-tiny-q5_1` या `ggml-base-q5_1` पर जाएँ, गाइड देखें |
| पोर्ट 4455 नहीं खुल रहा | OBS रीस्टार्ट करें; `config.json` में `server_enabled=true` जाँचें |

[पूरी गाइड: सेटिंग्स, स्टाइल, अनुवाद, SRT, समस्या-समाधान](../../GUIDE.md) — सेटिंग्स, स्टाइल, अनुवाद, SRT और पूरी समस्या-सूची।
