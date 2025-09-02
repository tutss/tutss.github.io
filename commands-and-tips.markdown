---
layout: page
title: Commands and tips
permalink: /commands-and-tips/
---

Dump of useful commands so that I don't forget them 

### install conda env as kernel

```bash
conda activate <your_env_name>
conda install ipykernel
python -m ipykernel install --user --name=<your_kernel_name> --display-name="<your_env_name>"
```

### terminal tools

- https://github.com/junegunn/fzf
- https://ohmyz.sh/
- https://github.com/zsh-users/zsh-autosuggestions

---

*Last updated: {{ site.time | date: "%B %Y" }}*