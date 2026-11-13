# Inicio rápido (3 minutos)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> Otros idiomas: ejecuta `obs-captions-help <código>` (p. ej. `obs-captions-help es`) para ver esta guía rápida en tu idioma; `obs-captions-help --list` muestra todos los códigos. Consulta también [i18n 说明](../../I18N.md) y [字幕翻译](../../TRANSLATION.md), solo en chino.
**Objetivo:** hablar en chino → los subtítulos aparecen en tiempo real en la parte inferior del lienzo de OBS → los espectadores los ven al emitir o grabar.

## 0. Antes de empezar

- OBS 33.x y `node >= 22`; `curl`, `patchelf`, `sha256sum` disponibles.
- Un micrófono que ya funcione en OBS (Ajustes → Audio).
- Una tipografía CJK como `noto-fonts-cjk`, o los subtítulos se verán como cuadros.
- **No** necesitas `sudo`, `yay` ni compilar.

## 1. Instalar

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

Puedes repetir la ejecución sin problema: las descargas que ya coinciden con su sha256 se reutilizan desde la caché (`~/.cache/obs-localvocal-arch`). Al terminar verás `DONE`.

## 2. Reiniciar OBS

Cierra **por completo** el OBS que esté abierto: los plugins solo se cargan al iniciar el proceso. Después ábrelo con el lanzador:

```bash
obs-captions
```

Comprueba en el registro de `~/.config/obs-studio/logs/` que aparezcan `plugin loaded successfully (version 0.6.2)` y `Loading whisper model from ...`.

## 3. Crear el filtro y la fuente de subtítulos

```bash
obs-captions-setup
```

Con OBS abierto, usa otra terminal. El script se conecta al obs-websocket local, localiza la escena actual y la entrada de micrófono, y crea o actualiza el filtro `LocalVocal Transcription` y la fuente de texto `LocalVocal Subtitles`, colocándola abajo en el lienzo. `SETUP_OK` indica que terminó.

## 4. Hablar y verificar

Di **«你好，欢迎来到我的直播间。»** Los subtítulos aparecen primero como texto parcial y luego se asientan en una frase completa. Después:

```bash
obs-captions-doctor
```

## 5. Emitir o grabar

Pulsa Iniciar grabación o Iniciar transmisión en OBS. Si además capturas la pantalla o un juego, arrastra `LocalVocal Subtitles` al principio de la lista de fuentes para que se dibuje por encima del vídeo.

## 6. La próxima vez

```bash
obs-captions          # abrir OBS con el plugin
obs-captions-setup    # opcional: restaurar el filtro de forma idempotente
```

OBS solo guarda el filtro en la colección de escenas cuando se cierra normalmente, así que un cierre forzado o `kill -9` puede perder el filtro en tiempo de ejecución; `obs-captions-setup` lo restaura.

## ¿Algo va mal?

| Síntoma | Qué probar primero |
| --- | --- |
| No aparece ningún subtítulo | `obs-captions-doctor`; comprueba que el micrófono no esté silenciado; repite `obs-captions-setup` |
| El plugin no se carga | Abre OBS con `obs-captions`, no con `/usr/bin/obs`, y revisa el registro |
| Cuadros en lugar de caracteres | Instala `noto-fonts-cjk` y repite `obs-captions-setup` |
| Uso de CPU muy alto | Cambia a `ggml-tiny-q5_1` o `ggml-base-q5_1`, ver la guía |
| El puerto 4455 no responde | Hay que reiniciar OBS; revisa `server_enabled=true` en `config.json` |

[Guía completa: ajustes, estilo, traducción, SRT, solución de problemas](../../GUIDE.md) — ajustes, estilo, traducción, SRT y la lista completa de problemas.
