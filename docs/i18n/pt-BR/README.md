# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](../fr/README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> Outros idiomas: rode `obs-captions-help <código>` (ex.: `obs-captions-help pt-BR`) para ver este início rápido no seu idioma; `obs-captions-help --list` lista todos os códigos. Veja também [i18n 说明](../../I18N.md) e [字幕翻译](../../TRANSLATION.md), disponíveis apenas em chinês.
Legendas em **chinês** em tempo real na parte inferior da cena do OBS no Arch / CachyOS / Linux compatível. Instalação no nível do usuário: sem sudo, sem AUR, sem compilar.

## Início rápido em 30 segundos

Execute estes quatro comandos na ordem (cerca de 300 MB de download na primeira vez).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **Instalar** — verifica e desempacota o `.deb` oficial 0.6.2, adiciona as bibliotecas ICU70 / OpenBLAS que faltam e baixa o modelo Whisper multilíngue.
2. **Feche o OBS por completo** e abra-o novamente pelo lançador, para que o plugin seja realmente carregado.
3. **Em outro terminal** — cria ou atualiza o filtro de áudio e a fonte de texto das legendas na parte inferior (idempotente, pode repetir).
4. **Fale em chinês** no microfone e rode a autoverificação. `VERIFY_OK` significa que está tudo pronto.

## O que ele faz

- Tudo fica na sua pasta de usuário: o plugin vai para `~/.config/obs-studio/plugins/obs-localvocal/` e o `/usr` não é alterado.
- O reconhecimento roda localmente na CPU via whisper.cpp — o áudio nunca sai da máquina.
- O filtro é aplicado à entrada do microfone com `whisper_language_select=zh` e `partial_group=true`, então o texto parcial aparece em cerca de 1,1 s.
- As legendas são uma fonte de texto comum do OBS (`text_ft2_source_v2`): centralizada embaixo, texto branco com contorno preto, ajustada à resolução da cena.
- Por ser uma fonte da cena, quem assiste à live e o arquivo gravado veem o mesmo — sem fonte de navegador nem janela sempre no topo.

## Requisitos

- OBS 33.x (precisa existir `/usr/lib/libobs.so.30`)
- Arch / CachyOS / família Arch, x86_64
- `node >= 22` (WebSocket embutido), `curl`, `patchelf`, `sha256sum`
- Uma fonte CJK, por exemplo `noto-fonts-cjk`

## Documentação

[Início rápido](QUICKSTART.md) · [Guia completo: ajustes, estilo, tradução, SRT, solução de problemas](../../GUIDE.md) · [Como e por que a instalação é feita assim](../../ARCHITECTURE.md)

## Licença

GPL-2.0, igual ao projeto original. Este repositório **não distribui binários**: o plugin, o modelo e as bibliotecas de compatibilidade são baixados na instalação e verificados por sha256. Veja `THIRD_PARTY.md`.
