---
layout: page
title: Commands and tips
permalink: /commands-and-tips/
---

Dump of useful commands so that I don't forget them 

### what's the correct way to log hyperparameters in TensorBoard?

Use `writer.add_hparams(hparams_dict, metrics_dict)` once per experiment after training completes, not continuously during training. Pass your hyperparameter configuration (learning rate, batch size, optimizer) and the final performance metrics (best accuracy, final loss) as separate dictionaries. This creates structured experiments in TensorBoard's HParams tab that let you compare different configurations and identify which hyperparameter combinations produce the best results.

### why do I need to load optimizer and scheduler state when resuming PyTorch training, and what happens if I start fresh?

Loading optimizer and scheduler state preserves essential training dynamics that accumulate over time. The optimizer state contains gradient statistics (moving averages in Adam, velocity in SGD) needed for stable parameter updates, while the scheduler state maintains your position in the learning rate schedule. Starting fresh forces the optimizer to rebuild these statistics from scratch and resets the learning rate to its initial value, creating a mismatch between your trained model parameters and the training dynamics. This typically causes loss spikes, training instability, and suboptimal convergence because the optimizer lacks historical gradient information for proper update scaling while using an inappropriate learning rate for the model's current convergence state.

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