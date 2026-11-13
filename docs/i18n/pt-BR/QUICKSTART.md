# Início rápido (3 minutos)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](../fr/QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> Outros idiomas: rode `obs-captions-help <código>` (ex.: `obs-captions-help pt-BR`) para ver este início rápido no seu idioma; `obs-captions-help --list` lista todos os códigos. Veja também [i18n 说明](../../I18N.md) e [字幕翻译](../../TRANSLATION.md), disponíveis apenas em chinês.
**Objetivo:** falar em chinês → as legendas aparecem em tempo real na parte inferior da cena do OBS → o público vê na live e na gravação.

## 0. Antes de começar

- OBS 33.x e `node >= 22`; `curl`, `patchelf`, `sha256sum` disponíveis.
- Um microfone que já funcione no OBS (Configurações → Áudio).
- Uma fonte CJK como `noto-fonts-cjk`, senão as legendas aparecem como quadrados.
- `sudo`, `yay` e compilação **não** são necessários.

## 1. Instalar

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

Pode executar várias vezes sem problema: downloads que já conferem com o sha256 são reaproveitados do cache (`~/.cache/obs-localvocal-arch`). Ao final o script imprime `DONE`.

## 2. Reiniciar o OBS

Feche **por completo** o OBS que estiver aberto — plugins só são carregados na inicialização do processo. Depois abra-o pelo lançador:

```bash
obs-captions
```

Confira no log em `~/.config/obs-studio/logs/` se aparecem `plugin loaded successfully (version 0.6.2)` e `Loading whisper model from ...`.

## 3. Criar o filtro e a fonte de legendas

```bash
obs-captions-setup
```

Mantenha o OBS aberto e use outro terminal. O script conecta ao obs-websocket local, encontra a cena atual e a entrada do microfone, então cria ou atualiza o filtro `LocalVocal Transcription` e a fonte de texto `LocalVocal Subtitles`, posicionada na parte inferior da cena. `SETUP_OK` indica que terminou.

## 4. Falar e verificar

Diga **«你好，欢迎来到我的直播间。»** As legendas aparecem primeiro como texto parcial e depois se fixam em uma frase completa. Em seguida:

```bash
obs-captions-doctor
```

## 5. Transmitir ou gravar

Basta clicar em Iniciar gravação ou Iniciar transmissão no OBS. Se você também captura a tela ou um jogo, arraste `LocalVocal Subtitles` para o topo da lista de fontes, para que fique sobre o vídeo.

## 6. Na próxima vez

```bash
obs-captions          # abrir o OBS com o plugin
obs-captions-setup    # opcional: restaurar o filtro de forma idempotente
```

O OBS só grava o filtro na coleção de cenas ao encerrar normalmente; após um travamento ou `kill -9`, o filtro pode faltar. `obs-captions-setup` recria tudo.

## Algo deu errado?

| Sintoma | O que tentar primeiro |
| --- | --- |
| Nenhuma legenda | `obs-captions-doctor`; veja se o microfone está mudo; rode `obs-captions-setup` de novo |
| Plugin não carrega | Abra com `obs-captions`, não com `/usr/bin/obs`, e leia o log |
| Quadrados em vez de letras | Instale `noto-fonts-cjk` e rode `obs-captions-setup` novamente |
| CPU muito alta | Troque para `ggml-tiny-q5_1` ou `ggml-base-q5_1`, veja o guia |
| Porta 4455 não responde | É preciso reiniciar o OBS; confira `server_enabled=true` em `config.json` |

[Guia completo: ajustes, estilo, tradução, SRT, solução de problemas](../../GUIDE.md) — ajustes, estilo, tradução, SRT e a lista completa de problemas.
