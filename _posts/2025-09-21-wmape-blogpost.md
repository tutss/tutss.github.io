---
layout: post
title: "WMAPE vs MAPE"
date: 2025-09-21 17:21:00 -0300
categories: [python, data-science, metrics]
tags: [forecasting, machine learning, evaluation]
---

I started learning about WMAPE while participating in the [BD Tech Hackathon 2025](https://bdtech.ai/pt-br/hackathon-2025/) - a competition similar to Kaggle. During the hackathon, I was working on a demand forecasting model. The performance metric for this competition was WMAPE, and I got interested in understanding its difference from MAPE.

## What MAPE gets wrong

MAPE (Mean Absolute Percentage Error) is everywhere in forecasting. It's simple to understand: you calculate the percentage error for each prediction, then average them all. Here's the formula:

```
MAPE = (1/n) × Σ|actual - predicted| / |actual| × 100%
```

The problem? MAPE treats all predictions equally. A 20% error on a product that sells 10 units gets the same weight as a 20% error on a product that sells 1000 units. In the real world, these errors have very different business impacts.

## How WMAPE fixes this

WMAPE (Weighted Mean Absolute Percentage Error) fixes this by weighting errors based on actual values:

```
WMAPE = Σ|actual - predicted| / Σ|actual| × 100%
```

Instead of averaging percentage errors, you sum all the absolute errors and divide by the sum of actual values. Products with higher volumes naturally contribute more to the final metric.

Here's an example to illustrate the difference. Let's say you're forecasting sales for three products:

| Product | Actual | Predicted | Error | MAPE contribution |
|---------|--------|-----------|-------|-------------------|
| Batteries | 20 | 14 | 6 | 30% |
| Headphones | 100 | 85 | 15 | 15% |
| Laptops | 500 | 475 | 25 | 5% |

**MAPE calculation:**
```
(30% + 15% + 5%) / 3 = 16.7%
```

**WMAPE calculation:**
```
(6 + 15 + 25) / (20 + 100 + 500) = 46 / 620 = 7.4%
```

See the difference? MAPE says your biggest problem is batteries (30% error). But batteries only account for 6 units of total error. Laptops, with just 5% error, contribute 25 units to your total error - that's 4x more impact.

WMAPE correctly tells you that your overall error rate is 7.4%, weighted by volume. This matches business reality: you're doing pretty well on the products that matter most.

## Code to calculate both metrics

Here's how to calculate both metrics:

```python
import numpy as np

def calculate_mape(y_true, y_pred):
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

def calculate_wmape(y_true, y_pred):
    return np.sum(np.abs(y_true - y_pred)) / np.sum(np.abs(y_true)) * 100

# Example
actual = np.array([20, 100, 500])
predicted = np.array([14, 85, 475])

mape = calculate_mape(actual, predicted)
wmape = calculate_wmape(actual, predicted)

print(f"MAPE: {mape:.2f}%")
print(f"WMAPE: {wmape:.2f}%")
```

## Picking the right metric for your problem

The recommendation is to use WMAPE when high-volume predictions matter more (which is most business cases), you care about total business impact, you're working with products or items of different magnitudes, or you're evaluating forecasts that drive inventory or revenue decisions.

## Something to keep in mind

WMAPE isn't perfect. Like MAPE, it struggles with values close to zero and can't handle negative values directly. But for most forecasting problems - especially in retail, supply chain, and demand planning - it's a better reflection of real-world performance.

Next time you're evaluating a forecasting model, try comparing MAPE and WMAPE. You might be surprised by what you learn about where your model is actually strong or weak.