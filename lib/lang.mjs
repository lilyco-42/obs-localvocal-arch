// Shared language helpers for this installer.
// Two independent notions of "language":
//   UI/docs language  -> 12 codes used by help + translated docs (e.g. pt-BR)
//   caption language  -> whisper.cpp 2-letter codes (e.g. pt)
// No npm dependencies.
export const UI_CODES = ['zh', 'en', 'ja', 'ko', 'es', 'fr', 'de', 'ru', 'pt-BR', 'ar', 'hi', 'pl'];

export const UI_NAMES = {
  zh: '中文', en: 'English', ja: '日本語', ko: '한국어', es: 'Español', fr: 'Français',
  de: 'Deutsch', ru: 'Русский', 'pt-BR': 'Português (Brasil)', ar: 'العربية', hi: 'हिन्दी', pl: 'Polski'
};

const UI_ALIAS = {
  zh: 'zh', 'zh-cn': 'zh', 'zh-hans': 'zh', 'zh-hant': 'zh', 'zh-tw': 'zh', 'zh-hk': 'zh', chinese: 'zh', '中文': 'zh', cmn: 'zh',
  en: 'en', 'en-us': 'en', 'en-gb': 'en', english: 'en', '英语': 'en',
  ja: 'ja', 'ja-jp': 'ja', japanese: 'ja', '日本語': 'ja', '日语': 'ja',
  ko: 'ko', 'ko-kr': 'ko', korean: 'ko', '한국어': 'ko', '韩语': 'ko',
  es: 'es', 'es-es': 'es', spanish: 'es', 'español': 'es', '西班牙语': 'es',
  fr: 'fr', 'fr-fr': 'fr', french: 'fr', 'français': 'fr', '法语': 'fr',
  de: 'de', 'de-de': 'de', german: 'de', deutsch: 'de', '德语': 'de',
  ru: 'ru', 'ru-ru': 'ru', russian: 'ru', 'русский': 'ru', '俄语': 'ru',
  'pt-br': 'pt-BR', pt: 'pt-BR', 'pt-pt': 'pt-BR', portuguese: 'pt-BR', 'português': 'pt-BR', '葡萄牙语': 'pt-BR',
  ar: 'ar', 'ar-sa': 'ar', arabic: 'ar', 'العربية': 'ar', '阿拉伯语': 'ar',
  hi: 'hi', 'hi-in': 'hi', hindi: 'hi', 'हिन्दी': 'hi', '印地语': 'hi',
  pl: 'pl', 'pl-pl': 'pl', polish: 'pl', polski: 'pl', '波兰语': 'pl'
};

const CAPTION_ALIAS = {
  zh: 'zh', 'zh-cn': 'zh', 'zh-hans': 'zh', 'zh-hant': 'zh', 'zh-tw': 'zh', 'zh-hk': 'zh', chinese: 'zh', '中文': 'zh', cmn: 'zh',
  en: 'en', 'en-us': 'en', 'en-gb': 'en', english: 'en', '英语': 'en',
  ja: 'ja', 'ja-jp': 'ja', japanese: 'ja', '日本語': 'ja', '日语': 'ja',
  ko: 'ko', 'ko-kr': 'ko', korean: 'ko', '한국어': 'ko', '韩语': 'ko',
  es: 'es', 'es-es': 'es', spanish: 'es', 'español': 'es', '西班牙语': 'es',
  fr: 'fr', 'fr-fr': 'fr', french: 'fr', 'français': 'fr', '法语': 'fr',
  de: 'de', 'de-de': 'de', german: 'de', deutsch: 'de', '德语': 'de',
  ru: 'ru', 'ru-ru': 'ru', russian: 'ru', 'русский': 'ru', '俄语': 'ru',
  pt: 'pt', 'pt-br': 'pt', 'pt-pt': 'pt', portuguese: 'pt', 'português': 'pt', '葡萄牙语': 'pt',
  ar: 'ar', 'ar-sa': 'ar', arabic: 'ar', 'العربية': 'ar', '阿拉伯语': 'ar',
  hi: 'hi', 'hi-in': 'hi', hindi: 'hi', 'हिन्दी': 'hi', '印地语': 'hi',
  pl: 'pl', 'pl-pl': 'pl', polish: 'pl', polski: 'pl', '波兰语': 'pl',
  'pt-BR': 'pt'
};

const AUTO = new Set(['auto', 'detect', 'autodetect', 'auto-detect', '自动', '自动检测', '自动识别']);

export function norm(raw) {
  return String(raw ?? '').trim().toLowerCase().replace(/_/g, '-');
}

// Returns one of UI_CODES, or null when the input is not a known UI language.
export function resolveUiLanguage(raw) {
  return UI_ALIAS[norm(raw)] || null;
}

// Priority: CAPTION_UI_LANG > LC_ALL > LC_MESSAGES > LANG > en (fallback, never zh).
export function detectUiLanguage(env = process.env) {
  for (const raw of [env.CAPTION_UI_LANG, env.LC_ALL, env.LC_MESSAGES, env.LANG]) {
    if (!raw) continue;
    const base = String(raw).split('.')[0].split('@')[0];
    const parts = base.split(/[-_]/).filter(Boolean);
    const primary = (parts[0] || '').toLowerCase();
    if (!primary || primary === 'c' || primary === 'posix') continue;
    const region = (parts[1] || '').toLowerCase();
    const hit = (region && resolveUiLanguage(primary + '-' + region)) || resolveUiLanguage(primary);
    if (hit) return hit;
  }
  return 'en';
}

// Returns a whisper.cpp language code. '' means auto-detect (upstream sets
// detect_language=true when whisper_language_select is empty).
export function resolveCaptionLanguage(raw) {
  const k = norm(raw);
  if (k === '' || AUTO.has(k)) return '';
  if (CAPTION_ALIAS[k]) return CAPTION_ALIAS[k];
  return k; // other 2-3 letter codes pass through to whisper.cpp
}

export function isKnownCaptionLanguage(raw) {
  const k = norm(raw);
  return k === '' || AUTO.has(k) || k in CAPTION_ALIAS || /^[a-z]{2,3}$/.test(k);
}
