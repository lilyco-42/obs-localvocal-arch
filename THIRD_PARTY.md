# 第三方组件与许可

本仓库只包含安装脚本、配置模板与文档；**不托管**下列二进制文件，它们在 <code>install.sh</code> 运行时从各自官方地址下载。

| 组件 | 用途 | 来源 | 许可 |
| --- | --- | --- | --- |
| obs-localvocal 0.6.2 | OBS 音频滤镜插件 | <https://github.com/royshil/obs-localvocal> | GPL-2.0 |
| whisper.cpp / ggml | 本地语音识别运行时 | 上游 .deb 内置；<https://github.com/ggml-org/whisper.cpp> | MIT（以上游为准） |
| ggml-small-q5_1.bin | 多语言中文模型 | <https://huggingface.co/ggerganov/whisper.cpp> | 以模型卡为准 |
| ICU 70 (libicuuc.so.70) | 兼容 Ubuntu 22.04 符号版本 | <https://archive.ubuntu.com/ubuntu/pool/main/i/icu/> | Unicode/ICU License |
| OpenBLAS | BLAS 后端 | Arch Linux <code>extra/openblas</code> | BSD-3-Clause |
| OBS Studio 33 | 宿主程序 | <https://obsproject.com> | GPL-2.0-or-later |
| obs-websocket 5 | 自动配置通道 | OBS 内置插件 | 以 OBS 发行版为准 |

请遵守各组件自身许可证；再分发二进制时需按 GPL-2.0 提供对应源码与许可文本。

本项目安装脚本与文档采用 GPL-2.0，见 <code>LICENSE</code>。
