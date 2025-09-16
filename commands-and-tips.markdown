---
layout: page
title: Commands and tips
permalink: /commands-and-tips/
---

Dump of useful commands so that I don't forget them 

### convert jupyter notebook into script

```bash
jupyter nbconvert --to script notebook.ipynb
```

### install package in specific version

```bash
pip install <package_name>==<version>
```

### img -> b64 and b64 -> img

```python
def image_to_b64(img, format="JPEG"):
    buffer = BytesIO()
    img.save(buffer, format=format)
    return base64.b64encode(buffer.getvalue()).decode()


def b64_to_image(b64_string):
    img_data = base64.b64decode(b64_string)
    return Image.open(BytesIO(img_data))
```

### paper review prompt

[paper-reviewer.md](/files/prompts/paper-reviewer.md)

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