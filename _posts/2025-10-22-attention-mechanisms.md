---
layout: post
title: "Attention mechanisms: self-attention, cross-attention, and co-attention"
date: 2025-10-23 20:02:14 -0300
categories: [research, python]
tags: [data-science, deep-learning, pytorch, transformers, multimodal-learning]
---

# Attention mechanisms: self-attention, cross-attention, and co-attention

## Introduction

Attention mechanisms have become fundamental building blocks in modern deep learning, particularly for tasks involving multiple data modalities like text and images, or sequential data. However, the terminology can be confusing: what exactly is the difference between self-attention, cross-attention, and co-attention? When should you use each one?

I caught myself with lots of doubts in the differences between each of these methods, and as I was studying about them, I decided to write this blog post.

This post clarifies these concepts with concrete implementations and discussion about their practical differences. We'll explore what these mechanisms actually compute, when they're useful, and examine common claims about them.

## What does attention compute?

Before diving into different types of attention, let's talk about the core operation. Attention mechanisms compute weighted combinations of values based on the relevance between queries and keys.

The mathematical operation is:

```
Attention(Q, K, V) = softmax(Q @ K^T / sqrt(d_k)) @ V
```

Where:
- **Q (Query)**: can be understood as "what am I looking for?"
- **K (Key)**: can be understood as  "what do I have available?"
- **V (Value)**: can be understood as "what information do I want to extract?"

The attention weights determine how much each value should contribute to the final output, based on the similarity between queries and keys.

## Self-attention: "looking" into itself

Self-attention allows elements in a sequence (images, text, whatever) to attend to other elements in the same sequence. This is the mechanism that powers transformers and is used extensively in language models.

### When self-attention makes sense

Self-attention is designed for sequences where you want to capture relationships between different positions:

```python
# Example: Processing a sentence
tokens = ["The", "cat", "sat", "on", "the", "mat"]
token_embeddings: [6, 512]  # 6 tokens, each with 512-dim embedding

# Self-attention allows each token to look at all other tokens
# "cat" can attend to "sat" to understand the action
# "on" can attend to both "cat" and "mat" to understand the spatial relationship
```

### Sample code

```python
import torch
import torch.nn as nn
import torch.nn.functional as F

class SelfAttentionLayer(nn.Module):
    def __init__(self, embed_dim=512, num_heads=8):
        super().__init__()
        self.attention = nn.MultiheadAttention(
            embed_dim=embed_dim,
            num_heads=num_heads,
            dropout=0.1,
            batch_first=True
        )
        self.norm = nn.LayerNorm(embed_dim)
        self.ffn = nn.Sequential(
            nn.Linear(embed_dim, embed_dim * 4),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(embed_dim * 4, embed_dim)
        )
        self.norm2 = nn.LayerNorm(embed_dim)
    
    def forward(self, x):
        # x shape: [batch, seq_len, embed_dim]
        # Self-attention: Q, K, V all come from the same input
        attn_output, attn_weights = self.attention(
            query=x,
            key=x,
            value=x
        )
        x = self.norm(x + attn_output)  # Residual connection
        ffn_output = self.ffn(x)
        x = self.norm2(x + ffn_output)  # Residual connection
        return x, attn_weights

# Example usage with a sequence
batch_size, seq_len, embed_dim = 2, 10, 512
sequence = torch.randn(batch_size, seq_len, embed_dim)

layer = SelfAttentionLayer(embed_dim=embed_dim)
output, weights = layer(sequence)

print(f"Input shape: {sequence.shape}")       # [2, 10, 512]
print(f"Output shape: {output.shape}")        # [2, 10, 512]
print(f"Attention weights: {weights.shape}")  # [2, 10, 10] - each token attends to all tokens
```

*NOTE:*

Here's an insight that needs *attention* (got the joke?): **self-attention degenerates to a linear transformation when you have a single embedding** (sequence length of 1).

```python
# Single embedding - self-attention has nothing to attend to
single_embedding = torch.randn(1, 1, 512)  # [batch=1, seq_len=1, embed_dim=512]

output, weights = layer(single_embedding)
print(f"Attention weights: {weights}")  # Always [[[1.0]]] - the only element attends to itself

# This is mathematically equivalent to:
# output = Linear(input)
# The "attention" mechanism provides no benefit over a simple feedforward layer
```

The power of self-attention's comes from relating multiple elements. With a single element, you're better off using a straightforward feedforward network.

## Cross-attention: relating elements across different sequences

Cross-attention allows elements from one sequence to attend to elements from a different sequence. This is essential for multimodal tasks where you need to align or relate information across modalities.

### When cross-attention makes sense

Cross-attention is designed for scenarios where you have two different sources of information that need to interact:

```python
# Example: Image captioning
image_features: [batch, 196, 512]  # 14×14 spatial grid from CNN
text_tokens: [batch, 20, 512]      # 20 words in the caption

# Each word can attend to different image regions
# The word "cat" should attend to the cat region in the image
# The word "sitting" should attend to the pose-related image features
```

### Sample code

```python
class CrossAttentionLayer(nn.Module):
    def __init__(self, embed_dim=512, num_heads=8):
        super().__init__()
        # Single attention module for cross-modal attention
        self.attention = nn.MultiheadAttention(
            embed_dim=embed_dim,
            num_heads=num_heads,
            dropout=0.1,
            batch_first=True
        )
        self.norm = nn.LayerNorm(embed_dim)
        self.ffn = nn.Sequential(
            nn.Linear(embed_dim, embed_dim * 4),
            nn.GELU(),
            nn.Dropout(0.1),
            nn.Linear(embed_dim * 4, embed_dim)
        )
        self.norm2 = nn.LayerNorm(embed_dim)
    
    def forward(self, query_seq, key_value_seq):
        # query_seq: the sequence that asks "what should I attend to?"
        # key_value_seq: the sequence being attended to
        
        # Cross-attention: Q comes from one sequence, K and V from another
        attn_output, attn_weights = self.attention(
            query=query_seq,
            key=key_value_seq,
            value=key_value_seq
        )
        query_seq = self.norm(query_seq + attn_output)
        ffn_output = self.ffn(query_seq)
        query_seq = self.norm2(query_seq + ffn_output)
        return query_seq, attn_weights

# Example: Text attending to image features
batch_size = 2
text_seq_len, img_seq_len = 20, 196
embed_dim = 512

text_features = torch.randn(batch_size, text_seq_len, embed_dim)
image_features = torch.randn(batch_size, img_seq_len, embed_dim)

cross_attn = CrossAttentionLayer(embed_dim=embed_dim)
attended_text, weights = cross_attn(
    query_seq=text_features,
    key_value_seq=image_features
)

print(f"Text input: {text_features.shape}")      # [2, 20, 512]
print(f"Image input: {image_features.shape}")    # [2, 196, 512]
print(f"Attended text: {attended_text.shape}")   # [2, 20, 512]
print(f"Attention weights: {weights.shape}")     # [2, 20, 196] - each text position attends to all image positions
```

## Co-attention: jointly attending different sequences

Co-attention attempts to compute attention in both directions simultaneously, using coupled parameters. The idea is that both modalities jointly determine what's important.

The theoretical motivation for co-attention comes from Visual Question Answering research (Lu et al., NeurIPS 2016), where the question and image should jointly guide attention. For example, if the question is "What color is the cat?", both the word "color" and the cat region should be emphasized together.

### Sample code

```python
class CoAttentionLayer(nn.Module):
    def __init__(self, embed_dim=512, num_heads=8):
        super().__init__()
        self.num_heads = num_heads
        self.head_dim = embed_dim // num_heads
        self.scale = self.head_dim ** -0.5
        
        # Separate Q, K, V projections for each modality
        # But they're used together to compute coupled attention
        self.text_q = nn.Linear(embed_dim, embed_dim)
        self.text_k = nn.Linear(embed_dim, embed_dim)
        self.text_v = nn.Linear(embed_dim, embed_dim)
        
        self.image_q = nn.Linear(embed_dim, embed_dim)
        self.image_k = nn.Linear(embed_dim, embed_dim)
        self.image_v = nn.Linear(embed_dim, embed_dim)
        
        self.text_out = nn.Linear(embed_dim, embed_dim)
        self.image_out = nn.Linear(embed_dim, embed_dim)
        
        self.dropout = nn.Dropout(0.1)
    
    def forward(self, text_features, image_features):
        batch_size = text_features.shape[0]
        text_len = text_features.shape[1]
        image_len = image_features.shape[1]
        
        # Generate Q, K, V for both modalities
        text_q = self.text_q(text_features).view(batch_size, text_len, self.num_heads, self.head_dim).transpose(1, 2)
        text_k = self.text_k(text_features).view(batch_size, text_len, self.num_heads, self.head_dim).transpose(1, 2)
        text_v = self.text_v(text_features).view(batch_size, text_len, self.num_heads, self.head_dim).transpose(1, 2)
        
        image_q = self.image_q(image_features).view(batch_size, image_len, self.num_heads, self.head_dim).transpose(1, 2)
        image_k = self.image_k(image_features).view(batch_size, image_len, self.num_heads, self.head_dim).transpose(1, 2)
        image_v = self.image_v(image_features).view(batch_size, image_len, self.num_heads, self.head_dim).transpose(1, 2)
        
        # Compute co-attention: text queries attend to image keys, and vice versa
        # Both computed simultaneously from the same Q/K projections
        text_to_image_scores = torch.matmul(text_q, image_k.transpose(-2, -1)) * self.scale
        image_to_text_scores = torch.matmul(image_q, text_k.transpose(-2, -1)) * self.scale
        
        # Apply attention to values from the other modality
        text_attn_weights = F.softmax(text_to_image_scores, dim=-1)
        image_attn_weights = F.softmax(image_to_text_scores, dim=-1)
        
        text_attn_weights = self.dropout(text_attn_weights)
        image_attn_weights = self.dropout(image_attn_weights)
        
        text_attended = torch.matmul(text_attn_weights, image_v)
        image_attended = torch.matmul(image_attn_weights, text_v)
        
        text_attended = text_attended.transpose(1, 2).contiguous().view(batch_size, text_len, -1)
        image_attended = image_attended.transpose(1, 2).contiguous().view(batch_size, image_len, -1)
        
        text_output = self.text_out(text_attended)
        image_output = self.image_out(image_attended)
        
        return text_output, image_output

# Example usage
co_attn = CoAttentionLayer(embed_dim=512, num_heads=8)
co_text, co_image = co_attn(text_features, image_features)

print(f"Co-attended text: {co_text.shape}")   # [2, 20, 512]
print(f"Co-attended image: {co_image.shape}") # [2, 196, 512]
```

## Cross-attention vs co-attention

The distinction between cross-attention and co-attention is not clear-cut and I couldn't find a stablished paper or result that compares then directly (if you find it, please share with me!). There is limited empirical evidence directly comparing them in controlled settings. The co-attention paper (Lu et al., 2016) introduced the concept for Visual Question Answering, but the comparison was against image-only attention, not sequential cross-attention. Subsequent papers often adopt one approach or the other.

So given that, we can discuss the implementation differences:

**Cross-attention**:
- Uses two separate `nn.MultiheadAttention` modules with independent parameters
- Computes sequence_1 -> sequence_2 (e.g. text -> image) and sequence_2 -> sequence_1 (e.g. image -> text) attention sequentially
- Each direction can learn completely different attention patterns

**Co-attention**:
- Uses shared Q/K/V projections for both modalities
- Computes both attention directions in a single forward pass
- The attention patterns are coupled through shared parameter structure

In practice, the choice between cross-attention and co-attention should be treated as an architectural hypothesis to test empirically, not as a definitively better approach. 
Factors that matter more than this choice include:

- Total number of parameters in your model + computational budget
- Quality and quantity of training data
- Task-specific characteristics of your data

## Example: multimodal alignment

Let's see how these concepts work together in multimodal alignment:

```python
class MultimodalAlignmentModel(nn.Module):
    def __init__(self, text_dim=768, image_dim=2048, shared_dim=512, num_heads=8):
        super().__init__()
        
        # Project both modalities to shared dimension
        self.text_proj = nn.Linear(text_dim, shared_dim)
        self.image_proj = nn.Linear(image_dim, shared_dim)
        
        # Option 1: Use cross-attention for interaction
        self.text_to_image_attn = CrossAttentionLayer(
            embed_dim=shared_dim,
            num_heads=num_heads
        )
        self.image_to_text_attn = CrossAttentionLayer(
            embed_dim=shared_dim,
            num_heads=num_heads
        )
        
        # Option 2: Use co-attention for interaction (alternative)
        # self.co_attn = CoAttentionLayer(
        #     embed_dim=shared_dim,
        #     num_heads=num_heads
        # )
        
        # Final projection layers
        self.text_final = nn.Linear(shared_dim, shared_dim)
        self.image_final = nn.Linear(shared_dim, shared_dim)
        
    def forward(self, text_features, image_features):
        # text_features: [batch, text_seq_len, text_dim]
        # image_features: [batch, image_seq_len, image_dim]
        
        text_shared = self.text_proj(text_features)
        image_shared = self.image_proj(image_features)
        
        # Apply cross-modal attention in both directions
        # Note: attention weights (discarded with _) could be used for:
        # - Visualizing text-to-image alignments
        # - Debugging what the model attends to
        # - Regularization or supervision losses
        text_attended, _ = self.text_to_image_attn(text_shared, image_shared)
        image_attended, _ = self.image_to_text_attn(image_shared, text_shared)
        
        # Final projections and pooling
        text_output = self.text_final(text_attended.mean(dim=1))  # Pool over sequence
        image_output = self.image_final(image_attended.mean(dim=1))  # Pool over sequence
        
        # L2 normalize for contrastive learning
        text_output = F.normalize(text_output, dim=-1)
        image_output = F.normalize(image_output, dim=-1)
        
        return text_output, image_output
    
    def compute_similarity(self, text_embeddings, image_embeddings, temperature=0.07):
        # Compute similarity matrix for contrastive learning
        return torch.matmul(text_embeddings, image_embeddings.T) / temperature

# Example usage
model = MultimodalAlignmentModel(
    text_dim=768,
    image_dim=2048,
    shared_dim=512,
    num_heads=8
)

# Sample data
batch_size = 4
text_seq_len, image_seq_len = 20, 49  # Text tokens and image spatial features
text_input = torch.randn(batch_size, text_seq_len, 768)
image_input = torch.randn(batch_size, image_seq_len, 2048)

# Forward pass
text_emb, image_emb = model(text_input, image_input)
print(f"Text embeddings: {text_emb.shape}")    # [4, 512]
print(f"Image embeddings: {image_emb.shape}")  # [4, 512]

# Compute similarity for contrastive loss
similarity_matrix = model.compute_similarity(text_emb, image_emb)
print(f"Similarity matrix: {similarity_matrix.shape}")  # [4, 4]
```

## Conclusion

Attention mechanisms are powerful tools for relating information across sequences and modalities, but understanding when and how to use them requires some considerations:

**Self-attention** is applied for processing sequences where elements need to contextualize each other. It's the foundation of transformer models.

**Cross-attention** enables explicit interaction between different sequences or modalities. It's well-suited for tasks where you want one source of information to query another, and it provides attention patterns showing what relates to what.

**Co-attention** represents a more tightly coupled variant of cross-attention, computing both directions simultaneously through shared parameters. While theoretically appealing, empirical evidence for its superiority over sequential cross-attention is limited.

---