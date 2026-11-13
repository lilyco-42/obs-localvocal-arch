# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> Otros idiomas: ejecuta `obs-captions-help <código>` (p. ej. `obs-captions-help es`) para ver esta guía rápida en tu idioma; `obs-captions-help --list` muestra todos los códigos. Consulta también [i18n 说明](../../I18N.md) y [字幕翻译](../../TRANSLATION.md), solo en chino.
Subtítulos en **chino** en tiempo real en la parte inferior del lienzo de OBS, en Arch / CachyOS / Linux similar. Instalación a nivel de usuario: sin sudo, sin AUR, sin compilar.

## Inicio rápido en 30 segundos

Ejecuta estos cuatro comandos en orden (la primera vez descarga unos 300 MB).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **Instalar** — verifica y desempaqueta el `.deb` oficial 0.6.2, añade las bibliotecas ICU70 / OpenBLAS que faltan y descarga el modelo Whisper multilingüe.
2. **Cierra OBS por completo** y vuelve a abrirlo con el lanzador, para que el plugin se cargue de verdad.
3. **En otra terminal** — crea o actualiza el filtro de audio y la fuente de texto de subtítulos inferior (idempotente, se puede repetir).
4. **Habla en chino** al micrófono y ejecuta la autocomprobación. `VERIFY_OK` significa que todo está listo.

## Qué hace

- Todo queda en tu carpeta de usuario: el plugin vive en `~/.config/obs-studio/plugins/obs-localvocal/` y `/usr` no se toca.
- El reconocimiento se ejecuta localmente en la CPU con whisper.cpp: el audio nunca sale de tu equipo.
- El filtro se monta sobre la entrada del micrófono con `whisper_language_select=zh` y `partial_group=true`, así que el texto parcial aparece en torno a 1,1 s.
- Los subtítulos son una fuente de texto normal de OBS (`text_ft2_source_v2`): abajo y centrada, texto blanco con contorno negro, ajustada a la resolución del lienzo.
- Al ser una fuente de la escena, la ven tanto los espectadores del directo como el archivo grabado: sin fuente de navegador ni ventana siempre visible.

## Requisitos

- OBS 33.x (debe existir `/usr/lib/libobs.so.30`)
- Arch / CachyOS / similar, x86_64
- `node >= 22` (WebSocket integrado), `curl`, `patchelf`, `sha256sum`
- Una tipografía CJK, por ejemplo `noto-fonts-cjk`

## Documentación

[Inicio rápido](QUICKSTART.md) · [Guía completa: ajustes, estilo, traducción, SRT, solución de problemas](../../GUIDE.md) · [Cómo y por qué se instala así](../../ARCHITECTURE.md)

## Licencia

GPL-2.0, igual que el proyecto original. Este repositorio **no incluye binarios**: el plugin, el modelo y las bibliotecas de compatibilidad se descargan al instalar y se verifican con sha256. Ver `THIRD_PARTY.md`.
