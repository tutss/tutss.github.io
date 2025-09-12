---
layout: post
title: "From (almost) one day to five minutes: multiprocessing"
date: 2025-09-11 22:59:00 -0300
---

Last week, I started what seemed like a simple task: processing 100,000 samples from the [FaceCaption-15M dataset](https://huggingface.co/datasets/OpenFace-CQUPT/FaceCaption-15M) for my masters research. This dataset contains millions of face images with captions, perfect for training vision-language models. I wrote a straightforward script that would download images, crop faces based on provided bounding boxes, and save them for training. Then I hit run and waited.

And waited.

After almost 16 hours, my script was still crawling through the dataset. Each sample required downloading an image from a URL, cropping it based on bounding box coordinates, and converting it to base64. With network delays and image processing, each sample was taking several seconds. At this rate, processing my full dataset would take around 3 days.

There had to be a better way.

## The multiprocessing breakthrough

That's when I tried researching more about parallel processing for I/O-bound tasks. Instead of processing one sample at a time, I could process dozens simultaneously. The key insight was that most of the time, my script wasn't actually working - it was waiting. Waiting for network requests, waiting for image downloads, waiting for server responses.

What if, instead of waiting, I could start processing other samples?

I rewrote my script using Python's `ThreadPoolExecutor`, and the results were incredible. What used to take almost a day now processes 10,000 samples in just 5 minutes. That's a huge speedup (from ~31 items per minute to 2000 items per minute).

## How it works

The magic happens with concurrent processing. Here's the basic idea:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import multiprocessing

def process_sample(args):
    ds, index = args
    session = requests.Session()
    
    try:
        sample = ds['train'][index]
        image, _ = load_image_from_sample(sample, session)
        if image:
            cropped_image = crop_image(image, sample['box'])
            if cropped_image:
                b64_string = image_to_b64(cropped_image)
                return sample['caption'][0], b64_string
    except Exception:
        pass
    finally:
        session.close()
    
    return None, None

# In the main function
max_workers = min(32, multiprocessing.cpu_count() * 4)
with ThreadPoolExecutor(max_workers=max_workers) as executor:
    futures = [executor.submit(process_sample, (ds, index)) for index in random_indices]
    
    for future in as_completed(futures):
        caption, b64_img = future.result()
        if caption and b64_img:
            samples['caption'].append(caption)
            samples['image'].append(b64_img)
```

Instead of processing samples one by one, I create a "thread pool" - a group of worker threads that can all work simultaneously. Each thread picks up a sample to process, and while one thread is waiting for a network request, other threads can continue working on different samples.

## The magic number formula

The most interesting part was figuring out how many worker threads to use - Claude helped me with this!. The formula I settled on was:

```python
max_workers = min(32, multiprocessing.cpu_count() * 4)
```

Let me break this down:

- `multiprocessing.cpu_count()` gives you the number of CPU cores on your system
- `* 4` multiplies by 4 because this is an I/O-bound task
- `min(32, ...)` caps the maximum at 32 workers

Why multiply by 4? This was a key insight. For CPU-intensive tasks (like mathematical calculations), you typically want one thread per CPU core. But for I/O-bound tasks (like network requests), threads spend most of their time waiting. While one thread is waiting for a server response, other threads can be working.

The rule of thumb is:
- **CPU-bound tasks**: 1 worker per core
- **I/O-bound tasks**: 2-4 workers per core (sometimes more)

So if I had an 8-core machine, instead of using 8 workers, I could use 32 workers effectively because they're mostly waiting for network operations.

My machine currently has 16 cores, but the cap at 32 prevents overwhelming servers with too many concurrent requests and avoids hitting system resource limits.

## Real world results

The performance improvement was dramatic:

**Before (sequential processing):**
- 30,000 samples: ~16 hours
- 0.52 items per second

**After (parallel processing):**
- 10,000 samples: 5 minutes  
- 33 items per second
- **Speedup: ~64x faster**

But the real benefit goes beyond raw speed. The parallel version is also more resilient - if one URL fails to download, other workers keep processing different samples. The overall success rate actually improved.

## Why this works so well

The key insight is understanding the difference between CPU-bound and I/O-bound tasks:

- **CPU-bound**: Your processor is doing intensive calculations
- **I/O-bound**: Your program is waiting for external operations (network, disk, etc.)

My image processing task was heavily I/O-bound. For each sample, the script would:
1. Make an HTTP request (wait for network)
2. Download image data (wait for network) 
3. Process the image (quick CPU work)
4. Convert to base64 (quick CPU work)

Steps 1-2 involved lots of waiting, which is perfect for parallel processing.

## Thoughts

This was an interesting finding for me. I initially assumed the bottleneck was in the image processing itself, so I was looking at optimizing PIL operations or using faster image libraries.

But the real bottleneck was much simpler - I was just processing things one at a time when I could do many at once. Sometimes the best optimization isn't making individual operations faster, but doing more operations simultaneously.

It also highlighted the importance of understanding your workload. The same parallel processing approach wouldn't help much with a CPU-intensive task like training a neural network (where you're already maxing out your CPU cores). But for I/O-bound tasks like web scraping, data downloading, or API calls, the speedup can be massive.

For anyone working with similar datasets or network-heavy tasks, I'd strongly recommend trying parallel processing. The implementation is straightforward, and the performance gains can be transformative. Just remember to be respectful of external servers and not overwhelm them with too many concurrent requests.

Now I can process my full dataset in hours instead of weeks, and get back to the actual machine learning research. Sometimes the biggest breakthroughs come from the simplest optimizations.