// Localized onboarding text for obs-captions-help and install.sh's final hint.
// Zero npm dependencies; language codes/aliases come from ./lang.mjs.
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { UI_CODES, UI_NAMES, detectUiLanguage, resolveUiLanguage } from './lang.mjs';

// {1} = obs-captions, {2} = obs-captions-setup, {3} = obs-captions-doctor.
// The Chinese example sentence stays Chinese on purpose: it demos Chinese ASR.
export const MESSAGES = {
  zh: {
    title: 'obs-captions 快速入门（中文）',
    next: '接下来：',
    steps: [
      '完全退出正在运行的 OBS',
      '用包装器启动 OBS：{1}',
      '另开终端，自动加滤镜与底部字幕源：{2}',
      '说一句中文（如“你好，欢迎来到我的直播间。”）；用 {3} 自检',
      'OBS 点“开始录制 / 开始直播”，字幕随画面输出'
    ],
    tip: '找不到命令时：export PATH="$HOME/.local/bin:$PATH"；其它语言：obs-captions-help --list'
  },
  en: {
    title: 'obs-captions quick start (English)',
    next: 'Next steps:',
    steps: [
      'Fully quit any running OBS',
      'Start OBS through the wrapper: {1}',
      'In another terminal, add the filter and bottom caption source: {2}',
      'Say a short sentence in Chinese (e.g. “你好，欢迎来到我的直播间。”); check with {3}',
      'Click "Start Recording / Start Streaming" in OBS; captions are part of the picture'
    ],
    tip: 'If commands are not found: export PATH="$HOME/.local/bin:$PATH"; other languages: obs-captions-help --list'
  },
  ja: {
    title: 'obs-captions クイックスタート（日本語）',
    next: '次の手順：',
    steps: [
      '起動中の OBS を完全に終了します',
      'ラッパー経由で OBS を起動：{1}',
      '別の端末でフィルタと画面下部の字幕ソースを自動追加：{2}',
      '中国語で一言話します（例：“你好，欢迎来到我的直播间。”）。{3} で確認',
      'OBS で“録画開始 / 配信開始”をクリック。字幕は映像と一緒に出力されます'
    ],
    tip: 'コマンドが見つからない場合：export PATH="$HOME/.local/bin:$PATH"; 他言語：obs-captions-help --list'
  },
  ko: {
    title: 'obs-captions 빠른 시작 (한국어)',
    next: '다음 단계:',
    steps: [
      '실행 중인 OBS를 완전히 종료',
      '래퍼로 OBS 실행: {1}',
      '다른 터미널에서 필터와 하단 자막 소스 자동 추가: {2}',
      '중국어로 짧게 말하기(예: “你好，欢迎来到我的直播间。”); {3} 으로 확인',
      'OBS에서 “녹화 시작 / 방송 시작” 클릭. 자막은 화면과 함께 출력'
    ],
    tip: '명령을 찾을 수 없으면: export PATH="$HOME/.local/bin:$PATH"; 다른 언어: obs-captions-help --list'
  },
  es: {
    title: 'Inicio rápido de obs-captions (Español)',
    next: 'Siguientes pasos:',
    steps: [
      'Cierra por completo cualquier OBS en ejecución',
      'Inicia OBS con el wrapper: {1}',
      'En otra terminal, añade el filtro y la fuente de subtítulos inferior: {2}',
      'Di una frase en chino (p. ej. “你好，欢迎来到我的直播间。”); comprueba con {3}',
      'Pulsa «Iniciar grabación / Iniciar transmisión» en OBS; los subtítulos van en la imagen'
    ],
    tip: 'Si no encuentra los comandos: export PATH="$HOME/.local/bin:$PATH"; otros idiomas: obs-captions-help --list'
  },
  fr: {
    title: 'Démarrage rapide obs-captions (Français)',
    next: 'Étapes suivantes :',
    steps: [
      'Quittez complètement toute instance d’OBS en cours',
      'Démarrez OBS via le wrapper : {1}',
      'Dans un autre terminal, ajoutez le filtre et la source de sous-titres en bas : {2}',
      'Dites une phrase en chinoise (ex. « 你好，欢迎来到我的直播间。 ») ; vérifiez avec {3}',
      'Cliquez sur « Démarrer l’enregistrement / Démarrer le stream » dans OBS ; les sous-titres font partie de l’image'
    ],
    tip: 'Si les commandes sont introuvables : export PATH="$HOME/.local/bin:$PATH"; autres langues : obs-captions-help --list'
  },
  de: {
    title: 'obs-captions Schnellstart (Deutsch)',
    next: 'Nächste Schritte:',
    steps: [
      'Beende alle laufenden OBS-Instanzen vollständig',
      'Starte OBS über den Wrapper: {1}',
      'In einem anderen Terminal Filter und untere Untertitelquelle automatisch anlegen: {2}',
      'Sag einen kurzen Satz auf Chinesisch (z. B. “你好，欢迎来到我的直播间。”); prüfe mit {3}',
      'In OBS „Aufnahme starten / Stream starten“ klicken; Untertitel sind Teil des Bildes'
    ],
    tip: 'Wenn Befehle fehlen: export PATH="$HOME/.local/bin:$PATH"; andere Sprachen: obs-captions-help --list'
  },
  ru: {
    title: 'Быстрый старт obs-captions (Русский)',
    next: 'Дальнейшие шаги:',
    steps: [
      'Полностью закройте запущенный OBS',
      'Запустите OBS через обёртку: {1}',
      'В другом терминале добавьте фильтр и нижний источник субтитров: {2}',
      'Скажите короткую фразу по-китайски (напр. «你好，欢迎来到我的直播间。»); проверьте через {3}',
      'Нажмите «Начать запись / Начать трансляцию» в OBS; субтитры идут в кадре'
    ],
    tip: 'Если команды не найдены: export PATH="$HOME/.local/bin:$PATH"; другие языки: obs-captions-help --list'
  },
  'pt-BR': {
    title: 'Início rápido do obs-captions (Português (Brasil))',
    next: 'Próximos passos:',
    steps: [
      'Feche completamente qualquer OBS em execução',
      'Inicie o OBS pelo wrapper: {1}',
      'Em outro terminal, adicione o filtro e a fonte de legendas na parte inferior: {2}',
      'Diga uma frase curta em chinês (ex.: “你好，欢迎来到我的直播间。”); verifique com {3}',
      'Clique em «Iniciar gravação / Iniciar transmissão» no OBS; as legendas fazem parte da imagem'
    ],
    tip: 'Se os comandos não forem encontrados: export PATH="$HOME/.local/bin:$PATH"; outros idiomas: obs-captions-help --list'
  },
  ar: {
    title: 'البدء السريع مع obs-captions (العربية)',
    next: 'الخطوات التالية:',
    steps: [
      'أغلق أي نسخة قيد التشغيل من OBS تمامًا',
      'شغّل OBS عبر الغلاف: {1}',
      'في طرفية أخرى، أضف الفلتر ومصدر الترجمة السفلي: {2}',
      'قل جملة قصيرة بالصينية (مثال: «你好，欢迎来到我的直播间。»)؛ تحقق باستخدام {3}',
      'اضغط «بدء التسجيل / بدء البث» في OBS؛ تظهر الترجمة ضمن الصورة'
    ],
    tip: 'إن لم تُوجد الأوامر: export PATH="$HOME/.local/bin:$PATH"; لغات أخرى: obs-captions-help --list'
  },
  hi: {
    title: 'obs-captions त्वरित प्रारंभ (हिन्दी)',
    next: 'अगले चरण:',
    steps: [
      'चल रहे OBS को पूरी तरह बंद करें',
      'रैपर से OBS शुरू करें: {1}',
      'दूसरे टर्मिनल में फ़िल्टर और निचला उपशीर्षक स्रोत जोड़ें: {2}',
      'चीनी में एक छोटा वाक्य बोलें (जैसे “你好，欢迎来到我的直播间。”); {3} से जाँचें',
      'OBS में «रिकॉर्डिंग शुरू / स्ट्रीम शुरू» दबाएँ; उपशीर्षक चित्र के साथ जाते हैं'
    ],
    tip: 'कमांड न मिले तो: export PATH="$HOME/.local/bin:$PATH"; अन्य भाषाएँ: obs-captions-help --list'
  },
  pl: {
    title: 'Szybki start obs-captions (Polski)',
    next: 'Następne kroki:',
    steps: [
      'Zamknij całkowicie wszystkie działające instancje OBS',
      'Uruchom OBS przez wrapper: {1}',
      'W drugim terminalu dodaj filtr i dolne źródło napisów: {2}',
      'Powiedz krótkie zdanie po chińsku (np. “你好，欢迎来到我的直播间。”); sprawdź przez {3}',
      'Kliknij „Rozpocznij nagrywanie / Rozpocznij transmisję” w OBS; napisy są częścią obrazu'
    ],
    tip: 'Gdy polecenia nie są znajdowane: export PATH="$HOME/.local/bin:$PATH"; inne języki: obs-captions-help --list'
  }
};

export const PATH_HINTS = {
  zh: '提示：把 {0} 加入 PATH：export PATH="{0}:$PATH"',
  en: 'Hint: add {0} to PATH: export PATH="{0}:$PATH"',
  ja: 'ヒント：{0} を PATH に追加：export PATH="{0}:$PATH"',
  ko: '힌트: {0} 를 PATH에 추가: export PATH="{0}:$PATH"',
  es: 'Sugerencia: añade {0} al PATH: export PATH="{0}:$PATH"',
  fr: 'Astuce : ajoutez {0} au PATH : export PATH="{0}:$PATH"',
  de: 'Hinweis: {0} zu PATH hinzufügen: export PATH="{0}:$PATH"',
  ru: 'Подсказка: добавьте {0} в PATH: export PATH="{0}:$PATH"',
  'pt-BR': 'Dica: adicione {0} ao PATH: export PATH="{0}:$PATH"',
  ar: 'تلميح: أضف {0} إلى PATH: export PATH="{0}:$PATH"',
  hi: 'सुझाव: {0} को PATH में जोड़ें: export PATH="{0}:$PATH"',
  pl: 'Wskazówka: dodaj {0} do PATH: export PATH="{0}:$PATH"'
};

function formatSteps(m, prefix) {
  const cmds = [prefix + 'obs-captions', prefix + 'obs-captions-setup', prefix + 'obs-captions-doctor'];
  return m.steps.map((s, i) => '  ' + (i + 1) + ') ' +
    s.replaceAll('{1}', cmds[0]).replaceAll('{2}', cmds[1]).replaceAll('{3}', cmds[2]));
}

function printList() {
  console.log('CODE     LANGUAGE');
  for (const c of UI_CODES) console.log(c.padEnd(8) + UI_NAMES[c]);
  console.log('');
  console.log('obs-captions-help <code> | CAPTION_UI_LANG=<code> obs-captions-help');
}

function printUsage() {
  console.log('Usage: obs-captions-help [code | --list | --next <dir> | --path <dir> | --help]');
  console.log('  no code        auto-detect from CAPTION_UI_LANG / LC_ALL / LC_MESSAGES / LANG, fallback en');
  console.log('  --list         list all 12 UI language codes');
  console.log('  --next <dir>   print the localized post-install hints (used by install.sh)');
  console.log('  --path <dir>   print the localized PATH hint (used by install.sh)');
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isDirect) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    printUsage();
  } else if (args.includes('--list')) {
    printList();
  } else if (args[0] === '--path') {
    const bindir = args[1] || path.join(os.homedir(), '.local', 'bin');
    console.log(PATH_HINTS[detectUiLanguage()].replaceAll('{0}', bindir));
  } else if (args[0] === '--next') {
    const bindir = args[1] || path.join(os.homedir(), '.local', 'bin');
    const code = detectUiLanguage();
    const m = MESSAGES[code];
    console.log('DONE. ' + m.next);
    for (const line of formatSteps(m, bindir.replace(/\/$/, '') + '/')) console.log(line);
    console.log(m.tip);
  } else {
    const raw = args.find((a) => !a.startsWith('--')) || detectUiLanguage();
    const code = resolveUiLanguage(raw);
    if (!code || !MESSAGES[code]) {
      console.error('Unknown language: ' + raw);
      console.error('Run: obs-captions-help --list');
      process.exitCode = 1;
    } else {
      const m = MESSAGES[code];
      console.log(m.title + '  [' + code + ' / ' + UI_NAMES[code] + ']');
      console.log('');
      for (const line of formatSteps(m, '')) console.log(line);
      console.log('');
      console.log(m.tip);
    }
  }
  }
