# obs-localvocal-arch

[中文](../../../README.md) · [English](../en/README.md) · [日本語](../ja/README.md) · [한국어](../ko/README.md) · [Español](../es/README.md) · [Français](README.md) · [Deutsch](../de/README.md) · [Русский](../ru/README.md) · [Português (Brasil)](../pt-BR/README.md) · [العربية](../ar/README.md) · [हिन्दी](../hi/README.md) · [Polski](../pl/README.md)


> Autres langues : lancez `obs-captions-help <code>` (ex. `obs-captions-help fr`) pour afficher ce démarrage rapide dans votre langue ; `obs-captions-help --list` liste tous les codes. Voir aussi [i18n 说明](../../I18N.md) et [字幕翻译](../../TRANSLATION.md), en chinois uniquement.
Sous-titres **chinois** en temps réel en bas du canvas OBS, sous Arch / CachyOS / Linux de la même famille. Installation au niveau utilisateur : sans sudo, sans AUR, sans compilation.

## Démarrage rapide en 30 secondes

Lancez ces quatre commandes dans l’ordre (environ 300 Mo de téléchargement la première fois).

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
obs-captions
obs-captions-setup
obs-captions-doctor
```

1. **Installer** — vérifie et dépaquette le `.deb` officiel 0.6.2, ajoute les bibliothèques ICU70 / OpenBLAS manquantes et télécharge le modèle Whisper multilingue.
2. **Quitter complètement OBS**, puis le relancer via le lanceur pour que le greffon soit réellement chargé.
3. **Dans un second terminal** — crée ou met à jour le filtre audio et la source de texte des sous-titres en bas de l’écran (idempotent, réexécutable).
4. **Parlez en chinois** dans le micro, puis lancez l’autocontrôle. `VERIFY_OK` signifie que tout est en place.

## Ce que cela fait

- Tout reste dans votre dossier utilisateur : le greffon va dans `~/.config/obs-studio/plugins/obs-localvocal/`, `/usr` n’est pas modifié.
- La reconnaissance tourne localement sur le CPU via whisper.cpp : l’audio ne quitte jamais la machine.
- Le filtre est appliqué à l’entrée micro avec `whisper_language_select=zh` et `partial_group=true`, ce qui fait apparaître un texte partiel au bout d’environ 1,1 s.
- Les sous-titres sont une source texte OBS classique (`text_ft2_source_v2`) : centrée en bas, texte blanc avec contour noir, dimensionnée selon la résolution du canvas.
- Comme il s’agit d’une source de scène, les spectateurs du direct et l’enregistrement la voient de la même façon : ni source navigateur ni fenêtre toujours au premier plan.

## Prérequis

- OBS 33.x (`/usr/lib/libobs.so.30` doit exister)
- Arch / CachyOS / famille Arch, x86_64
- `node >= 22` (WebSocket intégré), `curl`, `patchelf`, `sha256sum`
- Une police CJK, par exemple `noto-fonts-cjk`

## Documentation

[Démarrage rapide](QUICKSTART.md) · [Guide complet : réglages, style, traduction, SRT, dépannage](../../GUIDE.md) · [Comment et pourquoi cette installation](../../ARCHITECTURE.md)

## Licence

GPL-2.0, comme le projet amont. Ce dépôt ne contient **aucun binaire** : le greffon, le modèle et les bibliothèques de compatibilité sont téléchargés à l’installation et vérifiés par sha256. Voir `THIRD_PARTY.md`.
