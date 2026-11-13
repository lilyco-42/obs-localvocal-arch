# Démarrage rapide (3 minutes)

[中文](../../QUICKSTART.md) · [English](../en/QUICKSTART.md) · [日本語](../ja/QUICKSTART.md) · [한국어](../ko/QUICKSTART.md) · [Español](../es/QUICKSTART.md) · [Français](QUICKSTART.md) · [Deutsch](../de/QUICKSTART.md) · [Русский](../ru/QUICKSTART.md) · [Português (Brasil)](../pt-BR/QUICKSTART.md) · [العربية](../ar/QUICKSTART.md) · [हिन्दी](../hi/QUICKSTART.md) · [Polski](../pl/QUICKSTART.md)


> Autres langues : lancez `obs-captions-help <code>` (ex. `obs-captions-help fr`) pour afficher ce démarrage rapide dans votre langue ; `obs-captions-help --list` liste tous les codes. Voir aussi [i18n 说明](../../I18N.md) et [字幕翻译](../../TRANSLATION.md), en chinois uniquement.
**Objectif :** parler chinois → les sous-titres apparaissent en temps réel en bas du canvas OBS → les spectateurs les voient en direct comme à l’enregistrement.

## 0. Avant de commencer

- OBS 33.x et `node >= 22` ; `curl`, `patchelf`, `sha256sum` disponibles.
- Un micro qui fonctionne déjà dans OBS (Paramètres → Audio).
- Une police CJK comme `noto-fonts-cjk`, sinon les sous-titres s’affichent en carrés.
- `sudo`, `yay` et la compilation ne sont **pas** nécessaires.

## 1. Installer

```bash
bash <(curl -fsSL https://raw.githubusercontent.com/lilyco-42/obs-localvocal-arch/main/install.sh)
```

L’exécution est rejouable sans risque : les fichiers dont le sha256 correspond déjà sont réutilisés depuis le cache (`~/.cache/obs-localvocal-arch`). Le script affiche `DONE` à la fin.

## 2. Redémarrer OBS

Quittez **complètement** OBS s’il tourne : les greffons ne sont chargés qu’au démarrage du processus. Ensuite, lancez-le via le lanceur :

```bash
obs-captions
```

Vérifiez dans le journal de `~/.config/obs-studio/logs/` la présence de `plugin loaded successfully (version 0.6.2)` et de `Loading whisper model from ...`.

## 3. Créer le filtre et la source de sous-titres

```bash
obs-captions-setup
```

Laissez OBS ouvert et utilisez un autre terminal. Le script se connecte à l’obs-websocket local, trouve la scène courante et l’entrée micro, puis crée ou met à jour le filtre `LocalVocal Transcription` et la source texte `LocalVocal Subtitles`, placée en bas du canvas. `SETUP_OK` indique que c’est terminé.

## 4. Parler et vérifier

Dites **« 你好，欢迎来到我的直播间。 »** Les sous-titres apparaissent d’abord en texte partiel, puis se stabilisent en une phrase complète. Ensuite :

```bash
obs-captions-doctor
```

## 5. Passer en direct ou enregistrer

Cliquez simplement sur Démarrer l’enregistrement ou Démarrer le streaming. Si vous captez aussi l’écran ou un jeu, faites glisser `LocalVocal Subtitles` en haut de la liste des sources pour qu’elle s’affiche par-dessus la vidéo.

## 6. La prochaine fois

```bash
obs-captions          # lancer OBS avec le greffon
obs-captions-setup    # facultatif : restaurer le filtre de façon idempotente
```

OBS n’écrit le filtre dans la collection de scènes qu’à l’arrêt normal ; après un plantage ou un `kill -9`, le filtre d’exécution peut donc manquer. `obs-captions-setup` le rétablit.

## Un problème ?

| Symptôme | À essayer d’abord |
| --- | --- |
| Aucun sous-titre | `obs-captions-doctor` ; vérifier que le micro n’est pas coupé ; relancer `obs-captions-setup` |
| Le greffon n’est pas chargé | Lancer avec `obs-captions`, pas `/usr/bin/obs`, et lire le journal |
| Des carrés au lieu de caractères | Installer `noto-fonts-cjk`, puis relancer `obs-captions-setup` |
| CPU très sollicité | Passer à `ggml-tiny-q5_1` ou `ggml-base-q5_1`, voir le guide |
| Port 4455 injoignable | OBS doit être redémarré ; vérifier `server_enabled=true` dans `config.json` |

[Guide complet : réglages, style, traduction, SRT, dépannage](../../GUIDE.md) — réglages, style, traduction, SRT et liste complète de dépannage.
