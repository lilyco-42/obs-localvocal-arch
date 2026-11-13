// Idempotently create/update the LocalVocal filter and bottom caption text source.
// No npm dependencies: uses ./obs-ws.mjs and Node's built-in WebSocket.
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { connect } from './obs-ws.mjs';
import { resolveCaptionLanguage, isKnownCaptionLanguage } from './lang.mjs';

const verifyOnly = process.argv.includes('--verify');
const home = os.homedir();
const cfgHome = process.env.XDG_CONFIG_HOME || path.join(home, '.config');
const dataHome = process.env.XDG_DATA_HOME || path.join(home, '.local', 'share');
const wsCfgPath = path.join(cfgHome, 'obs-studio', 'plugin_config', 'obs-websocket', 'config.json');
const pluginSo = path.join(cfgHome, 'obs-studio', 'plugins', 'obs-localvocal', 'bin', '64bit', 'obs-localvocal.so');
const modelPath = process.env.CAPTION_MODEL || path.join(dataHome, 'obs-localvocal', 'models', 'ggml-small-q5_1.bin');

const filterName = 'LocalVocal Transcription';
const filterKind = 'transcription_filter_audio_filter';
const textName = 'LocalVocal Subtitles';
const rawLang = process.env.CAPTION_LANG ?? 'zh';
const lang = resolveCaptionLanguage(rawLang);
if (lang && !isKnownCaptionLanguage(rawLang)) {
  console.log('WARN 未识别的语言名：' + rawLang + ' → ' + lang + '（原样传给 whisper.cpp）');
}
const translate = process.env.CAPTION_TRANSLATE === '1';
const fontFace = process.env.CAPTION_FONT || 'Noto Sans CJK SC';

const rd = (r) => (r && r.responseData) || {};
const code = (r) => r && r.requestStatus && r.requestStatus.code;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function call(c, type, data = {}) {
  const r = await c.req(type, data);
  const c0 = code(r);
  if (c0 !== undefined && c0 !== 100) throw new Error(type + ' failed: ' + JSON.stringify(r.requestStatus));
  return rd(r);
}

function readWsConfig() {
  let cfg;
  try { cfg = JSON.parse(fs.readFileSync(wsCfgPath, 'utf8')); }
  catch (e) { throw new Error('读不到 obs-websocket 配置：' + wsCfgPath + '（先运行 install.sh）'); }
  if (!cfg.server_enabled) throw new Error('obs-websocket 未启用：' + wsCfgPath);
  return { port: Number(cfg.server_port || 4455), password: cfg.server_password || '' };
}

async function main() {
  if (!fs.existsSync(pluginSo)) throw new Error('未找到插件：' + pluginSo + '（先运行 install.sh）');
  if (!fs.existsSync(modelPath)) throw new Error('未找到语音模型：' + modelPath + '（先运行 install.sh，或用 CAPTION_MODEL 指定）');

  const ws = readWsConfig();
  let c = null;
  let lastErr = null;
  for (let i = 0; i < 40; i++) {
    try { c = await connect(ws.password, ws.port); break; }
    catch (e) { lastErr = e; await sleep(1000); }
  }
  if (!c) throw new Error('连不上 OBS WebSocket 127.0.0.1:' + ws.port + '（OBS 是否已用 obs-captions 重启？）' + (lastErr ? ' ' + lastErr.message : ''));

  try {
    const version = await call(c, 'GetVersion');
    if (!String(version.obsVersion || '').startsWith('33.')) {
      console.log('WARN obsVersion=' + version.obsVersion + ' (tested on OBS 33.x / libobs.so.30)');
    }

    const special = await call(c, 'GetSpecialInputs');
    const inputs = await call(c, 'GetInputList');
    let micName = special.mic1 || null;
    if (!micName) {
      for (const it of (inputs.inputs || [])) {
        if (it.inputKind === 'pulse_input_capture' || /mic|麦克风/i.test(it.inputName || '')) { micName = it.inputName; break; }
      }
    }
    if (!micName) throw new Error('找不到麦克风/辅助音频输入；请在 OBS 设置→音频里启用麦克风');

    const scenes = await call(c, 'GetSceneList');
    const sceneName = scenes.currentProgramSceneName || (scenes.scenes && scenes.scenes[0] && scenes.scenes[0].sceneName);
    if (!sceneName) throw new Error('没有可用场景；请先在 OBS 里建一个场景');

    const video = await call(c, 'GetVideoSettings');
    const W = Number(video.baseWidth || 1920);
    const H = Number(video.baseHeight || 1080);
    const fontSize = Number(process.env.CAPTION_SIZE || Math.max(36, Math.round(72 * H / 1080)));
    const outlineSize = Math.max(3, Math.round(7 * H / 1080));
    const boundsWidth = Math.min(1500, Math.round(W * 0.9));
    const boundsHeight = Math.min(230, Math.round(H * 0.22));
    const positionX = Math.round(W / 2);
    const positionY = Math.round(H - H * 0.148148);

    const filterSettings = {
      whisper_model_path: '!!!external!!!',
      whisper_model_path_external: modelPath,
      whisper_language_select: lang,
      subtitle_sources: textName,
      partial_group: true,
      partial_latency: 1100,
      buffered_output: false,
      buffer_num_lines: 2,
      buffer_num_chars_per_line: 30,
      log_level: 400,
      caption_to_stream: false,
      translate: translate,
      process_while_muted: false,
      subtitle_save_srt: false,
      backend_device: -1,
      enable_flash_attn: false,
      segment_duration: 7000,
      vad_threshold: 0.65
    };
    const textSettings = {
      text: '',
      word_wrap: true,
      extents: true,
      extents_cx: boundsWidth,
      extents_cy: boundsHeight,
      outline: true,
      outline_color: 4278190080,
      outline_size: outlineSize,
      color: 4294967295,
      font: { face: fontFace, style: 'Regular', size: fontSize, flags: 0 }
    };
    const transform = {
      positionX: positionX,
      positionY: positionY,
      alignment: 5,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
      boundsType: 'OBS_BOUNDS_NONE',
      boundsAlignment: 5,
      boundsWidth: boundsWidth,
      boundsHeight: boundsHeight,
      cropToBounds: false
    };

    const filterList = await call(c, 'GetSourceFilterList', { sourceName: micName });
    const filter = (filterList.filters || []).find((x) => x.filterName === filterName && x.filterKind === filterKind);
    const inputList = await call(c, 'GetInputList');
    const input = (inputList.inputs || []).find((x) => x.inputName === textName);
    const itemList = await call(c, 'GetSceneItemList', { sceneName: sceneName });
    const item = (itemList.sceneItems || []).find((x) => x.sourceName === textName);

    if (verifyOnly) {
      const missing = [];
      if (!filter || !filter.filterEnabled) missing.push('filter');
      if (!input) missing.push('text_source');
      if (!item || !item.sceneItemEnabled) missing.push('scene_item');
      const summary = {
        obsVersion: version.obsVersion,
        scene: sceneName,
        mic: micName,
        model: modelPath,
        language: lang,
        filter: filter ? { enabled: filter.filterEnabled, settings: filter.filterSettings } : null,
        textSource: input ? input.inputName : null,
        sceneItem: item ? { id: item.sceneItemId, enabled: item.sceneItemEnabled } : null
      };
      console.log(JSON.stringify(summary, null, 2));
      console.log(missing.length ? 'VERIFY_FAIL missing=' + missing.join(',') : 'VERIFY_OK');
      process.exitCode = missing.length ? 1 : 0;
      return;
    }

    if (!filter) {
      const r = await c.req('CreateSourceFilter', { sourceName: micName, filterName: filterName, filterKind: filterKind, filterSettings: filterSettings });
      console.log('CREATE_FILTER ' + JSON.stringify(r.requestStatus));
    } else {
      const r = await c.req('SetSourceFilterSettings', { sourceName: micName, filterName: filterName, filterSettings: filterSettings, overlay: false });
      console.log('UPDATE_FILTER ' + JSON.stringify(r.requestStatus));
    }
    console.log('ENABLE_FILTER ' + JSON.stringify((await c.req('SetSourceFilterEnabled', { sourceName: micName, filterName: filterName, filterEnabled: true })).requestStatus));

    if (!input) {
      const r = await c.req('CreateInput', { inputName: textName, inputKind: 'text_ft2_source_v2', sceneName: sceneName, sceneItemEnabled: true, inputSettings: textSettings });
      console.log('CREATE_TEXT ' + JSON.stringify(r.requestStatus));
    } else {
      console.log('TEXT_EXISTS ' + textName);
    }

    const items2 = await call(c, 'GetSceneItemList', { sceneName: sceneName });
    const item2 = (items2.sceneItems || []).find((x) => x.sourceName === textName);
    if (item2) {
      const r = await c.req('SetSceneItemTransform', { sceneName: sceneName, sceneItemId: item2.sceneItemId, sceneItemTransform: transform });
      console.log('SET_TRANSFORM ' + JSON.stringify(r.requestStatus));
    } else {
      console.log('WARN 文本源没有加入场景；请在 OBS 里手动把 ' + textName + ' 拖到 ' + sceneName);
    }
    console.log('SETUP_OK ' + JSON.stringify({ scene: sceneName, mic: micName, model: modelPath, language: lang, font: fontFace, size: fontSize, position: [positionX, positionY] }));
  } finally {
    c.close();
  }
}

const isDirect = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirect) main().catch((e) => { console.error('SETUP_FAIL ' + (e && e.message || e)); process.exitCode = 1; });
